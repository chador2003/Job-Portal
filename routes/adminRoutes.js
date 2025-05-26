// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getAdminStats } = require('../controllers/adminController');
const authenticate = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware')

router.get('/stats', authenticate, getAdminStats);
router.get('/jobs', adminController.getAllJobs);
router.get('/stats', authMiddleware.protect, authMiddleware.isAdmin, adminController.getAdminStats);
// routes/jobRoutes.js or adminRoutes.js
router.get("/recent", authenticate, async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("postedBy", "email");

    res.json(jobs);
  } catch (err) {
    console.error("Error fetching recent jobs:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
