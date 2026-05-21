import "dotenv/config";

const apiKey = process.env.API_KEY;
const model = process.env.AI_MODEL;
const timeout = process.env.AI_TIMEOUT || 30000;
const maxRetries = process.env.AI_RETRIES || 3;

const aiConfig = {
    defaultProviders: process.env.AI_PROVIDER || "google",
    nvidia: {
        apiKey,
        model: model || "nvidia/nemotron-mini-4b-instruct",
        timeout,
        maxRetries
    },
    google: {
        apiKey: apiKey || process.env.DEFAULT_API_KEY,
        model: model || "gemini-3-flash-preview",
        timeout,
        maxRetries
    },
    groq: {
        apiKey,
        model: model || "llama-3.3-70b-versatile",
        timeout,
        maxRetries
    },
    huggingface: {
        apiKey,
        model: model || "",
        timeout,
        maxRetries
    }
}

export default aiConfig;