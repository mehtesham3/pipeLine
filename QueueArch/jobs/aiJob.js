import { PrismaPg } from "@prisma/adapter-pg";
import { createAIService } from "../../aiSetup.js";
import logger from "../../config/logging.js";
import { PrismaClient } from "../../generated/prisma/client.js";
import emitProgress from "../../config/socketConn.js";
import { emailSendQueue } from "../../config/queueCon.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({
    adapter
});

async function saveToDB(data) {
    const { prompt, content, provider, status, requestId, userEmail } = data;
    const saveResp = await prisma.blogPost.create({
        data: {
            topic: prompt,
            content: content,
            provider,
            status,
            requestId,
            user: userEmail
        }
    });
    return saveResp;
}

export async function txtGenerate(data) {
    const { prompt, requestId, userEmail } = data;
    try {
        const provider = process.env.AI_PROVIDER;
        const textGen = createAIService({ provider });
        emitProgress(requestId, 25, 'Generating content...');
        const response = await textGen.generateText(prompt);
        logger.info(`Job completed for request ID: ${requestId}, Response: ${response}`);
        emitProgress(requestId, 50, 'Saving to database...');
        const saveData = {
            prompt,
            content: response,
            provider,
            status: "Completed",
            requestId,
            userEmail
        }
        const respFromDB = await saveToDB(saveData);
        logger.info(`Save the data to DB : ${respFromDB}`);

        await emailSendQueue.add("emailSend", {
            to: userEmail,
            subject: "Blog Post Generated",
            text: `Your blog post has been generated successfully`,
            requestId: requestId
        })
        return { blogId: respFromDB.id };
    } catch (error) {
        logger.error(`Job failed for request ID: ${requestId}, Error: ${error}`);
        emitProgress(requestId, 0, 'Failed');
        throw new Error(`Ai generation failed ${error.message}`);
    }
}

// export async function txtGenerateStream(data) {
//     const { prompt, requestId } = data;
//     try {
//         const textGen = createAIService({ provider: process.env.AI_PROVIDER });
//         const stream = await textGen.generateTextStream(prompt, (chunk) => {
//             logger.info(`Streaming chunk for request ID: ${requestId}, Chunk: ${chunk}`);
//         });
//         logger.info(`Job completed for request ID: ${requestId}, Response: ${stream}`);
//         return stream;
//     } catch (error) {
//         logger.error(`Job failed for request ID: ${requestId}, Error: ${error}`);
//         throw new Error(`Stream generation failed ${error.message}`);
//     }
// }