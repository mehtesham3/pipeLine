import "dotenv/config";

const timeout = process.env.AI_TIMEOUT || 30000;
const maxRetries = process.env.AI_RETRIES || 3;

const aiConfig = {
    defaultProviders: process.env.AI_PROVIDER || "google",
    nvidia: {
        apiKey: process.env.NVIDIA_KEY,
        model: process.env.NVIDIA_MODEL || "nvidia/nemotron-mini-4b-instruct",
        timeout,
        maxRetries
    },
    google: {
        apiKey: process.env.DEFAULT_API_KEY,
        model: process.env.DEAULT_MODEL || "gemini-3.5-flash",
        timeout,
        maxRetries
    },
    groq: {
        apiKey: process.env.GROQ_KEY,
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        timeout,
        maxRetries
    },
    huggingface: {
        apiKey: process.env.HFACE_KEY,
        model: process.env.HFACE_MODEL || "meta-llama/Llama-3.1-8B-Instruct",
        timeout,
        maxRetries
    }
}

export default aiConfig;