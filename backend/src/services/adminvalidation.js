const jwt = require("jsonwebtoken");
const admin_model = require("../models/adminmodel.js");


exports.admin_login = async (req, res) => {
    try {
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;


        const {frontend_password,frontend_email} = req.body;

        if (frontend_password !== password || frontend_email !== email) {
            return res.status(403).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        const existingAdmin = await admin_model.findOne({ email });
        if (!existingAdmin) {
            return {
                success: false,
                message: "Invalid email or not registered!",
            };
        }
        const token = jwt.sign({ id: existingAdmin._id }, process.env.SECRET_KEY);
        if (!token) {
            return res.json({ message: " Token generation failed" });
        }
        // Set the token to cookies
        res.cookie("token", token);
        const authKeyInsertion = await admin_model.findOneAndUpdate(
            { _id: existingAdmin._id },
            { auth_key: token },
            { new: true }
        );

        if (!authKeyInsertion) {
            return res.json({ message: "Token updation failed" });
        }

        return {
            message: "User logged in successfully",
            success: true,
            token: token,
            userId: existingAdmin._id
        };
    } catch (error) {
        console.log(error);
        return {
            message: error.message || "Internal server error",
            success: false,
        };
    }
};

exports.admin_logout = async (req, res) => {
    try {

        if (!req.user) {
            return {
                success: false,
                message: "Unauthorized",
            };
        }
        // Remove auth_key from the admin record so the token can't be reused
        try {
            // prefer unsetting the field, but setting to null is also acceptable
            await admin_model.findByIdAndUpdate(req.user._id, { $unset: { auth_key: "" } });
        } catch (dbErr) {
            console.log('Failed to remove auth_key on logout:', dbErr);
            // don't block logout response if DB update fails
        }

        // Invalidate the token (token blacklist can be implemented here if needed)
        res.clearCookie("token");
        return {
            success: true,
            message: "Logged out successfully",
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Internal server error",
        };
    }
};