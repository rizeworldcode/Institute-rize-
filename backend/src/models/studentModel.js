const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const bcrypt = require('bcryptjs');

const StudentSchema = new mongoose.Schema({
    student_name: {
        type: String,
        required: [true, 'Student name is required'],
        trim: true,
    },
    student_ID: {
        type: String,
        required: [true, 'Student ID is required'],
        unique: true,
        trim: true,
    },
    student_password: {
        type: String,
        required: [true, 'Password is required'],
        select: false,
    },
    fee_status: {
        type: String,
        required: true,
        enum: ['pending', 'clear', 'partially-paid'],
        default: "pending",
    },
    certificate_photo: {
        type: String,
        default: "",
    },
    selected_course_name: {
        type: String,
        required: true,
        trim: true,
    },
    course_duration: {
        type: String,
        required: true,
    },
    total_fee: {
        type: Number,
        required: true,
        default: 0,
    },
    total_paid_fee: {
        type: Number,
        required: true,
        default: 0,
    },
    fee: [{
        amount: {
            type: Number,
            default: 0,
        },
        utr_Number: {
            type: String,
            default: "",
            trim: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        payment_method: {
            type: String,
            enum: {
                values: ['cash', 'online', 'cheque'],
                message: '{VALUE} is not a valid payment method'
            },
            lowercase: true,
            default: "cash",
        },
    }],
    phone: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        default: "",
        trim: true,
        lowercase: true,
    },
    address: {
        type: String,
        default: "",
    },
    course_start_date: {
        type: Date,
    },
    course_end_date: {
        type: Date,
    },
    fee_installment: {
        type: Number,
        default: 1,
    },
    referred_by_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "referred",
        default: null,
    },
    auth_key: {
        type: String,
        default: null,
        select: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Plugins
StudentSchema.plugin(mongoosePaginate);

// Password Hashing
StudentSchema.pre('save', async function (next) {
    if (!this.isModified('student_password')) return next();
    this.student_password = await bcrypt.hash(this.student_password, 12);
    next();
});

// Methods
StudentSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const Student = mongoose.model("Student", StudentSchema);
module.exports = Student;
