import { Server } from "socket.io";
import { createServer } from "http";
import app from "../index.js";

const httpServer = createServer(app);
const io = new Server(httpServer);

io.on('connection', (socket) => {
    console.log('Client connected : ', socket.id);

    socket.on('subscribe:job', (jobId) => {
        socket.join(`job:${jobId}`);
        console.log(`Client subscribed to job : ${jobId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected : ', socket.id);
    });
});

//helper: emit progress to subscribed client
function emitProgress(jobId, data) {
    io.to(`job:${jobId}`).emit('job:progress', data);
}

export default emitProgress;