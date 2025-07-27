'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogIn, LogOut, User, X } from 'lucide-react';
import { signIn, signOut } from 'next-auth/react';

const navigation = [
    { name: 'Home', href: '/', icon: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
     { name: 'Form Builder', href: '/admin/form-builder', icon: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
    { name: 'Edit Form', href: '/admin/edit-forms', icon: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
    { name: 'Summary', href: '/admin/summary', icon: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { name: 'Dashboard', href: '/admin/dashboard', icon: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
];

interface SidebarProps {
    userInfo: {
        name: string;
        avatar: string | null;
    };
    isAuthenticated: boolean;
    isMobile?: boolean;
    isAdminRoute?: boolean;
    toggleMobileMenu: () => void;
}

const Sidebar = ({
    userInfo,
    isAuthenticated,
    isMobile = false,
    isAdminRoute = false,
    toggleMobileMenu
}: SidebarProps) => {
    const pathname = usePathname();

    if (!isAdminRoute) return null;

    // Mobile version
    if (isMobile) {
        return (
            <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={toggleMobileMenu}>
                <div
                    className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl transition-all duration-300 ease-in-out overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        onClick={toggleMobileMenu}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    
                    <div className="pt-40 px-6">
                        <nav className="space-y-1">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={toggleMobileMenu}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive
                                            ? 'bg-blue-600/90 text-white shadow-lg'
                                            : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                                            }`}
                                    >
                                        <span className={`${isActive ? 'text-white' : 'text-blue-400'}`}>
                                            <item.icon />
                                        </span>
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </div>
        );
    }

    // Desktop version
    return (
        <div className="h-full overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700/50"> 
            <nav className="p-4">
                <div className="space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive
                                    ? 'bg-blue-600/90 text-white shadow-lg'
                                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                                    }`}
                            >
                                <span className={`${isActive ? 'text-white' : 'text-blue-400'}`}>
                                    <item.icon />
                                </span>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;