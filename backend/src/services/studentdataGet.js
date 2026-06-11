const student_model = require("../models/studentModel");
const referred_model = require("../models/referreledModel");

exports.allStudents = async (req,res) => {
    try {
        const Studentdata = await student_model.find().sort({ created_at: -1 });
        
        // Calculate stats
        const totalEntries = Studentdata.length;
        
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));
        const twentyFourHoursAgo = new Date(now.getTime() - (24 * 24 * 60 * 60 * 1000));

        const last30DaysCount = Studentdata.filter(s => new Date(s.created_at) >= thirtyDaysAgo).length;
        const prev30DaysCount = Studentdata.filter(s => new Date(s.created_at) >= sixtyDaysAgo && new Date(s.created_at) < thirtyDaysAgo).length;
        
        let growth = 0;
        if (prev30DaysCount > 0) {
            growth = ((last30DaysCount - prev30DaysCount) / prev30DaysCount) * 100;
        } else if (last30DaysCount > 0) {
            growth = 100;
        }

        const recentActivity = Studentdata.filter(s => new Date(s.created_at) >= twentyFourHoursAgo).length;

        const mappedData = Studentdata.map(student => {
            const paid = parseFloat(student.total_paid_fee || 0);
            const total = parseFloat(student.total_fee || 0);
            const pending = total - paid;

            // Process admissions to ensure they have all required fields
            let processedAdmissions = [];
            if (student.admissions && student.admissions.length > 0) {
                processedAdmissions = student.admissions.map(adm => ({
                    admissionId: adm.admissionId || adm.admission_id || `ADM-${Date.now()}-${student.student_ID}`,
                    courses: adm.courses || [],
                    courseDuration: adm.courseDuration || adm.course_duration || "N/A",
                    totalFee: adm.totalFee || adm.total_fee || 0,
                    totalPaidFee: adm.totalPaidFee || adm.total_paid_fee || 0,
                    pendingFee: adm.pendingFee || adm.pending_fee || (adm.totalFee - adm.totalPaidFee) || 0,
                    feesStatus: adm.feesStatus || adm.status || "Pending",
                    feesInstallment: adm.feesInstallment || adm.fee_installment || 0,
                    payments: adm.payments || [],
                    certificates: adm.certificates || [],
                    startDate: adm.startDate || adm.course_start_date || new Date(),
                    endDate: adm.endDate || adm.course_end_date || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                    createdAt: adm.createdAt || adm.created_at || Date.now(),
                    updatedAt: adm.updatedAt || adm.updated_at || Date.now()
                }));
            }
            
            return {
                student_name: student.student_name,
                student_ID: student.student_ID,
                selected_course_name: student.selected_course_name,
                course_duration: student.course_duration,
                total_fee: student.total_fee,
                total_paid_fee: student.total_paid_fee,
                pending_fee: pending.toString(),
                email: student.email,
                phone: student.phone,
                address: student.address,
                course_start_date: student.course_start_date,
                course_end_date: student.course_end_date,
                fee_installment: student.fee_installment,
                fee: student.fee,
                status: pending > 0 ? "Pending" : "Clear",
                created_at: student.created_at,
                admissions: processedAdmissions,
                certificates: student.certificates || [],
                referredByName: student.referredByName || "",
                referredByPhone: student.referredByPhone || "",
                referredByEmail: student.referredByEmail || "",
                referredAmount: student.referredAmount || 0
            };
        });

        return {
            success: true,
            message: "Students fetched successfully",
            data: mappedData,
            stats: {
                totalEntries,
                growth: growth.toFixed(1),
                recentActivity
            }
        };
    } catch (error) {
        console.log("Error:", error);
        return {
            success: false,
            message: "Error in fetching students",
            data: null
        }
    }
}

exports.pandingfeeStudentsData = async (req,res) => {
    try {
        const students = await student_model.find();
        
        const pendingStudents = students.filter(student => {
            const paid = parseFloat(student.total_paid_fee || 0);
            const total = parseFloat(student.total_fee || 0);
            return total > 0 && paid < total;
        });

        const mappedData = pendingStudents.map(student => {
            const paid = parseFloat(student.total_paid_fee || 0);
            const total = parseFloat(student.total_fee || 0);
            const pending = total - paid;

            return {
                student_name: student.student_name,
                student_ID: student.student_ID,
                selected_course_name: student.selected_course_name,
                course_duration: student.course_duration,
                total_fee: student.total_fee,
                total_paid_fee: student.total_paid_fee,
                pending_fee: pending.toString(),
                email: student.email,
                phone: student.phone,
                address: student.address,
                course_start_date: student.course_start_date,
                course_end_date: student.course_end_date,
                fee_installment: student.fee_installment,
                fee: student.fee,
                status: "Pending"
            };
        });

        return {
            success: true,
            message: "Pending fee students fetched successfully",
            data: mappedData
        };
    } catch (error) {
        console.log("Error:", error);
        return {
            success: false,
            message: "Error in fetching pending fee students",
            data: null
        }
    }
}

exports.clearfeeStudentsData = async (req,res) => {
    try {
        const students = await student_model.find();
        
        const clearStudents = students.filter(student => {
            const paid = parseFloat(student.total_paid_fee || 0);
            const total = parseFloat(student.total_fee || 0);
            return total > 0 && paid >= total;
        });

        const mappedData = clearStudents.map(student => {
            return {
                student_name: student.student_name,
                student_ID: student.student_ID,
                selected_course_name: student.selected_course_name,
                course_duration: student.course_duration,
                total_fee: student.total_fee,
                total_paid_fee: student.total_paid_fee,
                pending_fee: "0",
                email: student.email,
                phone: student.phone,
                address: student.address,
                course_start_date: student.course_start_date,
                course_end_date: student.course_end_date,
                fee_installment: student.fee_installment,
                fee: student.fee,
                status: "Clear"
            };
        });

        return {
            success: true,
            message: "Clear fee students fetched successfully",
            data: mappedData
        };
    } catch (error) {
        console.log("Error:", error);
        return {
            success: false,
            message: "Error in fetching clear fee students",
            data: null
        }
    }
}

exports.totalEarningsDetails = async (req, res) => {
    try {
        const students = await student_model.find();
        let transactions = [];

        students.forEach(student => {
            if (student.fee && student.fee.length > 0) {
                student.fee.forEach((f, index) => {
                    transactions.push({
                        txn_id: f.utr_Number || `TXN-${student.student_ID}-${index}`,
                        student_name: student.student_name,
                        amount: f.amount,
                        date: f.date,
                        method: f.payment_method || "cash"
                    });
                });
            }
        });

        // Sort by date descending
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        return {
            success: true,
            message: "Earnings details fetched successfully",
            data: transactions
        };
    } catch (error) {
        console.log("Error:", error);
        return {
            success: false,
            message: "Error in fetching earnings details",
            data: null
        };
    }
};

exports.certificateissuedStudentsData = async (req,res) => {
    try {
        const Studentdata = await student_model.find({certificate_photo: {$ne: ""}}).sort({ updated_at: -1 });
        
        const mappedData = Studentdata.map(student => {
            const paid = parseFloat(student.total_paid_fee || 0);
            const total = parseFloat(student.total_fee || 0);
            const pending = total - paid;
            
            return {
                student_name: student.student_name,
                student_ID: student.student_ID,
                selected_course_name: student.selected_course_name,
                course_duration: student.course_duration,
                total_fee: student.total_fee,
                total_paid_fee: student.total_paid_fee,
                pending_fee: pending.toString(),
                email: student.email,
                phone: student.phone,
                address: student.address,
                course_start_date: student.course_start_date,
                course_end_date: student.course_end_date,
                fee_installment: student.fee_installment,
                fee: student.fee,
                certificate_photo: student.certificate_photo,
                updated_at: student.updated_at
            };
        });

        return {
            success: true,
            message: "Issued certificates fetched successfully",
            data: mappedData
        };
    } catch (error) {
        console.log("Error:", error);
        return {
            success: false,
            message: "Error in fetching issued certificates",
            data: null
        }
    }
}

exports.certificateunissuedStudentsData = async (req,res) => {
    try {
        const Studentdata = await student_model.find({certificate_photo: {$eq: ""}}).sort({ created_at: -1 });
        
        const mappedData = Studentdata.map(student => {
            const paid = parseFloat(student.total_paid_fee || 0);
            const total = parseFloat(student.total_fee || 0);
            const pending = total - paid;
            
            return {
                student_name: student.student_name,
                student_ID: student.student_ID,
                selected_course_name: student.selected_course_name,
                course_duration: student.course_duration,
                total_fee: student.total_fee,
                total_paid_fee: student.total_paid_fee,
                pending_fee: pending.toString(),
                email: student.email,
                phone: student.phone,
                address: student.address,
                course_start_date: student.course_start_date,
                course_end_date: student.course_end_date,
                fee_installment: student.fee_installment,
                fee: student.fee,
                status: pending > 0 ? "Pending" : "Clear"
            };
        });

        return {
            success: true,
            message: "Unissued certificates fetched successfully",
            data: mappedData
        };
    } catch (error) {
        console.log("Error:", error);
        return {
            success: false,
            message: "Error in fetching unissued certificates",
            data: null
        }
    }
}

exports.referredStudentsData = async (req, res) => {
    try {
        const Studentdata = await student_model.find({ referred_by_id: { $ne: null } })
            .populate('referred_by_id')
            .sort({ created_at: -1 });

        const mappedData = Studentdata.map(student => {
            return {
                student_name: student.student_name,
                student_ID: student.student_ID,
                selected_course_name: student.selected_course_name,
                course_duration: student.course_duration,
                referrer_name: student.referred_by_id ? student.referred_by_id.name : "Unknown",
                referrer_phone: student.referred_by_id ? student.referred_by_id.phone : "N/A",
                created_at: student.created_at
            };
        });

        return {
            success: true,
            message: "Referred students fetched successfully",
            data: mappedData
        };
    } catch (error) {
        console.log("Error:", error);
        return {
            success: false,
            message: "Error in fetching referred students",
            data: null
        }
    }
}

exports.getAllReferrers = async (req, res) => {
    try {
        const referrers = await referred_model.find().sort({ updated_at: -1 });
        const students = await student_model.find({ referred_by_id: { $ne: null } });
        
        const mappedData = referrers.map(ref => {
            // Calculate real-time stats from student model
            const referredStudents = students.filter(s => s.referred_by_id && s.referred_by_id.toString() === ref._id.toString());
            const totalStudentCount = referredStudents.length;
            
            // Total amount is stored in referrer model, but we can verify it or use it as base
            const total = parseFloat(ref.amount.total || 0);
            const paid = parseFloat(ref.amount.paid || 0);
            const pending = total - paid;

            return {
                id: ref._id,
                name: ref.name,
                phone: ref.phone,
                email: ref.email || "N/A",
                studentsReferred: totalStudentCount,
                totalAmount: `₹${total.toLocaleString()}`,
                pendingAmount: `₹${pending.toLocaleString()}`,
                paidAmount: `₹${paid.toLocaleString()}`,
                status: pending > 0 ? "Pending" : "Clear"
            };
        });

        return {
            success: true,
            message: "Referrers fetched successfully",
            data: mappedData
        };
    } catch (error) {
        console.log("Error:", error);
        return {
            success: false,
            message: "Error in fetching referrers",
            data: null
        };
    }
};

exports.updateReferrerPayment = async (req, res) => {
    try {
        const { id, payAmount } = req.body;
        
        const referrer = await referred_model.findById(id);
        if (!referrer) {
            return {
                success: false,
                message: "Referrer not found"
            };
        }

        const currentPaid = parseFloat(referrer.amount.paid || 0);
        const total = parseFloat(referrer.amount.total || 0);
        
        const newPaid = currentPaid + parseFloat(payAmount || 0);
        const newPending = total - newPaid;

        referrer.amount.paid = newPaid.toString();
        referrer.amount.pending = newPending.toString();
        referrer.updated_at = Date.now();

        await referrer.save();

        return {
            success: true,
            message: "Payment processed successfully",
            data: {
                paid: referrer.amount.paid,
                pending: referrer.amount.pending,
                status: newPending > 0 ? "Pending" : "Clear"
            }
        };
    } catch (error) {
        console.log("Error updating referrer payment:", error);
        return {
            success: false,
            message: "Error processing payment"
        };
    }
};

exports.getReferrerStudents = async (req, res) => {
    try {
        const { id } = req.params;
        const students = await student_model.find({ referred_by_id: id }).sort({ created_at: -1 });

        const mappedData = students.map(student => {
            const paid = parseFloat(student.total_paid_fee || 0);
            const total = parseFloat(student.total_fee || 0);
            const pending = total - paid;

            return {
                student_name: student.student_name,
                student_ID: student.student_ID,
                selected_course_name: student.selected_course_name,
                total_fee: student.total_fee,
                total_paid_fee: student.total_paid_fee,
                pending_fee: pending.toString(),
                student_phone: student.phone,
                created_at: student.created_at
            };
        });

        return {
            success: true,
            message: "Referrer students fetched successfully",
            data: mappedData
        };
    } catch (error) {
        console.log("Error:", error);
        return {
            success: false,
            message: "Error in fetching referrer students",
            data: null
        }
    }
}

exports.particularStudentData = async (req,res) => {
    try {
        const Studentdata = await student_model.findById(req.params.id);
        if(!Studentdata){
            return {
                success: false,
                message: "No student found",
                data: null
            }
        }
        return {
            success: true,
            message: "Student fetched successfully",
            data: Studentdata
        };
    } catch (error) {
        console.log("Error:", error);
        return {
            success: false,
            message: "Error in fetching student",
            data: null
        }
    }
}