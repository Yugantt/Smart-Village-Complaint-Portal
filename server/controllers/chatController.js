const Chat = require("../models/Chat");
const User = require("../models/User");

exports.sendMessage = async (req, res) => {
  try {
    const { message, userId } = req.body;
    const targetUser = req.user.role === "citizen" ? req.user._id : userId;

    if (!targetUser) return res.status(400).json({ success: false, message: "User ID is required" });

    const newChat = await Chat.create({ user: targetUser, senderRole: req.user.role, message });
    res.status(201).json({ success: true, chat: newChat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyChat = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllChatsAdmin = async (req, res) => {
  try {
    const usersWithChats = await Chat.aggregate([
      { $sort: { createdAt: 1 } },
      { $group: { _id: "$user", lastMessage: { $last: "$message" }, updatedAt: { $last: "$createdAt" } } },
      { $sort: { updatedAt: -1 } }
    ]);

    const populatedUsers = await User.populate(usersWithChats, { path: "_id", select: "name email" });
    res.status(200).json({ success: true, users: populatedUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getChatWithUser = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.params.userId }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};