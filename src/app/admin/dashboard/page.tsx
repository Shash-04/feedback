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
            whileHover={{ y: -4 }}
            className="bg-zinc-900/40 border border-zinc-800/60 p-6 sm:p-8 rounded-3xl backdrop-blur-xl relative group overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"></div>
            
            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`p-3.5 rounded-2xl border ${color} bg-opacity-10`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color.replace('border-', 'text-').replace('-500/20', '-400')}`} />
                </div>
                <div className="text-right">
                    <p className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">{value}</p>
                    <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-500 mt-1">{title}</p>
                </div>
            </div>
            {subtitle && (
                <p className="text-xs font-medium text-zinc-500 mt-4 relative z-10">{subtitle}</p>
            )}
        </motion.div>
    );

    return (
        <div className="min-h-full bg-transparent text-white pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-10 sm:mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                >
                    <div>
                        <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 tracking-tight text-white">Admin Dashboard</h1>
                        <p className="text-zinc-400 text-sm sm:text-lg font-light">Monitor your feedback forms and analytics</p>
                    </div>
                    <Link href="/admin/form-builder">
                        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-500 transition-all font-semibold tracking-wide shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] border border-indigo-500/50 w-full sm:w-auto">
                            <PlusCircle className="w-5 h-5" />
                            New Form
                        </button>
                    </Link>
                </motion.div>

                {/* Stats Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-10 sm:mb-12"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Activity className="w-6 h-6 text-indigo-400" />
                        <h2 className="text-2xl font-bold tracking-tight text-white">Overview</h2>
                    </div>
                    
                    {loading ? (
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, idx) => (
                                <div key={idx} className="bg-zinc-900/40 border border-zinc-800/60 p-6 sm:p-8 rounded-3xl backdrop-blur-xl animate-pulse">
                                    <div className="h-10 sm:h-12 bg-zinc-800 rounded-2xl mb-4 w-12" />
                                    <div className="flex justify-end mt-[-3rem] mb-6">
                                        <div className="flex flex-col items-end">
                                            <div className="h-8 bg-zinc-800 rounded w-16 mb-2" />
                                            <div className="h-4 bg-zinc-800 rounded w-24" />
                                        </div>
                                    </div>
                                    <div className="h-3 bg-zinc-800 rounded w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            <StatCard
                                title="Total Forms"
                                value={stats.totalForms}
                                icon={FileText}
                                color="border-indigo-500/20 bg-indigo-500"
                                subtitle="Active feedback forms"
                            />
                            <StatCard
                                title="Total Responses"
                                value={stats.totalResponses.toLocaleString()}
                                icon={Users}
                                color="border-emerald-500/20 bg-emerald-500"
                                subtitle="Across all forms"
                            />
                            <StatCard
                                title="Average Rating"
                                value={`${stats.averageRating}/5`}
                                icon={Star}
                                color="border-amber-500/20 bg-amber-500"
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
                    className="mb-10 sm:mb-12"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-6 h-6 text-indigo-400" />
                            <h2 className="text-2xl font-bold tracking-tight text-white">Quick Actions</h2>
                        </div>
                    </div>
                    
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                        <Link href="/admin/summary">
                            <div className="bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-md p-5 sm:p-6 rounded-2xl hover:bg-zinc-800/80 transition-all cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20 group-hover:border-indigo-500/40 transition-colors">
                                        <PieChart className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <span className="text-base font-bold text-zinc-100 tracking-tight">View Analytics</span>
                                </div>
                            </div>
                        </Link>
                        <Link href="/admin">
                            <div className="bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-md p-5 sm:p-6 rounded-2xl hover:bg-zinc-800/80 transition-all cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="bg-sky-500/10 p-3 rounded-xl border border-sky-500/20 group-hover:border-sky-500/40 transition-colors">
                                        <Activity className="w-5 h-5 text-sky-400" />
                                    </div>
                                    <span className="text-base font-bold text-zinc-100 tracking-tight">Admin Panel</span>
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                        <div className="flex items-center gap-3">
                            <FileText className="w-6 h-6 text-indigo-400" />
                            <h2 className="text-2xl font-bold tracking-tight text-white">Your Forms</h2>
                        </div>
                        <Link href="/admin/edit-forms" className="text-xs font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl transition-colors inline-block w-fit">
                            View All
                        </Link>
                    </div>

                    <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className="bg-zinc-900/40 border border-zinc-800/60 p-6 sm:p-8 rounded-3xl backdrop-blur-xl animate-pulse"
                                >
                                    <div className="h-6 sm:h-7 bg-zinc-800 rounded w-3/4 mb-4" />
                                    <div className="h-4 sm:h-5 bg-zinc-800 rounded w-full mb-3" />
                                    <div className="h-4 sm:h-5 bg-zinc-800 rounded w-1/2" />
                                </div>
                            ))
                        ) : error ? (
                            <div className="col-span-full text-center py-12">
                                <div className="bg-zinc-900/40 border border-red-900/30 backdrop-blur-xl rounded-3xl p-10 max-w-md mx-auto">
                                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
                                    <p className="text-red-400 font-semibold">Failed to load dashboard data.</p>
                                </div>
                            </div>
                        ) : forms.length === 0 ? (
                            <div className="col-span-full text-center py-16">
                                <div className="bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-xl rounded-3xl p-10 max-w-md mx-auto relative overflow-hidden">
                                     <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none"></div>
                                     <div className="bg-white/5 p-5 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center border border-white/10 shadow-inner">
                                        <FileText className="w-8 h-8 text-zinc-400" />
                                     </div>
                                    <h3 className="text-xl font-bold text-zinc-200 mb-3 tracking-tight">No forms available</h3>
                                    <p className="mb-8 text-zinc-500 font-medium">Add your first data input node to construct the form.</p>
                                    <Link href="/admin/form-builder">
                                        <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 hover:border-zinc-500 transition-all font-semibold rounded-2xl shadow-sm px-6 py-3">
                                            Create Your First Form
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            forms.slice(0, 6).map((form, idx) => (
                                <motion.div
                                    key={form.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ y: -4 }}
                                    className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative group flex flex-col h-full overflow-hidden shadow-none"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"></div>
                                    
                                    <div className="cursor-pointer flex-grow flex flex-col z-10 relative">
                                        <Link href={`/admin/forms/${form.id}`}>
                                            <div className="mb-6 flex-grow">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="bg-indigo-500/10 p-2.5 rounded-xl border border-indigo-500/20 group-hover:border-indigo-500/40 transition-colors">
                                                        <FileText className="text-indigo-400 w-5 h-5" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-zinc-100 line-clamp-1 tracking-tight">
                                                        {form.title}
                                                    </h3>
                                                </div>
                                                <p className="text-sm font-medium italic text-zinc-500 mb-6 line-clamp-2">
                                                    {form.description || "No description provided."}
                                                </p>
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                                    <span className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 opacity-70" />
                                                        {formatDate(form.createdAt)}
                                                    </span>
                                                    <span className="flex items-center gap-2 text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg">
                                                        <PieChart className="w-4 h-4 opacity-70" />
                                                        {form.responsesCount || 0} responses
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                        
                                        {/* View Responses Button */}
                                        <div className="border-t border-zinc-800/60 pt-6 mt-auto relative z-10 w-full">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    openResponsesModal(form.id, form.title);
                                                }}
                                                disabled={form.responsesCount === 0}
                                                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold tracking-wide transition-all border ${
                                                    form.responsesCount === 0
                                                        ? 'bg-zinc-800/50 border-zinc-800 text-zinc-600 cursor-not-allowed'
                                                        : 'bg-transparent border-zinc-700 hover:bg-zinc-800 hover:border-zinc-500 text-zinc-300 hover:text-white'
                                                }`}
                                            >
                                                <Eye className="w-4 h-4" />
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