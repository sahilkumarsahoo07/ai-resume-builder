import React from 'react';

const ModernTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, projects, skills } = data;

    return (
        <div className="font-sans text-gray-800 leading-normal p-10 bg-white min-h-[11in] w-full">
            <header className="border-b-2 border-primary-600 pb-4 mb-6">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">{personalInfo?.name || 'Your Name'}</h1>
                <div className="flex flex-wrap gap-x-4 mt-2 text-sm text-gray-600 font-medium">
                    {personalInfo?.email && <span>{personalInfo.email}</span>}
                    {personalInfo?.phone && <span>• Phone: {personalInfo.phone}</span>}
                    {personalInfo?.location && <span>• {personalInfo.location}</span>}
                    {personalInfo?.links?.map((link, idx) => (
                        <React.Fragment key={idx}>
                            {link.url && <span>• <a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">{link.label || 'Link'}</a></span>}
                        </React.Fragment>
                    ))}
                    {/* Fallback for legacy fields */}
                    {!personalInfo?.links?.some(l => l.label?.toLowerCase().includes('linkedin')) && personalInfo?.linkedin && <span>• <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer">LinkedIn</a></span>}
                    {!personalInfo?.links?.some(l => l.label?.toLowerCase().includes('portfolio')) && personalInfo?.portfolio && <span>• <a href={personalInfo.portfolio.startsWith('http') ? personalInfo.portfolio : `https://${personalInfo.portfolio}`} target="_blank" rel="noopener noreferrer">Portfolio</a></span>}
                </div>
            </header>

            {summary && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-primary-700 uppercase tracking-wider mb-2">Professional Summary</h2>
                    <p className="text-sm text-gray-700 leading-relaxed text-justify">{summary}</p>
                </section>
            )}

            {experience?.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-primary-700 uppercase tracking-wider mb-3">Work Experience</h2>
                    <div className="space-y-4">
                        {experience.map(exp => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-gray-900 text-base">{exp.role}</h3>
                                    <span className="text-sm font-medium text-gray-500 whitespace-nowrap ml-4">{exp.duration}</span>
                                </div>
                                <div className="text-primary-600 font-medium text-sm mb-1.5">{exp.company}</div>
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {projects?.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-primary-700 uppercase tracking-wider mb-3">Projects</h2>
                    <div className="space-y-4">
                        {projects.map(proj => (
                            <div key={proj.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-gray-900 text-base">{proj.name}</h3>
                                </div>
                                {proj.techStack && <div className="text-gray-500 text-xs font-medium mb-1.5">{proj.techStack}</div>}
                                <p className="text-sm text-gray-700 leading-relaxed">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {education?.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-primary-700 uppercase tracking-wider mb-3">Education</h2>
                    <div className="space-y-3">
                        {education.map(ed => (
                            <div key={ed.id} className="flex justify-between items-baseline">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-base">{ed.degree}</h3>
                                    <div className="text-gray-600 text-sm">{ed.institution}</div>
                                </div>
                                <span className="text-sm font-medium text-gray-500 whitespace-nowrap ml-4">{ed.year}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {skills?.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-primary-700 uppercase tracking-wider mb-3">Skills</h2>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                        {skills.map((skill, idx) => (
                            <span key={idx} className="bg-gray-100 px-2.5 py-1 rounded-sm border border-gray-200">
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default ModernTemplate;
