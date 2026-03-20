const User = require("../models/User");

const requireUser = async (req, res, next) => {
  const userId = req.headers["x-user-id"];
  if (!userId || typeof userId !== "string") {
    return res.status(401).json({ message: "Missing x-user-id header" });
  }

  try {
    const user = await User.findOne({ id: userId }).lean();
    if (!user) return res.status(401).json({ message: "Invalid user" });
    req.user = { id: user.id, role: user.role };
    return next();
  } catch (err) {
    return res.status(500).json({ message: "Auth failed" });
  }
};

const requireRole = (roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthenticated" });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  return next();
};

module.exports = {
  requireUser,
  requireRole,
};

