// import mongoose from "mongoose";
// const message = new mongoose.Schema({
//     SenderId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true
//     },
//     ReceiverId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true
//     },
//     messages: {
//         type: String,
//         required: true

//     },
//     status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
//     deliveredAt: Date,
//     readAt: Date,
//     createdAt: { type: Date, default: Date.now }
// }, { timestamps: true })
// export const Message = mongoose.model("Message", message);


import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    SenderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ReceiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    deliveredAt: {
      type: Date,
    },
    readAt: {
      type: Date,
    },
  },
  { timestamps: true } // auto adds createdAt and updatedAt
);

export const Message = mongoose.model("Message", messageSchema);
