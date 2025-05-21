const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const authenticate = require("../middleware/auth");

// Create job
router.post("/", authenticate, jobController.createJob);

// Get jobs posted by the current user
router.get("/mine", authenticate, jobController.getJobsByUser);

// Get stats for the current user
router.get("/stats", authenticate, jobController.getJobStatsByUser);

// Update job
router.put("/:id", authenticate, jobController.updateJob);

// Delete job
router.delete("/:id", authenticate, jobController.deleteJob);

// Optional: get recent jobs (already present)
router.get("/recent", authenticate, async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("postedBy", "email");
    res.json(jobs);
  } catch (err) {
    console.error("❌ Error fetching jobs:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
