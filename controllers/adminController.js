// controllers/adminController.js
const JobCategory = require('../models/jobCategory');
const User = require('../models/userModel');
const Job = require('../models/jobModel');

exports.getAdminStats = async (req, res) => {
  try {
    const totalCategories = await JobCategory.countDocuments();
    const totalEmployers = await User.countDocuments({ role: 'poster' });
    const totalCandidates = await User.countDocuments({ role: 'seeker' });
    const totalJobs = await Job.countDocuments();

    res.json({ totalCategories, totalEmployers, totalCandidates, totalJobs });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
