import React from 'react';
import useResumeStore from '../../store/useResumeStore';
import { v4 as uuidv4 } from 'uuid';
import { FiPlus, FiTrash2, FiMenu } from 'react-icons/fi';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ id, education, onChange, onDelete }) => {
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

            <div className="pl-8 flex justify-between items-start gap-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Institution</label>
                        <input value={education.institution} onChange={(e) => onChange(id, 'institution', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 outline-none" placeholder="University Name" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Degree</label>
                        <input value={education.degree} onChange={(e) => onChange(id, 'degree', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 outline-none" placeholder="B.S. Computer Science" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Year / Duration</label>
                        <input value={education.year} onChange={(e) => onChange(id, 'year', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 outline-none" placeholder="2018 - 2022" />
                    </div>
                </div>

                <button onClick={() => onDelete(id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <FiTrash2 size={18} />
                </button>
            </div>
        </div>
    );
};

const EducationForm = () => {
    const { currentResume, updateResumeData } = useResumeStore();
    const rawEducation = currentResume?.education || [];
    const educations = rawEducation.map(ed => ({ ...ed, id: ed.id || uuidv4() }));

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = educations.findIndex((item) => item.id === active.id);
            const newIndex = educations.findIndex((item) => item.id === over.id);
            updateResumeData('education', arrayMove(educations, oldIndex, newIndex));
        }
    };

    const handleUpdate = (id, field, value) => {
        updateResumeData('education', educations.map(ed => ed.id === id ? { ...ed, [field]: value } : ed));
    };

    const handleDelete = (id) => {
        updateResumeData('education', educations.filter(ed => ed.id !== id));
    };

    const handleAdd = () => {
        updateResumeData('education', [...educations, { id: uuidv4(), institution: '', degree: '', year: '' }]);
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Education</h2>
                    <p className="text-sm text-gray-500 mt-1">Add your academic background. Drag to reorder.</p>
                </div>
                <button onClick={handleAdd} className="flex items-center gap-2 bg-primary-50 text-primary-700 hover:bg-primary-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <FiPlus /> Add Education
                </button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={educations.map(e => e.id)} strategy={verticalListSortingStrategy}>
                    {educations.map((ed) => (
                        <SortableItem key={ed.id} id={ed.id} education={ed} onChange={handleUpdate} onDelete={handleDelete} />
                    ))}
                </SortableContext>
            </DndContext>

            {educations.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl text-gray-500">
                    No education added yet. Click "Add Education" to start.
                </div>
            )}
        </div>
    );
};

export default EducationForm;
