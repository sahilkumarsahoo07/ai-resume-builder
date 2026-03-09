import { create } from 'zustand';
import api from '../services/api';

const initialResumeData = {
    title: 'Untitled Resume',
    template: 'Modern',
    personalInfo: {
        name: '', email: '', phone: '', location: '', linkedin: '', portfolio: '', links: []
    },
    summary: '',
    experience: [],
    education: [],
    projects: [],
    skills: []
};

const useResumeStore = create((set, get) => ({
    currentResume: null,
    resumesList: [],
    isLoading: false,

    // Fetch all resumes
    fetchResumes: async () => {
        set({ isLoading: true });
        try {
            const { data } = await api.get('/resumes');
            // Handle different response formats
            const resumes = data.data || data.resumes || data || [];
            set({ resumesList: resumes, isLoading: false });
        } catch (error) {
            set({ isLoading: false, resumesList: [] });
            console.error('Failed to fetch resumes:', error);
        }
    },

    // Fetch single resume
    fetchResumeById: async (id) => {
        set({ isLoading: true });
        try {
            const { data } = await api.get(`/resumes/${id}`);
            set({ currentResume: data.data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            console.error('Failed to fetch resume:', error);
        }
    },

    // Create new resume
    createResume: async () => {
        set({ isLoading: true });
        try {
            const { data } = await api.post('/resumes', initialResumeData);
            set((state) => ({
                resumesList: [data.data, ...state.resumesList],
                isLoading: false
            }));
            return data.data;
        } catch (error) {
            set({ isLoading: false });
            console.error('Failed to create resume:', error);
        }
    },

    // Update resume data locally (for fast preview updates)
    updateResumeData: (section, data) => {
        set((state) => {
            if (!state.currentResume) return state;

            const newResume = { ...state.currentResume };
            // If it's a top level property or nested property
            if (['personalInfo'].includes(section)) {
                // Check if qualitative change happened
                if (JSON.stringify(newResume[section]) === JSON.stringify({ ...newResume[section], ...data })) {
                    return state;
                }
                newResume[section] = { ...newResume[section], ...data };
            } else if (['experience', 'education', 'projects'].includes(section)) {
                if (JSON.stringify(newResume[section]) === JSON.stringify(data)) {
                    return state;
                }
                newResume[section] = data; // Array replacement for DnD
            } else {
                if (newResume[section] === data) return state;
                newResume[section] = data;
            }

            return { currentResume: newResume };
        });
    },

    // Save resume to backend (called by debouncer)
    saveResume: async () => {
        const { currentResume } = get();
        if (!currentResume || !currentResume._id) return;

        try {
            await api.put(`/resumes/${currentResume._id}`, currentResume);
        } catch (error) {
            console.error('Failed to save resume:', error);
        }
    },

    // Delete resume
    deleteResume: async (id) => {
        try {
            await api.delete(`/resumes/${id}`);
            set((state) => ({
                resumesList: state.resumesList.filter(r => r._id !== id)
            }));
        } catch (error) {
            console.error('Failed to delete resume:', error);
        }
    }
}));

export default useResumeStore;
