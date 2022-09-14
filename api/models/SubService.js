const mongoose = require("mongoose");

const SubServiceSchema = new mongoose.Schema({
  service: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("SubService", SubServiceSchema);
