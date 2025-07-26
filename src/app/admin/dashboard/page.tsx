"use client";

import { Calendar, FileText, PieChart, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface FeedbackForm {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    responsesCount: number;
}

export default function AdminDashboard() {
    const [forms, setForms] = useState<FeedbackForm[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchForms = async () => {
        try {
            setLoading(true);
            setError(false);
            const res = await fetch("/api/forms");
            if (!res.ok) throw new Error("Failed to fetch forms");
            const data = await res.json();
            setForms(data);
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchForms();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white py-10 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8 flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
                        <p className="text-gray-400">Overview of all feedback forms</p>
                    </div>
                    <Link href="/admin/form-builder">
                        <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <PlusCircle className="w-4 h-4" />
                            New Form
                        </button>
                    </Link>
                </motion.div>

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="bg-gray-800/60 border border-gray-700 p-6 rounded-xl animate-pulse"
                            >
                                <div className="h-6 bg-gray-700 rounded w-3/4 mb-3" />
                                <div className="h-4 bg-gray-700 rounded w-full mb-2" />
                                <div className="h-4 bg-gray-700 rounded w-2/3" />
                            </div>
                        ))
                    ) : error ? (
                        <div className="col-span-full text-center text-red-400">
                            Failed to load dashboard data.
                        </div>
                    ) : forms.length === 0 ? (
                        <div className="col-span-full text-center text-gray-400">
                            No forms available.
                        </div>
                    ) : (
                        forms.map((form, idx) => (
                            <motion.div
                                key={form.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow hover:shadow-purple-700 transition"
                            >
                                <Link href={`/admin/forms/${form.id}`}>
                                    <div className="cursor-pointer">
                                        <div className="flex items-center gap-3 mb-4">
                                            <FileText className="text-purple-400 w-5 h-5" />
                                            <h3 className="text-lg font-semibold line-clamp-1">
                                                {form.title}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                                            {form.description || "No description provided."}
                                        </p>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(form.createdAt)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <PieChart className="w-4 h-4" />
                                                {form.responsesCount || 0} responses
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
