import React from 'react';

const CompactTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, projects, skills } = data;

    return (
        <div className="font-sans text-gray-800 text-[10pt] leading-tight p-6 bg-white min-h-[11in] w-full max-w-[8.5in] mx-auto">
            {/* Compact Header */}
            <header className="text-center mb-4 pb-2 border-b border-gray-300">
                <h1 className="text-[18pt] font-bold text-gray-900 mb-1">{personalInfo?.name || 'Your Name'}</h1>
                <div className="text-[9pt] text-gray-600 flex flex-wrap justify-center gap-x-3">
                    {personalInfo?.email && <span>{personalInfo.email}</span>}
                    {personalInfo?.phone && <span>| {personalInfo.phone}</span>}
                    {personalInfo?.location && <span>| {personalInfo.location}</span>}
                    {personalInfo?.linkedin && <span>| {personalInfo.linkedin}</span>}
                    {personalInfo?.portfolio && <span>| {personalInfo.portfolio}</span>}
                </div>
            </header>

            {/* Summary - Single line if possible */}
            {summary && (
                <section className="mb-3">
                    <h2 className="text-[11pt] font-bold uppercase border-b border-gray-300 mb-1">Summary</h2>
                    <p className="text-[10pt] text-gray-700 leading-snug">{summary}</p>
                </section>
            )}

            {/* Compact Experience */}
            {experience?.length > 0 && (
                <section className="mb-3">
                    <h2 className="text-[11pt] font-bold uppercase border-b border-gray-300 mb-2">Experience</h2>
                    <div className="space-y-2">
                        {experience.map(exp => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-[10pt] text-gray-900">{exp.role}</h3>
                                    <span className="text-[9pt] text-gray-500">{exp.duration}</span>
                                </div>
                                <div className="text-[9pt] text-gray-600 italic mb-0.5">{exp.company}</div>
                                <p className="text-[9pt] text-gray-700 leading-snug whitespace-pre-wrap">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Compact Projects */}
            {projects?.length > 0 && (
                <section className="mb-3">
                    <h2 className="text-[11pt] font-bold uppercase border-b border-gray-300 mb-2">Projects</h2>
                    <div className="space-y-1.5">
                        {projects.map(proj => (
                            <div key={proj.id}>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="font-bold text-[10pt] text-gray-900">{proj.name}</h3>
                                    {proj.techStack && <span className="text-[8pt] text-gray-500">({proj.techStack})</span>}
                                </div>
                                <p className="text-[9pt] text-gray-700 leading-snug">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education - Inline style */}
            {education?.length > 0 && (
                <section className="mb-3">
                    <h2 className="text-[11pt] font-bold uppercase border-b border-gray-300 mb-2">Education</h2>
                    <div className="space-y-1">
                        {education.map(ed => (
                            <div key={ed.id} className="flex justify-between items-baseline">
                                <div>
                                    <span className="font-bold text-[10pt] text-gray-900">{ed.degree}</span>
                                    <span className="text-[9pt] text-gray-600"> — {ed.institution}</span>
                                </div>
                                <span className="text-[9pt] text-gray-500">{ed.year}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Compact Skills */}
            {skills?.length > 0 && (
                <section className="mb-2">
                    <h2 className="text-[11pt] font-bold uppercase border-b border-gray-300 mb-1">Skills</h2>
                    <p className="text-[10pt] text-gray-700 leading-snug">{skills.join(', ')}</p>
                </section>
            )}
        </div>
    );
};

export default CompactTemplate;
