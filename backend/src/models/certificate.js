const mongoose = require("mongoose");
const { type } = require("node:os");

const CertificateSchema = new mongoose.Schema({

    student_name: {
        type: String,
        required: true,
    },
    student_ID: {
        type: String,
        required: true,
    },
    student_password:{
        type:String,
        required: true,
    },

    status: {
        type: String,
        required: true,
        default: "pending",
    },
    certificate_photo: {
        type: String,
        default: "",
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

const Certificate  = mongoose.model("Certificate ", CertificateSchema);
module.exports = Certificate ;