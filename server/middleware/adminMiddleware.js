exports.isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
        return res.status(403).json({ success: false, message: "Access denied. Admin only." });
    }
    next();
};

exports.isSuperAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (req.user.role !== "superadmin") {
        return res.status(403).json({ success: false, message: "Access denied. Only Main Admin can do this." });
    }
    next();
};