const mongoose = require("mongoose");

const FollowupHistorySchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  conversation: {
    type: String,
    default: "",
    trim: true,
  },
  status: {
    type: String,
    default: "In Follow-up",
  },
  next_followup_date: {
    type: Date,
    default: null,
  },
  taken_by: {
    type: String,
    default: "",
    trim: true,
  },
  next_followup_by: {
    type: String,
    default: "",
    trim: true,
  },
  followup_round: {
    type: String,
    default: "1st Follow-up",
    trim: true,
  },
}, { _id: true });

const StudentLeadSchema = new mongoose.Schema({
  lead_ID: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  // Section 1: Student Detail Section
  student_name: {
    type: String,
    required: [true, "Student name is required"],
    trim: true,
  },
  address: {
    type: String,
    default: "",
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
  },
  school_name: {
    type: String,
    default: "",
    trim: true,
  },
  current_education: {
    type: String,
    default: "",
    trim: true,
  },

  // Section 2: Workshop Section
  is_from_workshop: {
    type: Boolean,
    default: false,
  },
  workshop_school_name: {
    type: String,
    default: "",
    trim: true,
  },
  workshop_date: {
    type: Date,
    default: null,
  },
  source_other: {
    type: String,
    default: "Direct Walk-in",
    trim: true,
  },

  // Section 3: Demo Class Section (if taken)
  demo_class_taken: {
    type: Boolean,
    default: false,
  },
  demo_date: {
    type: Date,
    default: null,
  },
  interested_course: {
    type: String,
    default: "",
    trim: true,
  },
  interest_level: {
    type: String,
    enum: ["High", "Medium", "Low", "Not Interested", ""],
    default: "Medium",
  },
  problems_faced: {
    type: String,
    default: "",
    trim: true,
  },
  remarks: {
    type: String,
    default: "",
    trim: true,
  },

  // Section 4: Current Followup Section
  conversation_notes: {
    type: String,
    default: "",
    trim: true,
  },
  status: {
    type: String,
    enum: ["New Inquiry", "In Follow-up", "Demo Scheduled", "Demo Completed", "Converted", "Lost"],
    default: "New Inquiry",
  },
  next_followup_date: {
    type: Date,
    default: null,
  },
  next_followup_by: {
    type: String,
    default: "",
    trim: true,
  },
  followup_round: {
    type: String,
    default: "1st Follow-up",
    trim: true,
  },
  followup_taken_by: {
    type: String,
    default: "",
    trim: true,
  },
  followup_history: [FollowupHistorySchema],

  is_deleted: {
    type: Boolean,
    default: false,
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

// Indexes for ultra-fast search and queries
StudentLeadSchema.index({ phone: 1 });
StudentLeadSchema.index({ status: 1 });
StudentLeadSchema.index({ is_from_workshop: 1 });
StudentLeadSchema.index({ is_deleted: 1, created_at: -1 });

module.exports = mongoose.model("StudentLead", StudentLeadSchema);
