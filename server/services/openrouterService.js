import axios from 'axios';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const callOpenRouter = async (systemPrompt, userPrompt, model = 'stepfun/step-3.5-flash:free') => {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey || apiKey === 'your_openrouter_api_key_here' || apiKey.includes('placeholder')) {
            console.error('[OpenRouter] Missing or invalid API Key');
            throw new Error('AI API Key is not configured. Please add a valid OpenRouter API Key to your .env file.');
        }

        const response = await axios.post(
            OPENROUTER_API_URL,
            {
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': 'http://localhost:5173',
                    'X-Title': 'AI Resume Builder'
                }
            }
        );

        if (!response.data || !response.data.choices || !response.data.choices[0]) {
            console.error('[OpenRouter] Invalid response structure:', response.data);
            throw new Error('The AI service returned an empty or invalid response.');
        }

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('[OpenRouter Error]', {
            message: error.message,
            code: error.code,
            response: error.response?.data,
            status: error.response?.status
        });

        // Re-throw the error so agents can handle it appropriately
        throw error;
    }
};
