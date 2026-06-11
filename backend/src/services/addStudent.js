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

        // Calculate status based on fees for first admission
        const paid = parseFloat(total_paid_fee || 0);
        const total = parseFloat(total_fee || 0);
        const pendingFee = Math.max(0, total - paid);
        const calculatedStatus = (total > 0 && paid >= total) ? "Clear" : (paid > 0 ? "Partial" : "Pending");

        // Prepare first admission
        const firstAdmission = {
            admissionId: `ADM-${Date.now()}`,
            courses: Array.isArray(selected_course_name) ? selected_course_name : (selected_course_name ? [selected_course_name] : []),
            courseDuration: course_duration,
            totalFee: total,
            totalPaidFee: paid,
            pendingFee,
            feesStatus: calculatedStatus,
            feesInstallment: parseInt(fee_installment || "1"),
            payments: paid > 0 ? [{
                amount: paid,
                paymentMethod: fee_type || "cash",
                utrNumber: (fee_type && fee_type.toLowerCase() === "online") ? (fee_utr || "") : "",
                date: Date.now()
            }] : [],
            certificates: [],
            startDate: course_start_date ? new Date(course_start_date) : new Date(),
            endDate: course_end_date ? new Date(course_end_date) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days later
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        // Prepare initial fee entry for backward compatibility
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
            student_password, // Pass plain password, model hook will hash it
            selected_course_name: firstAdmission.courses,
            course_duration,
            total_fee: total,
            total_paid_fee: paid,
            pending_fee: pendingFee,
            fee: [feeEntry],
            phone,
            email,
            address,
            course_start_date: course_start_date ? new Date(course_start_date) : undefined,
            course_end_date: course_end_date ? new Date(course_end_date) : undefined,
            fee_installment: fee_installment || "1",
            admissions: [firstAdmission]
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
      fee_installment,
      certificate_course,
      // New fields for admissions
      add_admission,
      admission_payments
    } = req.body;

    let add_courses = [];
    if (req.body.add_courses) {
      try {
        add_courses = JSON.parse(req.body.add_courses);
      } catch (e) {
        console.error("Error parsing add_courses:", e);
      }
    }

    let parsedAddAdmission = null;
    if (add_admission) {
      try {
        parsedAddAdmission = JSON.parse(add_admission);
      } catch (e) {
        console.error("Error parsing add_admission:", e);
      }
    }

    let parsedAdmissionPayments = [];
    if (admission_payments) {
      try {
        parsedAdmissionPayments = JSON.parse(admission_payments);
      } catch (e) {
        console.error("Error parsing admission_payments:", e);
      }
    }

    // Find existing student by student_ID
    const existingcertificate = await certificate_model.findOne({ student_ID: student_iD });

    if (!existingcertificate) {
      return {
        success: false,
        message: "student not found",
      };
    }

    if (student_password && student_password.trim() !== "") {
      existingcertificate.student_password = student_password; // Plain password, model hook will hash it
    }

    // Ensure admissions array exists - convert old data if needed
    if (!existingcertificate.admissions || existingcertificate.admissions.length === 0) {
      // Convert old student data to a single admission
      const oldAdmission = {
        admissionId: `ADM-${Date.now()}-legacy`,
        courses: Array.isArray(existingcertificate.selected_course_name) 
          ? existingcertificate.selected_course_name 
          : (existingcertificate.selected_course_name ? [existingcertificate.selected_course_name] : []),
        courseDuration: existingcertificate.course_duration || "1 Month",
        totalFee: existingcertificate.total_fee || 0,
        totalPaidFee: existingcertificate.total_paid_fee || 0,
        pendingFee: existingcertificate.pending_fee || (existingcertificate.total_fee - existingcertificate.total_paid_fee) || 0,
        feesStatus: existingcertificate.status || "Pending",
        feesInstallment: existingcertificate.fee_installment || 0,
        payments: existingcertificate.fee || [],
        certificates: existingcertificate.certificates || [],
        startDate: existingcertificate.course_start_date || new Date(),
        endDate: existingcertificate.course_end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: existingcertificate.createdAt || Date.now(),
        updatedAt: Date.now()
      };
      
      existingcertificate.admissions.push(oldAdmission);
    } else {
      // Ensure all existing admissions have required fields with defaults (update in place)
      existingcertificate.admissions.forEach((adm, index) => {
        const defaultEndDate = new Date();
        defaultEndDate.setMonth(defaultEndDate.getMonth() + 3);
        
        if (!adm.admissionId) {
          adm.admissionId = adm.admission_id || `ADM-${Date.now()}-${index}`;
        }
        if (!Array.isArray(adm.courses) || adm.courses.length === 0) {
          adm.courses = Array.isArray(adm.courses) ? adm.courses : (adm.selected_course_name ? (Array.isArray(adm.selected_course_name) ? adm.selected_course_name : [adm.selected_course_name]) : []);
        }
        if (!adm.courseDuration) {
          adm.courseDuration = adm.course_duration || "N/A";
        }
        if (adm.totalFee === undefined || adm.totalFee === null) {
          adm.totalFee = adm.total_fee || 0;
        }
        if (adm.totalPaidFee === undefined || adm.totalPaidFee === null) {
          adm.totalPaidFee = adm.total_paid_fee || 0;
        }
        if (adm.pendingFee === undefined || adm.pendingFee === null) {
          adm.pendingFee = adm.pending_fee || (adm.totalFee - adm.totalPaidFee) || 0;
        }
        if (!adm.feesStatus) {
          adm.feesStatus = adm.status || "Pending";
        }
        if (adm.feesInstallment === undefined || adm.feesInstallment === null) {
          adm.feesInstallment = adm.fee_installment || 0;
        }
        if (!adm.payments) {
          adm.payments = [];
        }
        if (!adm.certificates) {
          adm.certificates = [];
        }
        if (!adm.startDate) {
          adm.startDate = adm.course_start_date || new Date();
        }
        if (!adm.endDate) {
          adm.endDate = adm.course_end_date || defaultEndDate;
        }
        adm.updatedAt = Date.now();
      });
    }

    // Handle adding a new admission
    if (parsedAddAdmission) {
      const newAdm = parsedAddAdmission;
      const total = parseFloat(newAdm.totalFee || 0);
      const paid = parseFloat(newAdm.paidFee || 0);
      const pending = Math.max(0, total - paid);
      const status = (total > 0 && paid >= total) ? "Clear" : (paid > 0 ? "Partial" : "Pending");

      const newAdmission = {
                admissionId: newAdm.admissionId || `ADM-${Date.now()}`,
                courses: Array.isArray(newAdm.courses) ? newAdm.courses : (newAdm.courses ? [newAdm.courses] : []),
                courseDuration: newAdm.courseDuration,
                totalFee: total,
                totalPaidFee: paid,
                pendingFee: pending,
                feesStatus: status,
                feesInstallment: parseInt(newAdm.feesInstallment || "0"),
                payments: paid > 0 ? [{
                    amount: paid,
                    paymentMethod: newAdm.feeType || "cash",
                    utrNumber: (newAdm.feeType && newAdm.feeType.toLowerCase() === "online") ? (newAdm.utrNumber || "") : "",
                    date: Date.now()
                }] : [],
                certificates: [],
                startDate: newAdm.startDate ? new Date(newAdm.startDate) : new Date(),
                endDate: newAdm.endDate ? new Date(newAdm.endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days later
                createdAt: Date.now(),
                updatedAt: Date.now()
            };

      existingcertificate.admissions.push(newAdmission);
    }

    // Handle admission payments
    if (Array.isArray(parsedAdmissionPayments) && parsedAdmissionPayments.length > 0) {
      for (const payment of parsedAdmissionPayments) {
        const admissionIndex = existingcertificate.admissions.findIndex(
          (adm) => adm.admissionId === payment.admissionId
        );

        if (admissionIndex !== -1) {
          const admission = existingcertificate.admissions[admissionIndex];
          const paymentAmount = parseFloat(payment.amount || 0);
          if (paymentAmount > 0) {
            const newTotalPaid = admission.totalPaidFee + paymentAmount;
            const newPending = Math.max(0, admission.totalFee - newTotalPaid);
            const newStatus = (admission.totalFee > 0 && newTotalPaid >= admission.totalFee) ? "Clear" : (newTotalPaid > 0 ? "Partial" : "Pending");

            // Update admission in place
            admission.totalPaidFee = newTotalPaid;
            admission.pendingFee = newPending;
            admission.feesStatus = newStatus;
            admission.payments.push({
              amount: paymentAmount,
              paymentMethod: payment.type || "cash",
              utrNumber: (payment.type && payment.type.toLowerCase() === "online") ? (payment.utr || "") : "",
              date: Date.now()
            });
            admission.updatedAt = Date.now();
          }
        }
      }
    }

    // Handle old fee entry (backward compatibility)
    if (fee_amount && !parsedAdmissionPayments.length) {
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

    // Update overall student totals and status from admissions
    if (existingcertificate.admissions.length > 0) {
      // Calculate overall totals
      const overallTotalFee = existingcertificate.admissions.reduce((sum, adm) => sum + (adm.totalFee || 0), 0);
      const overallTotalPaid = existingcertificate.admissions.reduce((sum, adm) => sum + (adm.totalPaidFee || 0), 0);
      const overallPending = existingcertificate.admissions.reduce((sum, adm) => sum + (adm.pendingFee || 0), 0);
      
      // Calculate overall status
      const allClear = existingcertificate.admissions.every((adm) => adm.feesStatus === "Clear");
      const anyPaid = existingcertificate.admissions.some((adm) => adm.totalPaidFee > 0);
      let overallStatus = "Pending";
      if (allClear) overallStatus = "Clear";
      else if (anyPaid) overallStatus = "Partial";

      // Update old fields for backward compatibility
      existingcertificate.total_fee = overallTotalFee;
      existingcertificate.total_paid_fee = overallTotalPaid;
      existingcertificate.pending_fee = overallPending;
      existingcertificate.status = overallStatus;
      
      // Collect all courses
      const allCourses = [...new Set(existingcertificate.admissions.flatMap((adm) => adm.courses || []))];
      existingcertificate.selected_course_name = allCourses;
    } else if (total_fee) {
      existingcertificate.total_fee = total_fee;
    }

    if (fee_installment) {
      existingcertificate.fee_installment = fee_installment;
    }

    // Handle adding new courses (backward compatibility)
    if (add_courses && Array.isArray(add_courses)) {
      add_courses.forEach(course => {
        if (!existingcertificate.selected_course_name.includes(course)) {
          existingcertificate.selected_course_name.push(course);
        }
      });
    }

    // Handle new certificate upload for a specific course and admission
    console.log("=== Certificate upload section ===");
    console.log("req.files:", req.files);
    console.log("req.body.certificate_course:", certificate_course);
    console.log("req.body.certificate_admission_id:", req.body.certificate_admission_id);
    
    if (
      req.files &&
      req.files["certificate_photo"] &&
      req.files["certificate_photo"].length > 0 &&
      certificate_course &&
      req.body.certificate_admission_id
    ) {
      const certificateFilePath = req.files["certificate_photo"][0].path; // Cloudinary URL
      const admissionId = req.body.certificate_admission_id;
      console.log("certificateFilePath:", certificateFilePath);
      console.log("admissionId to find:", admissionId);
      console.log("existingcertificate.admissions:", existingcertificate.admissions.map(a => ({ admissionId: a.admissionId, certificates: a.certificates })));
      
      // Find the admission by admissionId
      const admissionIndex = existingcertificate.admissions.findIndex(
        adm => adm.admissionId === admissionId
      );
      
      console.log("admissionIndex found:", admissionIndex);
      
      if (admissionIndex !== -1) {
        // Add certificate to the admission's certificates array
        const newCert = {
          courseName: certificate_course,
          certificatePath: certificateFilePath,
          issuedAt: Date.now()
        };
        existingcertificate.admissions[admissionIndex].certificates.push(newCert);
        console.log("Added new certificate to admission:", newCert);
        
        // Also add to student's top-level certificates array for backward compatibility
        existingcertificate.certificates.push({
          course_name: certificate_course,
          certificate_path: certificateFilePath,
          issued_at: Date.now()
        });
        console.log("Updated admissions array after adding cert:", existingcertificate.admissions[admissionIndex].certificates);
      }
    } else {
      console.log("Certificate upload condition not met!");
    }

    existingcertificate.updated_at = Date.now();

    console.log("=== existingcertificate.admissions before save ===");
    console.log(existingcertificate.admissions);
    console.log("=== existingcertificate.admissions mapped ===");
    console.log(existingcertificate.admissions.map(adm => ({ admissionId: adm.admissionId, ...adm })));

    await existingcertificate.save();

    return {
      success: true,
      message: 'student updated successfully',
      data: existingcertificate,
    };

  } catch (error) {

    return {
      success: false,
      message: error.message || 'Internal server error',
    };

  }
};