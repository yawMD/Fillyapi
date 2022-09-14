const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  job: {
    type: String,
    required: true,
    ref: "Job",
  },
  employer: {
    type: String,
    required: true,
    ref: "User",
  },
  employee: {
    type: String,
    required: true,
    ref: "User",
  },
  commencementDate: {
    type: Number,
  },
  terminationDate: {
      type: Number
  },
  salary: {
      type: Number
  },
  type: {
    type: String
  },
  paymentFrequency: {
    type: String
  },
  extra: {
    type: String
  },
  terminationSet: {
    type: Boolean,
    default: false,
  },
  cancelled: {
    type: Boolean,
    default: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  accepted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
