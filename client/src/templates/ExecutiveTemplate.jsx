import React from 'react';

const ExecutiveTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, projects, skills } = data;

    return (
        <div className="font-serif text-gray-900 leading-relaxed p-12 bg-white min-h-[11in] w-full max-w-[8.5in] mx-auto">
            {/* Header */}
            <header className="border-b-4 border-gray-900 pb-5 mb-8 text-center">
                <h1 className="text-5xl font-black uppercase tracking-widest text-gray-900 mb-3">{personalInfo?.name || 'Your Name'}</h1>
                <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-sm text-gray-700 font-medium tracking-wide">
                    {personalInfo?.email && <span>{personalInfo.email}</span>}
                    {personalInfo?.phone && <span>| Phone: {personalInfo.phone}</span>}
                    {personalInfo?.location && <span>| {personalInfo.location}</span>}
                    {personalInfo?.links?.map((link, idx) => (
                        <React.Fragment key={idx}>
                            {link.url && <span>| <a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">{link.label || 'Link'}</a></span>}
                        </React.Fragment>
                    ))}
                    {/* Fallback for legacy fields if they exist and aren't in links */}
                    {!personalInfo?.links?.some(l => l.label?.toLowerCase().includes('linkedin')) && personalInfo?.linkedin && <span>| <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer">LinkedIn</a></span>}
                    {!personalInfo?.links?.some(l => l.label?.toLowerCase().includes('portfolio')) && personalInfo?.portfolio && <span>| <a href={personalInfo.portfolio.startsWith('http') ? personalInfo.portfolio : `https://${personalInfo.portfolio}`} target="_blank" rel="noopener noreferrer">Portfolio</a></span>}
                </div>
            </header>

            {/* Summary */}
            {summary && (
                <section className="mb-8">
                    <p className="text-base text-gray-800 leading-loose text-justify italic font-medium">{summary}</p>
                </section>
            )}

            {/* Experience */}
            {experience?.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-xl font-bold uppercase tracking-widest border-b-2 border-gray-300 pb-2 mb-4">Professional Experience</h2>
                    <div className="space-y-6">
                        {experience.map(exp => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-end mb-1">
                                    <h3 className="font-bold text-lg text-gray-900">{exp.company}</h3>
                                    <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">{exp.duration}</span>
                                </div>
                                <div className="text-gray-700 italic font-semibold mb-2">{exp.role}</div>
                                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education?.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-xl font-bold uppercase tracking-widest border-b-2 border-gray-300 pb-2 mb-4">Education</h2>
                    <div className="space-y-4">
                        {education.map(ed => (
                            <div key={ed.id} className="flex justify-between items-baseline">
                                <div>
                                    <h3 className="font-bold text-gray-900">{ed.institution}</h3>
                                    <div className="text-gray-700 italic">{ed.degree}</div>
                                </div>
                                <span className="text-sm font-semibold text-gray-600 whitespace-nowrap ml-4">{ed.year}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {projects?.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-xl font-bold uppercase tracking-widest border-b-2 border-gray-300 pb-2 mb-4">Notable Projects</h2>
                    <div className="space-y-5">
                        {projects.map(proj => (
                            <div key={proj.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-gray-900 text-base">{proj.name}</h3>
                                </div>
                                {proj.techStack && <div className="text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wide">Tech: {proj.techStack}</div>}
                                <p className="text-sm text-gray-800 leading-relaxed">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Core Competencies (Skills) */}
            {skills?.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-bold uppercase tracking-widest border-b-2 border-gray-300 pb-2 mb-4">Core Competencies</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-900 font-medium">
                        {skills.map((skill, idx) => (
                            <span key={idx} className="flex items-center">
                                <span className="mr-2 text-gray-400">•</span> {skill}
                            </span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default ExecutiveTemplate;
