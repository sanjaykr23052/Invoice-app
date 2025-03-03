const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const User = require("../models/User");

module.exports = async function (req, res, next) {
  const authHeader = req.header("Authorization");
  
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied, No Token Provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check both Admin and User collections
    const [admin, user] = await Promise.all([
      Admin.findById(decoded.id),
      User.findById(decoded.id)
    ]);

    if (!admin && !user) {
      return res.status(401).json({ message: "Invalid token - user not found" });
    }

    req.user = admin || user;
    req.userType = admin ? 'admin' : user.userType;
    next();
  } catch (error) {
    console.error("JWT Verification Failed:", error);
    return res.status(403).json({ message: "Invalid or Expired Token" });
  }
};