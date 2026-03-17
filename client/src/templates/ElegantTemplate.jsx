import React from 'react';

const ElegantTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, projects, skills } = data;

    return (
        <div className="font-[optima,sans-serif] text-gray-800 leading-relaxed p-12 bg-white min-h-[11in] w-full max-w-[8.5in] mx-auto">
            {/* Minimalist Header */}
            <header className="mb-10 text-center">
                <h1 className="text-5xl font-light tracking-[0.2em] text-gray-900 mb-4">{personalInfo?.name || 'Your Name'}</h1>
                <div className="flex justify-center items-center gap-4 text-xs tracking-widest text-gray-500 uppercase">
                    {personalInfo?.email && <span><a href={`mailto:${personalInfo.email}`} className="hover:text-gray-900 transition-colors underline decoration-gray-300 underline-offset-4">{personalInfo.email}</a></span>}
                    {personalInfo?.phone && <><span className="w-1 h-1 bg-gray-300 rounded-full"></span><span><a href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`} className="hover:text-gray-900 transition-colors">{personalInfo.phone}</a></span></>}
                    {personalInfo?.location && <><span className="w-1 h-1 bg-gray-300 rounded-full"></span><span>{personalInfo.location}</span></>}
                </div>
                {(personalInfo?.linkedin || personalInfo?.portfolio || personalInfo?.links?.length > 0) && (
                    <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs tracking-widest text-gray-500 uppercase mt-2">
                        {/* Fallback for legacy fields */}
                        {!personalInfo?.links?.some(l => l.label?.toLowerCase().includes('linkedin')) && personalInfo?.linkedin && <span><a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">LinkedIn</a></span>}
                        {!personalInfo?.links?.some(l => l.label?.toLowerCase().includes('portfolio')) && personalInfo?.portfolio && (
                            <>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span><a href={personalInfo.portfolio.startsWith('http') ? personalInfo.portfolio : `https://${personalInfo.portfolio}`} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">Portfolio</a></span>
                            </>
                        )}
                        
                        {personalInfo?.links?.filter(link => link.url && link.label).map((link, idx) => (
                            <React.Fragment key={idx}>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span><a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors font-semibold">{link.label}</a></span>
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </header>

            <div className="flex flex-col gap-8">
                {/* Lateral Summary */}
                {summary && (
                    <section className="grid grid-cols-12 gap-6">
                        <div className="col-span-3">
                            <h2 className="text-xs font-bold tracking-[0.15em] text-gray-400 uppercase text-right mt-1">Profile</h2>
                        </div>
                        <div className="col-span-9 border-l border-gray-200 pl-6 pb-2">
                            <p className="text-sm text-gray-700 leading-loose text-justify">{summary}</p>
                        </div>
                    </section>
                )}

                {/* Experience */}
                {experience?.length > 0 && (
                    <section className="grid grid-cols-12 gap-6">
                        <div className="col-span-3">
                            <h2 className="text-xs font-bold tracking-[0.15em] text-gray-400 uppercase text-right mt-1">Experience</h2>
                        </div>
                        <div className="col-span-9 border-l border-gray-200 pl-6 pb-2 space-y-6">
                            {experience.map(exp => (
                                <div key={exp.id} className="relative">
                                    <div className="absolute -left-[29px] top-1.5 w-2 h-2 rounded-full border border-gray-300 bg-white"></div>
                                    <h3 className="text-base font-semibold text-gray-900 tracking-wide">{exp.role}</h3>
                                    <div className="flex justify-between items-baseline mb-3">
                                        <span className="text-sm text-gray-500 italic">{exp.company}</span>
                                        <span className="text-xs font-medium tracking-wider text-gray-400 uppercase">{exp.duration}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-loose whitespace-pre-wrap">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {projects?.length > 0 && (
                    <section className="grid grid-cols-12 gap-6">
                        <div className="col-span-3">
                            <h2 className="text-xs font-bold tracking-[0.15em] text-gray-400 uppercase text-right mt-1">Selected Works</h2>
                        </div>
                        <div className="col-span-9 border-l border-gray-200 pl-6 pb-2 space-y-6">
                            {projects.map(proj => (
                                <div key={proj.id} className="relative">
                                    <div className="absolute -left-[29px] top-1.5 w-2 h-2 rounded-full border border-gray-300 bg-white"></div>
                                    <h3 className="text-base font-semibold text-gray-900 tracking-wide mb-1">{proj.name}</h3>
                                    {proj.techStack && <div className="text-xs tracking-widest text-gray-400 uppercase mb-2">[{proj.techStack}]</div>}
                                    <p className="text-sm text-gray-600 leading-loose">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {education?.length > 0 && (
                    <section className="grid grid-cols-12 gap-6">
                        <div className="col-span-3">
                            <h2 className="text-xs font-bold tracking-[0.15em] text-gray-400 uppercase text-right mt-1">Education</h2>
                        </div>
                        <div className="col-span-9 border-l border-gray-200 pl-6 pb-2 space-y-5">
                            {education.map(ed => (
                                <div key={ed.id} className="relative flex justify-between items-baseline">
                                    <div className="absolute -left-[29px] top-1.5 w-2 h-2 rounded-full border border-gray-300 bg-white"></div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 tracking-wide">{ed.degree}</h3>
                                        <div className="text-sm text-gray-500 italic mt-0.5">{ed.institution}</div>
                                    </div>
                                    <span className="text-xs font-medium tracking-wider text-gray-400 uppercase">{ed.year}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {skills?.length > 0 && (
                    <section className="grid grid-cols-12 gap-6">
                        <div className="col-span-3">
                            <h2 className="text-xs font-bold tracking-[0.15em] text-gray-400 uppercase text-right mt-1">Expertise</h2>
                        </div>
                        <div className="col-span-9 border-l border-gray-200 pl-6 pb-2">
                            <div className="flex flex-wrap gap-x-6 gap-y-3">
                                {skills.map((skill, idx) => (
                                    <span key={idx} className="text-sm text-gray-600 tracking-wide">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ElegantTemplate;
