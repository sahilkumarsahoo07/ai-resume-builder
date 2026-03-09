import React, { useState } from 'react';
import { FiSearch, FiBell, FiChevronDown, FiLogOut, FiMenu } from 'react-icons/fi';
import useAiStore, { AI_MODELS } from '../store/useAiStore';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

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
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 no-print">
            {/* Left side: Toggle + Search */}
            <div className="flex items-center gap-4 flex-1">
                {/* Sidebar Toggle Button */}
                <button
                    onClick={onToggleSidebar}
                    className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Toggle sidebar"
                >
                    <FiMenu className="text-xl" />
                </button>

                {/* Search */}
                <div className="flex-1 max-w-md hidden md:flex">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-gray-50"
                            placeholder="Search resumes..."
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 ml-auto">
                {/* AI Model Selector */}
                <div className="relative">
                    <button
                        className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-1.5 text-sm font-medium hover:bg-gray-50 transition-colors"
                        onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                    >
                        <img src={selectedModel.icon} alt={selectedModel.name} className="w-5 h-5 rounded-sm bg-white p-0.5" />
                        <span className="hidden sm:inline">{selectedModel.name}</span>
                        <FiChevronDown className="text-gray-500" />
                    </button>

                    {modelDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Select AI Model
                            </div>
                            {AI_MODELS.map((model) => (
                                <button
                                    key={model.name}
                                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-gray-50 transition-colors ${selectedModel.name === model.name ? 'bg-primary-50 text-primary-700' : 'text-gray-700'}`}
                                    onClick={() => {
                                        setSelectedModel(model);
                                        setModelDropdownOpen(false);
                                    }}
                                >
                                    <img src={model.icon} alt={model.name} className="w-5 h-5 rounded-sm bg-white p-0.5" />
                                    <span>{model.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Notifications */}
                <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                    <FiBell className="text-xl" />
                    <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>

                {/* User Profile */}
                <div className="relative">
                    <button
                        className="flex items-center gap-2 focus:outline-none"
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                    >
                        {user?.avatar ? (
                            <img src={user.avatar} alt="User avatar" className="w-8 h-8 rounded-full border border-gray-200" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold font-sm">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                        )}
                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-medium leading-none text-gray-700">{user?.name || 'User'}</p>
                        </div>
                        <FiChevronDown className="text-gray-500" />
                    </button>

                    {userMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <FiLogOut /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default TopNavbar;
