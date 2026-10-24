const Complaint = require("../models/Complaint");

const activeComplaintQuery = { $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] };

exports.createComplaint = async (req, res) => {
    try {
        const { title, description, category, village, ward, landmark, latitude, longitude, customCategory } = req.body;

        const complaintData = {
            title, description, category, village, ward, landmark,
            location: { latitude, longitude },
            image: req.file ? req.file.path.replace(/\\/g, "/") : "",
            citizen: req.user._id
        };

        if (category === "Other" && customCategory) complaintData.customCategory = customCategory;

        const complaint = await Complaint.create(complaintData);
        res.status(201).json({ success: true, message: "Complaint submitted successfully", complaint });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ citizen: req.user._id, ...activeComplaintQuery }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: complaints.length, complaints });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find(activeComplaintQuery)
            .populate("citizen", "name email phone").sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: complaints.length, complaints });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateComplaintStatus = async (req, res) => {
    try {
        const { status, adminRemark } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });

        complaint.status = status;
        if (adminRemark !== undefined) complaint.adminRemark = adminRemark;
        await complaint.save();

        res.status(200).json({ success: true, message: "Complaint status updated successfully", complaint });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });

        complaint.isDeleted = true;
        complaint.deletedAt = new Date();
        complaint.deletedBy = req.user._id;
        await complaint.save();

        res.status(200).json({ success: true, message: "Complaint deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const totalComplaints = await Complaint.countDocuments(activeComplaintQuery);
        const pending = await Complaint.countDocuments({ ...activeComplaintQuery, status: "Pending" });
        const inProgress = await Complaint.countDocuments({ ...activeComplaintQuery, status: "In Progress" });
        const resolved = await Complaint.countDocuments({ ...activeComplaintQuery, status: "Resolved" });

        res.status(200).json({ success: true, stats: { totalComplaints, pending, inProgress, resolved } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getDeletedComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ isDeleted: true })
            .populate("citizen", "name email").populate("deletedBy", "name email").sort({ deletedAt: -1 });
        res.status(200).json({ success: true, complaints });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getChartData = async (req, res) => {
    try {
        const categoryData = await Complaint.aggregate([{ $match: activeComplaintQuery }, { $group: { _id: "$category", count: { $sum: 1 } } }]);
        const statusData = await Complaint.aggregate([{ $match: activeComplaintQuery }, { $group: { _id: "$status", count: { $sum: 1 } } }]);
        
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const trendData = await Complaint.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo }, ...activeComplaintQuery } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates.push(d.toISOString().split('T')[0]);
        }

        const trendMap = {};
        trendData.forEach(item => { trendMap[item._id] = item.count; });
        const completeTrend = dates.map(date => ({ _id: date, count: trendMap[date] || 0 }));

        res.status(200).json({ success: true, data: { category: categoryData, status: statusData, trend: completeTrend } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};