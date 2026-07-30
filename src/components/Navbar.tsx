'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PenLine, Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';

const Navbar = ({
  title = "Sentra",
  subtitle = "AI-Powered Feedback Intelligence Platform",
}: {
  title?: string;
  subtitle?: string;
}) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const isAdminRoute = pathname?.startsWith('/admin') ?? false;

  const navLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Submit Feedback', href: '/student', icon: PenLine },
  ];

  return (
    <>
      <header className="bg-black/40 border-b border-white/10 px-4 py-3 sm:px-6 lg:px-8 sticky top-0 z-[60] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {isAdminRoute && (
                <button
                  onClick={toggleMobileMenu}
                  className="md:hidden p-2 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-all"
                  title="Menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              )}
              <Link href="/">
                <div className="flex items-center space-x-3 group">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent tracking-tight group-hover:to-zinc-200 transition-all">{title}</h1>
                    {subtitle && (
                      <p className="text-indigo-400/80 text-xs font-semibold tracking-wider uppercase mt-0.5">{subtitle}</p>
                    )}
                  </div>
                </div>
              </Link>
            </div>
            <nav className="flex items-center gap-2">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== '/' && (pathname?.startsWith(link.href) ?? false));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    title={link.name}
                    className={`flex items-center gap-2 rounded-full px-3 sm:px-5 py-2 text-sm font-semibold transition-all border ${
                      isActive
                        ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300 shadow-[0_0_15px_rgba(79,70,229,0.35)]'
                        : 'border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          {subtitle && (
            <div className="sm:hidden mt-2 pb-1">
              <p className="text-indigo-400/80 text-xs font-semibold tracking-wider uppercase text-center">{subtitle}</p>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && isAdminRoute && (
        <Sidebar
          isMobile={true}
          isAdminRoute={true}
          toggleMobileMenu={toggleMobileMenu}
        />
      )}
    </>
  );
};

export default Navbar;
