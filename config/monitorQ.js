import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import txtGenerateQueue from "./queueCon.js";
import { emailSendQueue } from "./queueCon.js";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
    queues: [
        new BullMQAdapter(txtGenerateQueue),
        new BullMQAdapter(emailSendQueue),
    ],
    serverAdapter: serverAdapter
});

export default serverAdapter;