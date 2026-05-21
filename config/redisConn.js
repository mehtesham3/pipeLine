import { Redis } from "ioredis";
import logger from "./logging.js";

const connection = new Redis({
    host: "localhost",
    port: 6379,
    maxRetriesPerRequest: 0,
    enableReadyCheck: false

});

connection.on("connect", () => {
    logger.info("Redis is connected successfully");
})

connection.on("error", (err) => {
    logger.error("Redis is not connected", err);
})

export default connection;
