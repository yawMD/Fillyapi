const mongoose = require("mongoose");

const BillingSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    ref: "User",
  },
  type: {
    type: String,
    required: true,
  },
  card: {
    type: String,
  },
  phone: {
    type: String,
  },
  name: {
    first: {
      type: String,
      required: true,
    },
    last: {
      type: String,
      required: true,
    },
  },
  expire : {
    type: Number,
  },
  code: {
    type: String,
  },
  address: {
    first: {
      type: String,
    },
    second: {
      type: String,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    postal: {
      type: String,
    },
  },
});

module.exports = mongoose.model("Billing", BillingSchema);
