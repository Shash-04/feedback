'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import * as d3 from 'd3';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  TrendingUp,
  Users,
  MessageSquare,
  Star,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  FileText,
  Clock,
  Hash
} from 'lucide-react';

interface AnalyzedData {
  totalResponses: number;
  responsesByDate: Array<{ date: string; responses: number }>;
  keywordFrequency: Array<{ word: string; count: number }>;
  averageMetrics: Record<string, number>;
  responsePatterns: Array<{ pattern: string; count: number; percentage: number }>;
  questionAnalysis: Array<{ question: string; responses: Array<{ answer: string; count: number }> }>;
  sentimentDistribution: Array<{ sentiment: string; count: number; percentage: number }>;
  timeDistribution: Array<{ hour: number; count: number }>;
  summary: string;
}

// Utility function to extract insights from raw feedback data
const analyzeFormData = (feedbackText: string): AnalyzedData => {
  const lines = feedbackText.split('\n').filter(line => line.trim());
  const responses: Record<string, any> = {};
  let currentId = '';

  // Parse responses
  lines.forEach(line => {
    if (line.startsWith('🧾 Response ID:')) {
      currentId = line.split(':')[1].trim();
      responses[currentId] = { answers: [], timestamp: '' };
    } else if (line.startsWith('🕒 Submitted At:')) {
      if (currentId) {
        responses[currentId].timestamp = line.split('At:')[1].trim();
      }
    } else if (line.includes('. ') && line.includes(' → ')) {
      if (currentId) {
        const [question, answer] = line.split(' → ');
        responses[currentId].answers.push({ question: question.trim(), answer: answer.trim() });
      }
    }
  });

  const totalResponses = Object.keys(responses).length;

  // Analyze by date
  const dateGroups: Record<string, number> = {};
  Object.values(responses).forEach((resp: any) => {
    if (resp.timestamp) {
      const date = new Date(resp.timestamp).toLocaleDateString();
      dateGroups[date] = (dateGroups[date] || 0) + 1;
    }
  });

  // Extract keywords and analyze patterns
  const allText = Object.values(responses)
    .flatMap((resp: any) => resp.answers.map((a: any) => a.answer))
    .join(' ')
    .toLowerCase();

  const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'was', 'are', 'were', 'a', 'an', 'this', 'that', 'these', 'those'];
  const words = allText.match(/\w+/g) || [];
  const wordCount: Record<string, number> = {};

  words.forEach(word => {
    if (word.length > 3 && !commonWords.includes(word)) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });

  const keywordFrequency = Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15)
    .map(([word, count]) => ({ word, count }));

  // Analyze numeric responses for averages
  const numericResponses: Record<string, number[]> = {};
  Object.values(responses).forEach((resp: any) => {
    resp.answers.forEach((answer: any) => {
      const numMatch = answer.answer.match(/\d+/);
      if (numMatch) {
        const questionKey = answer.question.split('.')[1]?.trim() || answer.question;
        if (!numericResponses[questionKey]) numericResponses[questionKey] = [];
        numericResponses[questionKey].push(parseInt(numMatch[0]));
      }
    });
  });

  const averageMetrics: Record<string, number> = {};
  Object.entries(numericResponses).forEach(([question, values]) => {
    if (values.length > 0) {
      averageMetrics[question] = values.reduce((a, b) => a + b, 0) / values.length;
    }
  });

  // Analyze question patterns
  const questionGroups: Record<string, Record<string, number>> = {};
  Object.values(responses).forEach((resp: any) => {
    resp.answers.forEach((answer: any) => {
      const questionKey = answer.question.split('.')[1]?.trim() || answer.question;
      if (!questionGroups[questionKey]) questionGroups[questionKey] = {};
      const answerKey = answer.answer.toLowerCase();
      questionGroups[questionKey][answerKey] = (questionGroups[questionKey][answerKey] || 0) + 1;
    });
  });

  const questionAnalysis = Object.entries(questionGroups).map(([question, answers]) => ({
    question: question.substring(0, 40) + '...',
    responses: Object.entries(answers)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([answer, count]) => ({ answer: answer.substring(0, 20) + '...', count }))
  }));

  // Simple sentiment analysis
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'positive', 'helpful', 'satisfied', 'happy'];
  const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'negative', 'unhappy', 'disappointed', 'frustrated', 'issues', 'problems'];

  let positive = 0, negative = 0, neutral = 0;
  Object.values(responses).forEach((resp: any) => {
    resp.answers.forEach((answer: any) => {
      const text = answer.answer.toLowerCase();
      const hasPositive = positiveWords.some(word => text.includes(word));
      const hasNegative = negativeWords.some(word => text.includes(word));

      if (hasPositive && !hasNegative) positive++;
      else if (hasNegative && !hasPositive) negative++;
      else neutral++;
    });
  });

  const sentimentTotal = positive + negative + neutral;
  const sentimentDistribution = [
    { sentiment: 'Positive', count: positive, percentage: sentimentTotal > 0 ? (positive / sentimentTotal * 100) : 0 },
    { sentiment: 'Neutral', count: neutral, percentage: sentimentTotal > 0 ? (neutral / sentimentTotal * 100) : 0 },
    { sentiment: 'Negative', count: negative, percentage: sentimentTotal > 0 ? (negative / sentimentTotal * 100) : 0 }
  ];

  // Time distribution
  const hourGroups: Record<number, number> = {};
  Object.values(responses).forEach((resp: any) => {
    if (resp.timestamp) {
      const hour = new Date(resp.timestamp).getHours();
      hourGroups[hour] = (hourGroups[hour] || 0) + 1;
    }
  });

  const timeDistribution = Object.entries(hourGroups)
    .map(([hour, count]) => ({ hour: parseInt(hour), count }))
    .sort((a, b) => a.hour - b.hour);

  return {
    totalResponses,
    responsesByDate: Object.entries(dateGroups).map(([date, responses]) => ({ date, responses })),
    keywordFrequency,
    averageMetrics,
    responsePatterns: [],
    questionAnalysis,
    sentimentDistribution,
    timeDistribution,
    summary: ''
  };
};

// Loading skeleton components
const StatCardSkeleton = () => (
  <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 bg-gray-800 rounded-xl animate-pulse"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-800 rounded-lg w-24 mb-2 animate-pulse"></div>
        <div className="h-6 bg-gray-800 rounded-lg w-16 animate-pulse"></div>
      </div>
    </div>
  </div>
);

const ChartSkeleton = ({ height }: { height: string }) => (
  <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
    <div className="h-6 bg-gray-800 rounded-lg w-48 mb-6 animate-pulse"></div>
    <div className={`bg-gray-800 rounded-lg animate-pulse ${height}`}></div>
  </div>
);

// Custom D3 Word Cloud Component
const WordCloudD3 = ({ data }: { data: Array<{ word: string; count: number }> }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    const maxCount = d3.max(data, d => d.count) || 1;
    const sizeScale = d3.scaleLinear().domain([1, maxCount]).range([12, 32]);
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    data.forEach((d, i) => {
      const angle = (i / data.length) * 2 * Math.PI * 3;
      const radius = (i / data.length) * (Math.min(width, height) / 4);
      const x = (width - margin.left - margin.right) / 2 + Math.cos(angle) * radius;
      const y = (height - margin.top - margin.bottom) / 2 + Math.sin(angle) * radius;

      g.append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", `${sizeScale(d.count)}px`)
        .style("font-weight", "600")
        .style("fill", colorScale(i.toString()))
        .style("opacity", 0)
        .text(d.word)
        .transition()
        .duration(1000)
        .delay(i * 100)
        .style("opacity", 0.8);
    });

  }, [data]);

  return (
    <div className="flex justify-center">
      <svg
        ref={svgRef}
        width="100%"
        height="300"
        viewBox="0 0 400 300"
        className="max-w-full"
      />
    </div>
  );
};

// Stat Card Component
const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  color
}: {
  icon: any;
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
}) => (
  <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 sm:p-6 backdrop-blur-sm hover:border-gray-700 transition-all duration-300">
    <div className="flex items-center gap-3 sm:gap-4">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${color} rounded-xl flex items-center justify-center`}>
        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-400 text-xs sm:text-sm font-medium">{title}</p>
        <p className="text-xl sm:text-2xl font-bold text-gray-100 truncate">{value}</p>
        {subtitle && (
          <p className="text-gray-500 text-xs sm:text-sm mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  </div>
);

export default function UniversalSummaryDashboard() {
  const params = useParams();
  const formId = params?.formId as string;

  const [analyzedData, setAnalyzedData] = useState<AnalyzedData | null>(null);
  const [rawSummary, setRawSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'overview' | 'detailed'>('overview');

  useEffect(() => {
    async function getSummary() {
      try {
        const res = await fetch(`/api/forms/${formId}/summary`);
        const data = await res.json();

        // Extract the raw feedback data from the prompt (if available in response)
        // For now, we'll work with the summary and create mock analysis
        const mockFeedbackText = `
🧾 Response ID: 1
🕒 Submitted At: 2024-01-15T10:30:00Z
1. How would you rate our service? → 5
2. What did you like most? → Great customer support
3. Any suggestions? → Keep up the good work

🧾 Response ID: 2  
🕒 Submitted At: 2024-01-15T14:20:00Z
1. How would you rate our service? → 4
2. What did you like most? → Fast response time
3. Any suggestions? → Could improve documentation

🧾 Response ID: 3
🕒 Submitted At: 2024-01-16T09:15:00Z
1. How would you rate our service? → 3
2. What did you like most? → User-friendly interface
3. Any suggestions? → Need better mobile app
        `;

        const analyzed = analyzeFormData(mockFeedbackText);
        analyzed.summary = data.summary;

        setAnalyzedData(analyzed);
        setRawSummary(data.summary || "No summary available.");
      } catch (e) {
        setRawSummary('Failed to load summary.');
      } finally {
        setLoading(false);
      }
    }

    if (formId) getSummary();
  }, [formId]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="mb-8 sm:mb-12">
            <div className="h-8 sm:h-10 bg-gray-800 rounded-lg w-64 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-800 rounded-lg w-96 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <ChartSkeleton height="h-80" />
            <ChartSkeleton height="h-80" />
          </div>
        </div>
      </div>
    );
  }

  if (!analyzedData) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Activity className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-100 mb-2">Failed to Load</h3>
          <p className="text-gray-400">Unable to load form analysis data.</p>
        </div>
      </div>
    );
  }

  const topMetric = Object.entries(analyzedData.averageMetrics)[0];

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-2 sm:mb-3">
                📊 Form Analytics
              </h1>
              <p className="text-gray-400 text-base sm:text-lg">
                Comprehensive analysis of form responses and insights
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex bg-gray-800/50 rounded-xl p-1">
                <button
                  onClick={() => setActiveView('overview')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeView === 'overview'
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-400 hover:text-gray-100'
                    }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveView('detailed')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeView === 'detailed'
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-400 hover:text-gray-100'
                    }`}
                >
                  Analysis
                </button>
              </div>
              <button className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-100 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {activeView === 'overview' ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
              <StatCard
                icon={Users}
                title="Total Responses"
                value={analyzedData.totalResponses}
                color="bg-blue-600"
              />
              <StatCard
                icon={Star}
                title={topMetric ? topMetric[0] : "Average Score"}
                value={topMetric ? `${topMetric[1].toFixed(1)}/5` : "N/A"}
                color="bg-green-600"
              />
              <StatCard
                icon={MessageSquare}
                title="Positive Sentiment"
                value={`${analyzedData.sentimentDistribution[0]?.percentage.toFixed(1) || 0}%`}
                subtitle={`${analyzedData.sentimentDistribution[0]?.count || 0} responses`}
                color="bg-emerald-600"
              />
              <StatCard
                icon={Hash}
                title="Unique Keywords"
                value={analyzedData.keywordFrequency.length}
                subtitle="Key themes identified"
                color="bg-purple-600"
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
              {/* Sentiment Distribution */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mb-4 sm:mb-6">Response Sentiment</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyzedData.sentimentDistribution.filter(d => d.count > 0)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ sentiment, percentage }) => `${sentiment}: ${percentage.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analyzedData.sentimentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Response Timeline */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mb-4 sm:mb-6">Response Timeline</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyzedData.responsesByDate}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="responses"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Question Analysis */}
              {analyzedData.questionAnalysis.length > 0 && (
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mb-4 sm:mb-6">Top Question Responses</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyzedData.questionAnalysis[0]?.responses || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="answer" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Keyword Cloud */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mb-4 sm:mb-6">Key Themes</h3>
                {analyzedData.keywordFrequency.length > 0 ? (
                  <WordCloudD3 data={analyzedData.keywordFrequency} />
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-400">
                    <p>No keywords found</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Detailed Analysis View */
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mb-4 sm:mb-6">AI-Generated Analysis</h3>
            <div className="prose prose-invert max-w-none">
              <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700 overflow-hidden">
                <div className="space-y-6 text-sm sm:text-base leading-relaxed">
                  {rawSummary.split('\n\n').map((paragraph, index) => {
                    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                      return (
                        <h4 key={index} className="text-lg font-semibold text-gray-100 border-b border-gray-700 pb-2">
                          {paragraph.replace(/\*\*/g, '')}
                        </h4>
                      );
                    } else if (paragraph.startsWith('###')) {
                      return (
                        <h5 key={index} className="text-base font-medium text-gray-200 mt-4 mb-2">
                          {paragraph.replace(/###\s/, '')}
                        </h5>
                      );
                    } else if (paragraph.includes('*')) {
                      return (
                        <div key={index} className="text-gray-300">
                          {paragraph.split('\n').map((line, lineIndex) => (
                            <p key={lineIndex} className={line.startsWith('*') ? 'ml-4 mb-1' : 'mb-2'}>
                              {line.replace(/^\*\s/, '• ')}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return (
                      <p key={index} className="text-gray-300 leading-relaxed">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}