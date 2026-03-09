import Resume from '../models/Resume.js';
import { v4 as uuidv4 } from 'uuid';

// In-memory store for development fallback
let mockResumes = [];

const isDbConnected = () => {
    const mongoose = import('mongoose');
    // Simplified check: we'll use a safer approach in the exports
};

// Get all resumes for user
export const getResumes = async (req, res) => {
    try {
        // Use mock data if DB is disconnected (bufferCommands is often false in my setup)
        const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });
        res.status(200).json({ success: true, data: resumes });
    } catch (error) {
        console.log('Using Mock Resumes fallback');
        const userResumes = mockResumes.filter(r => r.userId === String(req.user._id));
        res.status(200).json({ success: true, data: userResumes });
    }
};

// Get single resume
export const getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
        if (!resume) {
            // Check mock store
            const mockResume = mockResumes.find(r => r._id === req.params.id && r.userId === String(req.user._id));
            if (mockResume) return res.status(200).json({ success: true, data: mockResume });

            return res.status(404).json({ success: false, message: 'Resume not found' });
        }
        res.status(200).json({ success: true, data: resume });
    } catch (error) {
        const mockResume = mockResumes.find(r => r._id === req.params.id && r.userId === String(req.user._id));
        if (mockResume) return res.status(200).json({ success: true, data: mockResume });
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create new resume
export const createResume = async (req, res) => {
    try {
        const newResume = await Resume.create({
            userId: req.user._id,
            ...req.body
        });
        res.status(201).json({ success: true, data: newResume });
    } catch (error) {
        console.log('Creating Mock Resume');
        const mockNewResume = {
            _id: uuidv4(),
            userId: String(req.user._id),
            ...req.body,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        mockResumes.push(mockNewResume);
        res.status(201).json({ success: true, data: mockNewResume });
    }
};

// Update resume
export const updateResume = async (req, res) => {
    try {
        const resume = await Resume.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!resume) {
            // Try mock store
            const index = mockResumes.findIndex(r => r._id === req.params.id && r.userId === String(req.user._id));
            if (index !== -1) {
                mockResumes[index] = { ...mockResumes[index], ...req.body, updatedAt: new Date() };
                return res.status(200).json({ success: true, data: mockResumes[index] });
            }
            return res.status(404).json({ success: false, message: 'Resume not found' });
        }

        res.status(200).json({ success: true, data: resume });
    } catch (error) {
        const index = mockResumes.findIndex(r => r._id === req.params.id && r.userId === String(req.user._id));
        if (index !== -1) {
            mockResumes[index] = { ...mockResumes[index], ...req.body, updatedAt: new Date() };
            return res.status(200).json({ success: true, data: mockResumes[index] });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete resume
export const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

        if (!resume) {
            const initialLength = mockResumes.length;
            mockResumes = mockResumes.filter(r => !(r._id === req.params.id && r.userId === String(req.user._id)));

            if (mockResumes.length < initialLength) {
                return res.status(200).json({ success: true, data: {} });
            }
            return res.status(404).json({ success: false, message: 'Resume not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        mockResumes = mockResumes.filter(r => !(r._id === req.params.id && r.userId === String(req.user._id)));
        res.status(200).json({ success: true, data: {} });
    }
};
