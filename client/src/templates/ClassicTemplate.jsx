import React from 'react';

const ClassicTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, projects, skills } = data;

    return (
        <div className="font-[arial,sans-serif] text-black leading-snug p-[1in] bg-white min-h-[11in] w-full max-w-[8.5in] mx-auto text-[11pt]">
            <header className="text-center mb-6">
                <h1 className="text-[20pt] font-bold uppercase mb-2">{personalInfo?.name || 'Your Name'}</h1>
                <div className="text-[10pt] flex justify-center flex-wrap gap-x-2">
                    {personalInfo?.location && <span>{personalInfo.location} |</span>}
                    {personalInfo?.phone && <span>Phone: <a href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`} className="text-blue-800 underline">{personalInfo.phone}</a> |</span>}
                    {personalInfo?.email && <a href={`mailto:${personalInfo.email}`} className="text-blue-800 underline">{personalInfo.email}</a>}
                    {personalInfo?.links?.map((link, idx) => (
                        <React.Fragment key={idx}>
                            {link.url && <span>| <a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer" className="text-blue-800 underline transition-colors">{link.label || 'Link'}</a></span>}
                        </React.Fragment>
                    ))}
                    {/* Fallback for legacy fields */}
                    {!personalInfo?.links?.some(l => l.label?.toLowerCase().includes('linkedin')) && personalInfo?.linkedin && <span>| <a href={`https://${personalInfo.linkedin}`} className="text-blue-800 underline">LinkedIn</a></span>}
                    {!personalInfo?.links?.some(l => l.label?.toLowerCase().includes('portfolio')) && personalInfo?.portfolio && <span>| <a href={`https://${personalInfo.portfolio}`} className="text-blue-800 underline">Portfolio</a></span>}
                </div>
            </header>

            {summary && (
                <section className="mb-4">
                    <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-2">Summary</h2>
                    <p className="text-justify">{summary}</p>
                </section>
            )}

            {experience?.length > 0 && (
                <section className="mb-4">
                    <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-2">Experience</h2>
                    <div className="space-y-3">
                        {experience.map(exp => (
                            <div key={exp.id}>
                                <div className="flex justify-between font-bold">
                                    <span>{exp.role}</span>
                                    <span>{exp.duration}</span>
                                </div>
                                <div className="italic mb-1">{exp.company}</div>
                                <ul className="list-disc pl-5">
                                    {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                        <li key={i} className="mb-0.5">{line.replace(/^[-*•]\s*/, '')}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {education?.length > 0 && (
                <section className="mb-4">
                    <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-2">Education</h2>
                    <div className="space-y-2">
                        {education.map(ed => (
                            <div key={ed.id} className="flex justify-between">
                                <div>
                                    <span className="font-bold">{ed.institution}</span>
                                    <span> - {ed.degree}</span>
                                </div>
                                <span className="font-bold">{ed.year}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {projects?.length > 0 && (
                <section className="mb-4">
                    <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-2">Projects</h2>
                    <div className="space-y-3">
                        {projects.map(proj => (
                            <div key={proj.id}>
                                <div className="font-bold">
                                    {proj.name} {proj.techStack && <span className="font-normal italic">({proj.techStack})</span>}
                                </div>
                                <p className="pl-5">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {skills?.length > 0 && (
                <section className="mb-4">
                    <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-2">Skills</h2>
                    <p>{skills.join(', ')}</p>
                </section>
            )}
        </div>
    );
};

export default ClassicTemplate;
