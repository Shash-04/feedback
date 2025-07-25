'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// Dynamically import heavier components
const TimelineChart = dynamic(() => import("@/components/TimelineChart"), { ssr: false });

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function SummaryPage() {
    const params = useParams();
    const formId = params?.formId as string;

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function getSummary() {
            try {
                const res = await fetch(`/api/forms/${formId}/summary`);
                const result = await res.json();
                if (result.error) {
                    setError(result.error);
                } else {
                    setData(result);
                }
            } catch (e) {
                setError('Failed to load summary data.');
            } finally {
                setLoading(false);
            }
        }

        if (formId) getSummary();
    }, [formId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 text-white p-8 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-950 text-white p-8 flex items-center justify-center">
                <div className="bg-red-900/50 p-6 rounded-lg border border-red-700 max-w-md text-center">
                    <h2 className="text-2xl font-bold mb-2">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-gray-950 text-white p-8 flex items-center justify-center">
                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 max-w-md text-center">
                    <h2 className="text-2xl font-bold mb-2">No Data</h2>
                    <p>No summary data available for this form.</p>
                </div>
            </div>
        );
    }

    // Prepare data for charts
    const ratingsData = data.ratings.categories.map((category: string, index: number) => ({
        name: category,
        value: data.ratings.averages[index]
    }));

    const sentimentData = [
        { name: 'Positive', value: data.sentiment.positive, color: '#4ade80' },
        { name: 'Neutral', value: data.sentiment.neutral, color: '#60a5fa' },
        { name: 'Negative', value: data.sentiment.negative, color: '#f87171' }
    ];

    return (
        <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                    Feedback Insights Dashboard
                </h1>
                <p className="text-gray-400">{data.summary}</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Ratings Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-gray-900 p-4 rounded-xl border border-gray-800"
                >
                    <h2 className="text-xl font-semibold mb-4">Average Ratings</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ratingsData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" domain={[0, 5]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }}
                                />
                                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                                    {ratingsData.map((entry: any, index: number) => (
                                        <motion.rect
                                            key={`cell-${index}`}
                                            initial={{ height: 0 }}
                                            animate={{ height: '100%' }}
                                            transition={{ duration: 0.8, delay: index * 0.1 }}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Sentiment Chart */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-gray-900 p-4 rounded-xl border border-gray-800"
                >
                    <h2 className="text-xl font-semibold mb-4">Sentiment Analysis</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sentimentData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent as any * 100).toFixed(0)}%`}
                                >
                                    {sentimentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }}
                                    formatter={(value: number) => [`${value}%`, 'Percentage']}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Themes and Word Cloud */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Themes Radar Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-gray-900 p-4 rounded-xl border border-gray-800"
                >
                    <h2 className="text-xl font-semibold mb-4">Key Themes</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.themes.slice(0, 6)}>
                                <PolarGrid stroke="#374151" />
                                <PolarAngleAxis dataKey="name" stroke="#9CA3AF" />
                                <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} stroke="#9CA3AF" />
                                <Radar
                                    name="Frequency"
                                    dataKey="count"
                                    stroke="#3B82F6"
                                    fill="#3B82F6"
                                    fillOpacity={0.6}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Word Cloud */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-gray-900 p-4 rounded-xl border border-gray-800"
                >
                    <h2 className="text-xl font-semibold mb-4">Frequent Terms</h2>
                    <div className="h-64 flex items-center justify-center">
                        <WordCloudComponent words={data.wordCloud} />
                    </div>
                </motion.div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="bg-gray-900 p-4 rounded-xl border border-gray-800"
                >
                    <h2 className="text-xl font-semibold mb-4 text-green-400">Strengths</h2>
                    <ul className="space-y-3">
                        {data.strengths.map((strength: string, index: number) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                                className="flex items-start"
                            >
                                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                                <span>{strength}</span>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="bg-gray-900 p-4 rounded-xl border border-gray-800"
                >
                    <h2 className="text-xl font-semibold mb-4 text-red-400">Areas for Improvement</h2>
                    <ul className="space-y-3">
                        {data.weaknesses.map((weakness: string, index: number) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                                className="flex items-start"
                            >
                                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-red-500 rounded-full"></span>
                                <span>{weakness}</span>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>
            </div>

            {/* Recommendations */}
            {data.recommendations && data.recommendations.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="bg-gray-900 p-4 rounded-xl border border-purple-800/50 mb-8"
                >
                    <h2 className="text-xl font-semibold mb-4 text-purple-400">Recommendations</h2>
                    <ul className="space-y-3">
                        {data.recommendations.map((rec: string, index: number) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                                className="flex items-start bg-purple-900/20 p-3 rounded-lg border border-purple-800/30"
                            >
                                <span className="inline-block w-5 h-5 mr-2 text-purple-400">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                    </svg>
                                </span>
                                <span>{rec}</span>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>
            )}

            {/* Timeline */}
            {data.timeline && data.timeline.length > 1 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="bg-gray-900 p-4 rounded-xl border border-gray-800"
                >
                    <h2 className="text-xl font-semibold mb-4">Feedback Over Time</h2>
                    <div className="h-64">
                        <TimelineChart data={data.timeline} />
                    </div>
                </motion.div>
            )}
        </div>
    );
}

// Word Cloud Component
const WordCloudComponent = ({ words }: { words: { text: string; value: number }[] }) => {
    if (!words || words.length === 0) {
        return <p className="text-gray-500">No word cloud data available</p>;
    }

    return (
        <svg width="100%" height="100%" viewBox={`0 0 ${500} ${300}`}>
            {words.slice(0, 20).map((word, i) => {
                const angle = (i % 2) * 45;
                const fontSize = Math.min(Math.max(word.value * 2, 12), 36);
                return (
                    <motion.text
                        key={word.text}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                        fill={COLORS[i % COLORS.length]}
                        fontSize={fontSize}
                        fontWeight="bold"
                        textAnchor="middle"
                        transform={`translate(${Math.random() * 400 + 50}, ${Math.random() * 200 + 50}) rotate(${angle})`}
                    >
                        {word.text}
                    </motion.text>
                );
            })}
        </svg>
    );
};