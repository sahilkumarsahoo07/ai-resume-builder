import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiStar, FiLayout, FiBriefcase, FiCode, FiBook, FiZap, FiAward } from 'react-icons/fi';

const Templates = () => {
    const navigate = useNavigate();

    const templates = [
        {
            id: 'modern',
            name: 'Modern',
            description: 'Clean and contemporary design with subtle accents',
            icon: <FiLayout className="text-2xl" />,
            color: 'bg-blue-500',
            popular: true,
            category: 'Professional'
        },
        {
            id: 'minimal',
            name: 'Minimal',
            description: 'Simple black and white elegance',
            icon: <FiLayout className="text-2xl" />,
            color: 'bg-gray-700',
            category: 'Simple'
        },
        {
            id: 'professional',
            name: 'Professional',
            description: 'Corporate style for traditional industries',
            icon: <FiBriefcase className="text-2xl" />,
            color: 'bg-indigo-500',
            category: 'Corporate'
        },
        {
            id: 'executive',
            name: 'Executive',
            description: 'Bold leadership presence with elegant spacing',
            icon: <FiAward className="text-2xl" />,
            color: 'bg-purple-500',
            category: 'Leadership'
        },
        {
            id: 'classic',
            name: 'Classic',
            description: 'Timeless traditional resume format',
            icon: <FiBook className="text-2xl" />,
            color: 'bg-amber-600',
            category: 'Traditional'
        },
        {
            id: 'tech',
            name: 'Tech',
            description: 'Developer-focused with skills emphasis',
            icon: <FiCode className="text-2xl" />,
            color: 'bg-emerald-500',
            popular: true,
            category: 'Technical'
        },
        {
            id: 'startup',
            name: 'Startup',
            description: 'Modern layout for innovative companies',
            icon: <FiZap className="text-2xl" />,
            color: 'bg-rose-500',
            category: 'Modern'
        },
        {
            id: 'elegant',
            name: 'Elegant',
            description: 'Stylish yet ATS-friendly design',
            icon: <FiStar className="text-2xl" />,
            color: 'bg-pink-500',
            category: 'Stylish'
        }
    ];

    const categories = ['All', 'Professional', 'Simple', 'Corporate', 'Technical', 'Modern', 'Traditional'];
    const [selectedCategory, setSelectedCategory] = React.useState('All');

    const filteredTemplates = selectedCategory === 'All' 
        ? templates 
        : templates.filter(t => t.category === selectedCategory);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Resume Templates</h1>
                <p className="text-gray-500 mt-1">Choose from our ATS-friendly professionally designed templates.</p>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                            selectedCategory === cat
                                ? 'bg-primary-600 text-white'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTemplates.map((template) => (
                    <div
                        key={template.id}
                        className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => navigate('/resumes')}
                    >
                        {/* Preview Area */}
                        <div className={`h-48 ${template.color} bg-opacity-10 flex items-center justify-center relative overflow-hidden`}>
                            <div className={`w-16 h-16 ${template.color} text-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                {template.icon}
                            </div>
                            
                            {template.popular && (
                                <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                                    <FiStar /> Popular
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <button className="bg-white text-gray-900 px-4 py-2 rounded-xl font-medium shadow-lg hover:bg-gray-50">
                                    Use Template
                                </button>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="p-5">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{template.name}</h3>
                            <p className="text-sm text-gray-500">{template.description}</p>
                            
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                    {template.category}
                                </span>
                                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                    <FiCheck /> ATS Ready
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Info Section */}
            <div className="mt-12 bg-gradient-to-r from-primary-50 to-indigo-50 rounded-2xl p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Why ATS-Friendly Templates Matter</h2>
                <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Parseable Structure</h4>
                        <p>Clean HTML structure that applicant tracking systems can read accurately.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Standard Sections</h4>
                        <p>Uses conventional headings like Summary, Experience, Education that ATS recognizes.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-1">No Complex Elements</h4>
                        <p>Avoids tables, graphics, and images that can confuse ATS parsers.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Templates;
