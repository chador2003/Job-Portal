const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: {
      type: String,
      enum: ["Full Time", "Part Time", "Contract"],
      required: true,
    },
    salary: { type: String },
    vacancy: { type: Number, required: true },
    deadline: { type: Date, required: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    howToApply: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    category: {
      type: String, // If you're storing category name directly
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema, "job_postings"); // ✅ this is correct