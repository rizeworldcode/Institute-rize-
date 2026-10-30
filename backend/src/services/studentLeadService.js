const StudentLead = require("../models/studentLeadModel");

/**
 * Generate next unique Lead ID in the format SL-1001, SL-1002, etc.
 */
async function generateNextLeadId() {
  const latestLead = await StudentLead.findOne({ lead_ID: { $regex: /^SL-\d+$/i } })
    .sort({ created_at: -1 })
    .select("lead_ID")
    .lean();

  let nextNum = 1001;
  if (latestLead && latestLead.lead_ID) {
    const match = latestLead.lead_ID.match(/\d+/);
    if (match) {
      nextNum = Math.max(nextNum, parseInt(match[0], 10) + 1);
    }
  }

  // Ensure uniqueness
  let candidate = `SL-${nextNum}`;
  let exists = await StudentLead.findOne({ lead_ID: candidate }).lean();
  while (exists) {
    nextNum += 1;
    candidate = `SL-${nextNum}`;
    exists = await StudentLead.findOne({ lead_ID: candidate }).lean();
  }

  return candidate;
}

exports.createLead = async (data) => {
  try {
    const lead_ID = await generateNextLeadId();

    const history = [];
    if (data.conversation_notes || data.status) {
      history.push({
        date: new Date(),
        conversation: data.conversation_notes || "Lead created",
        status: data.status || "New Inquiry",
        next_followup_date: data.next_followup_date || null,
        taken_by: data.followup_taken_by || "Admin",
        next_followup_by: data.next_followup_by || "",
        followup_round: data.followup_round || "1st Follow-up",
      });
    }

    const newLead = new StudentLead({
      lead_ID,
      student_name: data.student_name,
      address: data.address || "",
      phone: data.phone,
      school_name: data.school_name || "",
      current_education: data.current_education || "",

      is_from_workshop: Boolean(data.is_from_workshop),
      workshop_school_name: data.workshop_school_name || "",
      workshop_date: data.workshop_date ? new Date(data.workshop_date) : null,
      source_other: data.source_other || "Direct Walk-in",

      demo_class_taken: Boolean(data.demo_class_taken),
      demo_date: data.demo_date ? new Date(data.demo_date) : null,
      interested_course: data.interested_course || "",
      interest_level: data.interest_level || "Medium",
      problems_faced: data.problems_faced || "",
      remarks: data.remarks || "",

      conversation_notes: data.conversation_notes || "",
      status: data.status || "New Inquiry",
      next_followup_date: data.next_followup_date ? new Date(data.next_followup_date) : null,
      next_followup_by: data.next_followup_by || "",
      followup_round: data.followup_round || "1st Follow-up",
      followup_taken_by: data.followup_taken_by || "",
      followup_history: history,
    });

    await newLead.save();

    return {
      success: true,
      message: "Student lead created successfully",
      data: newLead,
    };
  } catch (error) {
    console.error("Create Lead Service Error:", error);
    return {
      success: false,
      message: error.message || "Failed to create student lead",
    };
  }
};

exports.getAllLeads = async (query = {}) => {
  try {
    const filter = { is_deleted: false };

    // Search filter across key fields
    if (query.search && query.search.trim() !== "") {
      const s = query.search.trim();
      const regex = new RegExp(s, "i");
      filter.$or = [
        { lead_ID: regex },
        { student_name: regex },
        { phone: regex },
        { school_name: regex },
        { current_education: regex },
        { interested_course: regex },
        { followup_taken_by: regex },
        { workshop_school_name: regex },
      ];
    }

    // Status filter
    if (query.status && query.status !== "All" && query.status !== "All Statuses") {
      filter.status = query.status;
    }

    // Workshop source filter
    if (query.source === "workshop") {
      filter.is_from_workshop = true;
    } else if (query.source === "other") {
      filter.is_from_workshop = false;
    }

    const leads = await StudentLead.find(filter)
      .sort({ created_at: -1 })
      .lean();

    return {
      success: true,
      count: leads.length,
      data: leads,
    };
  } catch (error) {
    console.error("Get All Leads Service Error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch student leads",
    };
  }
};

exports.getLeadStats = async () => {
  try {
    const baseFilter = { is_deleted: false };

    const [totalLeads, newInquiries, inFollowUp, demoScheduled, demoCompleted, converted, lostLeads] = await Promise.all([
      StudentLead.countDocuments(baseFilter),
      StudentLead.countDocuments({ ...baseFilter, status: "New Inquiry" }),
      StudentLead.countDocuments({ ...baseFilter, status: "In Follow-up" }),
      StudentLead.countDocuments({ ...baseFilter, status: "Demo Scheduled" }),
      StudentLead.countDocuments({ ...baseFilter, status: "Demo Completed" }),
      StudentLead.countDocuments({ ...baseFilter, status: "Converted" }),
      StudentLead.countDocuments({ ...baseFilter, status: "Lost" }),
    ]);

    return {
      success: true,
      stats: {
        totalLeads,
        newInquiries,
        inFollowUp: inFollowUp + demoScheduled + demoCompleted,
        converted,
        lostLeads,
      },
    };
  } catch (error) {
    console.error("Get Lead Stats Service Error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch lead statistics",
    };
  }
};

exports.getLeadById = async (id) => {
  try {
    const lead = await StudentLead.findById(id).lean();
    if (!lead || lead.is_deleted) {
      return { success: false, message: "Lead not found" };
    }
    return { success: true, data: lead };
  } catch (error) {
    console.error("Get Lead By Id Service Error:", error);
    return { success: false, message: error.message || "Failed to fetch lead" };
  }
};

exports.updateLead = async (id, data) => {
  try {
    const lead = await StudentLead.findById(id);
    if (!lead || lead.is_deleted) {
      return { success: false, message: "Lead not found" };
    }

    // Check if new follow-up conversation was provided
    if (data.new_conversation && data.new_conversation.trim() !== "") {
      lead.followup_history.push({
        date: new Date(),
        conversation: data.new_conversation.trim(),
        status: data.status || lead.status,
        next_followup_date: data.next_followup_date ? new Date(data.next_followup_date) : lead.next_followup_date,
        taken_by: data.followup_taken_by || lead.followup_taken_by || "Admin",
        next_followup_by: data.next_followup_by || lead.next_followup_by || "",
        followup_round: data.followup_round || lead.followup_round || "1st Follow-up",
      });
      lead.conversation_notes = data.new_conversation.trim();
    } else if (data.conversation_notes !== undefined) {
      // Check if conversation notes changed
      if (data.conversation_notes !== lead.conversation_notes && data.conversation_notes.trim() !== "") {
        lead.followup_history.push({
          date: new Date(),
          conversation: data.conversation_notes.trim(),
          status: data.status || lead.status,
          next_followup_date: data.next_followup_date ? new Date(data.next_followup_date) : lead.next_followup_date,
          taken_by: data.followup_taken_by || lead.followup_taken_by || "Admin",
          next_followup_by: data.next_followup_by || lead.next_followup_by || "",
          followup_round: data.followup_round || lead.followup_round || "1st Follow-up",
        });
      }
      lead.conversation_notes = data.conversation_notes;
    }

    // Update section 1: student details
    if (data.student_name !== undefined) lead.student_name = data.student_name;
    if (data.address !== undefined) lead.address = data.address;
    if (data.phone !== undefined) lead.phone = data.phone;
    if (data.school_name !== undefined) lead.school_name = data.school_name;
    if (data.current_education !== undefined) lead.current_education = data.current_education;

    // Update section 2: workshop
    if (data.is_from_workshop !== undefined) lead.is_from_workshop = Boolean(data.is_from_workshop);
    if (data.workshop_school_name !== undefined) lead.workshop_school_name = data.workshop_school_name;
    if (data.workshop_date !== undefined) {
      lead.workshop_date = data.workshop_date ? new Date(data.workshop_date) : null;
    }
    if (data.source_other !== undefined) lead.source_other = data.source_other;

    // Update section 3: demo class
    if (data.demo_class_taken !== undefined) lead.demo_class_taken = Boolean(data.demo_class_taken);
    if (data.demo_date !== undefined) {
      lead.demo_date = data.demo_date ? new Date(data.demo_date) : null;
    }
    if (data.interested_course !== undefined) lead.interested_course = data.interested_course;
    if (data.interest_level !== undefined) lead.interest_level = data.interest_level;
    if (data.problems_faced !== undefined) lead.problems_faced = data.problems_faced;
    if (data.remarks !== undefined) lead.remarks = data.remarks;

    // Update section 4: follow-up
    if (data.status !== undefined) lead.status = data.status;
    if (data.next_followup_date !== undefined) {
      lead.next_followup_date = data.next_followup_date ? new Date(data.next_followup_date) : null;
    }
    if (data.next_followup_by !== undefined) lead.next_followup_by = data.next_followup_by;
    if (data.followup_round !== undefined) lead.followup_round = data.followup_round;
    if (data.followup_taken_by !== undefined) lead.followup_taken_by = data.followup_taken_by;

    lead.updated_at = new Date();
    await lead.save();

    return {
      success: true,
      message: "Student lead updated successfully",
      data: lead,
    };
  } catch (error) {
    console.error("Update Lead Service Error:", error);
    return {
      success: false,
      message: error.message || "Failed to update student lead",
    };
  }
};

exports.addFollowupNote = async (id, data) => {
  try {
    const lead = await StudentLead.findById(id);
    if (!lead || lead.is_deleted) {
      return { success: false, message: "Lead not found" };
    }

    const note = {
      date: new Date(),
      conversation: data.conversation || data.conversation_notes || "",
      status: data.status || lead.status,
      next_followup_date: data.next_followup_date ? new Date(data.next_followup_date) : null,
      taken_by: data.taken_by || data.followup_taken_by || "Admin",
      next_followup_by: data.next_followup_by || lead.next_followup_by || "",
      followup_round: data.followup_round || lead.followup_round || "1st Follow-up",
    };

    lead.followup_history.push(note);
    if (note.conversation) {
      lead.conversation_notes = note.conversation;
    }
    if (data.status) {
      lead.status = data.status;
    }
    if (data.next_followup_date !== undefined) {
      lead.next_followup_date = data.next_followup_date ? new Date(data.next_followup_date) : null;
    }
    if (data.next_followup_by !== undefined) {
      lead.next_followup_by = data.next_followup_by;
    }
    if (data.followup_round !== undefined) {
      lead.followup_round = data.followup_round;
    }
    if (data.followup_taken_by || data.taken_by) {
      lead.followup_taken_by = data.followup_taken_by || data.taken_by;
    }
    lead.updated_at = new Date();

    await lead.save();

    return {
      success: true,
      message: "Follow-up recorded successfully",
      data: lead,
    };
  } catch (error) {
    console.error("Add Follow-up Service Error:", error);
    return {
      success: false,
      message: error.message || "Failed to add follow-up note",
    };
  }
};

exports.deleteLead = async (id) => {
  try {
    const lead = await StudentLead.findByIdAndUpdate(id, { is_deleted: true }, { new: true });
    if (!lead) {
      return { success: false, message: "Lead not found" };
    }
    return {
      success: true,
      message: "Student lead deleted successfully",
    };
  } catch (error) {
    console.error("Delete Lead Service Error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete student lead",
    };
  }
};

exports.getFollowupNotifications = async () => {
  try {
    const activeLeads = await StudentLead.find({
      is_deleted: false,
      next_followup_date: { $ne: null },
      status: { $nin: ["Converted", "Lost"] },
    })
      .sort({ next_followup_date: 1 })
      .lean();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const today = [];
    const due = [];
    const upcoming = [];

    activeLeads.forEach((lead) => {
      const fDate = new Date(lead.next_followup_date);
      const item = {
        id: lead._id,
        _id: lead._id,
        lead_ID: lead.lead_ID,
        student_name: lead.student_name,
        phone: lead.phone,
        interested_course: lead.interested_course || "Course N/A",
        status: lead.status,
        next_followup_date: lead.next_followup_date,
        next_followup_by: lead.next_followup_by || lead.followup_taken_by || "Counselor",
        followup_round: lead.followup_round || "1st Follow-up",
        conversation_notes: lead.conversation_notes || "",
        created_at: lead.created_at,
      };

      if (fDate < startOfToday) {
        due.push({ ...item, category: "due" });
      } else if (fDate <= endOfToday) {
        today.push({ ...item, category: "today" });
      } else {
        upcoming.push({ ...item, category: "upcoming" });
      }
    });

    return {
      success: true,
      data: {
        total: due.length + today.length + upcoming.length,
        dueCount: due.length,
        todayCount: today.length,
        upcomingCount: upcoming.length,
        today,
        due,
        upcoming,
        all: [...due, ...today, ...upcoming],
      },
    };
  } catch (error) {
    console.error("Get Followup Notifications Service Error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch followup notifications",
    };
  }
};

