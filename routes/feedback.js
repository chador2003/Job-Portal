const express = require("express");
const router = express.Router();
const Feedback = require("../models/feedback");

// POST feedback
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newFeedback = new Feedback({ name, email, subject, message });
    await newFeedback.save();

    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
