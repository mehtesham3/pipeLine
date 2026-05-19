import express from "express"
import connection from "./config/redisConn.js";
import pool from "./config/postgresConn.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running well  ");
})

app.get("/status", async (req, res) => {
    const check = await connection.ping();
    const postgres = await pool.query("SELECT 1");

    let redisStatus = "unknown";
    let postgresStatus = "unknown";

    check ? redisStatus = "connected" : redisStatus = "not connected";
    postgres ? postgresStatus = "connected" : postgresStatus = "not connected";

    res.json({ redis: redisStatus, postgres: postgresStatus, server: "running" });
})

app.listen(4000, () => {
    console.log("Server is running on port 4000 \n for helath check visit http://localhost:4000/status");
})

export default app;