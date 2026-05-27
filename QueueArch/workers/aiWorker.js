import { Worker } from "bullmq";
import { txtGenerate } from "../jobs/aiJob.js";
import connection from "../../config/redisConn.js";
import logger from "../../config/logging.js";

const aiWorker = new Worker("txtGenerate", async (job) => {
    const { data } = job;
    logger.info("AI Job started for request ID: ", job.data.requestId);
    await txtGenerate(data);
}, { connection, concurrency: 2, name: 'AI Worker' }
)

aiWorker.on('completed', (job) => {
    logger.info(`Job completed for request ID: ${job.data.requestId}`);
})

aiWorker.on("failed", (job, error) => {
    const isLastAttempt = job.attemptsMade === job.opts.attempts;
    if (isLastAttempt) {
        logger.error(`Job permanently failed - moved to dead letter Queue \nmessage: ${error.message}`, {
            jobId: job.id,
            error: job.failedReason
        });
    }
})

export default aiWorker; 