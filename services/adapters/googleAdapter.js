import { GoogleGenAI } from "@google/genai";
import BaseAIAdapter from "./base.js";
import logger from "../../config/logging.js";

class GeminiAdapter extends BaseAIAdapter {
    constructor(config) {
        super(config);
        this.validateConfig();
        this.clientSdk = new GoogleGenAI({ apiKey: this.config.apiKey });
        this.defaultModel = config.model || "gemini-2.5-flash";
    }

    async generateText(prompt, options = {}) {
        const model = options.model || this.defaultModel;
        logger.debug('Gemini generateText called', {
            promptLength: prompt.length,
            model: model
        });
        const response = await this.clientSdk.models.generateContent({
            model: model,
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                temperature: options.temperature || 0.7
            }
        });

        const text = response.text;
        logger.debug('Gemini response details', {
            model: model,
            textLength: text.length
        })
        return text;
    }

    async generateTextStream(prompt, onChunk, options = {}) {
        const model = options.model || this.defaultModel;
        logger.debug('Gemini generateTextStream called', {
            promptLength: prompt.length,
            model: model
        });
        const result = await this.clientSdk.models.generateContentStream({
            model: model,
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                temperature: options.temperature || 0.7
            }
        });

        if (!result) {
            throw new Error("Gemini stream initialization failed: No response from SDK.");
        }

        let totalChunks = 0;
        for await (const chunks of result) {
            const text = chunks.text;
            if (text) {
                onChunk(text);
                totalChunks++;
            }
        }
        logger.info('Gemini streaming complete', { totalChunks });
    }

    getCapabilities() {
        return {
            provider: 'Google',
            supportsStreaming: true,
            supportsVision: true,
            supportsFunctionCalling: false,
            maxTokens: 2048,
            models: ['gemini-2.5-pro', 'gemini-2.5-flash']
        }
    }
}

export default GeminiAdapter;