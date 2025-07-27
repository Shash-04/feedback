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
            <div className="fixed inset-0 z-50  bg-black bg-opacity-50" onClick={toggleMobileMenu}>
                <div
                    className="fixed left-0 top-0 pt-24 h-full w-64 bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <nav className="p-4 mt-4">
                        <div className="space-y-2">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={toggleMobileMenu}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                            }`}
                                    >
                                        <item.icon />
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>
                </div>
            </div>
        );
    }

    // Desktop version
    return (
        <div className="h-full overflow-y-auto">
            {isAuthenticated && (
                <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-600 rounded-full overflow-hidden flex justify-center items-center">
                            {userInfo.avatar ? (
                                <img src={userInfo.avatar} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-5 h-5 text-gray-300" />
                            )}
                        </div>
                        <div className='mt-7'>
                            <p className="text-white font-medium">{userInfo.name}</p>
                            <p className="text-gray-400 text-sm">User</p>
                        </div>
                    </div>
                </div>
            )}
            <nav className="p-4">
                <div className="space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                            >
                                <item.icon />
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