const express = require("express");
const router = express.Router();


const {
  admin_login, 
  admin_logout, 
  sendOtpTOadmin, 
  verifyOtp, 
  admin_forgatePassword,
  get_admin_profile,
  get_all_staff,
  create_staff,
  update_staff,
  delete_staff
} = require("../controllers/adminvalidation");

const user_auth = require("../../middleware/user_auth");
router.post("/admin_login", admin_login);
router.post("/admin_logout", user_auth, admin_logout);
router.post("/sendOtpTOadmin", sendOtpTOadmin);
router.post("/verifyOtp", verifyOtp);
router.post("/admin_forgatePassword", admin_forgatePassword);

// Staff management & profile routes
router.get("/admin/me", user_auth, get_admin_profile);
router.get("/admin/staff", user_auth, get_all_staff);
router.post("/admin/staff", user_auth, create_staff);
router.put("/admin/staff/:id", user_auth, update_staff);
router.delete("/admin/staff/:id", user_auth, delete_staff);

module.exports = router;