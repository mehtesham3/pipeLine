import aiConfig from "./config/aiConf.js";
import AIService from "./services/ai.Service.js";

/**
 * Create AI Servuce instance
 * @param {Object} config
 * @returns {AIService}
 */

export function createAIService(config = null) {
    if (!config) {
        config = {};
    }

    if (!config.provider) {
        config.provider = 'google';
    }
    const provider = config.provider.toLowerCase();
    if (!aiConfig[provider]) {
        throw new Error(`AI provider ${provider} is not supported`);
    }
    return new AIService({ ...aiConfig[provider], ...config });
}

//Default AI Servie Instance
let defaultService = aiConfig.defaultProviders;
export function getAIService() {
    if (!defaultService) {
        defaultService = createAIService();
    }
    return defaultService;
}

export { AIService };

export default {
    createAIService,
    getAIService,
    AIService
}