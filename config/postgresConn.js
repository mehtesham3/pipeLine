import app from "../index.js";
import { Pool } from "pg";

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "pipeline",
    password: "Angelica1!",
    port: 5432
})

pool.on("connect", () => {
    console.log("Connected to the database");
})

pool.on("error", (err) => {
    console.log("Not connected to the database", err);
})

export default pool;
