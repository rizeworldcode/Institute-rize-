const express = require("express");
const router = express.Router();
const user_auth = require("../../middleware/user_auth");
const multer_photo = require("../../middleware/multer");

const {
    add_student, certificate_view, updateStudentdetails
} = require("../controllers/addStudent");

// Debug middleware to log incoming requests
router.post("/updateStudentdetails/:student_iD", (req, res, next) => {

  next();
}, multer_photo.fields([{ name: "certificate_photo", maxCount: 1 }]), (req, res, next) => {
  console.log("Multer finished processing! Now calling updateStudentdetails controller...");
  console.log("After multer, req.body:", req.body);
  console.log("After multer, req.files:", req.files);
  next();
}, updateStudentdetails);

router.post(
    "/add_student",user_auth,
    add_student
);
router.get(
    "/certificate_view/:student_ID", certificate_view
);

module.exports = router;