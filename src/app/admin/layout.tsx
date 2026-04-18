'use client';

import Sidebar from '@/components/Sidebar';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <>
            <div className="flex min-h-[calc(100vh-64px)] bg-[#030303] relative overflow-hidden">
                {/* Global Admin Background Gradients & Grid */}
                <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none"></div>
                
                {/* Global Glowing Orbs */}
                <div className="fixed top-[-10%] left-[10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full mix-blend-screen filter blur-[150px] opacity-60 pointer-events-none"></div>
                <div className="fixed bottom-[10%] right-[10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full mix-blend-screen filter blur-[150px] opacity-50 pointer-events-none"></div>

                {/* Desktop Sidebar - always visible on admin routes */}
                <div className="hidden md:block w-72 bg-transparent relative z-10 shrink-0">
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
                <div className="flex-1 w-full relative z-10 overflow-y-auto h-[calc(100vh-64px)] scroll-smooth">
                    {children}
                </div>
            </div>
        </>
    );
}