import { Server } from "socket.io";
import http from "http"; /* no package required -> inbuilt in node */
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});


/* userSocketMap is used to store the online users */
const userSocketMap = {};// userId: socketId

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
};

/* Following function listens for every incoming connections */
io.on("connection", (socket) => {
    console.log("An user connected", socket.id);
    const userId = socket.handshake.query.userId;
    console.log(userId);
    if(userId) userSocketMap[userId] = socket.id;

    /* io.emit() is used to send events to all the connected users -> broadcasting */
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("An user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

/* io is our socket server */
export {io, app, server};