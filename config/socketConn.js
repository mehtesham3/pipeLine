import { Server } from "socket.io";
// import { createServer } from "http";
// import app from "../index.js";

// const httpServer = createServer(app);
let io = null;

export function initWebSocket(server) {
    io = new Server(server, { cors: { origin: '*' } });
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);
        socket.on('subscribe:job', (jobId) => {
            socket.join(`job:${jobId}`);
        });
    });
    return io;
}

function emitProgress(jobId, data) {
    console.log(`📡 Emitting progress for ${jobId}:`, data); // 👈 add this
    if (io) {
        io.to(`job:${jobId}`).emit('job:progress', data);
    }
}
export default emitProgress;
// io.on('connection', (socket) => {
//     console.log('Client connected : ', socket.id);

//     socket.on('subscribe:job', (jobId) => {
//         socket.join(`job:${jobId}`);
//         console.log(`Client subscribed to job : ${jobId}`);
//     });

//     socket.on('disconnect', () => {
//         console.log('Client disconnected : ', socket.id);
//     });
// });

// //helper: emit progress to subscribed client
// function emitProgress(jobId, data) {
//     io.to(`job:${jobId}`).emit('job:progress', data);
// }

// export default emitProgress;