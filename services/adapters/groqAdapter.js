import Groq from "groq-sdk";
import BaseAIAdapter from "./base.js";
import logger from "../../config/logging.js";

class GroqAdapter extends BaseAIAdapter {
    constructor(config) {
        super(config);
        this.validateConfig();

        this.clientGroq = new Groq({ apiKey: config.apiKey });
        this.defaultModel = config.model || 'llama-3.3-70b-versatile';
    }

    async generateText(prompt, options = {}) {
        const model = options.model || this.defaultModel;
        logger.debug('Groq generateText called', {
            promptLength: prompt.length,
            model: model
        });
        const response = await this.clientGroq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: model
        });

        const text = response.choices[0]?.message?.content || "";
        logger.debug('Groq response details', {
            model: model,
            textLength: text.length
        });
        return text;
    }

    async generateTextStream(prompt, onChunk, options = {}) {
        const model = options.model || this.defaultModel;
        logger.debug('Groq generateTextStream called', {
            promptLength: prompt.length,
            model: model
        });

        const result = await this.clientGroq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: model,
            max_completion_tokens: 3096,
            stop: null,
            stream: true,
        })

        let totalChunks = 0;
        for await (const chunk of result) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
                onChunk(content);
                totalChunks++;
            }
        }
        logger.log('\nGroq streaming complete ', { totalChunks });
    }
    getCapabilities() {
        return {
            provider: 'Groq',
            supportsStreaming: true,
            supportsVision: true,
            supportsFunctionCalling: true,
            maxTokens: 8192,
            models: ['llama-3.3-70b-versatile', 'openai/gpt-oss-20b ']
        }
    }
}

export default GroqAdapter;