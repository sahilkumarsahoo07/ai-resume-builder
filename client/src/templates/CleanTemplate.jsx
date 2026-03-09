import React from 'react';

const CleanTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, projects, skills } = data;

    return (
        <div className="font-sans text-gray-900 text-sm leading-normal p-8 bg-white min-h-[11in] w-full max-w-[8.5in] mx-auto">
            {/* Clean Header */}
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{personalInfo?.name || 'Your Name'}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                    {personalInfo?.email && <span className="flex items-center gap-1.5">{personalInfo.email}</span>}
                    {personalInfo?.phone && <span className="flex items-center gap-1.5">Phone: {personalInfo.phone}</span>}
                    {personalInfo?.location && <span className="flex items-center gap-1.5">{personalInfo.location}</span>}
                    {personalInfo?.links?.map((link, idx) => (
                        <React.Fragment key={idx}>
                            {link.url && <a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors uppercase tracking-wider text-xs font-bold">{link.label || 'Link'}</a>}
                        </React.Fragment>
                    ))}
                    {/* Fallback for legacy fields */}
                    {!personalInfo?.links?.some(l => l.label?.toLowerCase().includes('linkedin')) && personalInfo?.linkedin && <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors uppercase tracking-wider text-xs font-bold">LinkedIn</a>}
                    {!personalInfo?.links?.some(l => l.label?.toLowerCase().includes('portfolio')) && personalInfo?.portfolio && <a href={`https://${personalInfo.portfolio}`} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors uppercase tracking-wider text-xs font-bold">Portfolio</a>}
                </div>
            </header>

            {/* Clean Summary */}
            {summary && (
                <section className="mb-5">
                    <h2 className="text-base font-bold text-gray-900 uppercase mb-2">Summary</h2>
                    <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
                </section>
            )}

            {/* Clean Experience */}
            {experience?.length > 0 && (
                <section className="mb-5">
                    <h2 className="text-base font-bold text-gray-900 uppercase mb-3">Experience</h2>
                    <div className="space-y-4">
                        {experience.map(exp => (
                            <div key={exp.id}>
                                <h3 className="font-bold text-sm text-gray-900">{exp.role}</h3>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-700">{exp.company}</span>
                                    <span className="text-gray-500">{exp.duration}</span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Clean Projects */}
            {projects?.length > 0 && (
                <section className="mb-5">
                    <h2 className="text-base font-bold text-gray-900 uppercase mb-3">Projects</h2>
                    <div className="space-y-3">
                        {projects.map(proj => (
                            <div key={proj.id}>
                                <h3 className="font-bold text-sm text-gray-900">{proj.name}</h3>
                                {proj.techStack && <p className="text-xs text-gray-500 mb-1">Technologies: {proj.techStack}</p>}
                                <p className="text-sm text-gray-700 leading-relaxed">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Clean Education */}
            {education?.length > 0 && (
                <section className="mb-5">
                    <h2 className="text-base font-bold text-gray-900 uppercase mb-3">Education</h2>
                    <div className="space-y-2">
                        {education.map(ed => (
                            <div key={ed.id}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-sm text-gray-900">{ed.institution}</h3>
                                    <span className="text-sm text-gray-500">{ed.year}</span>
                                </div>
                                <p className="text-sm text-gray-700">{ed.degree}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Clean Skills */}
            {skills?.length > 0 && (
                <section className="mb-4">
                    <h2 className="text-base font-bold text-gray-900 uppercase mb-2">Skills</h2>
                    <p className="text-sm text-gray-700">{skills.join(', ')}</p>
                </section>
            )}
        </div>
    );
};

export default CleanTemplate;
