import { Redis } from "ioredis";
import logger from "./logging.js";

const connection = new Redis({
    host: "localhost",
    port: 6379,
    maxRetriesPerRequest: 0,
    enableReadyCheck: false,
    lazyConnect: true,
    retryStrategy: (times) => {
        if (times > 8) {
            logger.error("Redis is not connected after 8 retries");
            return null;
        }
        return Math.min(times * 50, 2000);
    }

});

connection.on("connect", () => {
    logger.info("Redis is connected successfully");
})

connection.on("error", (err) => {
    logger.error("Redis is not connected", err);
})

export default connection;
