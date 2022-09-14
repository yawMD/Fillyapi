const mongoose = require("mongoose");

const CategoriesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  },
  slud: {
    type: String,
    unique: false,
    default: Date.now(),
  },
  image: {
    type: String,
    required: true,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Categories", CategoriesSchema);
