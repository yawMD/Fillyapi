const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  user: { type: String, ref: "User", required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  post_location: { type: String, required: true },
  job_location: { type: String, required: true },
  job_type: { type: String, required: true, default: "fulltime" },
  project_type: { type: String, required: true },
  skills: { type: Array, required: true },
  budget_type: { type: String, required: true },
  budget: { type: Number },
  skill_level: { type: String, required: true },
  skill_text: { type: String, required: true },
  project_length: { type: String, required: true },
  weekly_hours: { type: String },
  payment: { type: Boolean, default: false },
  available: { type: Boolean, default: false },
  createdOn: { type: Number, default: Date.now() },
});

module.exports = mongoose.model("Job", JobSchema);
