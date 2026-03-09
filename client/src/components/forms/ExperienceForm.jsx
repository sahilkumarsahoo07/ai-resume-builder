import React, { useState } from 'react';
import useResumeStore from '../../store/useResumeStore';
import AISuggestionsModal from '../resume/AISuggestionsModal';
import { v4 as uuidv4 } from 'uuid';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiPlus, FiTrash2, FiMenu, FiCommand } from 'react-icons/fi';

const SortableItem = ({ id, experience, onChange, onDelete, onEnhance }) => {
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
                            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Role</label>
                            <input value={experience.role} onChange={(e) => onChange(id, 'role', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 outline-none" placeholder="Software Engineer" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Company</label>
                            <input value={experience.company} onChange={(e) => onChange(id, 'company', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 outline-none" placeholder="Google" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Duration</label>
                            <input value={experience.duration} onChange={(e) => onChange(id, 'duration', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 outline-none" placeholder="Jan 2020 - Present" />
                        </div>
                    </div>

                    <button onClick={() => onDelete(id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <FiTrash2 size={18} />
                    </button>
                </div>

                <div>
                    <div className="flex justify-between items-end mb-1">
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</label>
                        <button onClick={() => onEnhance(id, experience.description)} disabled={!experience.description} className="text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1 disabled:opacity-50">
                            <FiCommand /> AI Enhance
                        </button>
                    </div>
                    <textarea
                        value={experience.description}
                        onChange={(e) => onChange(id, 'description', e.target.value)}
                        rows={4}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 outline-none resize-none leading-relaxed"
                        placeholder="Developed and maintained web applications..."
                    ></textarea>
                </div>
            </div>
        </div>
    );
};

const ExperienceForm = () => {
    const { currentResume, updateResumeData, saveResume } = useResumeStore();
    const rawExperience = currentResume?.experience || [];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExpId, setSelectedExpId] = useState(null);
    const [selectedDescription, setSelectedDescription] = useState('');

    // Ensure all items have a unique ID for DnD
    const experiences = rawExperience.map(exp => ({ ...exp, id: exp.id || uuidv4() }));

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = experiences.findIndex((item) => item.id === active.id);
            const newIndex = experiences.findIndex((item) => item.id === over.id);
            const newArray = arrayMove(experiences, oldIndex, newIndex);
            updateResumeData('experience', newArray);
        }
    };

    const handleUpdate = (id, field, value) => {
        const newArray = experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp);
        updateResumeData('experience', newArray);
    };

    const handleDelete = (id) => {
        const newArray = experiences.filter(exp => exp.id !== id);
        updateResumeData('experience', newArray);
    };

    const handleAdd = () => {
        const newExp = { id: uuidv4(), company: '', role: '', duration: '', description: '' };
        updateResumeData('experience', [...experiences, newExp]);
    };

    const handleEnhance = (id, text) => {
        if (!text.trim()) return;
        setSelectedExpId(id);
        setSelectedDescription(text);
        setIsModalOpen(true);
    };

    const handleSelectSuggestion = (text) => {
        handleUpdate(selectedExpId, 'description', text);
        saveResume();
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Work Experience</h2>
                    <p className="text-sm text-gray-500 mt-1">Add your professional experience. Drag to reorder.</p>
                </div>
                <button onClick={handleAdd} className="flex items-center gap-2 bg-primary-50 text-primary-700 hover:bg-primary-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <FiPlus /> Add Role
                </button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={experiences.map(e => e.id)} strategy={verticalListSortingStrategy}>
                    {experiences.map((exp) => (
                        <SortableItem key={exp.id} id={exp.id} experience={exp} onChange={handleUpdate} onDelete={handleDelete} onEnhance={handleEnhance} />
                    ))}
                </SortableContext>
            </DndContext>

            {experiences.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl text-gray-500">
                    No experience added yet. Click "Add Role" to start.
                </div>
            )}

            <AISuggestionsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                sectionType="experience"
                currentContent={selectedDescription}
                onSelect={handleSelectSuggestion}
            />
        </div>
    );
};

export default ExperienceForm;
