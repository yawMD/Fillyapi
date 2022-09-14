const mongoose = require("mongoose");

const ServiceCategoriesSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  },
  date_added: {
    type: Number,
    default: Date.now(),
  },
});

module.exports = mongoose.model("ServiceCategories", ServiceCategoriesSchema);
