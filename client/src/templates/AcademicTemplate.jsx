import React from 'react';

const AcademicTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, projects, skills } = data;

    return (
        <div className="font-[times,serif] text-black leading-tight p-12 bg-white min-h-[11in] w-full max-w-[8.5in] mx-auto">
            {/* Header */}
            <header className="text-center mb-8 pb-4 border-b border-black">
                <h1 className="text-3xl font-normal tracking-wide mb-2 uppercase">{personalInfo?.name || 'Your Name'}</h1>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-x-6 gap-y-1 text-[11pt]">
                    {personalInfo?.location && <span>{personalInfo.location}</span>}
                    {personalInfo?.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo?.email && <span>{personalInfo.email}</span>}
                    {personalInfo?.linkedin && <span>{personalInfo.linkedin}</span>}
                </div>
            </header>

            {/* Education Profile (Academic Focus = Education First) */}
            {education?.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-[14pt] font-bold uppercase tracking-wider border-b border-black pb-1 mb-3">Education</h2>
                    <div className="space-y-4">
                        {education.map(ed => (
                            <div key={ed.id}>
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="font-bold text-[12pt]">{ed.institution}</h3>
                                    <span className="text-[11pt]">{ed.year}</span>
                                </div>
                                <div className="text-[11pt] italic">{ed.degree}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Research & summary */}
            {summary && (
                <section className="mb-6">
                    <h2 className="text-[14pt] font-bold uppercase tracking-wider border-b border-black pb-1 mb-3">Research Interests & Profile</h2>
                    <p className="text-[11pt] leading-relaxed text-justify">{summary}</p>
                </section>
            )}

            {/* Professional Experience */}
            {experience?.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-[14pt] font-bold uppercase tracking-wider border-b border-black pb-1 mb-3">Academic & Professional Experience</h2>
                    <div className="space-y-5">
                        {experience.map(exp => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="font-bold text-[12pt]">{exp.company}</h3>
                                    <span className="text-[11pt]">{exp.duration}</span>
                                </div>
                                <div className="text-[11pt] italic mb-1.5">{exp.role}</div>
                                <p className="text-[11pt] leading-relaxed whitespace-pre-wrap ml-4 list-disc display-list-item">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Publications / Projects */}
            {projects?.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-[14pt] font-bold uppercase tracking-wider border-b border-black pb-1 mb-3">Selected Projects & Publications</h2>
                    <div className="space-y-4">
                        {projects.map(proj => (
                            <div key={proj.id} className="pl-4 -indent-4">
                                <span className="font-bold">{proj.name}. </span>
                                {proj.description}
                                {proj.techStack && <span className="italic ml-1">[{proj.techStack}]</span>}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Core Competencies (Skills) */}
            {skills?.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-[14pt] font-bold uppercase tracking-wider border-b border-black pb-1 mb-3">Core Competencies</h2>
                    <p className="text-[11pt] leading-relaxed">
                        {skills.join(', ')}
                    </p>
                </section>
            )}
        </div>
    );
};

export default AcademicTemplate;
