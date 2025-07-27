'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute  top-0 left-1/2 -translate-x-1/2 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-purple-500 rounded-full blur-[100px] sm:blur-[120px] opacity-20 pointer-events-none" />
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mt-7 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-center leading-tight"
      >
        Feedback<span className="text-purple-500">Analysis</span> Dashboard
      </motion.h1>

      {/* Subheading */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-base sm:text-lg md:text-xl text-gray-400 max-w-md sm:max-w-xl text-center mb-8"
      >
        Collect. Understand. Improve. Your campus feedback hub — faster, smarter, sleeker.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none justify-center"
      >
        <Link href="/admin" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-full transition duration-300 shadow-lg hover:shadow-purple-800">
            Admin
          </button>
        </Link>
        <Link href="/student" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto border border-purple-500 hover:bg-purple-800 text-white font-medium py-2 px-6 rounded-full transition duration-300">
            Student
          </button>
        </Link>
      </motion.div>

      {/* Feature Highlights */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-20 mb-6 w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center"
      >
        {[
          {
            title: 'Smart Analytics',
            desc: 'AI-powered summaries and sentiment analysis.',
            icon: '📊',
          },
          {
            title: 'Fully Customizable',
            desc: 'Build forms tailored to your department’s needs.',
            icon: '⚙️',
          },
          {
            title: 'Real-Time Insights',
            desc: 'Instant reports and dashboards at your fingertips.',
            icon: '⏱️',
          },
        ].map((feature, idx) => (
          <div
            key={idx}
            className="mb-6 bg-zinc-900/60 border border-zinc-700 rounded-2xl p-6 shadow-lg hover:shadow-purple-700 transition"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-400">{feature.desc}</p>
          </div>
        ))}
      </motion.section>
    </main>
  );
}
