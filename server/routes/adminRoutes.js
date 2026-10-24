const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
// ✅ isSuperAdmin ko import kiya
const { isAdmin, isSuperAdmin } = require("../middleware/adminMiddleware");

const {
    createAdmin,
    getAllUsers,
    deleteUser,
    changeUserRole
} = require("../controllers/adminController");

// ✅ Ab sirf Super Admin hi naya admin bana sakta hai
router.post("/create-admin", protect, isSuperAdmin, createAdmin);

// Users dekhne aur delete karne ka access Admin aur Super Admin dono ko hai
router.get("/users", protect, isAdmin, getAllUsers);
router.delete("/users/:id", protect, isAdmin, deleteUser);

// ✅ NAYA CHANGE: Ab role change (Promote/Demote) sirf Super Admin kar sakta hai
router.put("/users/:id/role", protect, isSuperAdmin, changeUserRole);

module.exports = router;