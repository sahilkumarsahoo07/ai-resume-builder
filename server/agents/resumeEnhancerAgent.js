import { callOpenRouter } from '../services/openrouterService.js';

export const enhanceResumeSection = async (sectionType, content, model, customPrompt = null) => {
    const defaultSystemPrompt = `You are an expert ATS Resume Optimizer and Career Coach.

Your task is to generate 5 variations of the provided ${sectionType} content that will achieve 100% ATS compatibility score.

Each variation must:
- Use strong action verbs (Built, Developed, Implemented, Led, Created, Optimized, Designed)
- Include relevant industry keywords for ATS parsing
- Be concise, professional, and ATS-readable
- Quantify achievements with metrics where possible
- Follow standard ATS parsing structure
- Be optimized for 100/100 ATS Score

You MUST return ONLY a JSON array in this exact format:
[
  {"text": "Enhanced content variation 1", "atsScore": 100, "keywords": ["keyword1", "keyword2", "keyword3"]},
  {"text": "Enhanced content variation 2", "atsScore": 100, "keywords": ["keyword4", "keyword5", "keyword6"]},
  {"text": "Enhanced content variation 3", "atsScore": 100, "keywords": ["keyword7", "keyword8", "keyword9"]},
  {"text": "Enhanced content variation 4", "atsScore": 100, "keywords": ["keyword10", "keyword11", "keyword12"]},
  {"text": "Enhanced content variation 5", "atsScore": 100, "keywords": ["keyword13", "keyword14", "keyword15"]}
]

Do NOT include any conversational text, explanations, or markdown. Return ONLY the JSON array.`;

    const systemPrompt = customPrompt || defaultSystemPrompt;

    const userPrompt = `Please enhance the following ${sectionType}:
${content}`;

    return await callOpenRouter(systemPrompt, userPrompt, model);
};
