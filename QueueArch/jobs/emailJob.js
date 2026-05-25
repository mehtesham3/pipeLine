import logger from "../../config/logging.js";
import emitProgress from "../../config/socketConn.js";

export async function emailSend(job) {
    const { to, subject, text, requestId } = job.data;
    try {
        emitProgress(requestId, 75, 'Sending email...');
        await sendEmail(to, subject, text);
        if (Math.random() < 0.3) {  //30% chance of failure
            throw new Error('Email failed');
        }
        emitProgress(requestId, 100, 'Email sent successfully');
        return { success: true };
    } catch (error) {
        logger.error(`Failed to send email to ${to}, Error: ${error}`);
        emitProgress(requestId, 75, 'Failed to send email');
        throw new Error(`Email sending failed ${error.message}`);
    }
}

async function sendEmail(to, subject, text) {
    logger.info(`Sending email to ${to}`, {
        to,
        subject,
        text
    });
    await sleep(10000);
    logger.info(`Email sent successfully to ${to}`);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}