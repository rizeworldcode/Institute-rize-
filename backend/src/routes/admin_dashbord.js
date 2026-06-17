const express = require("express");
const router = express.Router();
const user_auth = require("../../middleware/user_auth");

const {
admin_dashboardGet,
updateReferralAmount
} = require("../controllers/admin_dashbord");

router.get("/admin_dashboardGet",user_auth, admin_dashboardGet);
router.post("/updateReferralAmount",user_auth, updateReferralAmount);

// router.post("/userID",user_auth, userID);

module.exports = router;