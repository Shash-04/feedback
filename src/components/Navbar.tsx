'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { User, LogOut, LogIn, Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';

const Navbar = ({
  title = "Sentra",
  subtitle = "AI-Powered Feedback Intelligence Platform",
}: {
  title?: string;
  subtitle?: string;
}) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const userInfo = {
    name: session?.user?.name || 'Guest',
    avatar: session?.user?.image || null,
  };

  const isAdminRoute = pathname.startsWith('/admin');

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
            <div className="flex items-center space-x-4">
              {isAuthenticated && (
                <div className="hidden md:flex items-center space-x-3 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
                  <div className="w-7 h-7 bg-zinc-800 rounded-full overflow-hidden flex justify-center items-center">
                    {userInfo.avatar ? (
                      <img
                        src={userInfo.avatar}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-zinc-400" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-zinc-200 pr-2">
                    {userInfo.name}
                  </span>
                </div>
              )}
              {isAuthenticated ? (
                <button
                  onClick={() => signOut()}
                  className="p-2 flex items-center gap-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all px-3"
                  title="Logout"
                >
                  <span className="hidden sm:inline text-sm font-medium">Logout</span>
                  <LogOut className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="p-2 flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full transition-all px-5 shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_20px_rgba(79,70,229,0.6)]"
                  title="Login"
                >
                  <span className="text-sm font-semibold">Login</span>
                  <LogIn className="w-4 h-4" />
                </button>
              )}
            </div>
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
          userInfo={userInfo}
          isAuthenticated={isAuthenticated}
          toggleMobileMenu={toggleMobileMenu}
        />
      )}
    </>
  );
};

export default Navbar;
