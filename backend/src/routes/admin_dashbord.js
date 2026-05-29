const express = require("express");
const router = express.Router();
// const user_auth = require("../../middleware/user_auth");

const {
admin_dashboardGet
} = require("../controllers/admin_dashbord");

router.get("/admin_dashboardGet", admin_dashboardGet);

// router.post("/userID",user_auth, userID);

module.exports = router;