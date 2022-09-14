const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordUpdates: {
    type: Number,
    default: 0
  },
  lastPasswordChange: {
    type: Number,
  },
  initialized: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
  },
  status: {
    type: String,
  },
  registeredOn: {
    type: Number,
    default: Date.now(),
  },
  fbUid: {
    type: String,
    default: Date.now(),
  },
  gender: {
    type: String,
  },
  dob: {
    type: String,
  },
  hometown: {
    type: String,
  },
  country: {
    type: String,
  },
  region: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  zip: {
    type: String,
  },
  fb: {
    type: String,
  },
  ig: {
    type: String,
  },
  tt: {
    type: String,
  },
  li: {
    type: String,
  },
  about: {
    type: String,
  },
  category: {
    type: String,
  },
  service: {
    type: String,
  },
  tag: {
    type: String,
  },
  pic: {
    type: String,
  },
  skill: {
    type: Array,
  },
  subservice: {
    type: Array,
  },
  hireable: {
    type: Boolean,
    default: false,
  },
  isFreelancer: {
    type: Boolean,
    default: false,
  },
  set: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
  },
  agencyEmail: {
    type: String,
  },
  website: {
    type: String,
  },
  staffSize: {
    type: String,
  },
  role: {
    type: String,
  },
  specialty: {
    type: String,
  },
  hiringBudget: {
    type: String,
  },
  serviceCost: {
    type: Number,
  },
  verified: {
    type: Boolean,
    default: false
  },
  level: {
    type: String,
    default: 'entry'
  },
});


UserSchema.virtual("services", {
  ref:"ServiceEntry",
  localField:"_id",
  foreignField:"user"
})

module.exports = mongoose.model("User", UserSchema);


