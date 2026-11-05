const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["superadmin", "staff"],
    default: "staff",
  },
  permissions: {
    type: [String],
    default: [],
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    default: null,
  },
  password: {
    type: String,
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Number,
  },
  auth_key: {
    type: String,
    default: null,
  },

  referrel_amount: {
    type: Number,
    default: 0,
  },
  
  notificationToken: {
    type: String,
    default: null,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const admin = mongoose.model("admin", adminSchema);
module.exports = admin;