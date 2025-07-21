"use client";

import { useState } from "react";
import { PlusCircle, Trash2, Save, FileText, Check, AlertCircle } from "lucide-react";
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
        <div className="fixed top-4 right-4 z-50">
            <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg border ${
                type === 'success' 
                    ? 'bg-gray-800 border-green-600 text-green-400' 
                    : 'bg-gray-800 border-red-600 text-red-400'
            }`}>
                {type === 'success' ? (
                    <Check className="h-5 w-5" />
                ) : (
                    <AlertCircle className="h-5 w-5" />
                )}
                <span className="text-white">{message}</span>
                <button 
                    onClick={onClose}
                    className="ml-2 text-gray-400 hover:text-white"
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
            
            <div className="min-h-screen bg-gray-900 text-white">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <FileText className="h-8 w-8 text-blue-400" />
                            <h1 className="text-3xl font-bold">Form Builder</h1>
                        </div>
                    </div>

                    {/* Form Title */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Form Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter form title"
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Questions */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">Questions</h2>
                            {questions.length > 0 && (
                                <span className="text-sm text-gray-400">
                                    {questions.length} question{questions.length !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>

                        {questions.length === 0 ? (
                            <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
                                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-300 mb-2">No questions yet</h3>
                                <p className="text-gray-400">Add your first question to get started</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {questions.map((q, index) => (
                                    <div
                                        key={q.id}
                                        className="bg-gray-800 border border-gray-700 rounded-lg p-6"
                                    >
                                        {/* Question Header */}
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-medium">Question {index + 1}</h3>
                                            <button
                                                onClick={() => removeQuestion(q.id)}
                                                className="text-red-400 hover:text-red-300 p-1"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>

                                        {/* Question Input */}
                                        <div className="mb-4">
                                            <input
                                                type="text"
                                                placeholder="Enter your question"
                                                value={q.question}
                                                onChange={(e) => updateQuestion(q.id, "question", e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        {/* Question Settings */}
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Question Type
                                                </label>
                                                <select
                                                    value={q.type}
                                                    onChange={(e) => updateQuestion(q.id, "type", e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    {questionTypes.map((type) => (
                                                        <option key={type.value} value={type.value}>
                                                            {type.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="flex items-end">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={q.required}
                                                        onChange={(e) => updateQuestion(q.id, "required", e.target.checked)}
                                                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-300">Required</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={addQuestion}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <PlusCircle className="h-5 w-5" />
                            Add Question
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={!title.trim() || questions.length === 0}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                        >
                            <Save className="h-5 w-5" />
                            Save Form
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}