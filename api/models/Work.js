const mongoose = require("mongoose");

const WorkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  organisation: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  there: {
    type: Boolean,
    default: false,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Work", WorkSchema);
