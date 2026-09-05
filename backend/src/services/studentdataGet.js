const student_model = require("../models/studentModel");
const referred_model = require("../models/referreledModel");
const memoryCache = require("../utils/cache");

exports.allStudents = async (req,res) => {
    try {
        const cached = memoryCache.get("all_students");
        if (cached) return cached;

        const Studentdata = await student_model.find({ is_deleted: { $ne: true } }).sort({ created_at: -1 }).lean();
        
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
                    payments: (adm.payments || []).map(pmt => ({
                        id: `pay-${Date.now()}-${Math.random()}`,
                        amount: pmt.amount,
                        paymentMethod: pmt.paymentMethod,
                        utrNumber: pmt.utrNumber,
                        date: pmt.date ? new Date(pmt.date).toISOString() : new Date().toISOString()
                    })),
                    certificates: (adm.certificates || []).map(cert => ({
                        id: `cert-${Date.now()}-${Math.random()}`,
                        courseName: cert.courseName || cert.course_name,
                        url: cert.certificatePath || cert.certificate_path,
                        date: cert.issuedAt || cert.issued_at ? new Date(cert.issuedAt || cert.issued_at).toISOString() : new Date().toISOString()
                    })),
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

        const result = {
            success: true,
            message: "Students fetched successfully",
            data: mappedData,
            stats: {
                totalEntries,
                growth: growth.toFixed(1),
                recentActivity
            }
        };

        memoryCache.set("all_students", result, 30);
        return result;
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
        const students = await student_model.find({ is_deleted: { $ne: true } });
        
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
        const students = await student_model.find({ is_deleted: { $ne: true } });
        
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
        const students = await student_model.find({ is_deleted: { $ne: true } });
        let transactions = [];

        students.forEach(student => {
            let studentTxns = [];

            // Primary source: Check admissions for payments
            if (student.admissions && student.admissions.length > 0) {
                student.admissions.forEach((adm, admIndex) => {
                    if (adm.payments && adm.payments.length > 0) {
                        adm.payments.forEach((p, pIndex) => {
                            studentTxns.push({
                                txn_id: p.utrNumber || p.utr_Number || `TXN-${student.student_ID}-${admIndex}-${pIndex}`,
                                student_name: student.student_name,
                                amount: parseFloat(p.amount || 0),
                                date: p.date || student.created_at || new Date(),
                                method: p.paymentMethod || p.payment_method || "cash"
                            });
                        });
                    }
                });
            }

            // Fallback: Check student.fee if no admission payments found
            if (studentTxns.length === 0 && student.fee && student.fee.length > 0) {
                student.fee.forEach((f, index) => {
                    studentTxns.push({
                        txn_id: f.utr_Number || `TXN-${student.student_ID}-${index}`,
                        student_name: student.student_name,
                        amount: parseFloat(f.amount || 0),
                        date: f.date || student.created_at || new Date(),
                        method: f.payment_method || f.paymentMethod || "cash"
                    });
                });
            }

            // Secondary Fallback: If still no transactions but student has total_paid_fee
            if (studentTxns.length === 0 && parseFloat(student.total_paid_fee || 0) > 0) {
                studentTxns.push({
                    txn_id: `TXN-${student.student_ID}-init`,
                    student_name: student.student_name,
                    amount: parseFloat(student.total_paid_fee || 0),
                    date: student.created_at || student.createdAt || new Date(),
                    method: "cash"
                });
            }

            transactions.push(...studentTxns);
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
        const Studentdata = await student_model.find({ is_deleted: { $ne: true }, certificate_photo: {$ne: ""} }).sort({ updated_at: -1 });
        
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
        const Studentdata = await student_model.find({ is_deleted: { $ne: true }, certificate_photo: {$eq: ""} }).sort({ created_at: -1 });
        
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
        const Studentdata = await student_model.find({ is_deleted: { $ne: true }, referred_by_id: { $ne: null } })
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
        const referrers = await referred_model.find({ is_deleted: { $ne: true } }).sort({ updated_at: -1 }).lean();
        const students = await student_model.find({ referred_by_id: { $ne: null } }).lean();
        
        const mappedData = referrers.map(ref => {
            // Calculate real-time stats from student model
            const referredStudents = students.filter(s => s.referred_by_id && s.referred_by_id.toString() === ref._id.toString());
            const totalStudentCount = referredStudents.length;
            
            // Total amount is stored in referrer model, but we can verify it or use it as base
            const total = parseFloat(ref.amount?.total || 0);
            const paid = parseFloat(ref.amount?.paid || 0);
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

exports.deleteReferrer = async (req, res) => {
    try {
        const { id } = req.body;
        const referrer = await referred_model.findById(id);
        if (!referrer) {
            return {
                success: false,
                message: "Referrer not found"
            };
        }

        referrer.is_deleted = true;
        referrer.deleted_at = new Date();
        await referrer.save();
        memoryCache.clear();

        return {
            success: true,
            message: "Referrer deleted successfully"
        };
    } catch (error) {
        console.log("Error deleting referrer:", error);
        return {
            success: false,
            message: "Error in deleting referrer"
        };
    }
};

exports.getDeletedReferrers = async (req, res) => {
    try {
        const referrers = await referred_model.find({ is_deleted: true }).sort({ deleted_at: -1 }).lean();
        const students = await student_model.find({ referred_by_id: { $ne: null } }).lean();
        
        const mappedData = referrers.map(ref => {
            const referredStudents = students.filter(s => s.referred_by_id && s.referred_by_id.toString() === ref._id.toString());
            const totalStudentCount = referredStudents.length;
            
            const total = parseFloat(ref.amount?.total || 0);
            const paid = parseFloat(ref.amount?.paid || 0);
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
                status: pending > 0 ? "Pending" : "Clear",
                deleted_at: ref.deleted_at
            };
        });

        return {
            success: true,
            message: "Deleted referrers fetched successfully",
            data: mappedData
        };
    } catch (error) {
        console.log("Error fetching deleted referrers:", error);
        return {
            success: false,
            message: "Error in fetching deleted referrers",
            data: null
        };
    }
};

exports.restoreReferrer = async (req, res) => {
    try {
        const { id } = req.body;
        const referrer = await referred_model.findById(id);
        if (!referrer) {
            return {
                success: false,
                message: "Referrer not found"
            };
        }

        referrer.is_deleted = false;
        referrer.deleted_at = null;
        await referrer.save();
        memoryCache.clear();

        return {
            success: true,
            message: "Referrer restored successfully"
        };
    } catch (error) {
        console.log("Error restoring referrer:", error);
        return {
            success: false,
            message: "Error in restoring referrer"
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
        memoryCache.clear();

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
};

exports.getDeletedStudents = async (req, res) => {
    try {
        const Studentdata = await student_model.find({ is_deleted: true }).sort({ deleted_at: -1 }).lean();
        
        const mappedData = Studentdata.map(student => {
            const paid = parseFloat(student.total_paid_fee || 0);
            const total = parseFloat(student.total_fee || 0);
            const pending = total - paid;

            return {
                student_name: student.student_name,
                student_ID: student.student_ID,
                selected_course_name: Array.isArray(student.selected_course_name) 
                    ? student.selected_course_name 
                    : (student.selected_course_name ? [student.selected_course_name] : ["N/A"]),
                course_duration: student.course_duration || "N/A",
                total_fee: student.total_fee || 0,
                total_paid_fee: student.total_paid_fee || 0,
                pending_fee: pending > 0 ? pending.toString() : "0",
                email: student.email || "N/A",
                phone: student.phone || "N/A",
                status: pending > 0 ? "Pending" : "Clear",
                deleted_at: student.deleted_at
            };
        });

        return {
            success: true,
            message: "Deleted students fetched successfully",
            data: mappedData
        };
    } catch (error) {
        console.log("Error in getDeletedStudents:", error);
        return {
            success: false,
            message: "Error in fetching deleted students",
            data: null
        };
    }
};

exports.restoreStudent = async (req, res) => {
    try {
        const { student_ID } = req.body;
        if (!student_ID) {
            return { success: false, message: "Student ID is required" };
        }

        let student = await student_model.findOne({ student_ID });
        if (!student) {
            const mongoose = require('mongoose');
            if (mongoose.isValidObjectId(student_ID)) {
                student = await student_model.findById(student_ID);
            }
        }

        if (!student) {
            return { success: false, message: "Student not found" };
        }

        student.is_deleted = false;
        student.deleted_at = null;
        await student.save();
        memoryCache.clear();

        return {
            success: true,
            message: "Student restored successfully"
        };
    } catch (error) {
        console.log("Error in restoreStudent:", error);
        return {
            success: false,
            message: "Error in restoring student"
        };
    }
};