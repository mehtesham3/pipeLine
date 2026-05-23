import logger from "../config/logging.js";
import normalizeVendorError from "../utils/errorNormalizer.js";
import GeminiAdapter from "./adapters/googleAdapter.js";
import GroqAdapter from "./adapters/groqAdapter.js";
import HuggingFaceAdapter from "./adapters/huggingFaceAdapter.js";
import NvidiaAdapter from "./adapters/nvidiaAdapter.js";

class AIService {
    constructor(config) {
        this.provider = config.provider.toLowerCase();
        this.adapter = this.initializeAdapter(this.provider, config);
        logger.info('AIService initialized', {
            provider: this.provider,
            capabilities: this.adapter.getCapabilities()
        });
    }

    initializeAdapter(provider = this.provider, config) {
        switch (provider) {
            case 'nvidia':
                return new NvidiaAdapter(config);
            case 'google':
                return new GeminiAdapter(config);
            case 'groq':
                return new GroqAdapter(config);
            case 'huggingface':
                return new HuggingFaceAdapter(config);
            default:
                logger.error('Unknow AI provider', { provider: provider })
                throw new Error(`Unknow AI provider: ${provider}. Supported groq, google,nvidia,huggingface`);
        }
    }

    /**
     * Generate text using the selected AI provider
     * @param {string} prompt - The text prompt to send to the AI model
     * @param {Object} options - Additional generation options
     * @returns {Promise<string>} - The generated text from the AI model
     */
    async generateText(prompt, options = {}) {
        try {
            return await this.adapter.generateText(prompt, options);
        }
        catch (error) {
            logger.error('Error generating text', { error: error, provider: this.provider });
            throw normalizeVendorError(error, this.provider);
        }
    }

    /**
     * Generate text with streaming     
     * @param {string} prompt 
     * @param {Function} onChunk 
     * @param {Object} options 
     * @returns {Promise<void>}
     */
    async generateTextStream(prompt, onChunk, options = {}) {
        try {
            const capabilities = this.adapter.getCapabilities();
            if (!capabilities.supportsStreaming) {
                logger.error('Streamming is not supported by this provider', { provider: this.provider });
                throw new Error(`Streamming is not supported by ${this.provider}`);
            }

            return await this.adapter.generateTextStream(prompt, onChunk, options);
        }
        catch (error) {
            logger.error('Error generating text stream', { error: error, provider: this.provider });
            throw normalizeVendorError(error, this.provider);
        }
    }

    getInfo() {
        return {
            provider: this.provider,
            ...this.adapter.getCapabilities()
        }

    }
}

export default AIService;