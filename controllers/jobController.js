const Job = require("../models/jobModel");
const mongoose = require("mongoose");


exports.createJob = async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      postedBy: req.user.id  // Set by auth middleware
    });

    await job.save();
    res.status(201).json({ message: "Job posted successfully", job });
  } catch (err) {
    console.error("Create job error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all jobs posted by the current user
exports.getJobsByUser = async (req, res) => {
  try {
    const userId = req.user.id; // extracted by auth middleware
    const jobs = await Job.find({ postedBy: userId }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Get user jobs error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getJobStatsByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await Job.aggregate([
      { $match: { postedBy: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Format into response shape
    const formattedStats = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0
    };

    stats.forEach(stat => {
      formattedStats.total += stat.count;
      if (stat._id === "pending") formattedStats.pending = stat.count;
      if (stat._id === "approved") formattedStats.approved = stat.count;
      if (stat._id === "rejected") formattedStats.rejected = stat.count;
    });

    res.json(formattedStats);
  } catch (err) {
    console.error("Job stats error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// DELETE job
// exports.deleteJob = async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.id);

//     if (!job) return res.status(404).json({ message: "Job not found" });
//     if (job.postedBy.toString() !== req.user.id)
//       return res.status(403).json({ message: "Not authorized" });

//     await job.remove();
//     res.json({ message: "Job deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

exports.deleteJob = async (req, res) => {
  try {
    console.log("Delete requested for ID:", req.params.id);
    console.log("User ID from token:", req.user.id);

    const job = await Job.findById(req.params.id);
    if (!job) {
      console.log("Job not found.");
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user.id) {
      console.log("User not authorized to delete this job.");
      return res.status(403).json({ message: "Not authorized" });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("Error deleting job:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.postedBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    Object.assign(job, req.body);
    await job.save();

    res.json({ message: "Job updated successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



