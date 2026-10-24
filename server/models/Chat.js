const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderRole: { type: String, enum: ["citizen", "admin", "superadmin"], required: true },
    message: { type: String, required: true, trim: true, maxlength: 1000 },
    isEdited: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);