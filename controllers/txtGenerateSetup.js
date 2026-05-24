import logger from "../config/logging.js";
import txtGenerateQueue from "../config/queueCon.js";

const generateTxt = async (req, res) => {
    const { prompt, email } = req.body;
    const requestId = req.id;

    try {
        if (!prompt || !email) {
            logger.warn('Prompt and email are required', { requestId });
            return res.status(400).json({ message: "Prompt and email are required" })
        }
        await txtGenerateQueue.add("txtGenerate", {
            prompt,
            requestId,
            userEmail: email
        })
        logger.info('Job queued for txt generation', { requestId, prompt, email });
        return res.status(202).json({ message: "Your request has been added to the queue", requestId });
    } catch (error) {
        logger.error('Failed to add to queue', { error, requestId });
        return res.status(500).json({ message: "Failed to add to queue" });
    }
}

export default generateTxt;