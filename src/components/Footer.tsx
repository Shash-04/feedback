// app/components/Footer.tsx
"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left - Project Info */}
        <div className="text-center md:text-left">
          <h2 className="text-lg font-semibold text-white">
            Feedback Analysis System
          </h2>
          <p className="text-sm text-gray-400">
            Developed by students of BPIT | 2025 © All rights reserved
          </p>
        </div>

        {/* Right - Links or Socials */}
        <div className="flex gap-6 items-center">
          <a
            href="https://shash-portfolio.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors text-sm"
          >
            Developer Portfolio
          </a>
          <a
            href="mailto:shashwatvaish1@gmail.com"
            className="hover:text-white transition-colors text-sm"
          >
            Contact
          </a>
          {/* Add icons like GitHub/LinkedIn here if needed */}
        </div>
      </div>
    </footer>
  );
}
