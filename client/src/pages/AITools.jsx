import React, { useState } from 'react';
import { FiZap, FiTarget, FiMessageSquare, FiCheckCircle, FiLoader, FiArrowRight, FiBriefcase } from 'react-icons/fi';
import useAiStore from '../store/useAiStore';

const AITools = () => {
    const { selectedModel } = useAiStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState('ats');

    const tools = [
        {
            id: 'ats',
            name: 'ATS Score Checker',
            description: 'Analyze your resume against ATS systems and get improvement suggestions.',
            icon: <FiTarget className="text-2xl" />,
            color: 'bg-indigo-500',
            features: ['Keyword analysis', 'Format checking', 'Readability score', 'Improvement tips']
        },
        {
            id: 'enhance',
            name: 'AI Content Enhancer',
            description: 'Rewrite and improve your resume content with AI suggestions.',
            icon: <FiZap className="text-2xl" />,
            color: 'bg-purple-500',
            features: ['Bullet point rewriting', 'Action verb suggestions', 'Impact quantification', 'Professional tone']
        },
        {
            id: 'match',
            name: 'Job Match Analyzer',
            description: 'Compare your resume against job descriptions to find gaps.',
            icon: <FiBriefcase className="text-2xl" />,
            color: 'bg-emerald-500',
            features: ['Keyword matching', 'Gap analysis', 'Skill comparison', 'Match percentage']
        },
        {
            id: 'chat',
            name: 'AI Resume Assistant',
            description: 'Chat with AI to get personalized resume advice and answers.',
            icon: <FiMessageSquare className="text-2xl" />,
            color: 'bg-blue-500',
            features: ['24/7 availability', 'Instant answers', 'Resume tips', 'Career advice']
        }
    ];

    const currentTool = tools.find(t => t.id === activeTab);

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">AI Tools</h1>
                <p className="text-gray-500 mt-1">Leverage AI to optimize your resume and boost your job search.</p>
            </div>

            {/* Active Model Badge */}
            <div className="mb-6 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 w-fit">
                <span className="text-sm text-gray-500">Active AI Model:</span>
                <div className="flex items-center gap-2">
                    <img src={selectedModel.icon} alt={selectedModel.name} className="w-5 h-5 rounded" />
                    <span className="font-medium text-gray-900">{selectedModel.name}</span>
                </div>
            </div>

            {/* Tools Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {tools.map((tool) => (
                    <button
                        key={tool.id}
                        onClick={() => setActiveTab(tool.id)}
                        className={`text-left p-5 rounded-xl border transition-all ${
                            activeTab === tool.id
                                ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                        }`}
                    >
                        <div className={`w-12 h-12 ${tool.color} bg-opacity-10 rounded-xl flex items-center justify-center mb-3 ${tool.color.replace('bg-', 'text-')}`}>
                            {tool.icon}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{tool.name}</h3>
                        <p className="text-xs text-gray-500 line-clamp-2">{tool.description}</p>
                    </button>
                ))}
            </div>

            {/* Active Tool Detail */}
            {currentTool && (
                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                    <div className="flex items-start gap-4 mb-6">
                        <div className={`w-16 h-16 ${currentTool.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                            {currentTool.icon}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{currentTool.name}</h2>
                            <p className="text-gray-500 mt-1">{currentTool.description}</p>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {currentTool.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-4 py-3 rounded-xl">
                                <FiCheckCircle className="text-green-500" />
                                {feature}
                            </div>
                        ))}
                    </div>

                    {/* Action Area */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                        {activeTab === 'ats' && (
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Check Your Resume ATS Score</h4>
                                <p className="text-sm text-gray-500 mb-4">Open any resume in the editor and click the "ATS Score" button to analyze it.</p>
                                <button 
                                    onClick={() => window.location.href = '/resumes'}
                                    className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors"
                                >
                                    Go to Resumes <FiArrowRight />
                                </button>
                            </div>
                        )}

                        {activeTab === 'enhance' && (
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Enhance Resume Content</h4>
                                <p className="text-sm text-gray-500 mb-4">Select any text in the resume editor and click "AI Enhance" to improve it.</p>
                                <button 
                                    onClick={() => window.location.href = '/resumes'}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors"
                                >
                                    Open Editor <FiArrowRight />
                                </button>
                            </div>
                        )}

                        {activeTab === 'match' && (
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Match with Job Description</h4>
                                <p className="text-sm text-gray-500 mb-4">In the resume editor, click "Job Match" to compare your resume with a job posting.</p>
                                <button 
                                    onClick={() => window.location.href = '/resumes'}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors"
                                >
                                    Try Job Match <FiArrowRight />
                                </button>
                            </div>
                        )}

                        {activeTab === 'chat' && (
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">AI Resume Assistant</h4>
                                <p className="text-sm text-gray-500 mb-4">Chat with our AI to get personalized advice for your resume and job search.</p>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors">
                                    {isProcessing ? <FiLoader className="animate-spin" /> : <FiMessageSquare />}
                                    Start Chat
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Tips Section */}
            <div className="mt-8 grid md:grid-cols-3 gap-6">
                <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-100">
                    <div className="flex items-center gap-2 text-yellow-700 font-semibold mb-2">
                        <FiZap /> Pro Tip
                    </div>
                    <p className="text-sm text-yellow-800">Use action verbs like "Achieved," "Improved," and "Led" to make your accomplishments stand out.</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                    <div className="flex items-center gap-2 text-blue-700 font-semibold mb-2">
                        <FiZap /> Pro Tip
                    </div>
                    <p className="text-sm text-blue-800">Quantify your achievements with numbers and percentages wherever possible.</p>
                </div>
                <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                    <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
                        <FiZap /> Pro Tip
                    </div>
                    <p className="text-sm text-green-800">Tailor your resume keywords to match the job description for better ATS matching.</p>
                </div>
            </div>
        </div>
    );
};

export default AITools;
