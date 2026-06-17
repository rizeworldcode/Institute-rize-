const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const admin_model = require("../../models/referreledModel");
const student_model = require("../../models/studentModel");
const refferl_model = require("../../models/referreledModel");
const nodemailer = require("nodemailer");

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

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    console.log(typeof otp);
    try {
        const user = await refferl_model.findOne({ email });
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
        const update_admin = await refferl_model.findOneAndUpdate({ email: email },
            {
                $set: {
                    auth_key: token,
                }
            },
            { new: true }
        )

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
            message: error,
            success: false,
        };
    }
};

exports.sendOtpTOadmin = async (req, res) => {
    const { email } = req.body;

    try {
        const AdminData = await refferl_model.findOne({ email: email });

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const otpExpiry = Date.now() + 3600000; // 1 hour
        if (AdminData) {
            const update_admin = await refferl_model.findOneAndUpdate({ email: email },
                {
                    $set: {
                        otp: otp,
                        otpExpiry: otpExpiry
                    }
                },
                { new: true }
            )
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
        }
        return {
            message: "Referrer not found with this email",
            success: false,
        };
    } catch (error) {
        console.log(error);
        return {
            message: error,
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
        const existingAdmin = await refferl_model.findOne({ email }).select('+auth_key');
        if (!existingAdmin) {
            return {
                success: false,
                message: "Admin not found",
            };
        }
        console.log(existingAdmin.auth_key);
        
        if (existingAdmin.auth_key) {
            existingAdmin.password = newPassword;
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


exports.get_referrer_dashboard_data = async (req, res) => {
    try {
        const referrerId = req.user._id;
        
        const referrer = await admin_model.findById(referrerId);
        if (!referrer) {
            return {
                success: false,
                message: "Referrer not found",
            };
        }

        const students = await student_model.find({ referred_by_id: referrerId })
            .select('student_name phone selected_course_name created_at student_ID')
            .sort({ created_at: -1 });

        return {
            success: true,
            data: {
                stats: {
                    totalReferred: students.length,
                    totalEarnings: parseFloat(referrer.amount.total || 0),
                    paidAmount: parseFloat(referrer.amount.paid || 0),
                    pendingAmount: parseFloat(referrer.amount.pending || 0)
                },
                students: students.map(s => ({
                    id: s._id,
                    studentID: s.student_ID,
                    name: s.student_name,
                    phone: s.phone,
                    course: s.selected_course_name,
                    date: s.created_at
                }))
            }
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Internal server error",
        };
    }
};

exports.referred_login = async (req, res) => {
    try {
        const {frontend_password,frontend_email} = req.body;
        const refferlData = await refferl_model.findOne({ email: frontend_email });
        if(!refferlData){
            return {
                success: false,
                message: "Invalid email or not registered!",
            };
        }
        const isPasswordValid = await refferlData.comparePassword(frontend_password);
        if (!isPasswordValid) {
            return {
                success: false,
                message: "Invalid password",
            };
        }
        const token = jwt.sign({ id: refferlData._id }, process.env.SECRET_KEY);
        if (!token) {
            return { success: false, message: " Token generation failed" };
        }
        // Set the token to cookies
        res.cookie("token", token);
        const authKeyInsertion = await admin_model.findOneAndUpdate(
            { _id: refferlData._id },
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
            userId: refferlData._id
        };
    } catch (error) {
        console.log(error);
        return {
            message: error.message || "Internal server error",
            success: false,
        };
    }
};

exports.referred_logout = async (req, res) => {
    try {

        if (!req.user) {
            return {
                success: false,
                message: "Unauthorized",
            };
        }
        // Remove auth_key from the referred record so the token can't be reused    
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