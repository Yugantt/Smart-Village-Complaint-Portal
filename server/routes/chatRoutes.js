const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const {
  sendMessage, getMyChat, getAllChatsAdmin, getChatWithUser, editMessage, deleteMessage
} = require("../controllers/chatController");

router.post("/", protect, sendMessage);
router.get("/my", protect, getMyChat);
router.get("/admin", protect, isAdmin, getAllChatsAdmin);
router.get("/admin/:userId", protect, isAdmin, getChatWithUser);

router.put("/:id", protect, editMessage);
router.delete("/:id", protect, deleteMessage);

module.exports = router;