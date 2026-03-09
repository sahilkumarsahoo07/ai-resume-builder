import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useResumeStore from '../store/useResumeStore';
import useAiStore from '../store/useAiStore';
import ResumeForm from '../components/resume/ResumeForm';
import ResumePreview from '../components/resume/ResumePreview';
import JobMatchModal from '../components/resume/JobMatchModal';
import ATSScoreModal from '../components/resume/ATSScoreModal';
import AISuggestionsModal from '../components/resume/AISuggestionsModal';
import useAutosave from '../hooks/useAutosave';
import { FiArrowLeft, FiDownload, FiCheck, FiTarget, FiBriefcase } from 'react-icons/fi';
import html2pdf from 'html2pdf.js/dist/html2pdf.bundle.min.js';
import api from '../services/api';

const ResumeEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchResumeById, currentResume, updateResumeData, isLoading, saveResume } = useResumeStore();
    const { selectedModel } = useAiStore();

    const [atsScore, setAtsScore] = useState(null);
    const [isScoring, setIsScoring] = useState(false);
    const [isJobMatchOpen, setIsJobMatchOpen] = useState(false);
    const [showDownloadOptions, setShowDownloadOptions] = useState(false);
    const [isATSScoreOpen, setIsATSScoreOpen] = useState(false);
    const [isAISuggestionsOpen, setIsAISuggestionsOpen] = useState(false);
    const [aiSuggestionContext, setAiSuggestionContext] = useState({ sectionType: '', content: '' });
    const [leftPanelWidth, setLeftPanelWidth] = useState(50);
    const [isDragging, setIsDragging] = useState(false);

    // Persisted state for modals - survives closing/reopening
    const [atsResult, setAtsResult] = useState(null);
    const [jobMatchResult, setJobMatchResult] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isCalculatingATS, setIsCalculatingATS] = useState(false);
    const [isAnalyzingJob, setIsAnalyzingJob] = useState(false);

    const { isSaving, manualSave } = useAutosave(saveResume, 2000, currentResume);

    useEffect(() => {
        if (id) fetchResumeById(id);
    }, [id, fetchResumeById]);

    // Handle resize drag
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            const container = document.getElementById('editor-container');
            if (!container) return;
            const rect = container.getBoundingClientRect();
            const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
            if (newWidth >= 30 && newWidth <= 70) {
                setLeftPanelWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    if (isLoading && !currentResume) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!currentResume) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-xl font-bold mb-2">Resume not found</h2>
                <button onClick={() => navigate('/dashboard')} className="text-primary-600 hover:underline">Return to Dashboard</button>
            </div>
        );
    }

    const handleDownloadPDF = async () => {
        const element = document.getElementById('resume-preview-container');
        if (!element) return;

        setShowDownloadOptions(false);

        // Get computed styles for the container to pass to backend if needed
        // But Puppeteer handles it better if we just send the cleaned HTML
        const clone = element.cloneNode(true);

        // Remove no-print elements
        const noPrint = clone.querySelectorAll('.no-print');
        noPrint.forEach(el => el.remove());

        try {
            // BACKEND PDF GENERATION (ATS Friendly / Text Selectable)
            // Using arraybuffer is more robust for cross-environment binary transfer
            const response = await api.post('/pdf/generate', {
                html: clone.innerHTML,
                css: Array.from(document.styleSheets)
                    .map(sheet => {
                        try {
                            return Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n');
                        } catch (e) {
                            console.warn('Could not read stylesheet rules (CORS?)', e);
                            return '';
                        }
                    }).join('\n')
            }, {
                responseType: 'arraybuffer'
            });

            // CRITICAL: Manual check for PDF integrity
            const uint8 = new Uint8Array(response.data);
            const header = String.fromCharCode(...uint8.slice(0, 4));

            if (header !== '%PDF') {
                // If it doesn't start with %PDF, it's likely a JSON error blob
                const text = new TextDecoder().decode(uint8);
                try {
                    const error = JSON.parse(text);
                    throw new Error(error.message || 'Server returned invalid PDF data');
                } catch (e) {
                    throw new Error('Server returned invalid data format');
                }
            }

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${currentResume.title || 'resume'}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Backend PDF Generation Failed:', error);
            alert('Encountered a technical issue generating the ATS-friendly PDF. Please use your browser\'s Print function (Ctrl+P) and select "Save as PDF" for the best result.');
        } finally {
            setShowDownloadOptions(false);
        }
    };

    const handleDownloadWord = () => {
        const element = document.getElementById('resume-preview-container');
        if (!element) return;

        const content = element.innerHTML;

        // Simple HTML to Word conversion using Blob
        const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML to Word</title><style>body { font-family: Arial, sans-serif; }</style></head><body>";
        const footer = "</body></html>";
        const sourceHTML = header + content + footer;

        const blob = new Blob([sourceHTML], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);

        const fileLink = document.createElement("a");
        document.body.appendChild(fileLink);
        fileLink.href = url;
        fileLink.download = `${currentResume.title || 'resume'}.doc`;
        fileLink.click();

        setTimeout(() => {
            document.body.removeChild(fileLink);
            URL.revokeObjectURL(url);
        }, 100);

        setShowDownloadOptions(false);
    };

    const calculateAtsScore = async () => {
        setIsScoring(true);
        try {
            const { data } = await api.post('/ai/ats-score', { resumeData: currentResume, model: selectedModel.model });
            if (data.success) setAtsScore(data.data);
        } catch (error) {
            console.error('Failed ATS Scoring', error);
            alert('Failed to calculate ATS score');
        } finally {
            setIsScoring(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-100 overflow-hidden relative">
            <header className="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between shrink-0 no-print">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                        <FiArrowLeft className="text-xl" />
                    </button>
                    <input
                        type="text"
                        value={currentResume.title || ''}
                        onChange={(e) => updateResumeData('title', e.target.value)}
                        className="text-lg font-bold text-gray-800 bg-transparent border-none focus:ring-0 p-0 w-64 border-b border-transparent hover:border-gray-300 focus:border-primary-500 transition-colors"
                    />
                </div>

                <div className="flex items-center gap-4 text-sm">
                    {isSaving ? (
                        <span className="flex items-center gap-1.5 text-orange-500 hidden md:flex"><span className="animate-pulse w-2 h-2 rounded-full bg-orange-500"></span> Saving...</span>
                    ) : (
                        <span className="flex items-center gap-1.5 text-green-600 hidden md:flex"><FiCheck /> Saved</span>
                    )}

                    <select
                        value={currentResume.template || 'Modern'}
                        onChange={(e) => updateResumeData('template', e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-gray-700 py-1.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                    >
                        <option value="Modern">Modern Template</option>
                        <option value="Minimal">Minimal Template</option>
                        <option value="Professional">Professional Template</option>
                        <option value="Executive">Executive Template</option>
                        <option value="Classic">Classic Template</option>
                        <option value="Tech">Tech Template</option>
                        <option value="Compact">Compact Template</option>
                        <option value="Startup">Startup Template</option>
                        <option value="Clean">Clean Template</option>
                        <option value="Elegant">Elegant Template</option>
                        <option value="Creative">Creative Template</option>
                        <option value="Technical">Technical Template</option>
                        <option value="Academic">Academic Template</option>
                    </select>

                    <button onClick={() => setIsATSScoreOpen(true)} disabled={isScoring} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-medium transition-colors border border-indigo-100">
                        {isScoring ? <span className="animate-spin h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full"></span> : <FiTarget />}
                        <span className="hidden lg:inline">{isScoring ? 'Scoring...' : 'ATS Score'}</span>
                    </button>

                    <button onClick={() => setIsJobMatchOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg font-medium transition-colors border border-teal-100">
                        <FiBriefcase /> <span className="hidden lg:inline">Job Match</span>
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                            className="px-4 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
                        >
                            <FiDownload /> <span className="hidden lg:inline">Download</span>
                        </button>

                        {showDownloadOptions && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-50 py-2 animate-fadeIn">
                                <button
                                    onClick={handleDownloadPDF}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 flex items-center gap-2"
                                >
                                    <FiDownload className="text-gray-400" /> Export as PDF (.pdf)
                                </button>
                                <button
                                    onClick={handleDownloadWord}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 flex items-center gap-2"
                                >
                                    <FiBriefcase className="text-gray-400" /> Export as Word (.doc)
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div id="editor-container" className="flex-1 flex overflow-hidden">
                <div
                    className="flex flex-col border-r border-gray-200 bg-white z-10 overflow-hidden no-print"
                    style={{ width: `${leftPanelWidth}%` }}
                >
                    <ResumeForm />
                </div>

                {/* Resizable Divider */}
                <div
                    className={`w-1 bg-gray-300 hover:bg-primary-500 cursor-col-resize flex-shrink-0 transition-colors ${isDragging ? 'bg-primary-500' : ''}`}
                    onMouseDown={() => setIsDragging(true)}
                    title="Drag to resize panels"
                />

                <div
                    className="bg-gray-200 overflow-y-auto flex justify-center p-8 custom-scrollbar"
                    style={{ width: `${100 - leftPanelWidth}%` }}
                >
                    <div className="flex flex-col items-center gap-6 w-full max-w-[210mm]">
                        {atsScore && (
                            <div className="w-full bg-white rounded-xl shadow-lg border border-indigo-100 p-6 animate-fadeIn relative">
                                <button onClick={() => setAtsScore(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">&times;</button>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2"><FiTarget className="text-indigo-600" /> ATS Analysis Score</h3>
                                    <div className={`text-2xl font-black ${atsScore.score >= 80 ? 'text-green-600' : atsScore.score >= 60 ? 'text-orange-500' : 'text-red-500'}`}>
                                        {atsScore.score} / 100
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-700 mb-2">Suggestions to Improve:</h4>
                                        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                                            {atsScore.suggestions?.map((s, i) => <li key={i}>{s}</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-700 mb-2">Missing Keywords:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {atsScore.missingKeywords?.map((k, i) => (
                                                <span key={i} className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-xs border border-red-100">{k}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div id="resume-preview-container" className="shadow-2xl bg-white w-[210mm] min-h-[297mm] shrink-0 relative transition-all duration-300">
                            <ResumePreview />
                        </div>
                    </div>
                </div>
            </div>

            {isJobMatchOpen && <JobMatchModal
                onClose={() => setIsJobMatchOpen(false)}
                result={jobMatchResult}
                setResult={setJobMatchResult}
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
                isAnalyzing={isAnalyzingJob}
                setIsAnalyzing={setIsAnalyzingJob}
            />}
            {isATSScoreOpen && <ATSScoreModal
                onClose={() => setIsATSScoreOpen(false)}
                result={atsResult}
                setResult={setAtsResult}
                isCalculating={isCalculatingATS}
                setIsCalculating={setIsCalculatingATS}
            />}
            {isAISuggestionsOpen && (
                <AISuggestionsModal
                    isOpen={isAISuggestionsOpen}
                    onClose={() => setIsAISuggestionsOpen(false)}
                    sectionType={aiSuggestionContext.sectionType}
                    currentContent={aiSuggestionContext.content}
                    onSelect={(text) => {
                        updateResumeData(aiSuggestionContext.sectionType, text);
                        saveResume();
                    }}
                />
            )}
        </div>
    );
};

export default ResumeEditor;
