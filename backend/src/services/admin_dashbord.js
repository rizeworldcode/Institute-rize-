
const Tc_model = require("../models/studentModel");
const admin_model = require("../models/adminmodel.js");

exports.admin_dashboardGet = async (req, res) => {
    try {
        // 1. Total Students
        const total_students = await Tc_model.countDocuments();

        // 2. Total Issued/Unissued Certificates
        // Issued: certificate_photo is present and not empty
        const total_issued_certificates = await Tc_model.countDocuments({ 
            certificate_photo: { $exists: true, $ne: "" } 
        });
        const total_unissued_certificates = total_students - total_issued_certificates;

        // 3. Total Earnings & Fee Status Counts
        const students = await Tc_model.find({});
        let total_earnings = 0;
        let clear_fee_students = 0;
        let unclear_fee_students = 0;

        const tcData = students.map(student => {
            const paid = parseFloat(student.total_paid_fee || 0);
            const total = parseFloat(student.total_fee || 0);
            const pending = total - paid;

            total_earnings += paid;

            if (paid >= total && total > 0) {
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
                total_fee: student.total_fee,
                total_paid_fee: student.total_paid_fee,
                pending_fee: pending.toString(),
                status: pending > 0 ? "Pending" : "Clear",
                fee: student.fee,
                email: student.email,
                phone: student.phone,
                address: student.address,
                course_start_date: student.course_start_date,
                course_end_date: student.course_end_date,
                fee_installment: student.fee_installment,
                created_at: student.created_at
            };
        });

        // 4. Top 3 Courses
        const top_courses = await Tc_model.aggregate([
            { $group: { _id: "$selected_course_name", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 3 }
        ]);

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