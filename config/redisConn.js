import { Redis } from "ioredis";

const connection = new Redis({
    host: "localhost",
    port: 6379,
    maxRetriesPerRequest: 0,
    enableReadyCheck: false

});

connection.on("connect", () => {
    console.log("Redis is connected successfully");
})

connection.on("error", (err) => {
    console.log("Redis is not connected", err);
})

export default connection;
