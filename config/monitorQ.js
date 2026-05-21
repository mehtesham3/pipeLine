import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import myQueue from "./queueCon.js";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
    queues: [
        new BullMQAdapter(myQueue)
    ],
    serverAdapter: serverAdapter
});

export default serverAdapter;