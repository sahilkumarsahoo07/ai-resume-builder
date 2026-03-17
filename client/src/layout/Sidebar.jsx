import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiHome, FiFileText, FiLayout, FiSliders, 
    FiSettings, FiChevronLeft, FiChevronRight, FiX, FiZap 
} from 'react-icons/fi';

const Sidebar = ({ isCollapsed, onToggle, isMobileOpen, setIsMobileOpen }) => {
    const location = useLocation();
    
    const menuItems = [
        { name: 'Dashboard', icon: <FiHome />, path: '/dashboard' },
        { name: 'Resumes', icon: <FiFileText />, path: '/resumes' },
        { name: 'Templates', icon: <FiLayout />, path: '/templates' },
        { name: 'AI Tools', icon: <FiSliders />, path: '/ai-tools' },
        { name: 'Settings', icon: <FiSettings />, path: '/settings' },
    ];

    const handleNavClick = () => {
        if (setIsMobileOpen) setIsMobileOpen(false);
    };

    const SidebarContent = ({ mobile = false }) => (
        <div className="flex flex-col h-full py-6">
            {/* Logo Section */}
            <div className={`px-6 mb-8 flex items-center ${isCollapsed && !mobile ? 'justify-center' : 'justify-between'}`}>
                <div className="flex items-center gap-3">
                    <div className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center font-black text-white text-lg shadow-xl ring-1 ring-white/10">
                            AI
                        </div>
                    </div>
                    {(!isCollapsed || mobile) && (
                        <motion.span 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-xl font-bold tracking-tight text-gray-900"
                        >
                            Resume<span className="text-primary-600">Builder</span>
                        </motion.span>
                    )}
                </div>
                {mobile && (
                    <button onClick={() => setIsMobileOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                        <FiX size={20} />
                    </button>
                )}
            </div>

            {/* Modern Collapse Toggle (Desktop only) */}
            {!mobile && (
                <div className={`absolute -right-3 top-20 z-50 transition-opacity duration-300 ${isCollapsed ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <button
                        onClick={onToggle}
                        className="w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-primary-600 hover:border-primary-200 shadow-premium transition-all hover:scale-110 active:scale-95"
                        title={isCollapsed ? 'Expand' : 'Collapse'}
                    >
                        <motion.div
                            animate={{ rotate: isCollapsed ? 0 : 180 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                            <FiChevronRight size={14} />
                        </motion.div>
                    </button>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto scrollbar-hide">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={handleNavClick}
                            className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                                (isCollapsed && !mobile) ? 'justify-center' : ''
                            } ${isActive
                                ? 'bg-white shadow-premium text-primary-600 ring-1 ring-gray-200'
                                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                            {isActive && (
                                <motion.div 
                                    layoutId="active-pill"
                                    className="absolute left-0 w-1 h-6 bg-primary-600 rounded-r-full"
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                {item.icon}
                            </span>
                            {(!isCollapsed || mobile) && (
                                <span className={`font-medium text-sm tracking-tight ${isActive ? 'text-gray-900' : ''}`}>
                                    {item.name}
                                </span>
                            )}
                            {isActive && isCollapsed && !mobile && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                    {item.name}
                                </div>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Upgrade Card */}
            {(!isCollapsed || mobile) && (
                <div className="px-3 pt-6">
                    <div className="relative overflow-hidden rounded-2xl bg-gray-900 p-5 text-white shadow-2xl">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-500/20 blur-2xl rounded-full" />
                        <div className="relative z-10">
                            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(14,165,233,0.4)]">
                                <FiZap className="fill-current text-white" />
                            </div>
                            <h4 className="font-bold text-base mb-1">Upgrade to <span className="text-primary-400">Pro</span></h4>
                            <p className="text-gray-400 text-xs mb-4 leading-relaxed">Unlock advanced AI tools and premium templates.</p>
                            <button className="w-full py-2.5 bg-white text-gray-900 rounded-xl font-bold text-xs hover:bg-gray-100 transition-colors shadow-lg">
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside 
                initial={false}
                animate={{ width: isCollapsed ? 88 : 280 }}
                className="fixed left-0 top-0 h-screen bg-gray-50/50 backdrop-blur-xl border-r border-gray-200 hidden md:flex flex-col z-30 no-print group"
            >
                <SidebarContent />
            </motion.aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setIsMobileOpen(false)}
                        />
                        <motion.aside 
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-200 flex flex-col z-50 md:hidden shadow-2xl"
                        >
                            <SidebarContent mobile />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Spacer for desktop main content */}
            <div className={`hidden md:block transition-all duration-300 no-print ${isCollapsed ? 'w-[88px]' : 'w-[280px]'}`} />
        </>
    );
};

export default Sidebar;
