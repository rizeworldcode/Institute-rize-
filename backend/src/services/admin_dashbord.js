
const Tc_model = require("../models/certificate");
const admin_model = require("../models/adminmodel.js");

exports.admin_dashboardGet = async (req, res) => {
    try {
        // The route is a GET; do not require a body. If you want admin-specific data,
        // send admin identity via cookie/token or query param. For now we return global dashboard data.
        const total_tc_uploaded = await Tc_model.countDocuments();

        // Count verified TC documents (case-insensitive match for 'Clear')
        const verifiedTc = await Tc_model.countDocuments({ status: { $regex: /^Clear$/i } });

        // Unverified/other statuses (case-insensitive match for 'Pending')
        const unverifiedTc = await Tc_model.countDocuments({ status: { $regex: /^Pending$/i } });

        const tcData = await Tc_model.find({})
            .select("student_name student_ID status created_at TC_photo")
            .sort({ created_at: -1 });

        return {
            message: "data fetch successfully",
            success: true,
            total_tc_uploaded,
            verifiedTc,
            unverifiedTc,
            tcData,
        };
    } catch (error) {
        console.log(error);
        return {
            message: error.message || "Internal server error",
            success: false,
        };
    }
};