import React from 'react';

const MinimalTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, projects, skills } = data;

    return (
        <div className="font-serif text-gray-900 p-12 bg-white min-h-[11in] w-full">
            <header className="text-center mb-8">
                <h1 className="text-3xl tracking-widest uppercase mb-3">{personalInfo?.name || 'Your Name'}</h1>
                <div className="flex flex-wrap justify-center gap-2 text-xs uppercase tracking-widest text-gray-500">
                    {personalInfo?.email && <span><a href={`mailto:${personalInfo.email}`} className="hover:text-gray-900 transition-colors">{personalInfo.email}</a></span>}
                    {personalInfo?.phone && <span>| Phone: <a href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`} className="hover:text-gray-900 transition-colors">{personalInfo.phone}</a></span>}
                    {personalInfo?.location && <span>| {personalInfo.location}</span>}
                </div>
                <div className="flex flex-wrap justify-center gap-2 text-xs uppercase tracking-widest text-gray-500 mt-1">
                    {personalInfo?.links?.filter(link => link.url && link.label).map((link, idx) => (
                        <React.Fragment key={idx}>
                            <span>{idx === 0 ? '' : '| '} <a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">{link.label}</a></span>
                        </React.Fragment>
                    ))}
                    {/* Fallback for legacy fields */}
                    {!personalInfo?.links?.some(l => l.label?.toLowerCase().includes('linkedin')) && personalInfo?.linkedin && <span>| <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer">LinkedIn</a></span>}
                    {!personalInfo?.links?.some(l => l.label?.toLowerCase().includes('portfolio')) && personalInfo?.portfolio && <span>| <a href={personalInfo.portfolio.startsWith('http') ? personalInfo.portfolio : `https://${personalInfo.portfolio}`} target="_blank" rel="noopener noreferrer">Portfolio</a></span>}
                </div>
            </header>

            {summary && (
                <section className="mb-8 text-center text-sm leading-7 text-gray-700 max-w-2xl mx-auto">
                    {summary}
                </section>
            )}

            {experience?.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-900 pb-2 mb-4">Experience</h2>
                    <div className="space-y-6">
                        {experience.map(exp => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-end mb-1">
                                    <h3 className="font-semibold text-base">{exp.role}</h3>
                                    <span className="text-xs uppercase tracking-widest text-gray-500">{exp.duration}</span>
                                </div>
                                <div className="text-gray-600 text-sm italic mb-2">{exp.company}</div>
                                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="grid grid-cols-2 gap-8">
                <div>
                    {education?.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-900 pb-2 mb-4">Education</h2>
                            <div className="space-y-4">
                                {education.map(ed => (
                                    <div key={ed.id}>
                                        <h3 className="font-semibold text-sm">{ed.degree}</h3>
                                        <div className="text-gray-600 text-sm italic">{ed.institution}</div>
                                        <div className="text-xs uppercase tracking-widest text-gray-500 mt-1">{ed.year}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {skills?.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-900 pb-2 mb-4">Skills</h2>
                            <p className="text-sm leading-relaxed text-gray-800">
                                {skills.join(' • ')}
                            </p>
                        </section>
                    )}
                </div>

                <div>
                    {projects?.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-900 pb-2 mb-4">Projects</h2>
                            <div className="space-y-5">
                                {projects.map(proj => (
                                    <div key={proj.id}>
                                        <h3 className="font-semibold text-sm mb-1">{proj.name}</h3>
                                        {proj.techStack && <div className="text-xs text-gray-500 mb-1.5">{proj.techStack}</div>}
                                        <p className="text-sm text-gray-800 leading-relaxed">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MinimalTemplate;
