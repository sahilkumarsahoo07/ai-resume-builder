import React from 'react';

const ProfessionalTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, projects, skills } = data;

    return (
        <div className="font-serif text-gray-800 p-10 bg-white min-h-[11in] w-full">
            <header className="border-b-4 border-gray-800 pb-5 mb-6 text-center">
                <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">{personalInfo?.name || 'Your Name'}</h1>
                <div className="text-sm text-gray-700 flex flex-wrap justify-center gap-2">
                    {personalInfo?.email && <span>{personalInfo.email}</span>}
                    {personalInfo?.phone && <span>• {personalInfo.phone}</span>}
                    {personalInfo?.location && <span>• {personalInfo.location}</span>}
                    {personalInfo?.linkedin && <span>• {personalInfo.linkedin}</span>}
                </div>
            </header>

            <div className="flex gap-8">
                {/* Main Content (Left) */}
                <div className="w-2/3 pr-4 border-r border-gray-200">
                    {summary && (
                        <section className="mb-6">
                            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3 uppercase tracking-wider">Summary</h2>
                            <p className="text-sm leading-relaxed text-gray-800">{summary}</p>
                        </section>
                    )}

                    {experience?.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3 uppercase tracking-wider">Professional Experience</h2>
                            <div className="space-y-5">
                                {experience.map(exp => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between font-bold text-gray-900 text-sm">
                                            <span>{exp.role}</span>
                                            <span className="font-normal italic">{exp.duration}</span>
                                        </div>
                                        <div className="text-gray-700 font-semibold text-sm mb-1.5">{exp.company}</div>
                                        <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {projects?.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3 uppercase tracking-wider">Key Projects</h2>
                            <div className="space-y-4">
                                {projects.map(proj => (
                                    <div key={proj.id}>
                                        <h3 className="font-bold text-gray-900 text-sm mb-0.5">{proj.name}</h3>
                                        <p className="text-sm leading-relaxed text-gray-800">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar (Right) */}
                <div className="w-1/3 pl-4">
                    {skills?.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3 uppercase tracking-wider">Skills</h2>
                            <ul className="list-disc pl-4 text-sm text-gray-800 leading-relaxed space-y-1">
                                {skills.map((skill, idx) => (
                                    <li key={idx}>{skill}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {education?.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3 uppercase tracking-wider">Education</h2>
                            <div className="space-y-4">
                                {education.map(ed => (
                                    <div key={ed.id}>
                                        <h3 className="font-bold text-gray-900 text-sm">{ed.degree}</h3>
                                        <div className="text-gray-700 text-sm mb-0.5">{ed.institution}</div>
                                        <div className="text-xs text-gray-500 italic">{ed.year}</div>
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

export default ProfessionalTemplate;
