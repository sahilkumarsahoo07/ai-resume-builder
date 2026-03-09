import { callOpenRouter } from '../services/openrouterService.js';

export const tailorResume = async (resumeData, jobDescription, model) => {
    const systemPrompt = `You are an expert ATS (Applicant Tracking System) Specialist and Professional Resume Writer.

Your task is to rewrite a user's resume summary and work experience descriptions to perfectly align with a specific Job Description (JD).

GOALS:
1. Maximize ATS compatibility for the specific JD.
2. Maintain 100% factual accuracy (do not invent experience).
3. Use strong action verbs and quantifiable metrics where possible.
4. Integrate missing high-priority keywords naturally into the summary and bullet points.

OUTPUT:
You must return ONLY a JSON object with the following structure:
{
  "tailoredSummary": "The rewritten professional summary...",
  "tailoredExperience": [
    {
      "id": "original_id_or_index",
      "description": "The rewritten experience description with bullet points..."
    }
  ]
}

RULES:
- Handle each experience entry separately.
- Preserve the "id" or index if provided in the input.
- Do NOT include any explanations, markdown headers, or chat text. 
- Return ONLY valid JSON.`;

    const userPrompt = `JOB DESCRIPTION:
${jobDescription}

ORIGINAL RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

Please tailor the summary and experience descriptions for this specific job.`;

    const response = await callOpenRouter(systemPrompt, userPrompt, model);

    try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return JSON.parse(response);
    } catch (error) {
        console.error('Failed to parse Tailor Resume JSON:', response);
        throw new Error('Failed to tailor resume: AI response was not valid JSON.');
    }
};
