const Tc_model = require("../models/studentModel")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.student_login = async (req, res) => {

    try {
            const { student_ID, student_Password, password } = req.body;
            
            // frontend may send 'password' or 'student_Password'
            const providedPassword = student_Password || password;
            console.log(providedPassword);
            if (!student_ID || !providedPassword) {
                return {
                    message: "Student ID and password are required",
                    success: false
                }
            }
        const validStudent = await Tc_model.findOne({ student_ID }).select("+student_password");
        if (!validStudent) {
            return {
                message: "student data not found",
                success: false
            }
        }
        const isPasswordValid = await bcrypt.compare(
            providedPassword,
            validStudent.student_password
        );
        if (!isPasswordValid) {
            return {
                message: "Invalid ID or password",
                success: false
            }
        }

        const token = jwt.sign({ id: validStudent._id }, process.env.SECRET_KEY);
        if (!token) {
            return { success: false, message: " Token generation failed" };
        }
        // Set the token to cookies
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        const authKeyInsertion = await Tc_model.findOneAndUpdate(
            { _id: validStudent._id },
            { auth_key: token },
            { new: true }
        );

        if (!authKeyInsertion) {
            return { success: false, message: "Token synchronization failed" };
        }

        return {
            message: "Student logged in successfully",
            success: true,
            token: token,
            studentId: validStudent.student_ID,
            studentName: validStudent.student_name,
            studentObjectId: validStudent._id
        };

    } catch (error) {
        console.log(error);
        return {
            message: error.message || "Internal server error",
            success: false,
        }

    }
}

exports.student_logout = async (req, res) => {
    try {

        if (!req.user) {
            return {
                success: false,
                message: "Unauthorized",
            };
        }
        // Remove auth_key from the student record so the token can't be reused
        try {
            // prefer unsetting the field, but setting to null is also acceptable
            await Tc_model.findByIdAndUpdate(req.user._id, { $unset: { auth_key: "" } });
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