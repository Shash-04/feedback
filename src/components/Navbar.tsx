'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { User, LogOut, LogIn, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Sidebar from './Sidebar';

const Navbar = ({
  title = "Feedback Forms",
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
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-4 sm:px-6 lg:px-8 sticky top-0 z-[60]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {isAdminRoute && (
                <button
                  onClick={toggleMobileMenu}
                  className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  title="Menu"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}
              <Link href="/">
                <div className="flex items-center space-x-4">
                  <Image
                    src="/logo.webp"
                    alt="Company Logo"
                    width={100}
                    height={100}
                  />
                  <div className="hidden sm:block">
                    <h1 className="text-xl font-bold text-white">{title}</h1>
                    <p className="text-gray-400 text-sm">{subtitle}</p>
                  </div>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
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
            </div>
          </div>
          <div className="sm:hidden mt-2">
            <h1 className="text-lg font-bold text-white">{title}</h1>
            <p className="text-gray-400 text-sm">{subtitle}</p>
          </div>
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