const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const admin_model = require("../models/adminmodel.js");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOTP = (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Verification Code",
        text: `Dear User,
Your verification code is:
${otp}
This code is valid for 10 minutes.
If you did not request a password reset, please ignore this email.
Thank you,
RizeWorld Team`,
    };

    return transporter.sendMail(mailOptions);
};


exports.admin_login = async (req, res) => {
    try {
        const {frontend_password,frontend_email} = req.body;
        
        // First check if admin exists in DB
        let existingAdmin = await admin_model.findOne({ email: frontend_email });
        
        if (!existingAdmin) {
            // If not in DB, check env vars (for backward compatibility)
            const envEmail = existingAdmin.email;
            const envPassword = existingAdmin.password;
            
            if (frontend_email !== envEmail || frontend_password !== envPassword) {
                return {
                    success: false,
                    message: "Invalid email or password",
                };
            }
            
            // Create admin in DB if not exists
            const hashedPassword = await bcrypt.hash(envPassword, 10);
            existingAdmin = await admin_model.create({
                email: envEmail,
                password: hashedPassword
            });
        } else {
            // Check password against DB
            if (existingAdmin.password) {
                const isPasswordValid = await bcrypt.compare(frontend_password, existingAdmin.password);
                if (!isPasswordValid) {
                    return {
                        success: false,
                        message: "Invalid email or password",
                    };
                }
            } else {
                // Fallback to env password if no password in DB
                const envPassword = process.env.ADMIN_PASSWORD;
                if (frontend_password !== envPassword) {
                    return {
                        success: false,
                        message: "Invalid email or password",
                    };
                }
            }
        }
        
        const token = jwt.sign({ id: existingAdmin._id }, process.env.SECRET_KEY);
        if (!token) {
            return { success: false, message: " Token generation failed" };
        }
        // Set the token to cookies
        res.cookie("token", token);
        const authKeyInsertion = await admin_model.findOneAndUpdate(
            { _id: existingAdmin._id },
            { auth_key: token },
            { new: true }
        );

        if (!authKeyInsertion) {
            return { success: false, message: "Token updation failed" };
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

exports.sendOtpTOadmin = async (req, res) => {
    const {email} = req.body;

    try {
        const AdminData = await admin_model.findOne({ email: email });
        
        // If admin not in DB, check env email


        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const otpExpiry = Date.now() + 3600000; // 1 hour
        
        // Update admin with OTP
        const update_admin = await admin_model.findOneAndUpdate({ email: email },
            {
                $set: {
                    otp: otp,
                    otpExpiry: otpExpiry
                }
            },
            { new: true }
        );
        
        if (!update_admin) {
            return {
                message: "admin not found",
                success: false,
            };
        }
        
        const otp_send = await sendOTP(email, otp);
        if (!otp_send) {
            return {
                message: "otp send faild",
                success: false,
            };
        }
        
        return {
            message: "OTP send successfully",
            success: true,
        };
    } catch (error) {
        console.log(error);
        return {
            message: error.message || "An error occurred",
            success: false,
        };
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    console.log(typeof otp);
    try {
        const user = await admin_model.findOne({ email });
        if (!user) {
            return {
                message: "Invalid email",
                success: false,
            };
        }
        console.log(typeof user.otp);
        if (user.otp !== otp || otp == undefined || user.otpExpiry < Date.now()) {
            return {
                message: "Invalid or expired OTP",
                success: false,
            };
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
        if (!token) {
            return {
                message: "Token generation failed",
                success: false,
            };
        }
        res.cookie("token", token);
        const update_admin = await admin_model.findOneAndUpdate({ email: email },
            {
                $set: {
                    auth_key: token,
                }
            },
            { new: true }
        );

        if (!update_admin) {
            return {
                message: "password updation failed",
                success: false,
            };
        }
        return {
            token,
            message: "OTP verified successfully",
            success: true,
        };
    } catch (error) {
        console.log(error);
        return {
            message: error.message || "An error occurred",
            success: false,
        };
    }
};

exports.admin_forgatePassword = async (req, res) => {
    const { newPassword, email } = req.body;
    console.log(newPassword, email);
    
    try {
        if (!newPassword || !email) {
            return {
                message: "email or password not define",
                success: false
            }
        }
        const existingAdmin = await admin_model.findOne({ email }).select('+auth_key');
        if (!existingAdmin) {
            return {
                success: false,
                message: "Admin not found",
            };
        }
        console.log(existingAdmin.auth_key);
        
        if (existingAdmin.auth_key) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            existingAdmin.password = hashedPassword;
            await existingAdmin.save();

            return {
                success: true,
                message: "Password updated successfully",
            };
        }
        return {
            success: false,
            message: "try again",
        };

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Internal server error",
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
