// app/components/Footer.tsx
"use client";

import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#030303] text-zinc-400 border-t border-white/10 py-8 px-4 relative overflow-hidden">
      {/* Subtle top edge glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-3 bg-indigo-500/20 blur-xl"></div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        {/* Left - Project Info */}
        <div className="text-center md:text-left">
          <h2 className="text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            AI Form Ecosystem
          </h2>
          <p className="text-sm text-zinc-500 font-medium">
            Next-generation data collection | 2025 © All rights reserved
          </p>
        </div>

        {/* Right - Links or Socials */}
        <div className="flex gap-6 items-center">
          <a
            href="https://shash-portfolio.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-400 transition-colors text-sm font-medium"
          >
            Developer Portfolio
          </a>
          <a
            href="mailto:shashwatvaish1@gmail.com"
            className="hover:text-indigo-400 transition-colors text-sm font-medium"
          >
            Contact
          </a>
          {/* Add icons like GitHub/LinkedIn here if needed */}
        </div>
      </div>
    </footer>
  );
}
