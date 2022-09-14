const mongoose = require("mongoose");

const InterviewSchema = new mongoose.Schema({
  application: {
    type: String,
    required: true,
    ref: "Application",
  },
  user: {
    type: String,
    required: true,
    ref: "User",
  },
  time: {
    type: Number,
  },
  cancelled: {
    type: Boolean,
    default: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Interview", InterviewSchema);
