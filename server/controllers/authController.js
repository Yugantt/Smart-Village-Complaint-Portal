const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, phone, role: "citizen" });

        const userResponse = {
            _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role
        };

        res.status(201).json({ success: true, message: "User Registered Successfully", user: userResponse });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please enter email and password" });
        }

        // 👇 FIX: Added .select("+password") so bcrypt can read it
        const user = await User.findOne({ email }).select("+password");
        
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getProfile = async (req, res) => {
    res.status(200).json({ success: true, user: req.user });
};