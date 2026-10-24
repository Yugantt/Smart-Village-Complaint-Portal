const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const chatRoutes = require("./routes/chatRoutes");
const publicRoutes = require("./routes/publicRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));
app.use(express.json({ limit: "10kb" }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5000, 
    message: "Too many requests from this IP, please try again later."
});
// app.use("/api", limiter); // DISABLED FOR LOCAL TESTING

app.use("/uploads", express.static(require("path").join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/public", publicRoutes);

app.get("/", (req, res) => {
    res.send("Smart Village Complaint Portal API is Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});