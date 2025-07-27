"use client"

import React from 'react';
import { PlusCircle, Edit3, BarChart3, Package } from 'lucide-react';
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
      id: 'Summary',
      title: 'Summary',
      description: 'View AI generated analysis',
      icon: Package,
      path: '/admin/summary',
      gradient: 'from-yellow-500 to-teal-500',
      hoverGradient: 'from-green-600 to-teal-600'
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'View analytics and form responses',
      icon: BarChart3,
      path: '/admin/dashboard',
      gradient: 'from-green-500 to-teal-500',
      hoverGradient: 'from-green-600 to-teal-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-20 text-center sm:text-left">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">Welcome back!</h2>
          <p className="text-gray-400 text-md sm:text-base">
            Choose an action to get started with your forms management.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {cards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.path)}
                className="group relative bg-gray-800/70 border border-gray-700 rounded-2xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-[1.03] hover:border-gray-600 hover:shadow-2xl overflow-hidden backdrop-blur-md"
              >
                {/* Background Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`} />

                {/* Card Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-12 h-12 bg-gradient-to-r ${card.gradient} rounded-xl flex items-center justify-center mb-5 group-hover:shadow-lg transition-shadow duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2 group-hover:text-gray-100 transition-colors">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors text-sm leading-relaxed sm:leading-snug">
                    {card.description}
                  </p>

                  {/* Arrow Indicator */}
                  <div className="flex items-center mt-5 text-gray-500 group-hover:text-gray-300 transition-colors">
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
                <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl`} />
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
