const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  message: {
    type: String,
  },
  createdOn: {
    type: Number,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Message", MessageSchema);
