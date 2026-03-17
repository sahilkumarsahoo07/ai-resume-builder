import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FiPlus, FiTrash2, FiLink } from 'react-icons/fi';
import useResumeStore from '../../store/useResumeStore';

const PersonalInfoForm = () => {
    const { currentResume, updateResumeData } = useResumeStore();
    const personalInfo = currentResume?.personalInfo || {};

    const { register, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            name: personalInfo.name || '',
            email: personalInfo.email || '',
            phone: personalInfo.phone || '',
            location: personalInfo.location || '',
            linkedin: personalInfo.linkedin || '',
            portfolio: personalInfo.portfolio || '',
            links: personalInfo.links || []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'links'
    });

    // Helper to update store on blur
    const handleBlur = () => {
        const values = getValues();
        updateResumeData('personalInfo', values);
    };

    // Handle link removal with immediate store update
    const handleRemoveLink = (index) => {
        remove(index);
        // Important: use timeout or getValues after remove to ensure state is updated
        setTimeout(handleBlur, 0);
    };

    // Sync form with store if changed from outside
    useEffect(() => {
        if (currentResume?.personalInfo) {
            Object.entries(currentResume.personalInfo).forEach(([key, value]) => {
                setValue(key, value, { shouldValidate: false, shouldDirty: false });
            });
        }
    }, [currentResume?.id, setValue]);

    return (
        <div className="space-y-8 animate-fadeIn">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                <p className="text-sm text-gray-500 mt-1">Include your key contact details so recruiters can reach you.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        {...register('name', { onBlur: handleBlur })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none"
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                        {...register('email', { onBlur: handleBlur })}
                        type="email"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none"
                        placeholder="john@example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                        {...register('phone', { onBlur: handleBlur })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none"
                        placeholder="+1 (555) 000-0000"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                        {...register('location', { onBlur: handleBlur })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none"
                        placeholder="San Francisco, CA"
                    />
                </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-gray-900">
                        <FiLink className="text-primary-500" />
                        <h3 className="font-bold text-lg">Social & Project Links</h3>
                    </div>
                    <button
                        type="button"
                        onClick={() => append({ label: '', url: '' })}
                        className="flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors border border-primary-200"
                    >
                        <FiPlus /> Add New Link
                    </button>
                </div>

                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-3 items-start bg-gray-50 p-4 rounded-xl border border-gray-200 group">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Label</label>
                                    <input
                                        {...register(`links.${index}.label`, { onBlur: handleBlur })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="LinkedIn, GitHub, etc."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">URL</label>
                                    <input
                                        {...register(`links.${index}.url`, { onBlur: handleBlur })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="linkedin.com/in/username"
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveLink(index)}
                                className="mt-6 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                title="Remove Link"
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    ))}

                    {fields.length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                            No custom links added yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PersonalInfoForm;
