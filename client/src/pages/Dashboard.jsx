import React, { useEffect } from 'react';
import useResumeStore from '../store/useResumeStore';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiFileText, FiClock, FiLayout } from 'react-icons/fi';

const Dashboard = () => {
    const { resumesList, fetchResumes, createResume, deleteResume, isLoading } = useResumeStore();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('[Dashboard] Fetching resumes...');
        fetchResumes();
    }, [fetchResumes]);

    // Debug logging
    useEffect(() => {
        console.log('[Dashboard] State:', { isLoading, count: resumesList?.length });
    }, [isLoading, resumesList]);

    // Ensure resumesList is always an array
    const safeResumesList = Array.isArray(resumesList) ? resumesList : [];

    const handleCreate = async () => {
        const newResume = await createResume();
        if (newResume && newResume._id) {
            navigate(`/editor/${newResume._id}`);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this resume?')) {
            await deleteResume(id);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Resumes</h1>
                    <p className="text-gray-500 mt-1">Create, edit, and manage your ATS-friendly resumes.</p>
                </div>
                <button
                    onClick={handleCreate}
                    disabled={isLoading}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-colors flex items-center gap-2"
                >
                    <FiPlus className="text-xl" />
                    <span>New Resume</span>
                </button>
            </div>

            {isLoading && safeResumesList.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
            ) : safeResumesList.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
                    <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiFileText className="text-2xl" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No resumes yet</h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">Get started by creating your first ATS-friendly resume using our AI-powered builder.</p>
                    <button
                        onClick={handleCreate}
                        className="bg-white border text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        Create Your First Resume
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <div
                        onClick={handleCreate}
                        className="group bg-gradient-to-br from-primary-50 to-indigo-50 border border-primary-100/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md hover:border-primary-300 transition-all min-h-[280px]"
                    >
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-primary-600 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                            <FiPlus className="text-2xl" />
                        </div>
                        <h3 className="font-semibold text-primary-900">Create New</h3>
                        <p className="text-sm text-primary-600/80 mt-1">Start from scratch or template</p>
                    </div>

                    {safeResumesList.map((resume) => (
                        <div
                            key={resume._id || resume.id || Math.random()}
                            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group flex flex-col min-h-[280px] cursor-pointer"
                            onClick={() => resume._id && navigate(`/editor/${resume._id}`)}
                        >
                            <div className="h-40 bg-gray-50 border-b border-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
                                {/* Simulated preview placeholder */}
                                <div className="w-full h-full bg-white shadow-sm border border-gray-200 rounded p-3 flex flex-col gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                    <div className="w-1/3 h-2 bg-gray-300 rounded mb-1"></div>
                                    <div className="w-1/4 h-1.5 bg-gray-200 rounded mb-2"></div>
                                    <div className="w-full h-1 bg-gray-100 rounded"></div>
                                    <div className="w-full h-1 bg-gray-100 rounded"></div>
                                    <div className="w-5/6 h-1 bg-gray-100 rounded mb-2"></div>
                                    <div className="w-1/2 h-1.5 bg-gray-200 rounded mt-auto"></div>
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                    <span className="bg-white/90 backdrop-blur text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                        <FiEdit2 /> Edit Resume
                                    </span>
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between font-medium items-start mb-1">
                                    <h3 className="text-lg font-bold text-gray-900 truncate pr-2">{resume.title || 'Untitled Resume'}</h3>
                                </div>
                                <div className="text-sm text-gray-500 flex items-center gap-1.5 mb-4">
                                    <FiLayout className="text-gray-400" /> {resume.template || 'Modern'} Template
                                </div>

                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div className="text-xs text-gray-400 flex items-center gap-1">
                                        <FiClock /> {new Date(resume.updatedAt).toLocaleDateString()}
                                    </div>
                                    <button
                                        onClick={(e) => handleDelete(e, resume._id)}
                                        className="text-gray-400 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                                        title="Delete resume"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
