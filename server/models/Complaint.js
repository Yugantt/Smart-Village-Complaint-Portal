const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 2000 },
    category: {
        type: String,
        required: true,
        enum: ["Road", "Water Supply", "Electricity", "Sanitation", "Street Light", "Other"]
    },
    customCategory: { type: String, default: "" },
    image: { type: String, default: "" },
    status: { type: String, enum: ["Pending", "In Progress", "Resolved"], default: "Pending" },
    citizen: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: { latitude: Number, longitude: Number },
    village: { type: String, maxlength: 100 },
    ward: { type: String, maxlength: 50 },
    landmark: { type: String, maxlength: 100 },
    adminRemark: { type: String, default: "", maxlength: 500 },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);