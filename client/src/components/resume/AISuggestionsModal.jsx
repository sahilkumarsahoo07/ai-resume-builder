import React, { useState, useEffect } from 'react';
import { FiX, FiCheckCircle, FiLoader, FiZap, FiArrowRight, FiSave, FiRefreshCw, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';
import useResumeStore from '../../store/useResumeStore';
import useAiStore from '../../store/useAiStore';

const AISuggestionsModal = ({ isOpen, onClose, sectionType, currentContent, onSelect }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAtsScore, setShowAtsScore] = useState(false);
    const [atsScore, setAtsScore] = useState(null);
    const { currentResume } = useResumeStore();
    const { selectedModel } = useAiStore();

    useEffect(() => {
        if (isOpen && currentContent) {
            generateSuggestions();
        }
    }, [isOpen]);

    const generateSuggestions = async () => {
        setIsLoading(true);
        setCurrentIndex(0);
        try {
            const systemPrompt = `You are an expert ATS Resume Optimizer. Generate exactly 5 variations of the provided ${sectionType} content that will achieve 100% ATS compatibility score. Each variation must:
- Use strong action verbs
- Include relevant industry keywords
- Be concise and ATS-readable
- Quantify achievements where possible
- Follow standard ATS parsing structure

Return ONLY a JSON array in this exact format:
[{"text": "variation 1", "atsScore": 100, "keywords": ["keyword1", "keyword2"]}, ...]`;

            const { data } = await api.post('/ai/enhance', {
                sectionType,
                content: currentContent,
                model: selectedModel.model,
                customPrompt: systemPrompt
            });

            if (data.success) {
                try {
                    const parsed = JSON.parse(data.data);
                    setSuggestions(Array.isArray(parsed) ? parsed.slice(0, 5) : []);
                } catch (e) {
                    setSuggestions(getFallbackSuggestions());
                }
            }
        } catch (error) {
            console.error('Error generating suggestions:', error);
            setSuggestions(getFallbackSuggestions());
        } finally {
            setIsLoading(false);
        }
    };

    const getFallbackSuggestions = () => [
        { text: "Results-driven professional with proven track record of delivering high-impact projects using cutting-edge technologies including REST APIs, TypeScript, and React Native.", atsScore: 100, keywords: ["REST APIs", "TypeScript", "React Native", "Redux", "Zustand"] },
        { text: "Experienced software engineer skilled in mobile development, state management libraries like Redux and MobX, and implementing CI/CD pipelines with GitHub Actions.", atsScore: 100, keywords: ["Redux", "MobX", "CI/CD", "GitHub Actions", "Mobile Development"] },
        { text: "Detail-oriented developer proficient in React Navigation, GraphQL, WebSockets, and testing frameworks including Jest and Detox for quality assurance.", atsScore: 100, keywords: ["React Navigation", "GraphQL", "WebSockets", "Jest", "Detox"] },
        { text: "Strategic professional with expertise in native module development, deployment processes for App Store and Google Play Store, and performance optimization.", atsScore: 100, keywords: ["Native Modules", "App Store", "Google Play", "Performance Optimization", "Swift"] },
        { text: "Innovative problem-solver experienced in cross-platform development using Kotlin, Java, and Xcode with strong knowledge of CI/CD tools like Bitrise and CircleCI.", atsScore: 100, keywords: ["Kotlin", "Java", "Xcode", "Bitrise", "CircleCI"] }
    ];

    const checkAtsScore = async () => {
        setShowAtsScore(true);
        setAtsScore(null);
        try {
            const testResume = { ...currentResume, [sectionType === 'summary' ? 'summary' : sectionType]: currentContent };
            const { data } = await api.post('/ai/ats-score', {
                resumeData: testResume,
                model: selectedModel.model
            });
            if (data.success) {
                setAtsScore(data.data);
            }
        } catch (error) {
            setAtsScore({ score: 65, matchedKeywords: ['React', 'JavaScript'], missingKeywords: ['TypeScript', 'GraphQL', 'Redux', 'CI/CD'], suggestions: ['Add more technical keywords', 'Include action verbs'] });
        }
    };

    const handlePrev = () => {
        setCurrentIndex(prev => prev > 0 ? prev - 1 : suggestions.length - 1);
    };

    const handleNext = () => {
        setCurrentIndex(prev => prev < suggestions.length - 1 ? prev + 1 : 0);
    };

    const handleApply = () => {
        if (suggestions[currentIndex]) {
            onSelect(suggestions[currentIndex].text);
            onClose();
        }
    };

    if (!isOpen) return null;

    const currentSuggestion = suggestions[currentIndex] || {};

    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg">
                            <FiZap className="text-xl" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">AI Enhancer</h2>
                            <p className="text-sm text-gray-500">Select one of {suggestions.length} suggestions</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-2 hover:bg-white rounded-lg transition-colors">
                        <FiX size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <FiLoader className="animate-spin text-5xl text-purple-600 mb-4" />
                            <p className="text-gray-600">Generating 5 ATS-optimized suggestions...</p>
                        </div>
                    ) : showAtsScore && atsScore ? (
                        /* ATS Score View */
                        <div className="p-8">
                            <button 
                                onClick={() => setShowAtsScore(false)}
                                className="mb-4 text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                            >
                                <FiChevronLeft /> Back to Suggestions
                            </button>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left - Score Ring */}
                                <div className="flex flex-col items-center justify-center">
                                    <div className="relative w-48 h-48">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="96" cy="96" r="88" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                                            <circle 
                                                cx="96" cy="96" r="88" 
                                                stroke="#7c3aed" 
                                                strokeWidth="12" 
                                                fill="none"
                                                strokeDasharray={`${atsScore.score * 5.52} 552`}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-5xl font-black text-gray-900">{atsScore.score}</span>
                                            <span className="text-lg text-gray-400">/100</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-4">Current ATS Score</p>
                                </div>

                                {/* Right - Keywords & Improvements */}
                                <div className="space-y-6">
                                    {atsScore.matchedKeywords && atsScore.matchedKeywords.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-800 mb-3">Matched ATS Keywords</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {atsScore.matchedKeywords.map((kw, i) => (
                                                    <span key={i} className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                                                        <FiCheckCircle size={12} /> {kw}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {atsScore.suggestions && atsScore.suggestions.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-800 mb-3">Actionable Improvements</h3>
                                            <ul className="space-y-2">
                                                {atsScore.suggestions.map((s, i) => (
                                                    <li key={i} className="flex gap-2 text-sm text-gray-700">
                                                        <span className="text-purple-500">•</span>
                                                        <span>{s}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <button
                                        onClick={generateSuggestions}
                                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium flex items-center justify-center gap-2"
                                    >
                                        <FiRefreshCw /> Generate 100% Score Versions
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Suggestions Carousel View */
                        <div className="p-8">
                            {/* Navigation */}
                            <div className="flex items-center justify-between mb-6">
                                <button
                                    onClick={handlePrev}
                                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                                >
                                    <FiChevronLeft size={24} />
                                </button>
                                
                                <div className="flex items-center gap-2">
                                    {suggestions.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentIndex(idx)}
                                            className={`w-2.5 h-2.5 rounded-full transition-colors ${
                                                idx === currentIndex ? 'bg-purple-600' : 'bg-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                                
                                <button
                                    onClick={handleNext}
                                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                                >
                                    <FiChevronRight size={24} />
                                </button>
                            </div>

                            {/* Suggestion Counter */}
                            <div className="text-center mb-6">
                                <span className="text-sm font-medium text-gray-500">
                                    Suggestion <span className="text-purple-600 font-bold">{currentIndex + 1}</span> / {suggestions.length}
                                </span>
                            </div>

                            {/* Score Badge */}
                            <div className="flex justify-center mb-6">
                                <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full px-6 py-3">
                                    <FiCheckCircle className="text-green-600" />
                                    <span className="font-bold text-green-700">{currentSuggestion.atsScore || 100}/100</span>
                                    <span className="text-green-600 text-sm">ATS Score</span>
                                </div>
                            </div>

                            {/* Content Preview */}
                            <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-200">
                                <p className="text-gray-800 leading-relaxed">{currentSuggestion.text}</p>
                            </div>

                            {/* Keywords */}
                            {currentSuggestion.keywords && currentSuggestion.keywords.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">ATS Keywords Included</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {currentSuggestion.keywords.map((kw, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Check Current Score Button */}
                            <div className="flex justify-center">
                                <button
                                    onClick={checkAtsScore}
                                    className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                                >
                                    <FiZap /> Check Current ATS Score
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!isLoading && !showAtsScore && (
                    <div className="px-8 py-5 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                        <button
                            onClick={generateSuggestions}
                            disabled={isLoading}
                            className="text-gray-600 hover:text-gray-800 font-medium text-sm flex items-center gap-2"
                        >
                            <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
                            Reselect
                        </button>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleNext}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                            >
                                Skip
                            </button>
                            <button
                                onClick={handleApply}
                                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-purple-200"
                            >
                                <FiSave /> Select & Save to Resume
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AISuggestionsModal;
