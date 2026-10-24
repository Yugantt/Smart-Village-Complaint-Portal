const User = require("../models/User");

exports.createAdmin = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        if (user.role === "admin" || user.role === "superadmin") {
            return res.status(400).json({ success: false, message: "User is already an admin" });
        }

        user.role = "admin";
        await user.save();
        res.status(200).json({ success: true, message: "Admin created successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.changeUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!["citizen", "admin"].includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role" });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        if (user.role === "superadmin") {
            return res.status(403).json({ success: false, message: "Cannot change Super Admin role" });
        }

        user.role = role;
        await user.save();
        res.status(200).json({ success: true, message: "Role updated successfully", user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        
        if (user.role === "superadmin") {
            return res.status(403).json({ success: false, message: "Cannot delete Super Admin" });
        }

        await user.deleteOne();
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};