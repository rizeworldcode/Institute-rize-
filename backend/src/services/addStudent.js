const certificate_model = require("../models/studentModel");
const referred_model = require("../models/referreledModel");
const admin_model = require("../models/adminmodel");
const bcrypt = require("bcryptjs");
const path = require('path');
const fs = require('fs');

exports.add_student = async (req,res) => {
    try {
        const { 
            student_name, 
            student_ID, 
            student_password,
            selected_course_name,
            course_duration,
            total_fee,
            total_paid_fee,
            fee_type,
            fee_utr,
            phone,
            email,
            address,
            course_start_date,
            course_end_date,
            fee_installment,
            referredByName,
            referredByPhone,
            referredByEmail,
            referredAmount
        } = req.body

        const existingStudentTc = await certificate_model.findOne({ student_ID: student_ID })
        if (existingStudentTc) {
            return {
                message: "student already exists",
                success: false,
            };
        }

        const hashedPassword = await bcrypt.hash(student_password, 10);
        
        // Calculate status based on fees
        const paid = parseFloat(total_paid_fee || 0);
        const total = parseFloat(total_fee || 0);
        const calculatedStatus = (total > 0 && paid >= total) ? "Clear" : "Pending";

        // Prepare initial fee entry
        const feeEntry = {
            amount: total_paid_fee || "0",
            payment_method: fee_type || "cash",
            date: Date.now()
        };

        // Add UTR number only if payment type is online
        if (fee_type && fee_type.toLowerCase() === "online") {
            feeEntry.utr_Number = fee_utr || "";
        }

        const student_Data = new certificate_model({ 
            student_name, 
            student_ID, 
            status: calculatedStatus, 
            student_password: hashedPassword,
            selected_course_name,
            course_duration,
            total_fee,
            total_paid_fee: total_paid_fee || "0",
            fee: [feeEntry],
            phone,
            email,
            address,
            course_start_date: course_start_date ? new Date(course_start_date) : undefined,
            course_end_date: course_end_date ? new Date(course_end_date) : undefined,
            fee_installment: fee_installment || "1"
        });

        // Handle Referral Logic
        if (referredByName && referredByPhone) {
            try {
                let referrer = await referred_model.findOne({ phone: referredByPhone });
                
                // Use explicit referredAmount if provided, else fallback to admin config
                let refAmount = parseFloat(referredAmount || 0);
                if (!referredAmount) {
                    const adminConfig = await admin_model.findOne();
                    refAmount = adminConfig ? (adminConfig.referrel_amount || 0) : 0;
                }

                if (!referrer) {
                    referrer = new referred_model({
                        name: referredByName,
                        phone: referredByPhone,
                        email: referredByEmail || "",
                        total_student: 1,
                        amount: {
                            total: refAmount.toString(),
                            pending: refAmount.toString(),
                            paid: "0"
                        }
                    });
                } else {
                    referrer.total_student += 1;
                    if (referredByEmail) referrer.email = referredByEmail;
                    
                    const currentTotal = parseFloat(referrer.amount.total || 0);
                    const currentPaid = parseFloat(referrer.amount.paid || 0);
                    
                    const newTotal = currentTotal + refAmount;
                    referrer.amount.total = newTotal.toString();
                    referrer.amount.pending = (newTotal - currentPaid).toString();
                    referrer.updated_at = Date.now();
                }
                
                const savedReferrer = await referrer.save();
                student_Data.referred_by_id = savedReferrer._id;
            } catch (refError) {
                console.error("Referral processing error:", refError);
                // We continue student creation even if referral processing fails
            }
        }

        if (!student_Data) {
            return {
                message: "student addition failed",
                success: false,
            };
        }

        // Persist to database
        const saved = await student_Data.save();

        return {
            student_Data: saved,
            message: "student added successfully",
            success: true,
        };
    } catch (error) {
        console.log(error);
        return {
            message: error.message || "Internal server error",
            success: false,
        };
    }
}

exports.certificate_view = async (req,res)=>{
  const { student_ID } = req.params || {};
  try {
    // Accept either the external student_ID (e.g., DWPS2026001) or a Mongo ObjectId
    let certificate_data = null;
    try {
      const mongoose = require('mongoose');
      if (mongoose.isValidObjectId(student_ID)) {
        certificate_data = await certificate_model.findById(student_ID);
      }
    } catch (innerErr) {
      // ignore mongoose require errors and fallback to lookup by student_ID
    }

    if (!certificate_data) {
      certificate_data = await certificate_model.findOne({ student_ID });
    }

    if(!certificate_data){
      return{
        message:"certificate not found",
        success:false
      }
    }

    return{
      certificate_data,
      certificate_photo:certificate_data.certificate_photo,
      message:"certificate fetch successfully",
      success:true
    }
  } catch (error) {
    console.log(error);
    return{
      message:error.message || "Internal server error",
      success: false,
    }
  }
}

exports.updateStudentdetails = async (req, res) => {
  try {

    const { student_iD } = req.params || {};

    const {
      student_password,
      fee_amount,
      fee_type,
      fee_utr,
      total_fee,
      fee_installment
    } = req.body;

    // Find existing student by student_ID
    const existingcertificate = await certificate_model.findOne({ student_ID: student_iD });

    if (!existingcertificate) {
      return {
        success: false,
        message: "student not found",
      };
    }

    if (student_password && student_password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(student_password, 10);
      existingcertificate.student_password = hashedPassword;
    }

    if (total_fee) {
      existingcertificate.total_fee = total_fee;
    }

    if (fee_installment) {
      existingcertificate.fee_installment = fee_installment;
    }

    // Handle new fee entry if amount is provided
    if (fee_amount) {
      const feeEntry = {
        amount: fee_amount,
        payment_method: fee_type || "cash",
        date: Date.now()
      };

      if (fee_type === "online") {
        feeEntry.utr_Number = fee_utr || "";
      }

      existingcertificate.fee.push(feeEntry);

      // Recalculate total_paid_fee
      // Sum all amounts in the fee array
      const totalPaid = existingcertificate.fee.reduce((sum, item) => {
        return sum + parseFloat(item.amount || 0);
      }, 0);
      
      existingcertificate.total_paid_fee = totalPaid.toString();

      // Recalculate status based on new total paid
      const totalFee = parseFloat(existingcertificate.total_fee || 0);
      if (totalPaid >= totalFee && totalFee > 0) {
        existingcertificate.status = "Clear";
      } else if (totalPaid > 0) {
        existingcertificate.status = "Partial";
      } else {
        existingcertificate.status = "Pending";
      }
    }

    // Handle new certificate photo if uploaded
    if (
      req.files &&
      req.files["certificate_photo"] &&
      req.files["certificate_photo"].length > 0
    ) {
      // Delete old photo if it exists
      if (existingcertificate.certificate_photo) {
        const oldFilePath = path.join(
          __dirname,
          "..",
          "..",
          "public",
          existingcertificate.certificate_photo
        );
        try {
          if (fs.existsSync(oldFilePath)) {
            await fs.unlink(oldFilePath);
            console.log("Old photo deleted successfully");
          }
        } catch (err) {
          console.log("Error deleting old photo:", err);
        }
      }

      // Store new path
      existingcertificate.certificate_photo = `uploads/${req.files["certificate_photo"][0].filename}`;
    }

    existingcertificate.updated_at = Date.now();

    await existingcertificate.save();

    return {
      success: true,
      message: 'certificate updated successfully',
      data: existingcertificate,
    };

  } catch (error) {

    return {
      success: false,
      message: error.message || 'Internal server error',
    };

  }
};