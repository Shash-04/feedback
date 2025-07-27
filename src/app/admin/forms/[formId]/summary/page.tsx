'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import TextualSummary from '@/components/TextualSummary';

const TimelineChart = dynamic(() => import("@/components/TimelineChart"), {
    ssr: false,
    loading: () => <div className="h-64 flex items-center justify-center text-gray-500">Loading timeline...</div>
});

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export default function SummaryPage() {
    const params = useParams();
    const formId = params?.formId as string;

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!formId) {
            setError('Invalid form ID');
            setLoading(false);
            return;
        }

        async function getSummary() {
            try {
                setLoading(true);
                setError('');

                const res = await fetch(`/api/forms/${formId}/summary`);

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const result = await res.json();

                if (result.error) {
                    throw new Error(result.error);
                }

                setData(result);
            } catch (e) {
                console.error('Error fetching summary:', e);
                setError(e instanceof Error ? e.message : 'Failed to load summary data.');
            } finally {
                setLoading(false);
            }
        }

        getSummary();
    }, [formId]);

    const ratingsData = data?.ratings?.categories?.map((category: string, index: number) => ({
        name: category,
        value: data.ratings.averages[index]
    })) || [];

    const sentimentData = data?.sentiment ? [
        { name: 'Positive', value: data.sentiment.positive, color: '#10B981' },
        { name: 'Neutral', value: data.sentiment.neutral, color: '#3B82F6' },
        { name: 'Negative', value: data.sentiment.negative, color: '#EF4444' }
    ] : [];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 text-white p-4 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full relative"
                >
                    <motion.span
                        className="absolute -inset-1 rounded-full border-2 border-blue-300 opacity-75"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-5 md:p-8 w-full">
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mb-6 bg-red-900/50 p-4 rounded-lg border border-red-700 backdrop-blur-sm"
                    >
                        <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            Error
                        </h2>
                        <p>{error}</p>
                    </motion.div>
                )}

                {!data && !error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center min-h-[50vh]"
                    >
                        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 max-w-md text-center backdrop-blur-sm">
                            <h2 className="text-2xl font-bold mb-2">No Data Available</h2>
                            <p>No summary data could be found for this form.</p>
                        </div>
                    </motion.div>
                )}

                {data && (
                    <>
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-8"
                        >
                            <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                Feedback Insights Dashboard
                            </h1>
                            <p className="text-gray-400">{data.summary}</p>
                        </motion.div>

                        {/* Main Charts */}
                        <div className=" grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                            {/* Ratings Chart */}
                            <ChartContainer
                                title="Average Ratings"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                delay={0.2}
                            >
                                {ratingsData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={ratingsData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
                                            <XAxis
                                                dataKey="name"
                                                stroke="#9CA3AF"
                                                tick={{ fontSize: 12 }}
                                                tickMargin={10}
                                            />
                                            <YAxis
                                                stroke="#9CA3AF"
                                                domain={[0, 5]}
                                                tick={{ fontSize: 12 }}
                                                tickMargin={10}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#111827',
                                                    borderColor: '#374151',
                                                    borderRadius: '0.5rem',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                }}
                                                cursor={{ fill: '#374151', opacity: 0.5 }}
                                            />
                                            <Bar
                                                dataKey="value"
                                                fill="#3B82F6"
                                                radius={[4, 4, 0, 0]}
                                                animationDuration={1500}
                                            >
                                                {ratingsData.map((entry: any, index: number) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={COLORS[index % COLORS.length]}
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <EmptyState message="No ratings data available" />
                                )}
                            </ChartContainer>

                            {/* Sentiment Chart */}
                            <ChartContainer
                                title="Sentiment Analysis"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                delay={0.2}
                                className='p-2'
                            >
                                {sentimentData.length > 0 ? (
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
                                                animationDuration={1000}
                                                animationEasing="ease-out"
                                            >
                                                {sentimentData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                    />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <EmptyState message="No sentiment data available" />
                                )}
                            </ChartContainer>
                        </div>


                        {/* Strengths & Weaknesses */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                            <ListContainer
                                title="Strengths"
                                items={data.strengths || []}
                                color="green"
                                delay={0.6}
                            />

                            <ListContainer
                                title="Areas for Improvement"
                                items={data.weaknesses || []}
                                color="red"
                                delay={0.6}
                            />
                        </div>
                        <TextualSummary data={data} />
                        {/* Recommendations */}
                        {data.recommendations?.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.8 }}
                                className="bg-gray-900/50 p-4 md:p-6 rounded-xl border border-purple-800/50 mb-6 md:mb-8 backdrop-blur-sm"
                            >
                                <h2 className="text-xl font-semibold mb-4 text-purple-400 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Recommendations
                                </h2>
                                <ul className="space-y-2 md:space-y-3">
                                    {data.recommendations.map((rec: string, index: number) => (
                                        <motion.li
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                                            className="flex items-start bg-purple-900/20 p-3 rounded-lg border border-purple-800/30"
                                        >
                                            <span className="inline-block w-5 h-5 mr-2 text-purple-400 flex-shrink-0">
                                                <svg viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                                </svg>
                                            </span>
                                            <span className="text-sm md:text-base">{rec}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}

                        {/* Timeline */}
                        {data.timeline?.length > 1 && (
                            <ChartContainer
                                title="Feedback Over Time"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                delay={1}
                            >
                                <div className="h-64">
                                    <TimelineChart data={data.timeline} />
                                </div>
                            </ChartContainer>
                        )}
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

// Reusable Chart Container Component
const ChartContainer = ({
    children,
    title,
    initial,
    animate,
    delay = 0,
    className = ''
}: {
    children: React.ReactNode;
    title: string;
    initial: any;
    animate: any;
    delay?: number;
    className?: string;
}) => (
    <motion.div
        initial={initial}
        animate={animate}
        transition={{ duration: 0.5, delay }}
        className={`bg-gray-900/50 p-4 rounded-xl border border-gray-800 backdrop-blur-sm ${className}`}
    >
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">{title}</h2>
        <div className="h-64">
            {children}
        </div>
    </motion.div>
);

// Reusable List Container Component
const ListContainer = ({
    items,
    title,
    color,
    delay
}: {
    items: string[];
    title: string;
    color: 'green' | 'red' | 'blue' | 'purple' | 'yellow';
    delay: number;
}) => {
    const colorClasses = {
        green: 'text-green-400 bg-green-900/20 border-green-800/30',
        red: 'text-red-400 bg-red-900/20 border-red-800/30',
        blue: 'text-blue-400 bg-blue-900/20 border-blue-800/30',
        purple: 'text-purple-400 bg-purple-900/20 border-purple-800/30',
        yellow: 'text-yellow-400 bg-yellow-900/20 border-yellow-800/30',
    };

    const dotColors = {
        green: 'bg-green-500',
        red: 'bg-red-500',
        blue: 'bg-blue-500',
        purple: 'bg-purple-500',
        yellow: 'bg-yellow-500',
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay }}
            className={`bg-gray-900/50 p-4 md:p-6 rounded-xl border border-gray-800 backdrop-blur-sm ${colorClasses[color]}`}
        >
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2">
                {title}
            </h2>
            <ul className="space-y-2 md:space-y-3">
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: delay + index * 0.1 }}
                            className="flex items-start"
                        >
                            <span className={`inline-block w-2 h-2 mt-2 mr-2 rounded-full flex-shrink-0 ${dotColors[color]}`}></span>
                            <span className="text-sm md:text-base">{item}</span>
                        </motion.li>
                    ))
                ) : (
                    <li className="text-gray-500 text-sm md:text-base">No {title.toLowerCase()} data available</li>
                )}
            </ul>
        </motion.div>
    );
};

// Word Cloud Component
const WordCloudComponent = ({ words }: { words: { text: string; value: number }[] }) => {
    if (!words || words.length === 0) {
        return <EmptyState message="No word cloud data available" />;
    }

    return (
        <div className="relative w-full h-full">
            <svg width="100%" height="100%" viewBox="0 0 500 300" className="overflow-visible">
                <AnimatePresence>
                    {words.slice(0, 20).map((word, i) => {
                        const angle = (i % 3 - 1) * 30; // -30, 0, or 30 degrees
                        const fontSize = Math.min(Math.max(word.value * 2, 12), 36);
                        const x = 100 + (i % 3) * 150;
                        const y = 50 + Math.floor(i / 3) * 80;

                        return (
                            <motion.text
                                key={word.text}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    x: x + (Math.random() * 40 - 20),
                                    y: y + (Math.random() * 40 - 20)
                                }}
                                transition={{
                                    duration: 0.8,
                                    delay: i * 0.05,
                                    type: 'spring',
                                    damping: 10,
                                    stiffness: 100
                                }}
                                fill={COLORS[i % COLORS.length]}
                                fontSize={fontSize}
                                fontWeight="bold"
                                textAnchor="middle"
                                transform={`rotate(${angle})`}
                                className="drop-shadow-md"
                            >
                                {word.text}
                            </motion.text>
                        );
                    })}
                </AnimatePresence>
            </svg>
        </div>
    );
};

// Empty State Component
const EmptyState = ({ message }: { message: string }) => (
    <div className="h-full flex items-center justify-center text-gray-500 text-sm md:text-base">
        {message}
    </div>
);