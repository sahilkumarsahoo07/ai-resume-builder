import React from 'react';

const StartupTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, projects, skills } = data;

    return (
        <div className="font-[inter,sans-serif] text-slate-800 p-10 bg-slate-50 min-h-[11in] w-full max-w-[8.5in] mx-auto border-l-8 border-rose-500">
            {/* Header section with impact */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8 mt-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500 rounded-bl-full opacity-10 blur-2xl"></div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4 relative z-10">{personalInfo?.name || 'Your Name'}</h1>

                {summary && (
                    <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-3xl mb-6 relative z-10">
                        {summary}
                    </p>
                )}

                <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-500 relative z-10">
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        {personalInfo?.email && <a href={`mailto:${personalInfo.email}`} className="bg-slate-100 hover:bg-rose-50 hover:text-rose-600 px-3 py-1.5 rounded-lg transition-colors">{personalInfo.email}</a>}
                        {personalInfo?.phone && <span className="bg-slate-100 px-3 py-1.5 rounded-lg">Phone: {personalInfo.phone}</span>}
                        {personalInfo?.location && <span className="bg-slate-100 px-3 py-1.5 rounded-lg">{personalInfo.location}</span>}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        {personalInfo?.links?.map((link, idx) => (
                            <React.Fragment key={idx}>
                                {link.url && <a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer" className="bg-slate-100 hover:bg-rose-50 hover:text-rose-600 px-3 py-1.5 rounded-lg transition-colors">{link.label || 'Link'}</a>}
                            </React.Fragment>
                        ))}
                        {/* Fallback for legacy fields */}
                        {!personalInfo?.links?.some(l => l.label?.toLowerCase().includes('linkedin')) && personalInfo?.linkedin && <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="bg-slate-100 hover:bg-rose-50 hover:text-rose-600 px-3 py-1.5 rounded-lg transition-colors">LinkedIn</a>}
                        {!personalInfo?.links?.some(l => l.label?.toLowerCase().includes('portfolio')) && personalInfo?.portfolio && <a href={`https://${personalInfo.portfolio}`} target="_blank" rel="noopener noreferrer" className="bg-rose-100 text-rose-700 hover:bg-rose-200 px-3 py-1.5 rounded-lg transition-colors">Portfolio</a>}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Main Content Column */}
                <div className="md:col-span-8 space-y-8">
                    {/* Experience Track Record */}
                    {experience?.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                <span className="text-rose-500">🔥</span> Track Record
                            </h2>
                            <div className="space-y-8">
                                {experience.map(exp => (
                                    <div key={exp.id} className="relative">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                                            <div>
                                                <h3 className="font-extrabold text-xl text-slate-900">{exp.role}</h3>
                                                <div className="text-rose-600 font-bold text-sm tracking-wide uppercase mt-0.5">{exp.company}</div>
                                            </div>
                                            <span className="inline-block mt-2 sm:mt-0 font-bold text-xs bg-white border border-slate-200 text-slate-500 px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
                                                {exp.duration}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 leading-relaxed font-medium mt-3 whitespace-pre-wrap pl-4 border-l-2 border-slate-200">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Shipments / Projects */}
                    {projects?.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                <span className="text-rose-500">🚀</span> Shipped
                            </h2>
                            <div className="grid grid-cols-1 gap-5">
                                {projects.map(proj => (
                                    <div key={proj.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-rose-300 hover:shadow-md transition-all group">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-rose-600 transition-colors">{proj.name}</h3>
                                        </div>
                                        <p className="text-slate-600 font-medium leading-relaxed mb-4">{proj.description}</p>
                                        {proj.techStack && (
                                            <div className="flex flex-wrap gap-2">
                                                {proj.techStack.split(',').map((tech, i) => (
                                                    <span key={i} className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                                        {tech.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar Column */}
                <div className="md:col-span-4 space-y-8">
                    {/* Arsenal (Skills) */}
                    {skills?.length > 0 && (
                        <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                                <span className="text-rose-500">⚡</span> Arsenal
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, idx) => (
                                    <span key={idx} className="bg-slate-100 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-200">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Basecamp (Education) */}
                    {education?.length > 0 && (
                        <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                                <span className="text-rose-500">🎓</span> Basecamp
                            </h2>
                            <div className="space-y-4">
                                {education.map(ed => (
                                    <div key={ed.id} className="relative pl-4 before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-rose-500 before:rounded-full">
                                        <h3 className="font-bold text-slate-900 text-sm leading-snug">{ed.degree}</h3>
                                        <div className="text-slate-500 text-xs font-semibold mt-1">{ed.institution}</div>
                                        <div className="text-rose-500 text-xs font-black mt-1">{ed.year}</div>
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

export default StartupTemplate;
