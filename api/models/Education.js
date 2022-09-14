const mongoose = require("mongoose");

const EducationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  programme: {
    type: String,
    required: true,
  },
  institution: {
    type: String,
    required: true,
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

module.exports = mongoose.model("Education", EducationSchema);
