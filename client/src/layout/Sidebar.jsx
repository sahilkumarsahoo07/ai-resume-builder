import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiFileText, FiLayout, FiSliders, FiSettings, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

const Sidebar = ({ isCollapsed, onToggle, isMobileOpen, setIsMobileOpen }) => {
    const menuItems = [
        { name: 'Dashboard', icon: <FiHome />, path: '/dashboard' },
        { name: 'Resumes', icon: <FiFileText />, path: '/resumes' },
        { name: 'Templates', icon: <FiLayout />, path: '/templates' },
        { name: 'AI Tools', icon: <FiSliders />, path: '/ai-tools' },
        { name: 'Settings', icon: <FiSettings />, path: '/settings' },
    ];

    const handleNavClick = () => {
        if (setIsMobileOpen) {
            setIsMobileOpen(false);
        }
    };

    const SidebarContent = ({ mobile = false }) => (
        <>
            <div className={`p-6 flex items-center ${isCollapsed && !mobile ? 'justify-center' : 'justify-between'}`}>
                {(!isCollapsed || mobile) && (
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
                        <span className="w-8 h-8 rounded bg-primary-600 text-white flex items-center justify-center font-black">AI</span>
                        {!mobile && 'ResumeBuilder'}
                    </h1>
                )}
                {isCollapsed && !mobile && (
                    <span className="w-10 h-10 rounded bg-primary-600 text-white flex items-center justify-center font-black text-lg">AI</span>
                )}
                {mobile && (
                    <button 
                        onClick={() => setIsMobileOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                    >
                        <FiX className="text-xl" />
                    </button>
                )}
            </div>

            {!mobile && (
                <button
                    onClick={onToggle}
                    className="mx-4 mb-2 p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center"
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? <FiChevronRight className="text-lg" /> : <FiChevronLeft className="text-lg" />}
                </button>
            )}

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                (isCollapsed && !mobile) ? 'justify-center' : ''
                            } ${isActive
                                ? 'bg-primary-50 text-primary-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                        title={(isCollapsed && !mobile) ? item.name : ''}
                    >
                        <span className="text-lg">{item.icon}</span>
                        {(!isCollapsed || mobile) && item.name}
                    </NavLink>
                ))}
            </nav>

            {(!isCollapsed || mobile) && (
                <div className="p-4 border-t border-gray-100">
                    <div className="bg-gradient-to-r from-primary-500 to-indigo-500 rounded-xl p-4 text-white text-sm shadow-sm">
                        <p className="font-semibold mb-1">Upgrade to Pro</p>
                        <p className="text-primary-100 text-xs mb-3 flex-1">Unlock all templates & advanced AI.</p>
                        <button className="bg-white text-primary-600 px-3 py-1.5 rounded-lg w-full font-medium text-xs hover:bg-gray-50">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            )}
        </>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside 
                className={`bg-white border-r border-gray-200 h-screen flex-col hidden md:flex no-print transition-all duration-300 ${
                    isCollapsed ? 'w-20' : 'w-60'
                }`}
            >
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobileOpen && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setIsMobileOpen(false)}
                    />
                    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50 md:hidden transition-transform duration-300">
                        <SidebarContent mobile />
                    </aside>
                </>
            )}
        </>
    );
};

export default Sidebar;
