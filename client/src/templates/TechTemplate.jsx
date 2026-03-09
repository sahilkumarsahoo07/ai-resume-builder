import React from 'react';

const TechTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, projects, skills } = data;

    return (
        <div className="font-sans text-gray-800 p-10 bg-white min-h-[11in] w-full max-w-[8.5in] mx-auto">
            {/* Tech Header */}
            <header className="mb-6 pb-4 border-b-2 border-gray-800">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">{personalInfo?.name || 'Your Name'}</h1>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                    {personalInfo?.email && <span>{personalInfo.email}</span>}
                    {personalInfo?.phone && <span>| {personalInfo.phone}</span>}
                    {personalInfo?.location && <span>| {personalInfo.location}</span>}
                    {personalInfo?.linkedin && <span>| {personalInfo.linkedin}</span>}
                    {personalInfo?.portfolio && <span>| {personalInfo.portfolio}</span>}
                </div>
            </header>

            {/* Tech Summary */}
            {summary && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 uppercase mb-2">Professional Summary</h2>
                    <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
                </section>
            )}

            {/* Tech Skills - Prominent for developers */}
            {skills?.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 uppercase mb-2">Technical Skills</h2>
                    <div className="flex flex-wrap gap-2 text-sm">
                        {skills.map((skill, idx) => (
                            <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded font-medium">
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* Tech Projects - Emphasized for developers */}
            {projects?.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 uppercase mb-3">Projects</h2>
                    <div className="space-y-4">
                        {projects.map(proj => (
                            <div key={proj.id} className="border-l-2 border-gray-300 pl-4">
                                <h3 className="font-bold text-base text-gray-900 mb-1">{proj.name}</h3>
                                {proj.techStack && (
                                    <p className="text-xs text-gray-600 mb-1 font-medium">Stack: {proj.techStack}</p>
                                )}
                                <p className="text-sm text-gray-700 leading-relaxed">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Tech Experience */}
            {experience?.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 uppercase mb-3">Work Experience</h2>
                    <div className="space-y-4">
                        {experience.map(exp => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-base text-gray-900">{exp.role}</h3>
                                    <span className="text-sm text-gray-500">{exp.duration}</span>
                                </div>
                                <div className="text-sm font-medium text-gray-700 mb-1">{exp.company}</div>
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Tech Education */}
            {education?.length > 0 && (
                <section className="mb-4">
                    <h2 className="text-lg font-bold text-gray-900 uppercase mb-3">Education</h2>
                    <div className="space-y-3">
                        {education.map(ed => (
                            <div key={ed.id} className="flex justify-between items-baseline">
                                <div>
                                    <h3 className="font-bold text-sm text-gray-900">{ed.degree}</h3>
                                    <p className="text-sm text-gray-600">{ed.institution}</p>
                                </div>
                                <span className="text-sm text-gray-500">{ed.year}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default TechTemplate;
