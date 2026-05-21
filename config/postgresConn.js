import { Pool } from "pg";
import logger from "./logging.js";

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "pipeline",
    password: "Angelica1!",
    port: 5432
})

pool.on("connect", () => {
    logger.info("Connected to the database");
})

pool.on("error", (err) => {
    logger.error("Not connected to the database", err);
})

export default pool;
