import { Worker } from "bullmq";
import logger from "../../config/logging.js";
import { emailSend } from "../jobs/emailJob.js";
import connection from "../../config/redisConn.js";

const emailWorker = new Worker("emailSend", async (job) => {
    logger.info(`Email job started for request ID: ${job.data.requestId}`);
    await emailSend(job);
}, { connection, concurrency: 2, name: 'Email Worker' });

emailWorker.on("completed", (job) => {
    logger.info(`Email job completed for requestId : ${job.data.requestId}`);
})

emailWorker.on('failed', (job, error) => {
    const isLastAttempt = job.attemptsMade === job.opts.attempts;
    if (isLastAttempt) {
        logger.error(`Email job permanently failed - moved to dead letter Queue \nmessage: ${error.message}`, {
            jobId: job.id,
            error: job.failedReason
        })
    }
})

export default emailWorker;