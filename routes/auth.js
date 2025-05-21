const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const jwt = require('jsonwebtoken');

// 🔐 Auth middleware

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // adds { id, role } to req.user
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// 👤 Auth routes
router.post('/signup', signup);
router.post('/login', login);
const User = require('../models/userModel');

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('fullName');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const firstName = user.fullName?.split(" ")[0] || "User";
    res.json({ firstName });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// ✅ Export both
module.exports = {
  authRouter: router,
  requireAuth
};
