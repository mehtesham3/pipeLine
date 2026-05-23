import { createAIService } from "./aiSetup.js";
import "dotenv/config"
import logger from "./config/logging.js";

const textGeneration = createAIService({ provider: process.env.AI_PROVIDER });
const resp = await textGeneration.generateText("Which number is larger, 9.11 or 9.8?");
console.log("\n\nAI Generated Response:");
logger.debug(resp);

const textStreamGeneration = createAIService({ provider: process.env.AI_PROVIDER });
const stream = await textStreamGeneration.generateTextStream("Which number is larger, 9.11 or 9.8?", (chunk) => {
    process.stdout.write(chunk);
});

console.log("\nStream completed\n");