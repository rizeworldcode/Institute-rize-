
const Tc_model = require("../models/studentModel");
const admin_model = require("../models/adminmodel.js");
const referred_model = require("../models/referreledModel.js");

exports.admin_dashboardGet = async (req, res) => {
    try {
        // 1. Total Students
        const total_students = await Tc_model.countDocuments();

        // 2. Total Issued/Unissued Certificates
        // Count all certificates from all admissions, plus backward compatibility
        let total_issued_certificates = 0;
        const students = await Tc_model.find({});
        
        students.forEach(student => {
            // Count certificates from admissions
            if (student.admissions && student.admissions.length > 0) {
                student.admissions.forEach(adm => {
                    if (adm.certificates && adm.certificates.length > 0) {
                        total_issued_certificates += adm.certificates.length;
                    }
                });
            }
            // Backward compatibility
            if (student.certificate_photo && student.certificate_photo !== "") {
                total_issued_certificates++;
            }
            if (student.certificates && student.certificates.length > 0) {
                total_issued_certificates += student.certificates.length;
            }
        });
        
        const total_unissued_certificates = Math.max(0, total_students - total_issued_certificates);

        // 3. Total Earnings & Fee Status Counts
        let total_earnings = 0;
        let clear_fee_students = 0;
        let unclear_fee_students = 0;

        const tcData = students.map(student => {
            // Calculate totals from admissions or old structure
            let totalFee = 0;
            let totalPaidFee = 0;
            let allClear = true;
            let anyPaid = false;
            
            let admissions = student.admissions || [];

            // Process admissions to ensure they have all required fields
            const processedAdmissions = admissions.map(adm => ({
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
                    courseName: cert.courseName,
                    url: `http://localhost:3001/${cert.certificatePath}`,
                    date: cert.issuedAt ? new Date(cert.issuedAt).toISOString() : new Date().toISOString()
                })),
                startDate: adm.startDate || adm.course_start_date || new Date(),
                endDate: adm.endDate || adm.course_end_date || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                createdAt: adm.createdAt || adm.created_at || Date.now(),
                updatedAt: adm.updatedAt || adm.updated_at || Date.now()
            }));
            
            // If no admissions, use old structure
            if (processedAdmissions.length === 0) {
                const oldPaid = parseFloat(student.total_paid_fee || 0);
                const oldTotal = parseFloat(student.total_fee || 0);
                totalFee = oldTotal;
                totalPaidFee = oldPaid;
                
                if (oldPaid > 0) anyPaid = true;
                allClear = oldPaid >= oldTotal && oldTotal > 0;
            } else {
                processedAdmissions.forEach(adm => {
                    const admTotal = parseFloat(adm.totalFee || 0);
                    const admPaid = parseFloat(adm.totalPaidFee || 0);
                    totalFee += admTotal;
                    totalPaidFee += admPaid;
                    
                    if (admPaid > 0) anyPaid = true;
                    if (admPaid < admTotal && admTotal > 0) allClear = false;
                });
            }

            total_earnings += totalPaidFee;

            if (allClear && anyPaid) {
                clear_fee_students++;
            } else {
                unclear_fee_students++;
            }

            return {
                student_name: student.student_name,
                student_ID: student.student_ID,
                selected_course_name: student.selected_course_name,
                course_duration: student.course_duration,
                _id: student._id,
                total_fee: totalFee,
                total_paid_fee: totalPaidFee,
                pending_fee: (totalFee - totalPaidFee).toString(),
                status: allClear ? "Clear" : (anyPaid ? "Partial" : "Pending"),
                fee: student.fee,
                email: student.email,
                phone: student.phone,
                address: student.address,
                course_start_date: student.course_start_date,
                course_end_date: student.course_end_date,
                fee_installment: student.fee_installment,
                created_at: student.created_at,
                certificates: student.certificates,
                admissions: processedAdmissions,
                referredByName: student.referredByName || "",
                referredByPhone: student.referredByPhone || "",
                referredByEmail: student.referredByEmail || "",
                referredAmount: student.referredAmount || 0,
                // Backward compatibility
                certificate_photo: student.certificate_photo
            };
        });

        // 4. Calculate total referral amount paid to referrers
        const referrers = await referred_model.find({});
        let total_referral_paid = 0;
        referrers.forEach(referrer => {
            total_referral_paid += referrer.amount?.paid || 0;
        });

        // 5. Deduct referral amount from total earnings
        const net_earnings = total_earnings - total_referral_paid;

        // 4. Top 3 Courses (from old structure and admissions)
        // First collect all courses from old structure
        const topCoursesOld = await Tc_model.aggregate([
            { $unwind: { path: "$selected_course_name", preserveNullAndEmptyArrays: true } },
            { $group: { _id: "$selected_course_name", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        
        // Collect all courses from admissions
        const topCoursesFromAdmissions = await Tc_model.aggregate([
            { $unwind: { path: "$admissions", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$admissions.courses", preserveNullAndEmptyArrays: true } },
            { $group: { _id: "$admissions.courses", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        
        // Combine and count
        const courseCounts = {};
        topCoursesOld.forEach(course => {
            if (course._id) {
                courseCounts[course._id] = (courseCounts[course._id] || 0) + course.count;
            }
        });
        topCoursesFromAdmissions.forEach(course => {
            if (course._id) {
                courseCounts[course._id] = (courseCounts[course._id] || 0) + course.count;
            }
        });
        
        // Convert to sorted array
        const top_courses = Object.keys(courseCounts)
            .map(key => ({ _id: key, count: courseCounts[key] }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

        // 5. Monthly Growth (Students and Earnings)
        // New students per month
        const monthly_students = await Tc_model.aggregate([
            {
                $group: {
                    _id: { 
                        month: { $month: "$created_at" }, 
                        year: { $year: "$created_at" } 
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Earnings per month (based on individual fee entries)
        const monthly_earnings = await Tc_model.aggregate([
            { $unwind: "$fee" },
            {
                $group: {
                    _id: { 
                        month: { $month: "$fee.date" }, 
                        year: { $year: "$fee.date" } 
                    },
                    earnings: { $sum: { $toDouble: { $ifNull: ["$fee.amount", "0"] } } }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Combine monthly data for a unified graph format
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const graphData = monthly_students.map(item => {
            const earningsItem = monthly_earnings.find(e => e._id.month === item._id.month && e._id.year === item._id.year);
            return {
                month: `${months[item._id.month - 1]} ${item._id.year}`,
                newStudents: item.count,
                earnings: earningsItem ? earningsItem.earnings : 0
            };
        });

        const adminConfig = await admin_model.findOne();

        return {
            success: true,
            stats: {
                total_students,
                total_issued_certificates,
                total_unissued_certificates,
                total_earnings,
                net_earnings,
                total_referral_paid,
                clear_fee_students,
                unclear_fee_students
            },
            tcData, 
            top_courses,
            graphData,
            referrel_amount: adminConfig ? adminConfig.referrel_amount : 0
        };
    } catch (error) {
        console.log("Dashboard Error:", error);
        return { success: false, message: "Error fetching dashboard data" };
    }
};

exports.updateReferralAmount = async (req, res) => {
    try {
        const { amount } = req.body;
        
        let admin = await admin_model.findOne();
        if (!admin) {
            admin = new admin_model({ referrel_amount: amount });
        } else {
            admin.referrel_amount = amount;
        }
        
        await admin.save();
        
        return {
            success: true,
            message: "Referral amount updated successfully",
            amount: admin.referrel_amount
        };
    } catch (error) {
        console.log("Error updating referral amount:", error);
        return {
            success: false,
            message: "Error updating referral amount"
        };
    }
};