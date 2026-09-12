const express = require("express");
const router = express.Router();

const multer_photo = require("../../middleware/multer");

const {
    certificateData
} = require("../controllers/certificate");
const path = require("path");
const fs = require("fs");

const user_auth = require("../../middleware/student_auth");

router.post(
    "/certificateData",
    user_auth,
    certificateData
);

router.get("/api/certificate/download", (req, res) => {
    const certPath = path.join(__dirname, "../../../frontend-admin/public/hero/White and Gold Simple Elegant Appreciation Certificate.jpg.jpeg");
    if (fs.existsSync(certPath)) {
        return res.download(certPath, "RizeWorld_Certificate_Punit_Sharma.jpg");
    }
    const backupPath = path.join(__dirname, "../../public/uploads/RizeWorld_Certificate_Punit_Sharma.jpg");
    if (fs.existsSync(backupPath)) {
        return res.download(backupPath, "RizeWorld_Certificate_Punit_Sharma.jpg");
    }
    return res.status(404).json({ success: false, message: "Certificate not found" });
});

router.get("/download-certificate", (req, res) => {
    const certPath = path.join(__dirname, "../../../frontend-admin/public/hero/White and Gold Simple Elegant Appreciation Certificate.jpg.jpeg");
    if (fs.existsSync(certPath)) {
        return res.download(certPath, "RizeWorld_Certificate_Punit_Sharma.jpg");
    }
    const backupPath = path.join(__dirname, "../../public/uploads/RizeWorld_Certificate_Punit_Sharma.jpg");
    if (fs.existsSync(backupPath)) {
        return res.download(backupPath, "RizeWorld_Certificate_Punit_Sharma.jpg");
    }
    return res.status(404).json({ success: false, message: "Certificate not found" });
});

module.exports = router;