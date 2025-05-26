// controllers/jobController.js

const Job = require("../models/jobModel");
const mongoose = require("mongoose");

// Utility: Update expired jobs
const updateExpiredJobs = async () => {
  try {
    const now = new Date();
    const result = await Job.updateMany(
      { deadline: { $lt: now }, status: { $ne: "expired" } },
      { $set: { status: "expired" } }
    );

    if (result.modifiedCount > 0) {
      console.log(`✅ ${result.modifiedCount} job(s) marked as expired.`);
    }
  } catch (err) {
    console.error("❌ Error updating expired jobs:", err.message);
  }
};

// @desc    Create a job
// @route   POST /jobs
exports.createJob = async (req, res) => {
  try {
    const requiredFields = [
      "title", "company", "location", "type", "vacancy",
      "deadline", "description", "requirements", "category"
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    const job = new Job({
      ...req.body,
      postedBy: req.user._id || req.user.id,
    });

    await job.save();
    res.status(201).json({ message: "Job posted successfully", job });
  } catch (err) {
    console.error("❌ Create job error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Get jobs posted by current user
// @route   GET /jobs/my
exports.getJobsByUser = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Get job statistics by current user
// @route   GET /jobs/my/stats
exports.getJobStatsByUser = async (req, res) => {
  try {
    const stats = await Job.aggregate([
      { $match: { postedBy: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const formattedStats = { total: 0, pending: 0, approved: 0, rejected: 0 };
    stats.forEach(({ _id, count }) => {
      formattedStats.total += count;
      if (_id in formattedStats) formattedStats[_id] = count;
    });

    res.json(formattedStats);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Delete a job
// @route   DELETE /jobs/:id
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Update a job
// @route   PUT /jobs/:id
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(job, req.body);
    await job.save();
    res.json({ message: "Job updated successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Get recent jobs
// @route   GET /jobs/recent
exports.getRecentJobs = async (req, res) => {
  try {
    await updateExpiredJobs();

    const jobs = await Job.find({ postedBy: { $exists: true } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("postedBy", "email");

    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Admin: update job status
// @route   PATCH /jobs/:jobId/status
exports.updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const job = await Job.findByIdAndUpdate(
      req.params.jobId,
      { status },
      { new: true }
    ).populate("postedBy", "email");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job status updated", job });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Get public jobs (approved only)
// @route   GET /jobs/public
exports.getPublicJobs = async (req, res) => {
  try {
    await updateExpiredJobs();
    const jobs = await Job.find({ status: "approved" }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Get job by ID
// @route   GET /jobs/:id
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "email");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Get available filter values (categories and locations)
// @route   GET /jobs/filters
exports.getFilters = async (req, res) => {
  try {
    const categories = await Job.distinct("category");
    const locations = await Job.distinct("location", { status: "approved" });
    res.status(200).json({ categories, locations });
  } catch (err) {
    res.status(500).json({ message: "Error fetching filters", error: err.message });
  }
};
