import Resume from '../models/Resume.js';
import { v4 as uuidv4 } from 'uuid';

// Get all resumes for user
export const getResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });
        res.status(200).json({ success: true, data: resumes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single resume
export const getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
        if (!resume) {
            return res.status(404).json({ success: false, message: 'Resume not found' });
        }
        res.status(200).json({ success: true, data: resume });
    } catch (error) {
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
        res.status(500).json({ success: false, message: error.message });
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
            return res.status(404).json({ success: false, message: 'Resume not found' });
        }

        res.status(200).json({ success: true, data: resume });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete resume
export const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

        if (!resume) {
            return res.status(404).json({ success: false, message: 'Resume not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
