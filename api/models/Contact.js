const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  card: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },  
});

module.exports = mongoose.model("Contact", ContactSchema);
