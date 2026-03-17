import React from 'react';

const TechnicalTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, projects, skills } = data;

    return (
        <div className="font-sans text-[#333] p-10 bg-[#fbfbfb] min-h-[11in] w-full max-w-[8.5in] mx-auto border-t-8 border-[#2563eb]">
            <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-[#111] mb-1">{personalInfo?.name || 'Your Name'}</h1>
                    {summary && <p className="text-[#555] font-medium text-sm max-w-2xl">{summary}</p>}
                </div>
                <div className="mt-4 md:mt-0 text-xs font-mono text-[#666] flex flex-col items-start md:items-end space-y-1">
                    {personalInfo?.email && <a href={`mailto:${personalInfo.email}`} className="hover:text-[#2563eb]">{personalInfo.email}</a>}
                    {personalInfo?.phone && <span>Phone: <a href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`} className="hover:text-[#2563eb]">{personalInfo.phone}</a></span>}
                    {personalInfo?.location && <span>{personalInfo.location}</span>}
                    {personalInfo?.links?.map((link, idx) => (
                        <React.Fragment key={idx}>
                            {link.url && <a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#2563eb] transition-colors">{link.label || 'Link'}</a>}
                        </React.Fragment>
                    ))}
                    {/* Fallback for legacy fields */}
                    {!personalInfo?.links?.some(l => l.label?.toLowerCase().includes('linkedin')) && personalInfo?.linkedin && <a href={`https://${personalInfo.linkedin}`} className="hover:text-[#2563eb]">LinkedIn</a>}
                    {!personalInfo?.links?.some(l => l.label?.toLowerCase().includes('portfolio')) && personalInfo?.portfolio && <a href={`https://${personalInfo.portfolio}`} className="hover:text-[#2563eb]">Portfolio</a>}
                </div>
            </header>

            {/* Skills - Front and Center for Tech */}
            {skills?.length > 0 && (
                <section className="mb-6 border border-[#e5e7eb] bg-white rounded-md p-4 shadow-sm">
                    <h2 className="text-sm font-bold text-[#2563eb] uppercase tracking-wider mb-3 flex items-center"><span className="font-mono mr-2">&lt;Skills /&gt;</span></h2>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, idx) => (
                            <span key={idx} className="bg-[#f3f4f6] text-[#374151] font-mono text-xs px-2 py-1 rounded border border-[#d1d5db]">
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* Experience */}
            {experience?.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-[#111] border-b-2 border-[#e5e7eb] pb-1 mb-4 flex items-center"><span className="text-[#2563eb] mr-2">/</span> Experience</h2>
                    <div className="space-y-5">
                        {experience.map(exp => (
                            <div key={exp.id} className="relative pl-4 border-l-2 border-[#e5e7eb] hover:border-[#2563eb] transition-colors">
                                <div className="absolute w-2 h-2 bg-[#2563eb] rounded-full -left-[5px] top-2"></div>
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="font-bold text-[#111] text-base">{exp.role}</h3>
                                    <span className="font-mono text-xs text-[#666] bg-[#f3f4f6] px-2 py-0.5 rounded">{exp.duration}</span>
                                </div>
                                <div className="text-[#2563eb] font-semibold text-sm mb-2">{exp.company}</div>
                                <p className="text-sm text-[#444] leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {projects?.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-[#111] border-b-2 border-[#e5e7eb] pb-1 mb-4 flex items-center"><span className="text-[#2563eb] mr-2">/</span> Open Source & Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projects.map(proj => (
                            <div key={proj.id} className="border border-[#e5e7eb] rounded-md p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="font-bold text-[#111] text-base mb-1">{proj.name}</h3>
                                {proj.techStack && (
                                    <div className="font-mono text-xs text-[#2563eb] mb-2 break-words">
                                        {proj.techStack.split(',').map(t => t.trim()).join(' • ')}
                                    </div>
                                )}
                                <p className="text-sm text-[#555] leading-relaxed">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education?.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-[#111] border-b-2 border-[#e5e7eb] pb-1 mb-4 flex items-center"><span className="text-[#2563eb] mr-2">/</span> Education</h2>
                    <div className="space-y-3">
                        {education.map(ed => (
                            <div key={ed.id} className="flex justify-between items-baseline border-l-2 border-[#e5e7eb] pl-4">
                                <div>
                                    <h3 className="font-bold text-[#111]">{ed.degree}</h3>
                                    <div className="text-[#555] text-sm">{ed.institution}</div>
                                </div>
                                <span className="font-mono text-xs text-[#666]">{ed.year}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default TechnicalTemplate;
