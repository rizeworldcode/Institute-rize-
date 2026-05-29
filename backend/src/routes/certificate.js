const express = require("express");
const router = express.Router();

const multer_photo = require("../../middleware/multer");

const {
    certificate_uplode, certificate_delete, certificate_view, updateCertificate
} = require("../controllers/certificate");

router.post(
    "/certificate_uplode",
    multer_photo.fields([
        { name: "certificate_photo", maxCount: 1 }
    ]),
    certificate_uplode
);
router.post(
    "/certificate_delete", certificate_delete
);
router.get(
    "/certificate_view/:student_ID", certificate_view
);

router.post(
    "/update-certificate/:student_iD",
    multer_photo.fields([
        { name: "certificate_photo", maxCount: 1 }
    ]),
    updateCertificate
);

module.exports = router;