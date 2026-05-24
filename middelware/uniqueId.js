import { randomUUID } from "crypto";
import logger from "../config/logging.js";

const addUniqueId = (req, res, next) => {
    req.id = randomUUID();
    const originalMeta = logger.defaultMeta;
    logger.defaultMeta = { ...originalMeta, requestId: req.id };
    res.on('finish', () => {
        logger.defaultMeta = originalMeta;
        logger.info('Request completed', { requestId: req.id });
    });
    next();
}

export default addUniqueId;