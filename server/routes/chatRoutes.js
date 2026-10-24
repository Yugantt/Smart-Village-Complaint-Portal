const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const {
  sendMessage,
  getMyChat,
  getAllChatsAdmin,
  getChatWithUser,
} = require("../controllers/chatController");

// User aur Admin dono message bhej sakte hain
router.post("/", protect, sendMessage);

// User apni chat dekhe
router.get("/my", protect, getMyChat);

// Admin routes
router.get("/admin", protect, isAdmin, getAllChatsAdmin);
router.get("/admin/:userId", protect, isAdmin, getChatWithUser);

module.exports = router;