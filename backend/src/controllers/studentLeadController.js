const studentLeadService = require("../services/studentLeadService");

exports.createLead = async (req, res) => {
  try {
    const { student_name, phone } = req.body;
    if (!student_name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Student name and phone number are required",
      });
    }

    const result = await studentLeadService.createLead(req.body);
    if (result.success) {
      return res.status(201).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    console.error("Create Lead Controller Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getAllLeads = async (req, res) => {
  try {
    const result = await studentLeadService.getAllLeads(req.query || req.body);
    if (result.success) {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    console.error("Get All Leads Controller Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getLeadStats = async (req, res) => {
  try {
    const result = await studentLeadService.getLeadStats();
    if (result.success) {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    console.error("Get Lead Stats Controller Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await studentLeadService.getLeadById(id);
    if (result.success) {
      return res.status(200).json(result);
    }
    return res.status(404).json(result);
  } catch (error) {
    console.error("Get Lead By Id Controller Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await studentLeadService.updateLead(id, req.body);
    if (result.success) {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    console.error("Update Lead Controller Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.addFollowupNote = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await studentLeadService.addFollowupNote(id, req.body);
    if (result.success) {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    console.error("Add Followup Controller Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await studentLeadService.deleteLead(id);
    if (result.success) {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    console.error("Delete Lead Controller Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getFollowupNotifications = async (req, res) => {
  try {
    const result = await studentLeadService.getFollowupNotifications();
    if (result.success) {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    console.error("Get Followup Notifications Controller Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

