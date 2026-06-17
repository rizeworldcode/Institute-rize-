const express = require("express");
const router = express.Router();

const user_auth = require("../../middleware/user_auth");
const {
allStudents,certificateissuedStudentsData,certificateunissuedStudentsData,pandingfeeStudentsData,clearfeeStudentsData,particularStudentData, totalEarningsDetails, referredStudentsData, getAllReferrers, updateReferrerPayment, getReferrerStudents
} = require("../controllers/studentdataGet");
router.post("/allStudents",user_auth, allStudents);
router.post("/certificateissuedStudentsData",user_auth, certificateissuedStudentsData);
router.post("/certificateunissuedStudentsData",user_auth, certificateunissuedStudentsData);
router.post("/pandingfeeStudentsData",user_auth, pandingfeeStudentsData);
router.post("/clearfeeStudentsData",user_auth, clearfeeStudentsData);
router.post("/particularStudentData",user_auth, particularStudentData);
router.post("/totalEarningsDetails",user_auth, totalEarningsDetails);
router.post("/referredStudentsData",user_auth, referredStudentsData);
router.post("/getAllReferrers",user_auth, getAllReferrers);
router.post("/updateReferrerPayment",user_auth, updateReferrerPayment);
router.post("/getReferrerStudents/:id",user_auth, getReferrerStudents);

module.exports = router;