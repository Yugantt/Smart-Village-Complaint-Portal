const Complaint = require("../models/Complaint");
const User = require("../models/User");

exports.getPublicStats = async (req, res) => {
  try {
    const notDeletedQuery = { $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] };
    
    const totalComplaints = await Complaint.countDocuments(notDeletedQuery);
    const resolvedComplaints = await Complaint.countDocuments({ status: "Resolved", ...notDeletedQuery });
    const pendingComplaints = await Complaint.countDocuments({ status: "Pending", ...notDeletedQuery });
    const totalUsers = await User.countDocuments({ role: "citizen" });

    res.status(200).json({
      success: true,
      stats: { totalComplaints, resolvedComplaints, pendingComplaints, totalUsers }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};