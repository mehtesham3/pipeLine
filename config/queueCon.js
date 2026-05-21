import { Queue } from "bullmq";
import connection from "./redisConn.js";

const myQueue = new Queue("pipeLineJobs",
    {
        connection,
        defaultJobOptions: {
            removeOnComplete: { age: 60 * 60 * 24 },    // remove after 24 hours 
            removeOnFail: { age: 60 * 60 * 24 * 7 },  // remove after 1 week   
            attempts: 3,
            backoff: { type: "exponential", delay: 2000 },
        }
    }
);

export default myQueue;