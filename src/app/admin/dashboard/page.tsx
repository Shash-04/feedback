"use client";

import { Calendar, FileText, PieChart, PlusCircle, Users, TrendingUp, Clock, Star, AlertCircle, Activity, Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ResponsesModal from "./ResponsesModal";

interface FeedbackForm {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    responsesCount: number;
}

interface DashboardStats {
    totalForms: number;
    totalResponses: number;
    averageRating: number;
    responseRate: number;
}

export default function AdminDashboard() {
    const [forms, setForms] = useState<FeedbackForm[]>([]);
    const [stats, setStats] = useState<DashboardStats>({
        totalForms: 0,
        totalResponses: 0,
        averageRating: 0,
        responseRate: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedForm, setSelectedForm] = useState<{ id: string; title: string } | null>(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(false);
            
            // Fetch forms
            const formsRes = await fetch("/api/forms");
            if (!formsRes.ok) throw new Error("Failed to fetch forms");
            const formsData = await formsRes.json();
            setForms(formsData);

            // Fetch stats (you'll need to implement this endpoint)
            const statsRes = await fetch("/api/dashboard/stats");
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
            } else {
                // Calculate basic stats from forms data
                const totalResponses = formsData.reduce((sum: number, form: FeedbackForm) => sum + form.responsesCount, 0);
                setStats({
                    totalForms: formsData.length,
                    totalResponses,
                    averageRating: 4.2, // Placeholder
                    responseRate: 78, // Placeholder
                });
            }
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const openResponsesModal = (formId: string, formTitle: string) => {
        setSelectedForm({ id: formId, title: formTitle });
        setModalOpen(true);
    };

    const closeResponsesModal = () => {
        setModalOpen(false);
        setSelectedForm(null);
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const StatCard = ({ title, value, icon: Icon, color, subtitle }: {
        title: string;
        value: string | number;
        icon: any;
        color: string;
        subtitle?: string;
    }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gray-900 border border-gray-800 p-4 sm:p-6 rounded-xl"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 sm:p-3 rounded-lg ${color}`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-right">
                    <p className="text-lg sm:text-2xl font-bold">{value}</p>
                    <p className="text-xs sm:text-sm text-gray-400">{title}</p>
                </div>
            </div>
            {subtitle && (
                <p className="text-xs text-gray-500">{subtitle}</p>
            )}
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gray-950 text-white py-6 sm:py-10 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-bold mb-1">Admin Dashboard</h1>
                        <p className="text-gray-400 text-sm sm:text-lg">Monitor your feedback forms and analytics</p>
                    </div>
                    <Link href="/admin/form-builder">
                        <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-full sm:w-auto justify-center">
                            <PlusCircle className="w-4 h-4" />
                            New Form
                        </button>
                    </Link>
                </motion.div>

                {/* Stats Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6 sm:mb-8"
                >
                    <div className="flex items-center gap-2 mb-4 sm:mb-6">
                        <Activity className="w-5 h-5 text-purple-400" />
                        <h2 className="text-lg sm:text-xl font-semibold">Overview</h2>
                    </div>
                    
                    {loading ? (
                        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, idx) => (
                                <div key={idx} className="bg-gray-800/60 border border-gray-700 p-4 sm:p-6 rounded-xl animate-pulse">
                                    <div className="h-10 sm:h-12 bg-gray-700 rounded mb-4" />
                                    <div className="h-5 sm:h-6 bg-gray-700 rounded w-3/4 mb-2" />
                                    <div className="h-3 sm:h-4 bg-gray-700 rounded w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                            <StatCard
                                title="Total Forms"
                                value={stats.totalForms}
                                icon={FileText}
                                color="bg-blue-600"
                                subtitle="Active feedback forms"
                            />
                            <StatCard
                                title="Total Responses"
                                value={stats.totalResponses.toLocaleString()}
                                icon={Users}
                                color="bg-green-600"
                                subtitle="Across all forms"
                            />
                            <StatCard
                                title="Average Rating"
                                value={`${stats.averageRating}/5`}
                                icon={Star}
                                color="bg-yellow-600"
                                subtitle="Overall satisfaction"
                            />
                        </div>
                    )}
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-6 sm:mb-8"
                >
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-purple-400" />
                            <h2 className="text-lg sm:text-xl font-semibold">Quick Actions</h2>
                        </div>
                    </div>
                    
                    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                        <Link href="/admin/summary">
                            <div className="bg-gray-900 border border-gray-800 p-3 sm:p-4 rounded-lg hover:border-purple-500 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <PieChart className="w-5 h-5 text-purple-400" />
                                    <span className="text-sm sm:text-base">View Analytics</span>
                                </div>
                            </div>
                        </Link>
                        <Link href="/admin">
                            <div className="bg-gray-900 border border-gray-800 p-3 sm:p-4 rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <Activity className="w-5 h-5 text-blue-400" />
                                    <span className="text-sm sm:text-base">Admin Panel</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                </motion.div>

                {/* Forms Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-purple-400" />
                            <h2 className="text-lg sm:text-xl font-semibold">Your Forms</h2>
                        </div>
                        <Link href="/admin/edit-forms" className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm">
                            View All
                        </Link>
                    </div>

                    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className="bg-gray-800/60 border border-gray-700 p-4 sm:p-6 rounded-xl animate-pulse"
                                >
                                    <div className="h-5 sm:h-6 bg-gray-700 rounded w-3/4 mb-3" />
                                    <div className="h-3 sm:h-4 bg-gray-700 rounded w-full mb-2" />
                                    <div className="h-3 sm:h-4 bg-gray-700 rounded w-2/3" />
                                </div>
                            ))
                        ) : error ? (
                            <div className="col-span-full text-center text-red-400">
                                Failed to load dashboard data.
                            </div>
                        ) : forms.length === 0 ? (
                            <div className="col-span-full text-center text-gray-400 py-8 sm:py-12">
                                <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-600" />
                                <p className="mb-4 text-sm sm:text-base">No forms available.</p>
                                <Link href="/admin/form-builder">
                                    <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm sm:text-base">
                                        Create Your First Form
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            forms.slice(0, 6).map((form, idx) => (
                                <motion.div
                                    key={form.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-gray-900 border border-gray-800 p-4 sm:p-6 rounded-xl shadow hover:shadow-purple-700/20 hover:border-purple-700 transition-all"
                                >
                                    <div className="cursor-pointer">
                                        <Link href={`/admin/forms/${form.id}`}>
                                            <div className="mb-4">
                                                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                                                    <FileText className="text-purple-400 w-4 h-4 sm:w-5 sm:h-5" />
                                                    <h3 className="text-base sm:text-lg font-semibold line-clamp-1">
                                                        {form.title}
                                                    </h3>
                                                </div>
                                                <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 line-clamp-2">
                                                    {form.description || "No description provided."}
                                                </p>
                                                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        {formatDate(form.createdAt)}
                                                    </span>
                                                    <span className="text-white flex items-center gap-1">
                                                        <PieChart className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        {form.responsesCount || 0} responses
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                        
                                        {/* View Responses Button */}
                                        <div className="border-t border-gray-800 pt-3 mt-3">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    openResponsesModal(form.id, form.title);
                                                }}
                                                disabled={form.responsesCount === 0}
                                                className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                                                    form.responsesCount === 0
                                                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                                                }`}
                                            >
                                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                                {form.responsesCount === 0 
                                                    ? 'No Responses' 
                                                    : 'View Responses'
                                                }
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Responses Modal */}
                {selectedForm && (
                    <ResponsesModal
                        isOpen={modalOpen}
                        onClose={closeResponsesModal}
                        formId={selectedForm.id}
                        formTitle={selectedForm.title}
                    />
                )}
            </div>
        </div>
    );
}