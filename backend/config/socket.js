import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.model.js";

const app = express();
const server = http.createServer(app);
const allowedOrigins = [
    "http://localhost:5173",
    "https://vibely-social-media-app.vercel.app",
    ...(process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.split(",").map((origin) => origin.trim())
        : []),
].map((origin) => origin.replace(/\/$/, ""));

const io = new Server(server, {
  cors: {
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);

            const normalizedOrigin = origin.replace(/\/$/, "");
            if (allowedOrigins.includes(normalizedOrigin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Map: userId -> socketId  (to know who is online)
const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];  // example: { "123": "socketId1", "456": "socketId2" }
};

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    const userId = socket.handshake.query.userId;

    if (userId) {
        userSocketMap[userId] = socket.id;
    } 

    // Broadcast updated online users list to everyone
    io.emit("onlineUsers", Object.keys(userSocketMap));

    // Typing indicator — forward to the receiver only
    socket.on("typing", ({ receiverId }) => {
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("typing", { senderId: userId });
        }
    });

    socket.on("stopTyping", ({ receiverId }) => {
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("stopTyping", { senderId: userId });
        }
    });

    // Seen receipts — receiver opens chat, tell the original senders
    socket.on("markSeen", async ({ conversationId, senderId }) => {
        try {
            await Message.updateMany(
                { conversationId, sender: senderId, seen: false },
                { seen: true }
            );
            const senderSocketId = userSocketMap[senderId];
            if (senderSocketId) {
                io.to(senderSocketId).emit("messagesSeen", { conversationId });
            }
        } catch (err) {
            console.error("markSeen error:", err);
        }
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
        if (userId) {
            delete userSocketMap[userId];
        }
        io.emit("onlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server };
