import React, { useEffect, useState } from 'react';
import useResumeStore from '../store/useResumeStore';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiFileText, FiClock, FiLayout, FiFilter, FiSearch } from 'react-icons/fi';
import DeleteModal from '../components/common/DeleteModal';

const Resumes = () => {
    const { resumesList, fetchResumes, createResume, deleteResume, isLoading } = useResumeStore();
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [resumeToDelete, setResumeToDelete] = useState(null);

    useEffect(() => {
        console.log('[Resumes] Component mounted, fetching resumes...');
        fetchResumes();
    }, [fetchResumes]);

    // Debug logging
    useEffect(() => {
        console.log('[Resumes] State updated:', { isLoading, resumesCount: resumesList?.length, resumesList });
    }, [isLoading, resumesList]);

    const handleCreate = async () => {
        const newResume = await createResume();
        if (newResume && newResume._id) {
            navigate(`/editor/${newResume._id}`);
        }
    };

    const handleDeleteClick = (e, id) => {
        e.stopPropagation();
        setResumeToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (resumeToDelete) {
            await deleteResume(resumeToDelete);
            setIsDeleteModalOpen(false);
            setResumeToDelete(null);
        }
    };

    // Ensure resumesList is always an array
    const safeResumesList = Array.isArray(resumesList) ? resumesList : [];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">All Resumes</h1>
                    <p className="text-gray-500 mt-1">Manage and organize all your resumes in one place.</p>
                </div>
                <button
                    onClick={handleCreate}
                    disabled={isLoading}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-colors flex items-center gap-2 w-fit"
                >
                    <FiPlus className="text-xl" />
                    <span>Create New Resume</span>
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                        placeholder="Search resumes..."
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors w-fit">
                    <FiFilter className="text-gray-400" />
                    Filter
                </button>
            </div>

            {/* Resume Grid */}
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
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        Create Your First Resume
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {safeResumesList.map((resume) => (
                        <div
                            key={resume._id || resume.id || Math.random()}
                            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group flex flex-col min-h-[280px] cursor-pointer"
                            onClick={() => resume._id && navigate(`/editor/${resume._id}`)}
                        >
                            <div className="h-40 bg-gray-50 border-b border-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
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
                                        <FiEdit2 /> Edit
                                    </span>
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900 truncate mb-1">{resume.title || 'Untitled Resume'}</h3>
                                <div className="text-sm text-gray-500 flex items-center gap-1.5 mb-4">
                                    <FiLayout className="text-gray-400" /> {resume.template || 'Modern'} Template
                                </div>

                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div className="text-xs text-gray-400 flex items-center gap-1">
                                        <FiClock /> {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : 'Recently'}
                                    </div>
                                    <button
                                        onClick={(e) => resume._id && handleDeleteClick(e, resume._id)}
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

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={isLoading}
                title="Delete Resume?"
                message="Are you sure you want to delete this resume? This action cannot be undone and you will lose all saved progress."
            />
        </div>
    );
};

export default Resumes;
