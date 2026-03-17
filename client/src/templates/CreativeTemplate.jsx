import React from 'react';

const CreativeTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, projects, skills } = data;

    return (
        <div className="font-sans text-gray-800 p-10 bg-white min-h-[11in] w-full max-w-[8.5in] mx-auto flex flex-col sm:flex-row">
            {/* Left Sidebar (Dark Theme) */}
            <div className="w-full sm:w-1/3 bg-gray-900 text-white p-6 rounded-l-lg mb-6 sm:mb-0">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-white tracking-tight leading-tight mb-2">
                        {personalInfo?.name?.split(' ').map((part, i) => (
                            <span key={i} className="block">{part}</span>
                        )) || 'Your Name'}
                    </h1>
                </div>

                <div className="space-y-6">
                    {/* Contact Info */}
                    <section>
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-700 pb-1">Contact</h2>
                        <div className="text-sm text-gray-300 space-y-2 break-all">
                            {personalInfo?.email && <div><a href={`mailto:${personalInfo.email}`} className="hover:text-teal-400 transition-colors">{personalInfo.email}</a></div>}
                            {personalInfo?.phone && <div><a href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`} className="hover:text-teal-400 transition-colors">{personalInfo.phone}</a></div>}
                            {personalInfo?.location && <div>{personalInfo.location}</div>}
                            {personalInfo?.links?.filter(link => link.url && link.label).map((link, idx) => (
                                <div key={idx}>
                                    <a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">{link.label}</a>
                                </div>
                            ))}
                            {/* Fallback for legacy fields */}
                            {!personalInfo?.links?.some(l => l.label?.toLowerCase().includes('linkedin')) && personalInfo?.linkedin && <div><a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">LinkedIn</a></div>}
                            {!personalInfo?.links?.some(l => l.label?.toLowerCase().includes('portfolio')) && personalInfo?.portfolio && <div><a href={personalInfo.portfolio.startsWith('http') ? personalInfo.portfolio : `https://${personalInfo.portfolio}`} target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">Portfolio</a></div>}
                        </div>
                    </section>

                    {/* Education */}
                    {education?.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-700 pb-1">Education</h2>
                            <div className="space-y-4">
                                {education.map(ed => (
                                    <div key={ed.id}>
                                        <h3 className="font-bold text-white text-sm">{ed.degree}</h3>
                                        <div className="text-gray-400 text-xs">{ed.institution}</div>
                                        <div className="text-teal-400 text-xs font-semibold mt-0.5">{ed.year}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {skills?.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-700 pb-1">Expertise</h2>
                            <div className="flex flex-wrap gap-2 text-xs">
                                {skills.map((skill, idx) => (
                                    <span key={idx} className="bg-gray-800 text-gray-300 px-2.5 py-1 rounded inline-block border border-gray-700">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>

            {/* Right Main Content */}
            <div className="w-full sm:w-2/3 p-6 sm:pl-10">
                {/* Summary */}
                {summary && (
                    <section className="mb-8 relative">
                        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-teal-500 rounded-full"></div>
                        <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Profile</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">{summary}</p>
                    </section>
                )}

                {/* Experience */}
                {experience?.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-black text-gray-900 mb-5 tracking-tight flex items-center gap-2">
                            <span className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-teal-600 text-lg">💼</span>
                            Experience
                        </h2>
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                            {experience.map((exp, index) => (
                                <div key={exp.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-3 h-3 rounded-full border-2 border-white bg-teal-500 shadow shrink-0 z-10"></div>
                                    <div className="w-[calc(100%-2rem)] bg-white rounded-lg border border-gray-100 p-4 shadow-sm group-hover:shadow-md transition-shadow">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                                            <h3 className="font-bold text-gray-900">{exp.role}</h3>
                                            <span className="text-teal-600 font-bold text-xs bg-teal-50 px-2 py-0.5 rounded">{exp.duration}</span>
                                        </div>
                                        <div className="text-gray-500 font-medium text-sm mb-2">{exp.company}</div>
                                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {projects?.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-2xl font-black text-gray-900 mb-5 tracking-tight flex items-center gap-2">
                            <span className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-teal-600 text-lg">🚀</span>
                            Projects
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {projects.map(proj => (
                                <div key={proj.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-teal-200 transition-colors">
                                    <h3 className="font-bold text-gray-900 text-base mb-1">{proj.name}</h3>
                                    {proj.techStack && <div className="text-teal-600 text-xs font-bold mb-2 uppercase tracking-wider">{proj.techStack}</div>}
                                    <p className="text-sm text-gray-600 leading-relaxed">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default CreativeTemplate;
