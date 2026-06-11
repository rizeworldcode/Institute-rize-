const mongoose = require('mongoose');

// Schema for a single certificate (per admission)
const CertificateSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true
  },
  certificatePath: {
    type: String,
    required: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  }
});

// Schema for a single payment entry
const PaymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Online', 'Cash'],
    default: 'Cash'
  },
  utrNumber: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Schema for a single admission (what the user calls a "model")
const AdmissionSchema = new mongoose.Schema({
  admissionId: {
    type: String,
    required: true
  },
  courses: {
    type: [String],
    required: true,
    default: []
  },
  courseDuration: {
    type: String,
    required: true,
    default: "N/A"
  },
  totalFee: {
    type: Number,
    required: true,
    default: 0
  },
  totalPaidFee: {
    type: Number,
    required: true,
    default: 0
  },
  pendingFee: {
    type: Number,
    required: true,
    default: 0
  },
  feesStatus: {
    type: String,
    enum: ['Pending', 'Partial', 'Clear'],
    default: 'Pending'
  },
  feesInstallment: {
    type: Number,
    default: 0
  },
  payments: [PaymentSchema],
  certificates: [CertificateSchema],
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true,
    default: function() {
      const date = new Date();
      date.setMonth(date.getMonth() + 3); // Default to 3 months later
      return date;
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Main Student schema
const StudentSchema = new mongoose.Schema({
  student_ID: {
    type: String,
    required: true,
    unique: true
  },
  student_name: {
    type: String,
    required: true
  },
  student_password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    default: ''
  },
  // For backward compatibility
  selected_course_name: {
    type: [String],
    default: []
  },
  course_duration: {
    type: String,
    default: ''
  },
  total_fee: {
    type: Number,
    default: 0
  },
  total_paid_fee: {
    type: Number,
    default: 0
  },
  pending_fee: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Partial', 'Clear'],
    default: 'Pending'
  },
  fee: [{
    amount: Number,
    payment_method: String,
    date: Date,
    utr_Number: String
  }],
  certificate_photo: {
    type: String,
    default: ''
  },
  course_start_date: {
    type: Date
  },
  course_end_date: {
    type: Date
  },
  fee_installment: {
    type: Number,
    default: 0
  },
  referredByName: {
    type: String,
    default: ''
  },
  referredByPhone: {
    type: String,
    default: ''
  },
  referredByEmail: {
    type: String,
    default: ''
  },
  referredAmount: {
    type: Number,
    default: 0
  },
  // New structure: multiple admissions
  admissions: [AdmissionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
StudentSchema.pre('save', function (next) {
  if (!this.isModified('student_password')) {
    // return next();
  }
  
  // Ensure all admissions have an admissionId
  if (this.admissions && this.admissions.length > 0) {
    this.admissions.forEach((adm, index) => {
      if (!adm.admissionId) {
        adm.admissionId = `ADM-${Date.now()}-legacy-${index}`;
      }
      // Also ensure other required fields have defaults
      if (!adm.courseDuration) adm.courseDuration = "N/A";
      if (!adm.startDate) adm.startDate = new Date();
      if (!adm.endDate) {
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 3);
        adm.endDate = endDate;
      }
    });
  }
  
  // If password is being updated, you should hash it here
  next();
});

const Student = mongoose.model('Student', StudentSchema);
module.exports = Student;
