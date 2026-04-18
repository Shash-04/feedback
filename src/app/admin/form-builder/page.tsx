"use client";

import { useState } from "react";
import { PlusCircle, Trash2, Save, FileText, Check, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

// Define a type for a question
type Question = {
    id: number;
    question: string;
    type: "DESCRIPTIVE" | "RATING";
    required: boolean;
    order: number;
};

// Notification component
const Notification = ({ message, type, visible, onClose }: {
    message: string;
    type: 'success' | 'error';
    visible: boolean;
    onClose: () => void;
}) => {
    if (!visible) return null;

    return (
        <div className="fixed top-4 right-4 z-[100]">
            <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border ${
                type === 'success' 
                    ? 'bg-zinc-900/80 border-green-500/30 text-green-400' 
                    : 'bg-zinc-900/80 border-red-500/30 text-red-400'
            }`}>
                {type === 'success' ? (
                    <Check className="h-5 w-5" />
                ) : (
                    <AlertCircle className="h-5 w-5" />
                )}
                <span className="text-zinc-100 font-medium">{message}</span>
                <button 
                    onClick={onClose}
                    className="ml-2 text-zinc-400 hover:text-white transition-colors cursor-pointer p-1"
                >
                    ×
                </button>
            </div>
        </div>
    );
};

const questionTypes = [
    { value: "DESCRIPTIVE", label: "Descriptive" },
    { value: "RATING", label: "1–5 Rating" }
];

export default function FormBuilder() {
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [notification, setNotification] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ visible: true, message, type });
        setTimeout(() => {
            setNotification(prev => ({ ...prev, visible: false }));
        }, 4000);
    };

    const addQuestion = () => {
        setQuestions((prev) => [
            ...prev,
            {
                id: Date.now(),
                question: "",
                type: "DESCRIPTIVE",
                required: false,
                order: prev.length
            }
        ]);
    };

    const updateQuestion = (id: number, key: keyof Question, value: any) => {
        setQuestions((prev) =>
            prev.map((q) => (q.id === id ? { ...q, [key]: value } : q))
        );
    };

    const removeQuestion = (id: number) => {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
    };

    const clearForm = () => {
        setTitle("");
        setQuestions([]);
    };

    const handleSubmit = async () => {
        try {
            const res = await fetch("/api/forms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, questions })
            });
            
            if (res.ok) {
                showNotification("Form saved successfully!", "success");
                clearForm();
            } else {
                showNotification("Error saving form. Please try again.", "error");
            }
        } catch (error) {
            showNotification("Network error. Please check your connection.", "error");
        }
    };

    return (
        <>
            <Notification 
                {...notification} 
                onClose={() => setNotification(prev => ({ ...prev, visible: false }))}
            />
            
            <div className="min-h-full bg-transparent text-white pb-16">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <FileText className="h-8 w-8 text-indigo-400" />
                            <h1 className="text-3xl font-bold tracking-tight">Form Builder</h1>
                        </div>
                    </motion.div>

                    {/* Form Title */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10 bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-8 backdrop-blur-xl"
                    >
                        <label className="block text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wide">
                            Form Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter form title"
                            className="w-full px-5 py-4 bg-zinc-950/50 border border-zinc-800/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-lg transition-all text-white placeholder-zinc-500"
                        />
                    </motion.div>

                    {/* Questions */}
                    <div className="mb-10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 px-2 gap-4">
                            <h2 className="text-2xl font-bold tracking-tight text-white">Questions</h2>
                            {questions.length > 0 && (
                                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl">
                                    {questions.length} question{questions.length !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>

                        {questions.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="text-center py-16 bg-zinc-900/40 rounded-3xl border border-zinc-800/60 backdrop-blur-xl relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none"></div>
                                <div className="bg-white/5 p-5 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center border border-white/10 shadow-inner">
                                    <FileText className="h-8 w-8 text-zinc-400" />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-200 mb-2 tracking-tight">No questions yet</h3>
                                <p className="text-zinc-500 font-medium">Add your first question to get started</p>
                            </motion.div>
                        ) : (
                            <div className="space-y-6">
                                {questions.map((q, index) => (
                                    <motion.div
                                        key={q.id}
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"></div>
                                        
                                        {/* Question Header */}
                                        <div className="flex items-center justify-between mb-6 relative z-10">
                                            <h3 className="text-lg font-bold text-zinc-100">Question {index + 1}</h3>
                                            <button
                                                onClick={() => removeQuestion(q.id)}
                                                className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent p-2.5 rounded-xl transition-all duration-300"
                                                title="Delete Node"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>

                                        {/* Question Input */}
                                        <div className="mb-6 relative z-10">
                                            <input
                                                type="text"
                                                placeholder="Enter your question"
                                                value={q.question}
                                                onChange={(e) => updateQuestion(q.id, "question", e.target.value)}
                                                className="w-full px-5 py-4 bg-zinc-950/50 border border-zinc-800/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-zinc-100 placeholder-zinc-500"
                                            />
                                        </div>

                                        {/* Question Settings */}
                                        <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                                            <div className="flex-1">
                                                <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">
                                                    Question Type
                                                </label>
                                                <select
                                                    value={q.type}
                                                    onChange={(e) => updateQuestion(q.id, "type", e.target.value)}
                                                    className="w-full px-4 py-3.5 bg-zinc-950/50 border border-zinc-800/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-zinc-300 appearance-none cursor-pointer"
                                                >
                                                    {questionTypes.map((type) => (
                                                        <option key={type.value} value={type.value} className="bg-zinc-900">
                                                            {type.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="flex items-center pt-2 sm:pt-6">
                                                <label className="flex items-center gap-3 cursor-pointer group/check">
                                                    <div className="relative flex items-center justify-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={q.required}
                                                            onChange={(e) => updateQuestion(q.id, "required", e.target.checked)}
                                                            className="peer sr-only"
                                                        />
                                                        <div className="w-6 h-6 bg-zinc-800 border border-zinc-600 rounded-md peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-all shadow-inner"></div>
                                                        <Check className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                                    </div>
                                                    <span className="text-sm font-medium text-zinc-300 group-hover/check:text-white transition-colors">Required</span>
                                                </label>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-zinc-800/60">
                        <button
                            onClick={addQuestion}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-zinc-800 text-zinc-200 rounded-2xl hover:bg-zinc-700 hover:text-white transition-all font-semibold tracking-wide border border-zinc-700 hover:border-zinc-500 shadow-sm"
                        >
                            <PlusCircle className="h-5 w-5" />
                            Add Question
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={!title.trim() || questions.length === 0}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:border-zinc-800 disabled:cursor-not-allowed transition-all font-semibold tracking-wide shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] border border-indigo-500/50 disabled:shadow-none"
                        >
                            <Save className="h-5 w-5" />
                            Save Form
                        </button>
                    </motion.div>
                </div>
            </div>
        </>
    );
}