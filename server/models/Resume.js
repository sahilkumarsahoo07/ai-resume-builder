import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'Untitled Resume' },
    template: { type: String, default: 'Modern' },
    personalInfo: {
        name: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        location: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        portfolio: { type: String, default: '' },
        links: [{
            label: { type: String, default: '' },
            url: { type: String, default: '' }
        }]
    },
    summary: { type: String, default: '' },
    experience: [{
        id: { type: String, required: true },
        company: { type: String, default: '' },
        role: { type: String, default: '' },
        duration: { type: String, default: '' },
        description: { type: String, default: '' }
    }],
    education: [{
        id: { type: String, required: true },
        institution: { type: String, default: '' },
        degree: { type: String, default: '' },
        year: { type: String, default: '' }
    }],
    projects: [{
        id: { type: String, required: true },
        name: { type: String, default: '' },
        description: { type: String, default: '' },
        techStack: { type: String, default: '' }
    }],
    skills: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Resume', ResumeSchema);
