const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const admin_model = require("../models/adminmodel.js");

const axios = require("axios"); // already in most projects

const sendOTP = async (email, otp) => {
  const response = await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: { email: "rizeworldcode@gmail.com", name: "RizeWorld" },
      to: [{ email: email }],
      subject: "Password Reset Verification Code",
      textContent: `Dear User,
Your verification code is: ${otp}
This code is valid for 10 minutes.
If you did not request a password reset, please ignore this email.
Thank you, RizeWorld Team`,
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};


exports.admin_login = async (req, res) => {
    try {
        const {frontend_password,frontend_email} = req.body;
        
        if (!frontend_email || !frontend_password) {
            return {
                success: false,
                message: "Email and password are required",
            };
        }

        const cleanEmail = frontend_email.trim();
        // Check if admin exists in DB (case-insensitive)
        let existingAdmin = await admin_model.findOne({ 
            email: { $regex: new RegExp(`^${cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i") } 
        });
        
        if (!existingAdmin) {
            return {
                success: false,
                message: "Invalid email or password",
            };
        }

        if (existingAdmin.is_active === false) {
            return {
                success: false,
                message: "Your account has been deactivated. Please contact administrator.",
            };
        }
        
        // Check password against DB
        const isPasswordValid = await bcrypt.compare(frontend_password, existingAdmin.password);
        if (!isPasswordValid) {
            return {
                success: false,
                message: "Invalid email or password",
            };
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

        const isSuperAdmin = existingAdmin.role === "superadmin" || 
            existingAdmin.email.toLowerCase() === "bhavikbhai1922@gmail.com" ||
            !existingAdmin.role;

        const role = isSuperAdmin ? "superadmin" : "staff";
        const allPermissions = [
            "dashboard",
            "add-student",
            "student-crm",
            "inquiry",
            "referred-by",
            "deleted-referrers",
            "deleted-students"
        ];
        const permissions = isSuperAdmin ? allPermissions : (existingAdmin.permissions || []);

        return {
            message: "User logged in successfully",
            success: true,
            token: token,
            userId: existingAdmin._id,
            email: existingAdmin.email,
            name: existingAdmin.name || (isSuperAdmin ? "Super Admin" : "Staff User"),
            role: role,
            permissions: permissions
        };
    } catch (error) {
        console.log(error);
        return {
            message: error.message || "Internal server error",
            success: false,
        };
    }
};

const ALL_BOTTOM_BAR_PERMISSIONS = [
    "dashboard",
    "add-student",
    "student-crm",
    "inquiry",
    "referred-by",
    "deleted-referrers",
    "deleted-students"
];

exports.get_admin_profile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return { success: false, message: "Unauthorized" };
        }

        const isSuperAdmin = user.role === "superadmin" || 
            user.email.toLowerCase() === "bhavikbhai1922@gmail.com" ||
            !user.role;

        return {
            success: true,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name || (isSuperAdmin ? "Super Admin" : "Staff User"),
                role: isSuperAdmin ? "superadmin" : "staff",
                permissions: isSuperAdmin ? ALL_BOTTOM_BAR_PERMISSIONS : (user.permissions || []),
                is_active: user.is_active !== false,
            }
        };
    } catch (error) {
        console.log(error);
        return { success: false, message: error.message || "Failed to fetch profile" };
    }
};

exports.get_all_staff = async (req, res) => {
    try {
        const currentUser = req.user;
        const isSuperAdmin = currentUser.role === "superadmin" || 
            currentUser.email.toLowerCase() === "bhavikbhai1922@gmail.com" ||
            !currentUser.role;

        if (!isSuperAdmin) {
            return { success: false, message: "Only Super Admin can manage staff members" };
        }

        // Return all staff members (and exclude password and secret tokens)
        const staffList = await admin_model.find(
            { role: "staff" },
            "-password -auth_key -otp -otpExpiry"
        ).sort({ created_at: -1 });

        return {
            success: true,
            staff: staffList
        };
    } catch (error) {
        console.log(error);
        return { success: false, message: error.message || "Failed to fetch staff" };
    }
};

exports.create_staff = async (req, res) => {
    try {
        const currentUser = req.user;
        const isSuperAdmin = currentUser.role === "superadmin" || 
            currentUser.email.toLowerCase() === "bhavikbhai1922@gmail.com" ||
            !currentUser.role;

        if (!isSuperAdmin) {
            return { success: false, message: "Only Super Admin can create staff accounts" };
        }

        const { name, email, password, permissions } = req.body;

        if (!email || !email.trim()) {
            return { success: false, message: "Email is required" };
        }

        if (!password || password.trim().length < 6) {
            return { success: false, message: "Password must be at least 6 characters long" };
        }

        const cleanEmail = email.trim().toLowerCase();
        const existing = await admin_model.findOne({ 
            email: { $regex: new RegExp(`^${cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i") } 
        });

        if (existing) {
            return { success: false, message: "An account with this email already exists" };
        }

        const hashedPassword = await bcrypt.hash(password.trim(), 10);
        const assignedPermissions = Array.isArray(permissions)
            ? permissions.filter(p => ALL_BOTTOM_BAR_PERMISSIONS.includes(p))
            : [];

        const newStaff = new admin_model({
            email: cleanEmail,
            name: (name || "").trim(),
            password: hashedPassword,
            role: "staff",
            permissions: assignedPermissions,
            is_active: true,
            created_by: currentUser._id,
        });

        await newStaff.save();

        return {
            success: true,
            message: "Staff member created successfully",
            staff: {
                _id: newStaff._id,
                name: newStaff.name,
                email: newStaff.email,
                role: newStaff.role,
                permissions: newStaff.permissions,
                is_active: newStaff.is_active,
                created_at: newStaff.created_at
            }
        };
    } catch (error) {
        console.log(error);
        return { success: false, message: error.message || "Failed to create staff member" };
    }
};

exports.update_staff = async (req, res) => {
    try {
        const currentUser = req.user;
        const isSuperAdmin = currentUser.role === "superadmin" || 
            currentUser.email.toLowerCase() === "bhavikbhai1922@gmail.com" ||
            !currentUser.role;

        if (!isSuperAdmin) {
            return { success: false, message: "Only Super Admin can update staff accounts" };
        }

        const { id } = req.params;
        const { name, permissions, is_active, password } = req.body;

        const staff = await admin_model.findById(id);
        if (!staff) {
            return { success: false, message: "Staff member not found" };
        }

        if (staff.role === "superadmin" || staff.email.toLowerCase() === "bhavikbhai1922@gmail.com") {
            return { success: false, message: "Cannot modify Super Admin account through staff manager" };
        }

        if (name !== undefined) staff.name = (name || "").trim();
        if (is_active !== undefined) staff.is_active = Boolean(is_active);

        if (Array.isArray(permissions)) {
            staff.permissions = permissions.filter(p => ALL_BOTTOM_BAR_PERMISSIONS.includes(p));
        }

        if (password && password.trim().length > 0) {
            if (password.trim().length < 6) {
                return { success: false, message: "New password must be at least 6 characters long" };
            }
            staff.password = await bcrypt.hash(password.trim(), 10);
        }

        staff.updated_at = new Date();
        await staff.save();

        return {
            success: true,
            message: "Staff member updated successfully",
            staff: {
                _id: staff._id,
                name: staff.name,
                email: staff.email,
                role: staff.role,
                permissions: staff.permissions,
                is_active: staff.is_active,
                updated_at: staff.updated_at
            }
        };
    } catch (error) {
        console.log(error);
        return { success: false, message: error.message || "Failed to update staff member" };
    }
};

exports.delete_staff = async (req, res) => {
    try {
        const currentUser = req.user;
        const isSuperAdmin = currentUser.role === "superadmin" || 
            currentUser.email.toLowerCase() === "bhavikbhai1922@gmail.com" ||
            !currentUser.role;

        if (!isSuperAdmin) {
            return { success: false, message: "Only Super Admin can delete staff members" };
        }

        const { id } = req.params;
        const staff = await admin_model.findById(id);
        if (!staff) {
            return { success: false, message: "Staff member not found" };
        }

        if (staff.role === "superadmin" || staff.email.toLowerCase() === "bhavikbhai1922@gmail.com") {
            return { success: false, message: "Cannot delete Super Admin account" };
        }

        await admin_model.findByIdAndDelete(id);

        return {
            success: true,
            message: "Staff member deleted successfully",
        };
    } catch (error) {
        console.log(error);
        return { success: false, message: error.message || "Failed to delete staff member" };
    }
};

exports.sendOtpTOadmin = async (req, res) => {
    const {email} = req.body;

    try {
        const AdminData = await admin_model.findOne({ email: email });
        
        if (!AdminData) {
            return {
                message: "Admin not found with this email",
                success: false,
            };
        }

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
            message: error,
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
