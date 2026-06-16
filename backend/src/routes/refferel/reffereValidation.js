const express = require("express");
const router = express.Router();


const {
referred_login,referred_logout, get_referrer_dashboard_data,sendOtpTOadmin,verifyOtp,admin_forgatePassword
} = require("../../controllers/refferel/reffereValidation");

const refferl_auth = require("../../../middleware/refferl_auth");

router.post("/sendOtpTOadmin", sendOtpTOadmin);
router.post("/verifyOtp", verifyOtp);
router.post("/admin_forgatePassword", admin_forgatePassword);
router.post("/referred_login", referred_login);
router.post("/referred_logout",refferl_auth, referred_logout);  
router.get("/referrer_dashboard_data", refferl_auth, get_referrer_dashboard_data);

module.exports = router;