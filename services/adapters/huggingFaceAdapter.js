import logger from "../../config/logging.js";
import BaseAIAdapter from "./base.js";
import { InferenceClient } from "@huggingface/inference";

class HuggingFaceAdapter extends BaseAIAdapter {
    constructor(config) {
        super(config);
        this.validateConfig();

        this.clientSdk = new InferenceClient(config.apikey);
        this.defaultModel = config.model || 'deepseek-ai/DeepSeek-V4-Pro';
    }
    async generateText(prompt, options = {}) {
        const model = options.model || this.defaultModel;
        logger.debug('HuggingFace generate text called', {
            promptLength: prompt.length,
            model: model
        });
        const response = await this.clientSdk.chatCompletion({
            model: "meta-llama/Llama-3.1-8B-Instruct",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        });
        const text = response.choices[0].message;
        logger.debug('HuggingFace text generation complete', {
            textLength: text.length
        });
        return text;
    }

    async generateTextStream(prompt, onChunk, options = {}) {
        const model = options.model || this.defaultModel;
        logger.debug('HuggingFace text streaming started', {
            promptLength: prompt.length,
            model: model
        });
        const result = await this.clientSdk.chatCompletionStream({
            model: model,
            messages: [{
                role: "user",
                content: prompt
            }]
        });

        let totalChunks = 0;
        for await (const chunks of result) {
            const text = chunks.choices[0].delta.content;

            if (text) {
                onChunk(text);
                totalChunks++;
            }
        }
        logger.info('HuggingFace text streaming complete ', { totalChunks });
    }

    getCapabilities() {
        return {
            provider: 'HuggingFace',
            supportsStreaming: true,
            supportsVision: true,
            supportsFunctionCalling: true,
            maxTokens: 8192,
            models: ['deepseek-ai/DeepSeek-V4-Pro:novita', 'Qwen/Qwen3-0.6B:featherless-ai', "meta-llama/Llama-3.1-8B-Instruct:novita"]
        }
    }
}

export default HuggingFaceAdapter;