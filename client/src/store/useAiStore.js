import { create } from 'zustand';

export const AI_MODELS = [
    {
        name: "GPT-OSS-20B",
        icon: "https://www.google.com/s2/favicons?domain=openai.com&sz=128",
        model: "openai/gpt-oss-20b:free",
        description: "OpenAI's general purpose model"
    },
    {
        name: "Solar Pro",
        icon: "https://www.google.com/s2/favicons?domain=upstage.ai&sz=128",
        model: "upstage/solar-pro-3:free",
        description: "Upstage's specialized model"
    },
    {
        name: "Trinity Large",
        icon: "https://www.google.com/s2/favicons?domain=arcee.ai&sz=128",
        model: "arcee-ai/trinity-large-preview:free",
        description: "Arcee's enterprise model"
    },
    {
        name: "NVIDIA Nemotron",
        icon: "https://www.google.com/s2/favicons?domain=nvidia.com&sz=128",
        model: "nvidia/nemotron-3-nano-30b-a3b:free",
        description: "NVIDIA's optimized model"
    },
    {
        name: "Step 3.5 Flash",
        icon: "https://www.google.com/s2/favicons?domain=stepfun.com&sz=128",
        model: "stepfun/step-3.5-flash:free",
        description: "Stepfun's fast model"
    },
    {
        name: "DeepSeek Chimera",
        icon: "https://www.google.com/s2/favicons?domain=tngtech.com&sz=128",
        model: "tngtech/deepseek-r1t-chimera:free",
        description: "DeepSeek reasoning model",
        hasReasoning: true
    }
];

const useAiStore = create((set) => ({
    selectedModel: AI_MODELS[0],
    setSelectedModel: (model) => set({ selectedModel: model }),
}));

export default useAiStore;
