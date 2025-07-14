import mongoose from "mongoose";
import { conv } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { io } from "../Socket/socket.js";
import { getReceiverSocketId } from "../Socket/socket.js";

// ✅ Send Message
export const sendmessage = async (req, res) => {
    try {
        const sender_id = req.id;
        const receiver_id = req.params.id;
        const { messages } = req.body;

        if (!sender_id || !receiver_id || !messages) {
            return res.status(400).json({ message: "Missing sender, receiver, or message content" });
        }

        const senderObjectId = new mongoose.Types.ObjectId(sender_id);
        const receiverObjectId = new mongoose.Types.ObjectId(receiver_id);

        // 🔍 Find or create conversation
        let gotConversation = await conv.findOne({
            participants: { $all: [senderObjectId, receiverObjectId] }
        });

        if (!gotConversation) {
            gotConversation = await conv.create({
                participants: [senderObjectId, receiverObjectId],
                messages: []
            });
        }

        // ✉️ Create new message
        const newMessage = await Message.create({
            SenderId: senderObjectId,
            ReceiverId: receiverObjectId,
            messages: messages
        });

        // 🧩 Push message ID to conversation
        if (newMessage) {
            gotConversation.messages.push(newMessage._id);
            //await gotConversation.save();
            await Promise.all([gotConversation.save(),newMessage.save()]);
        }
        const receiverSocketId = getReceiverSocketId(receiverObjectId);
        if(receiverSocketId)
        {
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }
        return res.status(201).json({
            // message: "Message sent successfully",
            //data: newMessage
            newMessage
        });

    } catch (error) {
        console.error("Send Message Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Get Messages
export const get_message = async (req, res) => {
    try {
        const sender_id = req.id;
        const receiver_id = req.params.id;

        if (!sender_id || !receiver_id) {
            return res.status(400).json({ message: "Missing sender or receiver ID" });
        }

        const senderObjectId = new mongoose.Types.ObjectId(sender_id);
        const receiverObjectId = new mongoose.Types.ObjectId(receiver_id);

        const conversation = await conv.findOne({
            participants: { $all: [senderObjectId, receiverObjectId] }
        }).populate("messages");

        if (!conversation) {
            // ✅ Gracefully return empty array
            return res.status(200).json({
                message: "No conversation found",
                data: []
            });
        }

        return res.status(200).json({
            message: "Messages fetched successfully",
            data: conversation.messages
        });

    } catch (error) {
        console.error("Get Message Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
