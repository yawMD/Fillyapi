const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  uid: {
    type: String,
  },
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isMatched: {
    type: Boolean,
    default: false,
  },
  profile: {
    type: Object,
  },
});

module.exports = mongoose.model("Profile", ProfileSchema);
