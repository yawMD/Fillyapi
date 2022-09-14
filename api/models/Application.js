const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  job: {
    type: String,
    required: true,
    ref: "Job",
  },
  applicant: {
    type: String,
    required: true,
    ref: "User",
  },
  poster: {
    type: String,
    required: true,
    ref: "User",
  },
  accepted: {
    type: Boolean,
    default: false,
  },
  rejected: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Application", ApplicationSchema);
