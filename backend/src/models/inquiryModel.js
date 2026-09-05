const mongoose = require("mongoose");

const InquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    course: {
        type: String,
        default: "General Inquiry",
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "New",
        enum: ["New", "Contacted"],
    },
    is_read: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
});

// Indexes for ultra-fast query performance
InquirySchema.index({ is_read: 1, created_at: -1 });
InquirySchema.index({ created_at: -1 });

const Inquiry = mongoose.model("Inquiry", InquirySchema);
module.exports = Inquiry;
