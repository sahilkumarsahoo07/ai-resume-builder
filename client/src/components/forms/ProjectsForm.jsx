import React from 'react';
import useResumeStore from '../../store/useResumeStore';
import { v4 as uuidv4 } from 'uuid';
import { FiPlus, FiTrash2, FiMenu, FiCommand } from 'react-icons/fi';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useAiStore from '../../store/useAiStore';
import api from '../../services/api';

const SortableItem = ({ id, project, onChange, onDelete, onEnhance }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className={`bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4 relative ${isDragging ? 'shadow-xl ring-2 ring-primary-500 opacity-90' : ''}`}>
            <div
                className="absolute top-5 left-3 text-gray-400 hover:text-gray-700 cursor-grab active:cursor-grabbing p-1"
                {...attributes}
                {...listeners}
            >
                <FiMenu size={20} />
            </div>

            <div className="pl-8 flex flex-col gap-4">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Project Name</label>
                            <input value={project.name} onChange={(e) => onChange(id, 'name', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 outline-none" placeholder="E-commerce Platform" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Tech Stack</label>
                            <input value={project.techStack} onChange={(e) => onChange(id, 'techStack', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 outline-none" placeholder="React, Node.js, MongoDB" />
                        </div>
                    </div>

                    <button onClick={() => onDelete(id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <FiTrash2 size={18} />
                    </button>
                </div>

                <div>
                    <div className="flex justify-between items-end mb-1">
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</label>
                        <button onClick={() => onEnhance(id, project.description)} disabled={!project.description} className="text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1 disabled:opacity-50">
                            <FiCommand /> AI Enhance
                        </button>
                    </div>
                    <textarea
                        value={project.description}
                        onChange={(e) => onChange(id, 'description', e.target.value)}
                        rows={3}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 outline-none resize-none leading-relaxed"
                        placeholder="Built a full-stack e-commerce platform handling 10k+ daily users..."
                    ></textarea>
                </div>
            </div>
        </div>
    );
};

const ProjectsForm = () => {
    const { currentResume, updateResumeData } = useResumeStore();
    const { selectedModel } = useAiStore();
    const rawProjects = currentResume?.projects || [];
    const projects = rawProjects.map(proj => ({ ...proj, id: proj.id || uuidv4() }));

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = projects.findIndex((item) => item.id === active.id);
            const newIndex = projects.findIndex((item) => item.id === over.id);
            updateResumeData('projects', arrayMove(projects, oldIndex, newIndex));
        }
    };

    const handleUpdate = (id, field, value) => {
        updateResumeData('projects', projects.map(proj => proj.id === id ? { ...proj, [field]: value } : proj));
    };

    const handleDelete = (id) => {
        updateResumeData('projects', projects.filter(proj => proj.id !== id));
    };

    const handleAdd = () => {
        updateResumeData('projects', [...projects, { id: uuidv4(), name: '', description: '', techStack: '' }]);
    };

    const handleEnhance = async (id, text) => {
        if (!text.trim()) return;
        try {
            const { data } = await api.post('/ai/enhance', { sectionType: 'Project Description', content: text, model: selectedModel.model });
            if (data.success && data.data) {
                handleUpdate(id, 'description', data.data);
            }
        } catch (error) {
            console.error('Failed to enhance project:', error);
            alert('AI Enhancement failed.');
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Projects</h2>
                    <p className="text-sm text-gray-500 mt-1">Showcase your best work. Drag to reorder.</p>
                </div>
                <button onClick={handleAdd} className="flex items-center gap-2 bg-primary-50 text-primary-700 hover:bg-primary-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <FiPlus /> Add Project
                </button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={projects.map(e => e.id)} strategy={verticalListSortingStrategy}>
                    {projects.map((proj) => (
                        <SortableItem key={proj.id} id={proj.id} project={proj} onChange={handleUpdate} onDelete={handleDelete} onEnhance={handleEnhance} />
                    ))}
                </SortableContext>
            </DndContext>

            {projects.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl text-gray-500">
                    No projects added yet. Click "Add Project" to start.
                </div>
            )}
        </div>
    );
};

export default ProjectsForm;
