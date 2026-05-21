import express from "express"
import morgan from "morgan";
import connection from "./config/redisConn.js";
import pool from "./config/postgresConn.js";
import logger from "./config/logging.js";
import serverAdapter from "./config/monitorQ.js";

const app = express();
app.use(express.json());

const morganStream = {
    write: (message) => logger.http(message)
}

app.use(morgan(":method :url :response-time ms :status  ", {
    stream: morganStream
}))

app.use("/admin/queues", serverAdapter.getRouter());

app.get("/", (req, res) => {
    logger.info("Status check requested");
    res.send("Server is running well  ");
})

app.get("/status", async (req, res) => {
    const check = await connection.ping();
    const postgres = await pool.query("SELECT 1");

    let redisStatus = "unknown";
    let postgresStatus = "unknown";

    check ? redisStatus = "connected" : redisStatus = "not connected";
    postgres ? postgresStatus = "connected" : postgresStatus = "not connected";

    logger.info("Status check requested", { redis: redisStatus, postgres: postgresStatus });
    res.json({ redis: redisStatus, postgres: postgresStatus, server: "running" });
})

app.listen(4000, () => {
    logger.info("Server health check at http://localhost:4000/status");
})

export default app;