import { randomUUID } from "crypto";
import logger from "../config/logging";

const addUniqueId = (req, res, next) => {
    req.id = randomUUID();
    logger.defaultMeta = { ...logger.defaultMeta, requestId: req.id };
    next();
}

export default addUniqueId;