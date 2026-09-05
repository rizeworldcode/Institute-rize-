const Inquiry = require("../models/inquiryModel");
const memoryCache = require("../utils/cache");

exports.addInquiry = async (req, res) => {
    try {
        const { name, email, phone, course, message } = req.body;
        
        const newInquiry = new Inquiry({
            name,
            email,
            phone,
            course,
            message
        });

        await newInquiry.save();
        memoryCache.clear();

        return {
            success: true,
            message: "Inquiry submitted successfully",
            data: newInquiry
        };
    } catch (error) {
        console.log("Add Inquiry Error:", error);
        return { success: false, message: "Error submitting inquiry" };
    }
};

exports.getAllInquiries = async (req, res) => {
    try {
        const cached = memoryCache.get("all_inquiries");
        if (cached) return cached;

        const inquiries = await Inquiry.find().sort({ created_at: -1 }).lean();
        const result = {
            success: true,
            data: inquiries
        };
        memoryCache.set("all_inquiries", result, 30);
        return result;
    } catch (error) {
        console.log("Get Inquiries Error:", error);
        return { success: false, message: "Error fetching inquiries" };
    }
};

exports.markInquiryRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Inquiry.findByIdAndUpdate(id, { is_read: true });
        memoryCache.clear();
        return {
            success: true,
            message: "Inquiry marked as read"
        };
    } catch (error) {
        console.log("Mark Read Error:", error);
        return { success: false, message: "Error updating inquiry" };
    }
};
