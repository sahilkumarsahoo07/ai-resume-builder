import React, { useState } from 'react';
import PersonalInfoForm from '../forms/PersonalInfoForm';
import SummaryForm from '../forms/SummaryForm';
import ExperienceForm from '../forms/ExperienceForm';
import EducationForm from '../forms/EducationForm';
import ProjectsForm from '../forms/ProjectsForm';
import SkillsForm from '../forms/SkillsForm';

const ResumeForm = () => {
    const [activeTab, setActiveTab] = useState('personal');

    const tabs = [
        { id: 'personal', label: 'Personal Info' },
        { id: 'summary', label: 'Summary' },
        { id: 'experience', label: 'Experience' },
        { id: 'education', label: 'Education' },
        { id: 'projects', label: 'Projects' },
        { id: 'skills', label: 'Skills' }
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Horizontal Scrollable Tabs */}
            <div className="flex overflow-x-auto border-b border-gray-200 hide-scrollbar bg-gray-50 p-2 gap-2 shrink-0">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                            ? 'bg-white text-primary-600 shadow-sm border border-gray-200'
                            : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-white">
                {activeTab === 'personal' && <PersonalInfoForm />}
                {activeTab === 'summary' && <SummaryForm />}
                {activeTab === 'experience' && <ExperienceForm />}
                {activeTab === 'education' && <EducationForm />}
                {activeTab === 'projects' && <ProjectsForm />}
                {activeTab === 'skills' && <SkillsForm />}
            </div>
        </div>
    );
};

export default ResumeForm;
