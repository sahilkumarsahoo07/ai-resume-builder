import { enhanceResumeSection } from '../agents/resumeEnhancerAgent.js';
import { generateAtsScore } from '../agents/atsScoreAgent.js';
import { generateJobMatch } from '../agents/jobMatchAgent.js';
import { extractKeywords } from '../agents/keywordExtractorAgent.js';
import { tailorResume } from '../agents/tailorResumeAgent.js';

export const enhanceContent = async (req, res) => {
    try {
        const { sectionType, content, model, customPrompt } = req.body;
        const enhancedText = await enhanceResumeSection(sectionType, content, model, customPrompt);
        res.status(200).json({ success: true, data: enhancedText });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAtsScore = async (req, res) => {
    try {
        const { resumeData, model } = req.body;
        const result = await generateAtsScore(resumeData, model);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getJobMatch = async (req, res) => {
    try {
        const { resumeData, jobDescription, model } = req.body;
        const result = await generateJobMatch(resumeData, jobDescription, model);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getKeywords = async (req, res) => {
    try {
        const { text, model } = req.body;
        const result = await extractKeywords(text, model);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getTailoredResume = async (req, res) => {
    try {
        const { resumeData, jobDescription, model } = req.body;
        const result = await tailorResume(resumeData, jobDescription, model);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
