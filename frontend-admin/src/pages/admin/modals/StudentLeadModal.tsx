import { useState, useEffect, useMemo } from "react";
import { 
  X, User, Phone, MapPin, School, GraduationCap, 
  Calendar, BookOpen, AlertCircle, MessageSquare, 
  Clock, CheckCircle2, Flame, Award, Building, Sparkles, Plus, History, CalendarCheck
} from "lucide-react";
import { StudentLead } from "../types";

interface StudentLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<StudentLead>) => Promise<boolean | void>;
  lead?: StudentLead | null;
}

export function StudentLeadModal({ isOpen, onClose, onSave, lead }: StudentLeadModalProps) {
  const isEditing = Boolean(lead && lead._id);

  // Section 1: Student Detail Section
  const [studentName, setStudentName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [currentEducation, setCurrentEducation] = useState("");

  // Section 2: Workshop Section
  const [isFromWorkshop, setIsFromWorkshop] = useState(false);
  const [workshopSchoolName, setWorkshopSchoolName] = useState("");
  const [workshopDate, setWorkshopDate] = useState("");
  const [sourceOther, setSourceOther] = useState("Direct Walk-in");

  // Section 3: Demo Class Section
  const [demoClassTaken, setDemoClassTaken] = useState(false);
  const [demoDate, setDemoDate] = useState("");
  const [interestedCourse, setInterestedCourse] = useState("");
  const [interestLevel, setInterestLevel] = useState<"High" | "Medium" | "Low" | "Not Interested" | "">("Medium");
  const [problemsFaced, setProblemsFaced] = useState("");
  const [remarks, setRemarks] = useState("");

  // Section 4: Current Followup Section
  const [conversationNotes, setConversationNotes] = useState("");
  const [newConversation, setNewConversation] = useState("");
  const [callOutcome, setCallOutcome] = useState<StudentLead["call_outcome"]>("");
  const [status, setStatus] = useState<StudentLead["status"]>("New Inquiry");
  const [nextFollowupDate, setNextFollowupDate] = useState("");
  const [followupTakenBy, setFollowupTakenBy] = useState("");

  // Section 5: Next Followup Section
  const [nextFollowupBy, setNextFollowupBy] = useState("");
  const [followupRound, setFollowupRound] = useState("1st Follow-up");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const effectiveHistory = useMemo(() => {
    if (!lead) return [];
    const list = Array.isArray(lead.followup_history) ? [...lead.followup_history] : [];
    if (list.length === 0 && (lead.conversation_notes || lead.call_outcome || (lead.status && lead.status !== "New Inquiry"))) {
      list.push({
        _id: "initial-log",
        date: lead.created_at || new Date().toISOString(),
        conversation: lead.conversation_notes || "Initial lead inquiry registered",
        status: lead.status || "New Inquiry",
        call_outcome: lead.call_outcome || "Connected",
        taken_by: lead.followup_taken_by || "Counselor",
        followup_round: lead.followup_round || "1st Follow-up",
      });
    }
    if (list.length === 1 && lead.followup_history?.[0]) {
      const first = lead.followup_history[0];
      const hasOutcomeDiff = Boolean(lead.call_outcome && lead.call_outcome !== first.call_outcome);
      const hasStatusDiff = Boolean(lead.status && lead.status !== "New Inquiry" && lead.status !== first.status);
      const hasTimeDiff = Boolean(lead.updated_at && lead.created_at && (new Date(lead.updated_at).getTime() - new Date(lead.created_at).getTime() > 60000));
      const hasStaff = Boolean(lead.followup_taken_by && (!first.taken_by || lead.followup_taken_by !== first.taken_by));
      if (hasOutcomeDiff || (hasStatusDiff && hasTimeDiff) || (hasOutcomeDiff && hasStaff)) {
        list.push({
          _id: "call-2-synth",
          date: lead.updated_at || new Date().toISOString(),
          conversation: (lead.conversation_notes && lead.conversation_notes !== first.conversation)
            ? lead.conversation_notes
            : `Call response: ${lead.call_outcome || "Follow-up call attended"}`,
          status: lead.status || "In Follow-up",
          call_outcome: lead.call_outcome || "Not Connected",
          taken_by: lead.followup_taken_by || "Counselor",
          followup_round: lead.followup_round || "2nd Follow-up",
        });
      }
    }
    return list;
  }, [lead]);

  useEffect(() => {
    if (lead) {
      setStudentName(lead.student_name || "");
      setPhone(lead.phone || "");
      setAddress(lead.address || "");
      setSchoolName(lead.school_name || "");
      setCurrentEducation(lead.current_education || "");

      setIsFromWorkshop(Boolean(lead.is_from_workshop));
      setWorkshopSchoolName(lead.workshop_school_name || "");
      setWorkshopDate(lead.workshop_date ? lead.workshop_date.split("T")[0] : "");
      setSourceOther(lead.source_other || "Direct Walk-in");

      const formatForDateTime = (dStr?: string | null) => {
        if (!dStr) return "";
        try {
          const d = new Date(dStr);
          if (isNaN(d.getTime())) return "";
          return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        } catch {
          return "";
        }
      };

      setDemoClassTaken(Boolean(lead.demo_class_taken));
      setDemoDate(formatForDateTime(lead.demo_date));
      setInterestedCourse(lead.interested_course || "");
      setInterestLevel(lead.interest_level || "Medium");
      setProblemsFaced(lead.problems_faced || "");
      setRemarks(lead.remarks || "");

      setConversationNotes(lead.conversation_notes || "");
      setNewConversation("");
      setCallOutcome(lead.call_outcome || "");
      setStatus(lead.status || "New Inquiry");
      
      if (lead.next_followup_date) {
        // Convert to YYYY-MM-DDThh:mm format for datetime-local
        try {
          const d = new Date(lead.next_followup_date);
          const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
          setNextFollowupDate(iso);
        } catch {
          setNextFollowupDate("");
        }
      } else {
        setNextFollowupDate("");
      }

      setFollowupTakenBy(lead.followup_taken_by || "");
      setNextFollowupBy(lead.next_followup_by || lead.followup_taken_by || "");
      if (lead.followup_round) {
        setFollowupRound(lead.followup_round);
      } else if (lead.followup_history && lead.followup_history.length > 0) {
        const nextNum = lead.followup_history.length + 1;
        const roundName = nextNum === 1 ? "1st Follow-up" : nextNum === 2 ? "2nd Follow-up" : nextNum === 3 ? "3rd Follow-up" : nextNum === 4 ? "4th Follow-up" : nextNum === 5 ? "5th Follow-up" : `${nextNum}th Follow-up`;
        setFollowupRound(roundName);
      } else {
        setFollowupRound("1st Follow-up");
      }
    } else {
      // Reset defaults for new lead
      setStudentName("");
      setPhone("");
      setAddress("");
      setSchoolName("");
      setCurrentEducation("");

      setIsFromWorkshop(false);
      setWorkshopSchoolName("");
      setWorkshopDate("");
      setSourceOther("Direct Walk-in");

      setDemoClassTaken(false);
      setDemoDate("");
      setInterestedCourse("");
      setInterestLevel("Medium");
      setProblemsFaced("");
      setRemarks("");

      setConversationNotes("");
      setNewConversation("");
      setCallOutcome("");
      setStatus("New Inquiry");
      setNextFollowupDate("");
      setFollowupRound("1st Follow-up");
      
      // Default staff name from localStorage if available
      try {
        const storedAdmin = localStorage.getItem("adminUser");
        if (storedAdmin) {
          const parsed = JSON.parse(storedAdmin);
          setFollowupTakenBy(parsed.name || "Counselor");
          setNextFollowupBy(parsed.name || "Counselor");
        } else {
          setFollowupTakenBy("Counselor");
          setNextFollowupBy("Counselor");
        }
      } catch {
        setFollowupTakenBy("Counselor");
        setNextFollowupBy("Counselor");
      }
    }
    setErrorMsg("");
  }, [lead, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setErrorMsg("Student name is required.");
      return;
    }
    if (!phone.trim()) {
      setErrorMsg("Phone number is required.");
      return;
    }
    if (status === "Demo Scheduled" && !demoDate.trim()) {
      setErrorMsg("Please select the Scheduled Date & Time of Demo Class.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const payload: any = {
        student_name: studentName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        school_name: schoolName.trim(),
        current_education: currentEducation.trim(),

        is_from_workshop: isFromWorkshop,
        workshop_school_name: isFromWorkshop ? workshopSchoolName.trim() : "",
        workshop_date: isFromWorkshop && workshopDate ? workshopDate : null,
        source_other: !isFromWorkshop ? sourceOther.trim() : "Workshop",

        demo_class_taken: demoClassTaken,
        demo_date: demoDate ? new Date(demoDate).toISOString() : null,
        interested_course: interestedCourse.trim(),
        interest_level: interestLevel,
        problems_faced: problemsFaced.trim(),
        remarks: remarks.trim(),

        status,
        call_outcome: callOutcome,
        next_followup_date: nextFollowupDate ? new Date(nextFollowupDate).toISOString() : null,
        next_followup_by: nextFollowupBy.trim(),
        followup_round: followupRound,
        followup_taken_by: followupTakenBy.trim(),
      };

      if (isEditing) {
        if (newConversation.trim()) {
          payload.new_conversation = newConversation.trim();
        } else {
          payload.conversation_notes = conversationNotes.trim();
        }
      } else {
        payload.conversation_notes = conversationNotes.trim();
      }

      const res = await onSave(payload);
      if (res !== false) {
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save student lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  const courseSuggestions = [
    "Full Stack Web Development",
    "Python & AI / Data Science",
    "Graphic Designing & UI/UX",
    "Digital Marketing & SEO",
    "Cyber Security & Ethical Hacking",
    "Android & iOS App Development",
    "Basic Computer & Tally Prime",
    "C++ & Java Core",
    "Video Editing & Motion Graphics"
  ];

  const educationSuggestions = [
    "10th Standard",
    "11th Standard",
    "12th Standard (Science/Maths)",
    "12th Standard (Commerce/Arts)",
    "BCA / MCA",
    "B.Tech / B.E. (Computer Science/IT)",
    "B.Tech (Other Branches)",
    "B.Sc / M.Sc",
    "B.Com / BBA / MBA",
    "Graduation (Any Stream)",
    "Working Professional",
    "Other"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 overflow-y-auto bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative bg-white border border-neutral-200 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-200 bg-neutral-50/70 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Sparkles size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                  {isEditing ? `Edit Lead • ${lead?.lead_ID}` : "CRM Form"}
                </span>
                <span className="text-xs text-neutral-400 font-medium">Student Management</span>
              </div>
              <h2 className="text-xl font-bold text-neutral-900 mt-0.5">
                {isEditing ? "Update Student Lead & Follow-up" : "Enter New Student Lead"}
              </h2>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded-xl transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <AlertCircle size={18} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* SECTION 1: Student Detail Section */}
          <div className="bg-neutral-50/50 border border-neutral-200/80 rounded-2xl p-5 md:p-6 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-200">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</div>
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <User size={18} className="text-blue-600" />
                Student Detail Section
              </h3>
              <span className="text-xs text-neutral-400 ml-auto font-medium">* Required info</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Student Name */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Student Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter student's full name"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium text-neutral-900 placeholder:text-neutral-400"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium text-neutral-900 placeholder:text-neutral-400"
                  />
                </div>
              </div>

              {/* Name of the School */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Name of the School / College
                </label>
                <div className="relative">
                  <School size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="School or college name"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium text-neutral-900 placeholder:text-neutral-400"
                  />
                </div>
              </div>

              {/* Current Education */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Current Education / Class
                </label>
                <div className="relative">
                  <GraduationCap size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    list="education-list"
                    type="text"
                    value={currentEducation}
                    onChange={(e) => setCurrentEducation(e.target.value)}
                    placeholder="e.g. 12th Science, BCA, B.Tech..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium text-neutral-900 placeholder:text-neutral-400"
                  />
                  <datalist id="education-list">
                    {educationSuggestions.map((edu) => (
                      <option key={edu} value={edu} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Student Address / Area / City
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-3 text-neutral-400" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House/Street, Area, City, Pin Code"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium text-neutral-900 placeholder:text-neutral-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Workshop Section */}
          <div className="bg-neutral-50/50 border border-neutral-200/80 rounded-2xl p-5 md:p-6 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-200">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">2</div>
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <Building size={18} className="text-indigo-600" />
                Workshop & Lead Source Section
              </h3>
            </div>

            {/* First Question: Is student from workshop or other? */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-neutral-700">
                Did this student come from a Workshop or Other Source?
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => setIsFromWorkshop(true)}
                  className={`py-3 px-4 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isFromWorkshop 
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" 
                      : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400"
                  }`}
                >
                  <Award size={16} />
                  Yes, from Workshop
                </button>
                <button
                  type="button"
                  onClick={() => setIsFromWorkshop(false)}
                  className={`py-3 px-4 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    !isFromWorkshop 
                      ? "bg-neutral-900 text-white border-neutral-900 shadow-sm" 
                      : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400"
                  }`}
                >
                  Other Source / Walk-in
                </button>
              </div>
            </div>

            {/* If Yes: take school name and workshop date */}
            {isFromWorkshop ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-neutral-200 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Workshop School / Institute Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <School size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={workshopSchoolName}
                      onChange={(e) => setWorkshopSchoolName(e.target.value)}
                      placeholder="School where workshop was held"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-medium text-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Workshop Date
                  </label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="date"
                      value={workshopDate}
                      onChange={(e) => setWorkshopDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-medium text-neutral-900"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="pt-3 border-t border-neutral-200 animate-in fade-in duration-200">
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Lead Source / Inquiry Origin
                </label>
                <select
                  value={sourceOther}
                  onChange={(e) => setSourceOther(e.target.value)}
                  className="w-full max-w-md px-4 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-500/20 focus:border-neutral-600 transition-all font-medium text-neutral-900 cursor-pointer"
                >
                  <option value="Direct Walk-in">Direct Walk-in / Campus Visit</option>
                  <option value="Social Media (Instagram/FB)">Social Media (Instagram / Facebook)</option>
                  <option value="Google / Website">Website / Google Search</option>
                  <option value="Friend / Student Referral">Friend / Student Referral</option>
                  <option value="Pamphlet / Poster / Banner">Pamphlet / Poster / Banner</option>
                  <option value="Telecalling / Cold Call">Telecalling / Cold Call</option>
                  <option value="Other">Other Source</option>
                </select>
              </div>
            )}
          </div>

          {/* SECTION 3: Demo Class Section */}
          <div className="bg-neutral-50/50 border border-neutral-200/80 rounded-2xl p-5 md:p-6 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-200">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">3</div>
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <BookOpen size={18} className="text-emerald-600" />
                Demo Class & Course Interests
              </h3>
            </div>

            {/* Demo class taken toggle */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-neutral-700">
                Has the student already attended / taken a Demo Class?
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => {
                    setDemoClassTaken(true);
                    if (status !== "Demo Scheduled" && status !== "Demo Completed" && status !== "Converted") {
                      setStatus("Demo Completed");
                    }
                  }}
                  className={`py-3 px-4 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    demoClassTaken 
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm" 
                      : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400"
                  }`}
                >
                  <CheckCircle2 size={16} />
                  Yes, Demo Taken
                </button>
                <button
                  type="button"
                  onClick={() => setDemoClassTaken(false)}
                  className={`py-3 px-4 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    !demoClassTaken 
                      ? "bg-neutral-800 text-white border-neutral-800 shadow-sm" 
                      : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400"
                  }`}
                >
                  <Clock size={16} />
                  No Demo Yet / Scheduled
                </button>
              </div>
            </div>

            {/* If Demo Taken: Date of Attended Demo Class */}
            {demoClassTaken && (
              <div className="pt-2 animate-in fade-in duration-200">
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Date & Time of Attended Demo Class <span className="text-emerald-600 font-bold">•</span>
                </label>
                <div className="relative max-w-md">
                  <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  <input
                    type="datetime-local"
                    value={demoDate}
                    onChange={(e) => setDemoDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium text-neutral-900"
                  />
                </div>
              </div>
            )}

            {/* Course Interest & Background Info - Always accessible */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-neutral-200">
              {/* Interested Course Name */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Interested Course Name
                </label>
                <div className="relative">
                  <BookOpen size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  <input
                    list="course-list"
                    type="text"
                    value={interestedCourse}
                    onChange={(e) => setInterestedCourse(e.target.value)}
                    placeholder="e.g. Full Stack Web Development"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium text-neutral-900"
                  />
                  <datalist id="course-list">
                    {courseSuggestions.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Level of Interest */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Level of Interest
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(["High", "Medium", "Low", "Not Interested"] as const).map((lvl) => {
                    const isSelected = interestLevel === lvl;
                    return (
                      <button
                        type="button"
                        key={lvl}
                        onClick={() => setInterestLevel(lvl)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? lvl === "High"
                              ? "bg-rose-50 text-rose-700 border-rose-300 font-bold ring-2 ring-rose-200"
                              : lvl === "Medium"
                              ? "bg-amber-50 text-amber-700 border-amber-300 font-bold ring-2 ring-amber-200"
                              : lvl === "Low"
                              ? "bg-blue-50 text-blue-700 border-blue-300 font-bold ring-2 ring-blue-200"
                              : "bg-neutral-100 text-neutral-700 border-neutral-300 font-bold ring-2 ring-neutral-200"
                            : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        {lvl === "High" && <Flame size={14} className="text-rose-600" />}
                        {lvl}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Problem if any (Textarea) */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Problem / Concerns (If any)
                </label>
                <textarea
                  rows={3}
                  value={problemsFaced}
                  onChange={(e) => setProblemsFaced(e.target.value)}
                  placeholder="e.g. Fees issue, distance/travel problem, batch timings, laptop unavailability..."
                  className="w-full p-3 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium text-neutral-900 placeholder:text-neutral-400 resize-none"
                />
              </div>

              {/* Remarks (Textarea) */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Remarks / Teacher Feedback
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="General remarks, attitude, learning readiness, parents' view..."
                  className="w-full p-3 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium text-neutral-900 placeholder:text-neutral-400 resize-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Current Followup Section */}
          <div className="bg-neutral-50/50 border border-neutral-200/80 rounded-2xl p-5 md:p-6 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-200">
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">4</div>
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <MessageSquare size={18} className="text-purple-600" />
                Current Follow-up Section
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Call Outcome / Student Response */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Call Outcome / Response (Telecalling Result)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {[
                    { key: "Yes for Demo", label: "✨ Yes for Demo", color: "text-indigo-700 bg-indigo-50 border-indigo-300 ring-indigo-200" },
                    { key: "Demo Completed", label: "🎓 Demo Completed", color: "text-teal-700 bg-teal-50 border-teal-300 ring-teal-200" },
                    { key: "Connected", label: "📞 Connected", color: "text-emerald-700 bg-emerald-50 border-emerald-300 ring-emerald-200" },
                    { key: "Told Later", label: "⏳ Told Later", color: "text-purple-700 bg-purple-50 border-purple-300 ring-purple-200" },
                    { key: "No", label: "❌ No / Dropped", color: "text-rose-700 bg-rose-50 border-rose-300 ring-rose-200" },
                    { key: "Not Connected", label: "📵 Not Connected", color: "text-amber-700 bg-amber-50 border-amber-300 ring-amber-200" }
                  ].map((item) => {
                    const isSelected = callOutcome === item.key;
                    return (
                      <button
                        type="button"
                        key={item.key}
                        onClick={() => {
                          const newOutcome = isSelected ? "" : (item.key as any);
                          setCallOutcome(newOutcome);
                          if (newOutcome === "Yes for Demo") {
                            setStatus("Demo Scheduled");
                          } else if (newOutcome === "Demo Completed") {
                            setStatus("Demo Completed");
                            setDemoClassTaken(true);
                          } else if (newOutcome === "No") {
                            setStatus("Lost");
                            setInterestLevel("Not Interested");
                          } else if (newOutcome === "Told Later") {
                            if (status === "New Inquiry") setStatus("In Follow-up");
                          } else if (newOutcome === "Connected") {
                            if (status === "New Inquiry") setStatus("In Follow-up");
                          }
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? `${item.color} font-bold ring-2`
                            : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Lead Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => {
                    const newStatus = e.target.value as any;
                    setStatus(newStatus);
                    if (newStatus === "Demo Scheduled" && (!callOutcome || callOutcome === "Connected")) {
                      setCallOutcome("Yes for Demo");
                    }
                  }}
                  className="w-full px-4 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all font-semibold text-neutral-900 cursor-pointer"
                >
                  <option value="New Inquiry">🔵 New Inquiry</option>
                  <option value="In Follow-up">🟣 In Follow-up</option>
                  <option value="Demo Scheduled">🟠 Demo Scheduled</option>
                  <option value="Demo Completed">🟢 Demo Completed</option>
                  <option value="Converted">✅ Converted / Enrolled</option>
                  <option value="Lost">🔴 Lost / Dropped</option>
                </select>
              </div>

              {/* Who Took Followup */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Who Took Follow-up (Staff Name)
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={followupTakenBy}
                    onChange={(e) => setFollowupTakenBy(e.target.value)}
                    placeholder="Staff / Counselor name"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all font-medium text-neutral-900"
                  />
                </div>
              </div>

              {/* CONDITIONAL DYNAMIC DEMO CLASS SCHEDULE CARD */}
              {(status === "Demo Scheduled" || callOutcome === "Yes for Demo") && (
                <div className="md:col-span-2 p-4 bg-gradient-to-br from-amber-50 via-orange-50/70 to-amber-50 border-2 border-amber-300 rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-300 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-amber-200/90">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                        <CalendarCheck size={17} />
                      </div>
                      <div>
                        <span className="text-xs font-black text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
                          Scheduled Date & Time of Demo Class <span className="text-rose-600 font-black text-sm">*</span>
                        </span>
                        <p className="text-[11px] text-amber-800 font-medium">
                          Select the exact demo date & batch timing for this student
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-amber-900 bg-amber-200/90 px-2.5 py-0.5 rounded-full border border-amber-300 shadow-2xs">
                      🟠 Demo Scheduled
                    </span>
                  </div>

                  {/* Demo Date & Time Input */}
                  <div className="pt-1">
                    <label className="block text-[11px] font-bold text-amber-950 mb-1.5 flex items-center gap-1">
                      <Calendar size={13} className="text-amber-700" />
                      Demo Class Date & Time <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-600 pointer-events-none" />
                      <input
                        type="datetime-local"
                        value={demoDate}
                        onChange={(e) => setDemoDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border-2 border-amber-300 rounded-xl font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 shadow-2xs transition-all cursor-pointer"
                        required={status === "Demo Scheduled"}
                      />
                    </div>
                  </div>

                  {/* 1-Click Fast Presets */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider mr-1">
                      Quick Select:
                    </span>
                    {[
                      {
                        label: "Today 4:00 PM",
                        getVal: () => {
                          const d = new Date();
                          d.setHours(16, 0, 0, 0);
                          return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                        }
                      },
                      {
                        label: "Tomorrow 11:00 AM",
                        getVal: () => {
                          const d = new Date();
                          d.setDate(d.getDate() + 1);
                          d.setHours(11, 0, 0, 0);
                          return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                        }
                      },
                      {
                        label: "Tomorrow 4:00 PM",
                        getVal: () => {
                          const d = new Date();
                          d.setDate(d.getDate() + 1);
                          d.setHours(16, 0, 0, 0);
                          return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                        }
                      },
                      {
                        label: "Day After 11:00 AM",
                        getVal: () => {
                          const d = new Date();
                          d.setDate(d.getDate() + 2);
                          d.setHours(11, 0, 0, 0);
                          return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                        }
                      },
                    ].map((btn) => (
                      <button
                        type="button"
                        key={btn.label}
                        onClick={() => setDemoDate(btn.getVal())}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white text-amber-900 border border-amber-300 hover:border-amber-500 hover:bg-amber-100/60 transition-all cursor-pointer shadow-2xs active:scale-95"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Area Conversation (Textarea) */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MessageSquare size={14} className="text-purple-600" />
                    {isEditing ? "New Call Discussion / क्या बात हुई? (Call Notes)" : "Call Conversation Notes / Summary (क्या बात हुई)"}
                  </span>
                  {isEditing && (
                    <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                      Adds New Call Record
                    </span>
                  )}
                </label>
                <textarea
                  rows={3}
                  value={isEditing ? newConversation : conversationNotes}
                  onChange={(e) => isEditing ? setNewConversation(e.target.value) : setConversationNotes(e.target.value)}
                  placeholder={isEditing ? "Write notes of this call (e.g. Student se baat hui, fees structure explain kiya, kal demo class attend karega...)" : "Record summary of discussion with student or parents..."}
                  className="w-full p-3.5 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all font-medium text-neutral-900 placeholder:text-neutral-400 resize-none shadow-2xs"
                />
              </div>

              {/* If editing and has previous conversation notes or history, display them nicely */}
              {isEditing && effectiveHistory.length > 0 && (
                <div className="md:col-span-2 pt-3 border-t border-neutral-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-700 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <History size={14} className="text-purple-600" />
                      Previous Call Records & Notes ({effectiveHistory.length} Calls)
                    </span>
                    <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                      {effectiveHistory.length} Calls Logged
                    </span>
                  </div>
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                    {effectiveHistory.slice().reverse().map((item, idx) => {
                      const callNum = effectiveHistory.length - idx;
                      return (
                        <div key={item._id || idx} className="p-3 bg-white border border-neutral-200 rounded-xl text-xs space-y-1.5 shadow-2xs">
                          <div className="flex items-center justify-between text-neutral-500">
                            <div className="flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-black text-[10px]">
                                Call #{callNum}
                              </span>
                              <span className="font-bold text-neutral-800">
                                👤 {item.taken_by || "Staff"}
                              </span>
                              {item.call_outcome && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                  item.call_outcome === "Not Connected"
                                    ? "bg-amber-50 text-amber-800 border-amber-200"
                                    : "bg-indigo-50 text-indigo-700 border-indigo-200/60"
                                }`}>
                                  {item.call_outcome === "Not Connected" ? "📵 Not Connected" : item.call_outcome}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px]">{new Date(item.date).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</span>
                          </div>
                          <div className="p-2 bg-neutral-50 rounded-lg text-neutral-800 text-xs font-medium border border-neutral-100 whitespace-pre-wrap">
                            {item.conversation || "(No conversation details recorded)"}
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-neutral-500">
                            <span className="px-1.5 py-0.5 rounded bg-neutral-100 font-semibold text-neutral-700">
                              Status: {item.status}
                            </span>
                            {item.next_followup_date && (
                              <span className="text-amber-700 font-medium">Next: {new Date(item.next_followup_date).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 5: Next Follow-up Section */}
          <div className="bg-neutral-50/50 border border-neutral-200/80 rounded-2xl p-5 md:p-6 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-200">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">5</div>
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <Calendar size={18} className="text-amber-600" />
                Next Follow-up Section
              </h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Next Followup Date & Time */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Next Follow-up Date & Time
                  </label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="datetime-local"
                      value={nextFollowupDate}
                      onChange={(e) => setNextFollowupDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all font-medium text-neutral-900"
                    />
                  </div>
                </div>

                {/* Who Will Take Next Follow-up */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Who Will Take Next Follow-up? (Staff Name)
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={nextFollowupBy}
                      onChange={(e) => setNextFollowupBy(e.target.value)}
                      placeholder="e.g. Vikas Jangid, Counselor"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all font-medium text-neutral-900 placeholder:text-neutral-400"
                    />
                  </div>
                </div>

                {/* Which Follow-up is it (First, Second, Third, etc.) */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Which Follow-up is it? (Round / Sequence)
                  </label>
                  <select
                    value={followupRound}
                    onChange={(e) => setFollowupRound(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all font-semibold text-neutral-900 cursor-pointer"
                  >
                    <option value="1st Follow-up">1st Follow-up (First Call / Intro)</option>
                    <option value="2nd Follow-up">2nd Follow-up (Second Call / Demo)</option>
                    <option value="3rd Follow-up">3rd Follow-up (Third Call / Feedback)</option>
                    <option value="4th Follow-up">4th Follow-up (Fourth Call / Fees)</option>
                    <option value="5th Follow-up">5th Follow-up (Fifth Call / Decision)</option>
                    <option value="6th+ Follow-up">6th+ Follow-up (Subsequent Follow-up)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer / Save Actions */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white/95 backdrop-blur-md pb-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 text-sm font-semibold hover:bg-neutral-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-7 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : isEditing ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>Update Lead</span>
                </>
              ) : (
                <>
                  <Plus size={16} />
                  <span>Create Student Lead</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

