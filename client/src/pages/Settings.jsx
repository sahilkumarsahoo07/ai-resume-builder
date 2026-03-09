import React, { useState } from 'react';
import { FiUser, FiMail, FiLock, FiBell, FiGlobe, FiMoon, FiSun, FiCamera, FiSave, FiCheckCircle } from 'react-icons/fi';
import useAuthStore from '../store/useAuthStore';
import useAiStore from '../store/useAiStore';

const Settings = () => {
    const { user, logout } = useAuthStore();
    const { selectedModel, setSelectedModel, AI_MODELS } = useAiStore();
    const [activeTab, setActiveTab] = useState('profile');
    const [saved, setSaved] = useState(false);

    const [profile, setProfile] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: '',
        location: '',
        phone: ''
    });

    const [notifications, setNotifications] = useState({
        emailUpdates: true,
        resumeTips: true,
        jobAlerts: false,
        weeklyReport: true
    });

    const [preferences, setPreferences] = useState({
        theme: 'light',
        language: 'en',
        defaultTemplate: 'modern'
    });

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const tabs = [
        { id: 'profile', name: 'Profile', icon: <FiUser /> },
        { id: 'account', name: 'Account', icon: <FiLock /> },
        { id: 'ai', name: 'AI Preferences', icon: <FiCheckCircle /> },
        { id: 'notifications', name: 'Notifications', icon: <FiBell /> },
        { id: 'preferences', name: 'Preferences', icon: <FiGlobe /> }
    ];

    return (
        <div className="p-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your account, AI preferences, and application settings.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Tabs */}
                <div className="lg:w-64 flex-shrink-0">
                    <nav className="space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-primary-50 text-primary-600 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <span className="text-lg">{tab.icon}</span>
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
                                
                                {/* Avatar */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold">
                                        {profile.name.charAt(0) || 'U'}
                                    </div>
                                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                                        <FiCamera /> Change Photo
                                    </button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile({...profile, email: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            value={profile.phone}
                                            onChange={(e) => setProfile({...profile, phone: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                        <input
                                            type="text"
                                            value={profile.location}
                                            onChange={(e) => setProfile({...profile, location: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                        <textarea
                                            rows={3}
                                            value={profile.bio}
                                            onChange={(e) => setProfile({...profile, bio: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Account Tab */}
                        {activeTab === 'account' && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Account Security</h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <h3 className="text-lg font-semibold text-red-600 mb-3">Danger Zone</h3>
                                    <button
                                        onClick={logout}
                                        className="text-red-600 hover:text-red-700 font-medium"
                                    >
                                        Logout from all devices
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* AI Preferences Tab */}
                        {activeTab === 'ai' && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-6">AI Preferences</h2>
                                
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Default AI Model</label>
                                    <div className="grid sm:grid-cols-2 gap-3">
                                        {AI_MODELS.map((model) => (
                                            <button
                                                key={model.name}
                                                onClick={() => setSelectedModel(model)}
                                                className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                                                    selectedModel.name === model.name
                                                        ? 'border-primary-500 bg-primary-50'
                                                        : 'border-gray-200 hover:bg-gray-50'
                                                }`}
                                            >
                                                <img src={model.icon} alt={model.name} className="w-8 h-8 rounded" />
                                                <div className="text-left">
                                                    <div className="font-medium text-gray-900">{model.name}</div>
                                                    <div className="text-xs text-gray-500">{model.description}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                                
                                <div className="space-y-4">
                                    {Object.entries(notifications).map(([key, value]) => (
                                        <label key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer">
                                            <div>
                                                <div className="font-medium text-gray-900 capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Receive notifications about {key.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={value}
                                                onChange={(e) => setNotifications({...notifications, [key]: e.target.checked})}
                                                className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Preferences Tab */}
                        {activeTab === 'preferences' && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Application Preferences</h2>
                                
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setPreferences({...preferences, theme: 'light'})}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${
                                                    preferences.theme === 'light'
                                                        ? 'border-primary-500 bg-primary-50 text-primary-600'
                                                        : 'border-gray-200 hover:bg-gray-50'
                                                }`}
                                            >
                                                <FiSun /> Light
                                            </button>
                                            <button
                                                onClick={() => setPreferences({...preferences, theme: 'dark'})}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${
                                                    preferences.theme === 'dark'
                                                        ? 'border-primary-500 bg-primary-50 text-primary-600'
                                                        : 'border-gray-200 hover:bg-gray-50'
                                                }`}
                                            >
                                                <FiMoon /> Dark
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                                        <select
                                            value={preferences.language}
                                            onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        >
                                            <option value="en">English</option>
                                            <option value="es">Spanish</option>
                                            <option value="fr">French</option>
                                            <option value="de">German</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Default Resume Template</label>
                                        <select
                                            value={preferences.defaultTemplate}
                                            onChange={(e) => setPreferences({...preferences, defaultTemplate: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        >
                                            <option value="modern">Modern</option>
                                            <option value="minimal">Minimal</option>
                                            <option value="professional">Professional</option>
                                            <option value="tech">Tech</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                            {saved && (
                                <span className="text-green-600 font-medium flex items-center gap-2">
                                    <FiCheckCircle /> Saved successfully!
                                </span>
                            )}
                            <div className="ml-auto">
                                <button
                                    onClick={handleSave}
                                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors"
                                >
                                    <FiSave /> Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
