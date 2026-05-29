const express = require("express");
const router = express.Router();


const {
admin_login,admin_logout
} = require("../controllers/adminvalidation");

const user_auth = require("../../middleware/user_auth");
router.post("/admin_login", admin_login);
router.post("/admin_logout",user_auth, admin_logout);

module.exports = router;