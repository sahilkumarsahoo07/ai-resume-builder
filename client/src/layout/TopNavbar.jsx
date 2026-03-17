import React, { useState } from 'react';
import { FiSearch, FiBell, FiChevronDown, FiLogOut, FiMenu } from 'react-icons/fi';
import useAiStore, { AI_MODELS } from '../store/useAiStore';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const TopNavbar = ({ onToggleSidebar, isSidebarCollapsed }) => {
    const { selectedModel, setSelectedModel } = useAiStore();
    const { user, logout } = useAuthStore();
    const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="sticky top-0 h-20 bg-white/60 backdrop-blur-xl border-b border-gray-200/50 flex items-center justify-between px-8 z-20 no-print transition-all duration-300">
            {/* Left side: Toggle + Search */}
            <div className="flex items-center gap-6 flex-1">
                <button
                    onClick={onToggleSidebar}
                    className="md:hidden p-2.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                >
                    <FiMenu className="text-2xl" />
                </button>

                {/* Modern Search */}
                <div className="flex-1 max-w-lg hidden md:block group">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 group-focus-within:text-primary-500 text-gray-400">
                            <FiSearch size={18} />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-2xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-gray-50/50 group-hover:bg-white transition-all duration-300 shadow-sm"
                            placeholder="Search your resumes..."
                        />
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <span className="text-[10px] font-bold text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded-md bg-white">⌘K</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-5 ml-auto">
                {/* Refined AI Model Selector */}
                <div className="relative">
                    <button
                        className="flex items-center gap-2.5 border border-gray-200 rounded-2xl px-4 py-2 text-sm font-semibold hover:bg-white hover:shadow-premium transition-all active:scale-95 bg-white/50"
                        onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                    >
                        <div className="relative">
                            <img src={selectedModel.icon} alt={selectedModel.name} className="w-5 h-5 rounded-md object-contain" />
                            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 border-2 border-white rounded-full" />
                        </div>
                        <span className="hidden sm:inline text-gray-700">{selectedModel.name}</span>
                        <FiChevronDown className={`text-gray-400 transition-transform duration-300 ${modelDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {modelDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setModelDropdownOpen(false)} />
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 p-2 z-50 overflow-hidden"
                                >
                                    <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        Choose AI Engine
                                    </div>
                                    <div className="space-y-1">
                                        {AI_MODELS.map((model) => (
                                            <button
                                                key={model.name}
                                                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center gap-3 transition-all ${selectedModel.name === model.name ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-100' : 'text-gray-600 hover:bg-gray-50'}`}
                                                onClick={() => {
                                                    setSelectedModel(model);
                                                    setModelDropdownOpen(false);
                                                }}
                                            >
                                                <div className={`p-1 rounded-lg ${selectedModel.name === model.name ? 'bg-white' : 'bg-gray-50 group-hover:bg-white'}`}>
                                                    <img src={model.icon} alt={model.name} className="w-5 h-5 object-contain" />
                                                </div>
                                                <span className="font-medium">{model.name}</span>
                                                {selectedModel.name === model.name && (
                                                    <div className="ml-auto w-1.5 h-1.5 bg-primary-500 rounded-full" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {/* Notifications */}
                <button className="relative p-2.5 text-gray-400 hover:text-gray-900 hover:bg-white hover:shadow-premium rounded-2xl transition-all">
                    <FiBell size={20} />
                    <span className="absolute top-2.5 right-2.5 block h-2 w-2 rounded-full bg-primary-500 ring-2 ring-white"></span>
                </button>

                <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block" />

                {/* User Profile */}
                <div className="relative">
                    <button
                        className="flex items-center gap-3 p-1 rounded-2xl hover:bg-white hover:shadow-premium transition-all active:scale-95 group"
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                    >
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-xl border-2 border-transparent group-hover:border-primary-100 transition-all object-cover" />
                        ) : (
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 text-white flex items-center justify-center font-bold shadow-lg">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                        )}
                        <div className="hidden lg:block text-left mr-1">
                            <p className="text-xs font-bold leading-none text-gray-900 mb-1">{user?.name || 'Guest User'}</p>
                            <p className="text-[10px] font-medium text-gray-400 leading-none">Free Account</p>
                        </div>
                        <FiChevronDown className={`text-gray-400 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {userMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 p-2 z-50 overflow-hidden"
                                >
                                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                        <p className="text-xs font-bold text-gray-900 truncate">{user?.email}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 font-semibold transition-all"
                                    >
                                        <FiLogOut size={16} /> Logout
                                    </button>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default TopNavbar;
