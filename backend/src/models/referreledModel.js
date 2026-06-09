const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const referredSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    default: "",
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    unique: true,
  },
  total_student: {
    type: Number,
    default: 0,
  },
  amount: {
    total: {
      type: Number,
      default: 0,
    },
    pending: {
      type: Number,
      default: 0,
    },
    paid: {
      type: Number,
      default: 0,
    },
  },
  auth_key: {
    type: String,
    default: null,
    select: false,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Plugins
referredSchema.plugin(mongoosePaginate);

const referred = mongoose.model("referred", referredSchema);
module.exports = referred;
