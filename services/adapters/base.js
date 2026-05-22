class BaseAIAdapter {
    constructor(config) {
        if (new.target === BaseAIAdapter) {
            throw new Error("BaseAIAdapter cannot be instantiated directly");
        }
        this.provider = config.provider;
        this.config = config;
    }

    /**
     * Generate text from prompt
     * @abstract
     * @param {string} prompt
     * @param {object} options
     * @returns {Promise<string>}
     */
    async generateText(prompt, options = {}) {
        throw new Error("generateText method must be implemented by subclass");
    }

    /**
     * Generate text from streaming
     * @abstract
     * @param {string} prompt 
     * @param {Function} onChunk - Callback for each chunk
     * @param {Object} options 
     * @returns {Promise<void>}
     */
    async generateTextStream(prompt, onChunk, options = {}) {
        throw new Error('generateTextStream method must be implemented by subclass');
    }

    /**
     * Get provider capabilities
     * @return {object}
     */
    getCapabilities() {
        return {
            provider: this.provider,
            supportsStreaming: false,
            supportsVision: false,
            supportsFunctionCalling: false,
            maxTokens: 4090,
            models: []
        };
    }

    validateConfig() {
        if (!this.config.apiKey) {
            throw new Error(`${this.provider} API key is required`);
        }
    }
}

export default BaseAIAdapter;