const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const mongoosePaginate = require('mongoose-paginate-v2');

const referredSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
    password: {
    type: String,
    required: true,
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
    otp: {
    type: String,
  },
  otpExpiry: { type: Date },
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

// Hash password before saving
referredSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Hash password before updating
referredSchema.pre('findOneAndUpdate', async function (next) {
  try {
    if (this.getUpdate().password) {
      const salt = await bcrypt.genSalt(10);
      this.getUpdate().password = await bcrypt.hash(this.getUpdate().password, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
referredSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Plugins
referredSchema.plugin(mongoosePaginate);

const referred = mongoose.model("referred", referredSchema);
module.exports = referred;
