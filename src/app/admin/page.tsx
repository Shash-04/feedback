"use client"
import React from 'react';
import { PlusCircle, Edit3, BarChart3,Package} from 'lucide-react';
import { useRouter } from 'next/navigation';

const AdminDashboard = () => {
    const router = useRouter();

    const handleCardClick = (path: string) => {
        router.push(path);
    };

    const cards = [
        {
            id: 'form-builder',
            title: 'Form Builder',
            description: 'Create new forms with drag-and-drop interface',
            icon: PlusCircle,
            path: '/admin/form-builder',
            gradient: 'from-blue-500 to-cyan-500',
            hoverGradient: 'from-blue-600 to-cyan-600'
        },
        {
            id: 'edit-form',
            title: 'Edit Forms',
            description: 'Modify and update existing forms',
            icon: Edit3,
            path: '/admin/edit-forms',
            gradient: 'from-purple-500 to-pink-500',
            hoverGradient: 'from-purple-600 to-pink-600'
        },
        {
            id: 'dashboard',
            title: 'Dashboard',
            description: 'View analytics and form responses',
            icon: BarChart3,
            path: '/admin/dashboard',
            gradient: 'from-green-500 to-teal-500',
            hoverGradient: 'from-green-600 to-teal-600'
        },
        {
            id: 'Summary',
            title: 'Summary',
            description: 'View AI generated analysis',
            icon: Package,
            path: '/admin/summary',
            gradient: 'from-yellow-500 to-teal-500',
            hoverGradient: 'from-green-600 to-teal-600'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome back!</h2>
                    <p className="text-gray-400">Choose an action to get started with your forms management.</p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {cards.map((card) => {
                        const IconComponent = card.icon;
                        return (
                            <div
                                key={card.id}
                                onClick={() => handleCardClick(card.path)}
                                className="group relative bg-gray-800 rounded-2xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-700 hover:border-gray-600 overflow-hidden"
                            >
                                {/* Background Gradient Overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>

                                {/* Card Content */}
                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div className={`w-12 h-12 bg-gradient-to-r ${card.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow duration-300`}>
                                        <IconComponent className="w-6 h-6 text-white" />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gray-100 transition-colors">
                                        {card.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors text-sm leading-relaxed">
                                        {card.description}
                                    </p>

                                    {/* Arrow Indicator */}
                                    <div className="flex items-center mt-4 text-gray-500 group-hover:text-gray-300 transition-colors">
                                        <span className="text-sm font-medium">Get started</span>
                                        <svg
                                            className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Subtle Border Glow */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl`}></div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Stats Section */}
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Forms</p>
                                <p className="text-2xl font-bold text-white">24</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                <PlusCircle className="w-5 h-5 text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Active Forms</p>
                                <p className="text-2xl font-bold text-white">18</p>
                            </div>
                            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Responses</p>
                                <p className="text-2xl font-bold text-white">1,247</p>
                            </div>
                            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                <Edit3 className="w-5 h-5 text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;