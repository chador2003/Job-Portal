// routes/jobRoutes.js

const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// ✅ Public Routes (No Auth)

router.get("/public", jobController.getPublicJobs);          // Get all approved jobs
router.get("/filters", jobController.getFilters);            // Get job filter values (categories, locations)

// ✅ Authenticated User Routes

router.post("/", protect, jobController.createJob);                  // Create a job
router.get("/mine", protect, jobController.getJobsByUser);           // Get jobs posted by the current user
router.get("/stats", protect, jobController.getJobStatsByUser);      // Get job stats for the current user
router.put("/:id", protect, jobController.updateJob);                // Update a job by ID
router.delete("/:id", protect, jobController.deleteJob);             // Delete a job by ID

// ✅ Admin-Only Routes

router.get("/recent", protect, isAdmin, jobController.getRecentJobs);             // Get recent jobs
router.put("/:jobId/status", protect, isAdmin, jobController.updateJobStatus);    // Approve or reject a job

// ✅ General Route (Last)

router.get("/:id", protect, isAdmin, jobController.getJobById);       // Get a job by ID (Admin access)
module.exports = router;
