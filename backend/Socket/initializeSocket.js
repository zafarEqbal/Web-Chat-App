import { Server } from "socket.io";
import { Message } from "../models/messageModel.js";

const userSocketMap = {}; // userId -> socketId

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

export function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // change this for production
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (!userId) return;

    // ✅ Map userId to socket.id
    userSocketMap[userId] = socket.id;
    console.log(`✅ User ${userId} connected as ${socket.id}`);

    // 🟢 Broadcast online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // 📩 Handle new message
    socket.on("newMessage", async (msgData) => {
      try {
        const savedMessage = await Message.create({
          SenderId: msgData.SenderId,
          ReceiverId: msgData.ReceiverId,
          messages: msgData.message,
          status: "sent",
        });

        const receiverSocketId = userSocketMap[msgData.ReceiverId];
        const deliveredTime = new Date();

        if (receiverSocketId) {
          // Send message to receiver
          io.to(receiverSocketId).emit("newMessage", {
            ...savedMessage._doc,
            status: "delivered",
            deliveredAt: deliveredTime,
          });

          // Update status to delivered in DB
          await Message.findByIdAndUpdate(savedMessage._id, {
            status: "delivered",
            deliveredAt: deliveredTime,
          });
        }

        // Acknowledge sender
        socket.emit("messageSent", savedMessage);
      } catch (err) {
        console.error("❌ Error saving message:", err);
      }
    });

    // ✅ Handle mark as read
    socket.on("markAsRead", async ({ fromUserId }) => {
      try {
        const readTime = new Date();
        await Message.updateMany(
          {
            SenderId: fromUserId,
            ReceiverId: userId,
            status: { $ne: "read" },
          },
          {
            status: "read",
            readAt: readTime,
          }
        );

        const senderSocketId = userSocketMap[fromUserId];
        if (senderSocketId) {
          io.to(senderSocketId).emit("messagesRead", {
            readerId: userId,
            fromUserId,
            readAt: readTime,
          });
        }
      } catch (err) {
        console.error("❌ Error marking messages as read:", err);
      }
    });

    // 🔌 Disconnect
    socket.on("disconnect", () => {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
      console.log(`❌ User ${userId} disconnected`);
    });
  });
}
