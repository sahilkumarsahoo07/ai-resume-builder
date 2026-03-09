import { callOpenRouter } from '../services/openrouterService.js';

export const extractKeywords = async (text, model) => {
    const systemPrompt = `You are an expert in Talent Acquisition and NLP keyword extraction.
Extract the most important skills, tools, and keywords from the text.

You MUST respond ONLY with a valid JSON array of strings:
["Keyword1", "Keyword2", "Keyword3"]`;

    const userPrompt = `Extract keywords from the following text:
${text}`;

    const response = await callOpenRouter(systemPrompt, userPrompt, model);

    try {
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return JSON.parse(response);
    } catch (error) {
        console.error('Failed to parse Keywords JSON:', response);
        return [];
    }
};
