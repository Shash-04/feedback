'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { User, LogOut, LogIn, Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';

const Navbar = ({
  title = "AI Feedback Analysis",
  subtitle = "",
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
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700/50 px-4 py-3 sm:px-6 lg:px-8 sticky top-0 z-[60] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {isAdminRoute && (
                <button
                  onClick={toggleMobileMenu}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-700/50 text-gray-300 hover:text-white transition-all"
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
                <div className="flex items-center space-x-3">
                  <img
                    src="/logo.webp"
                    alt="BPIT Logo"
                    className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-sm shadow-sm"
                  />

                  <div>
                    <h1 className="text-xl sm:text-3xl font-bold text-white tracking-tight">{title}</h1>
                    {subtitle && (
                      <p className="text-gray-400 text-sm font-medium">{subtitle}</p>
                    )}
                  </div>
                </div>
              </Link>

            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated && (
                <div className="hidden md:flex items-center space-x-3 bg-gray-800/50 px-3 py-2 rounded-lg">
                  <div className="w-8 h-8 bg-gray-700 rounded-full overflow-hidden flex justify-center items-center border border-gray-600">
                    {userInfo.avatar ? (
                      <img
                        src={userInfo.avatar}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-gray-300" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-200">
                    {userInfo.name}
                  </span>
                </div>
              )}
              {isAuthenticated ? (
                <button
                  onClick={() => signOut()}
                  className="p-2 flex items-center gap-1 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
                  title="Logout"
                >
                  <span className="hidden sm:inline text-sm font-medium">Logout</span>
                  <LogOut className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="p-2 flex items-center gap-2 bg-blue-600/90 hover:bg-blue-600 text-white rounded-lg transition-all px-4"
                  title="Login"
                >
                  <span className="text-sm font-medium">Login</span>
                  <LogIn className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          {subtitle && (
            <div className="sm:hidden mt-1">
              <p className="text-gray-400 text-sm font-medium">{subtitle}</p>
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