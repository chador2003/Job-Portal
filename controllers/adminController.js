// controllers/adminController.js

const JobCategory = require('../models/jobCategory');
const User = require('../models/userModel');
const Job = require('../models/jobModel');

// @desc    Get admin statistics
// @route   GET /admin/stats
exports.getAdminStats = async (req, res) => {
  try {
    const totalCategories = await JobCategory.countDocuments();
    const totalEmployers = await User.countDocuments({ role: 'poster' });
    const totalCandidates = await User.countDocuments({ role: 'seeker' });
    const totalJobs = await Job.countDocuments();

    res.json({
      totalCategories,
      totalEmployers,
      totalCandidates,
      totalJobs,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Get all jobs
// @route   GET /admin/jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch jobs',
      error: err.message,
    });
  }
};

// @desc    Update job status
// @route   PUT /admin/jobs/:jobId/status
exports.updateJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.body;

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { status },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({
      message: 'Job status updated',
      job: updatedJob,
    });
  } catch (err) {
    console.error('Error updating job status:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
