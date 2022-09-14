const mongoose = require("mongoose");

const ServicesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  service_category: {
    type: String,
    default: "uncategorized",
  },
  enabled: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Services", ServicesSchema);
