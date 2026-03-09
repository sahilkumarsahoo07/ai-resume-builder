import React, { useState } from 'react';
import useResumeStore from '../../store/useResumeStore';
import AISuggestionsModal from '../resume/AISuggestionsModal';
import { FiCommand, FiCheck } from 'react-icons/fi';

const SummaryForm = () => {
    const { currentResume, updateResumeData, saveResume } = useResumeStore();
    const [summary, setSummary] = useState(currentResume?.summary || '');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleChange = (e) => {
        const val = e.target.value;
        setSummary(val);
        updateResumeData('summary', val);
    };

    const handleEnhance = () => {
        if (!summary.trim()) return;
        setIsModalOpen(true);
    };

    const handleSelectSuggestion = (text) => {
        setSummary(text);
        updateResumeData('summary', text);
        saveResume();
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Professional Summary</h2>
                    <p className="text-sm text-gray-500 mt-1">Write a short and engaging pitch about yourself.</p>
                </div>
                <button
                    onClick={handleEnhance}
                    disabled={!summary}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all disabled:opacity-50"
                >
                    <FiCommand />
                    Enhance with AI
                </button>
            </div>

            <div>
                <textarea
                    value={summary}
                    onChange={handleChange}
                    rows={8}
                    className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none resize-none leading-relaxed text-gray-700"
                    placeholder="I am an experienced software engineer specialized in..."
                ></textarea>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                    <FiCheck className="text-green-500" />
                    Tip: Keep it between 3 to 5 sentences. Use the AI button to get 5 ATS-optimized suggestions!
                </p>
            </div>

            <AISuggestionsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                sectionType="summary"
                currentContent={summary}
                onSelect={handleSelectSuggestion}
            />
        </div>
    );
};

export default SummaryForm;
