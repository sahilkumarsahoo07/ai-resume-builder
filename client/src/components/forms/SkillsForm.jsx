import React, { useState } from 'react';
import useResumeStore from '../../store/useResumeStore';
import { FiCommand } from 'react-icons/fi';
import api from '../../services/api';
import useAiStore from '../../store/useAiStore';

const SkillsForm = () => {
    const { currentResume, updateResumeData } = useResumeStore();
    const { selectedModel } = useAiStore();
    const [skillInput, setSkillInput] = useState('');
    const [isExtracting, setIsExtracting] = useState(false);

    const skills = currentResume?.skills || [];

    const handleAddSkill = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            e.preventDefault();
            if (skillInput.trim() && !skills.includes(skillInput.trim())) {
                updateResumeData('skills', [...skills, skillInput.trim()]);
                setSkillInput('');
            }
        }
    };

    const removeSkill = (skillToRemove) => {
        updateResumeData('skills', skills.filter(s => s !== skillToRemove));
    };

    const handleAutoExtract = async () => {
        if (!currentResume.summary && (!currentResume.experience || currentResume.experience.length === 0)) {
            alert("Add some summary or experience first to let AI extract skills!");
            return;
        }

        setIsExtracting(true);
        try {
            const textToAnalyze = `
        Summary: ${currentResume.summary}
        Experience: ${currentResume.experience.map(e => e.description).join(' ')}
      `;

            const { data } = await api.post('/ai/extract-keywords', {
                text: textToAnalyze,
                model: selectedModel.model
            });

            if (data.success && data.data && Array.isArray(data.data)) {
                // Merge unique skills
                const newSkills = [...new Set([...skills, ...data.data])];
                updateResumeData('skills', newSkills);
            }
        } catch (error) {
            console.error('Extraction failed:', error);
            alert('Failed to extract skills. Please try again.');
        } finally {
            setIsExtracting(false);
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Skills</h2>
                    <p className="text-sm text-gray-500 mt-1">Add relevant skills. Press Enter to add.</p>
                </div>
                <button
                    onClick={handleAutoExtract}
                    disabled={isExtracting}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all disabled:opacity-50"
                >
                    {isExtracting ? (
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    ) : (
                        <FiCommand />
                    )}
                    {isExtracting ? 'Extracting...' : 'Auto Extract with AI'}
                </button>
            </div>

            <div className="flex gap-2">
                <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="e.g. JavaScript, React, System Design"
                />
                <button
                    onClick={handleAddSkill}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
                >
                    Add
                </button>
            </div>

            <div className="border border-gray-200 bg-gray-50 rounded-xl p-6 min-h-[150px]">
                {skills.length === 0 ? (
                    <div className="text-center text-gray-500 pt-6">No skills added yet.</div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                            <div key={index} className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm hover:border-red-300 group transition-colors">
                                {skill}
                                <button
                                    onClick={() => removeSkill(skill)}
                                    className="text-gray-400 group-hover:text-red-500 focus:outline-none"
                                    aria-label="Remove skill"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SkillsForm;
