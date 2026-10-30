const express = require("express");
const router = express.Router();
const user_auth = require("../../middleware/user_auth");
const {
  createLead,
  getAllLeads,
  getLeadStats,
  getLeadById,
  updateLead,
  addFollowupNote,
  deleteLead,
  getFollowupNotifications,
} = require("../controllers/studentLeadController");

// RESTful & Helper Routes
router.post("/student-leads", user_auth, createLead);
router.get("/student-leads", user_auth, getAllLeads);
router.post("/get-all-student-leads", user_auth, getAllLeads);

router.get("/student-leads/stats", user_auth, getLeadStats);
router.post("/student-leads/stats", user_auth, getLeadStats);

router.get("/student-leads/followups/reminders", user_auth, getFollowupNotifications);
router.post("/student-leads/followups/reminders", user_auth, getFollowupNotifications);

router.get("/student-leads/:id", user_auth, getLeadById);
router.put("/student-leads/:id", user_auth, updateLead);
router.post("/update-student-lead/:id", user_auth, updateLead);

router.post("/student-leads/:id/followup", user_auth, addFollowupNote);

router.delete("/student-leads/:id", user_auth, deleteLead);
router.post("/delete-student-lead/:id", user_auth, deleteLead);

module.exports = router;

