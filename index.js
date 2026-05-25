import express from "express"
import morgan from "morgan";
import connection from "./config/redisConn.js";
import logger from "./config/logging.js";
import serverAdapter from "./config/monitorQ.js";
import txtRouter from "./routes/txtGenerate.route.js";
import prisma from "./config/postgresConn.js";
import { createServer } from "http";
import { initWebSocket } from "./config/socketConn.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
// Starting Worker
import aiWorker from "./QueueArch/workers/aiWorker.js";
import emailWorker from "./QueueArch/workers/emailWorker.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }))
// Serve static files from the 'public' folder
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

const httpServer = createServer(app);
initWebSocket(httpServer);

const morganStream = {
    write: (message) => logger.http(message)
}

app.use(morgan(":method :url :response-time ms :status  ", {
    stream: morganStream
}))

app.use("/admin/queues", serverAdapter.getRouter());

app.use("/", txtRouter);

app.get("/", (req, res) => {
    logger.info("Status check requested");
    res.send("Server is running well  ");
})

app.get("/status", async (req, res) => {
    const check = await connection.ping();
    const postgres = await prisma.$queryRaw`SELECT 1`;

    let redisStatus = "unknown";
    let postgresStatus = "unknown";

    check ? redisStatus = "connected" : redisStatus = "not connected";
    postgres ? postgresStatus = "connected" : postgresStatus = "not connected";

    logger.info("Status check requested", { redis: redisStatus, postgres: postgresStatus });
    res.json({ redis: redisStatus, postgres: postgresStatus, server: "running" });
})

httpServer.listen(4000, () => {
    logger.info("Server health check at http://localhost:4000/status");
    logger.info("WebSocket server running on port 4000");
})

export default app;