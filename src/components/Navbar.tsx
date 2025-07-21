'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { User, LogOut, LogIn, Settings, Menu, X } from 'lucide-react';
import Image from 'next/image';

const Navbar = ({
  title = "Feedback Forms",
  subtitle = "",
  showMobileMenu = false,
}) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userInfo = {
    name: session?.user?.name || 'Guest',
    avatar: session?.user?.image || null,
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-4 py-4 sm:px-6 lg:px-8 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link href="/">
            <div className="flex items-center space-x-4">
                <Image
                  src="/logo.webp"          // Path to image (public folder or remote)
                  alt="Company Logo"       // Required alt text
                  width={100}              // Desired width
                  height={100}             // Desired height
                />
              
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white">{title}</h1>
                <p className="text-gray-400 text-sm">{subtitle}</p>
              </div>
            </div>
          </Link>

          {/* User Info & Auth Buttons */}
          <div className="flex items-center space-x-4">
            {/* Desktop user info */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-600 rounded-full overflow-hidden flex justify-center items-center">
                  {userInfo.avatar ? (
                    <img src={userInfo.avatar} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-gray-300" />
                  )}
                </div>
                <span className="text-sm text-gray-300">{userInfo.name}</span>
              </div>
            )}

            {/* Auth Button */}
            {isAuthenticated ? (
              <button
                onClick={() => signOut()}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => signIn()}
                className="p-2 flex gap-3 items-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                title="Login"
              >
                <p>LOGIN</p>
                <LogIn className="w-5 h-5" />
              </button>
            )}

            {/* Mobile toggle */}
            {showMobileMenu && (
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Title */}
        <div className="sm:hidden mt-2">
          <h1 className="text-lg font-bold text-white">{title}</h1>
          <p className="text-gray-400 text-sm">{subtitle}</p>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-700">
            {isAuthenticated && (
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gray-600 rounded-full overflow-hidden flex justify-center items-center">
                  {userInfo.avatar ? (
                    <img src={userInfo.avatar} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-gray-300" />
                  )}
                </div>
                <span className="text-sm text-gray-300">{userInfo.name}</span>
              </div>
            )}

            <div className="space-y-2">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left p-2 text-red-400 hover:text-white hover:bg-red-700 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="w-full text-left p-2 text-blue-400 hover:text-white hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
