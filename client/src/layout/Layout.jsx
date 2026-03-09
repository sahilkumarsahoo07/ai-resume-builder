import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import useAuthStore from '../store/useAuthStore';

const Layout = () => {
    const { isAuthenticated } = useAuthStore();
    const location = useLocation();
    
    // Auto-collapse sidebar when on editor page
    const isEditorPage = location.pathname.startsWith('/editor/');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(isEditorPage);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    
    // Update collapse state when route changes
    useEffect(() => {
        if (isEditorPage) {
            setIsSidebarCollapsed(true);
        }
    }, [isEditorPage]);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900 font-sans">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                onToggle={toggleSidebar}
                isMobileOpen={isMobileSidebarOpen}
                setIsMobileOpen={setIsMobileSidebarOpen}
            />
            <div className="flex flex-col flex-1 overflow-hidden">
                <TopNavbar 
                    onToggleSidebar={toggleMobileSidebar} 
                    isSidebarCollapsed={isSidebarCollapsed}
                />
                <main className="flex-1 overflow-y-auto no-scrollbar relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
