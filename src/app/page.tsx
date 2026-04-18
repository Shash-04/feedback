'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Settings2, Sparkles, Database, Layers } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030303] text-zinc-50 flex flex-col items-center justify-center px-6 relative overflow-hidden selection:bg-indigo-500/30">
      
      {/* Background Gradients & Grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      {/* Glowing Orbs for Flashy but Tasteful Aesthetic */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[150px] opacity-60"></div>
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[150px] opacity-70"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[150px] opacity-60"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-6xl mt-16 md:mt-0 pt-20">

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="text-5xl sm:text-7xl md:text-7xl font-extrabold tracking-tighter text-center mb-6 leading-[1.05]"
        >
          Forms, reimagined <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            with Intelligence.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-zinc-400 text-center max-w-3xl mb-12 leading-relaxed font-light mt-4"
        >
          A unified, high-performance platform to build dynamic forms, instantly analyze responses using advanced AI, and derive deep insights across any organization.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto"
        >
          <div className="relative group w-full sm:w-auto">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur opacity-40 group-hover:opacity-80 transition duration-500"></div>
            <Link href="/admin" className="relative flex w-full sm:w-auto">
              <button className="w-full sm:w-auto h-14 px-8 rounded-full bg-zinc-950 text-white font-semibold hover:bg-black transition-all duration-300 border border-white/10 flex items-center justify-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                Launch Dashboard
              </button>
            </Link>
          </div>

          <Link href="/student" className="w-full sm:w-auto group relative">
            <div className="absolute inset-0 bg-white/5 rounded-full blur-md opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <button className="relative w-full sm:w-auto h-14 px-8 rounded-full bg-zinc-900 border border-zinc-700/80 text-zinc-300 font-semibold hover:bg-zinc-800 hover:text-white transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2">
              Submit Responses
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Feature Highlight Cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        className="mt-24 pb-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl relative z-10"
      >
        {[
          {
            title: 'AI Sentiment Analysis',
            desc: 'Automatically categorize unstructured responses and detect sentiment trends across thousands of submissions in real-time.',
            icon: Sparkles,
            color: 'text-pink-400',
            bg: 'bg-pink-500/10',
            border: 'hover:border-pink-500/50',
          },
          {
            title: 'Dynamic Form Engine',
            desc: 'Construct complex, conditional logic forms with a highly versatile builder designed for any industry or use case.',
            icon: Settings2,
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/10',
            border: 'hover:border-indigo-500/50',
          },
          {
            title: 'Unified Data Ecosystem',
            desc: 'Aggregate all your metrics into beautiful, actionable dashboards. Connect your data pipelines effortlessly.',
            icon: Database,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            border: 'hover:border-purple-500/50',
          },
        ].map((feature, idx) => (
          <div
            key={idx}
            className={`group p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 ${feature.border} hover:bg-zinc-800/60 transition-all duration-500 backdrop-blur-xl relative overflow-hidden`}
          >
            {/* Subtle Hover Gradient Inside Card */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className={`relative z-10 w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
              <feature.icon className={`w-6 h-6 ${feature.color}`} />
            </div>
            <h3 className="relative z-10 text-xl font-bold text-zinc-100 mb-3 tracking-tight">{feature.title}</h3>
            <p className="relative z-10 text-sm text-zinc-400 leading-relaxed font-medium">
              {feature.desc}
            </p>
          </div>
        ))}
      </motion.div>
    </main>
  );
}
