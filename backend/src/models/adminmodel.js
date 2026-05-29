const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
  },


  auth_key: {
    type: String,
    default: null,
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