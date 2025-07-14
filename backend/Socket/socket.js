
import { Message } from "../models/messageModel.js";

import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://192.168.187.11:5173",
      "https://web-chat-app-frontend-1o2g.onrender.com"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});


const usersocketMap = {}; // userId -> socketId

export const getReceiverSocketId = (receiverObjectId) => {
  return usersocketMap[receiverObjectId];
};

io.on('connection', (socket) => {
  console.log('🔌 user connected', socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    usersocketMap[userId] = socket.id;
  }

  io.emit('getOnlineUsers', Object.keys(usersocketMap));

  // ✅ Send message
  socket.on('newMessage', (message) => {
    const receiverSocketId = usersocketMap[message.to];
    message.status = receiverSocketId ? 'delivered' : 'sent';
    message.createdAt = new Date().toISOString();

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', message);
    }

    // You can save message to DB here
  });

  // ✅ Message marked as read
  // socket.on("messageRead", (messageId) => {
  //   io.emit("messageReadStatusUpdate", { messageId, status: "read" });
  // });

  socket.on("messageRead", async (messageId) => {
  // ✅ Update message status in MongoDB
  await Message.findByIdAndUpdate(messageId, {
    status: "read",
    readAt: new Date()
  });

  // ✅ Notify sender if online
  io.emit("messageReadStatusUpdate", { messageId, status: "read" });
});
  

  socket.on('disconnect', () => {
    console.log('🔌 user disconnected', socket.id);
    if (userId) delete usersocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(usersocketMap));
  });
});

export { app, io, server };
