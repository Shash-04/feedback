'use client';


import Sidebar from '@/components/Sidebar';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <>
            <div className="flex min-h-[calc(100vh-72px)] bg-gray-950">
                {/* Desktop Sidebar - always visible on admin routes */}
                <div className="hidden md:block w-64 bg-gray-800 border-r border-gray-700">
                    <Sidebar
                        isMobile={false}
                        isAdminRoute={true}
                        toggleMobileMenu={() => {}}
                        userInfo={{
                            name: '',
                            avatar: null
                        }} 
                        isAuthenticated={false}
                    />
                </div>

                {/* Main content */}
                <div className="flex-1 p-4 md:p-6">
                    {children}
                </div>
            </div>
        </>
    );
}