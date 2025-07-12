import mongoose from "mongoose";
const user_module = new mongoose.Schema({
    FullName: {
        type: String,
        required: true
    },
    UserName: {
        type: String,
        Unique: true,
        required: true
    },
    Email: {
    type: String,
    required: true,
    unique: true
  },
    Password: {
        type: String,
        required: true
    },
    ProfilePhoto: {
        type: String,
        default: ""
    },
    Gender: {
        type: String,
        enum: ["Male", "Female", "others"],
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },

}, { timestamps: true })

export const USER = mongoose.model("USER", user_module);