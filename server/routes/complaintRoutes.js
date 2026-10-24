const express = require("express");
const router = express.Router();
const { upload, handleUploadError } = require("../middleware/uploadMiddleware");
const {
    createComplaint, getMyComplaints, getAllComplaints,
    updateComplaintStatus, deleteComplaint, getDashboardStats,
    getDeletedComplaints, getChartData
} = require("../controllers/complaintController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

router.post("/", protect, upload.single("image"), handleUploadError, createComplaint);
router.get("/my", protect, getMyComplaints);
router.get("/", protect, isAdmin, getAllComplaints);
router.get("/dashboard/stats", protect, isAdmin, getDashboardStats);
router.put("/:id/status", protect, isAdmin, updateComplaintStatus);
router.delete("/:id", protect, isAdmin, deleteComplaint);
router.get("/deleted", protect, isAdmin, getDeletedComplaints);
router.get("/chart-data", protect, isAdmin, getChartData);

module.exports = router;