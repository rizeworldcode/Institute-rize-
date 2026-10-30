import { useState, useEffect } from "react";
import { 
  X, User, Phone, MapPin, School, GraduationCap, 
  Calendar, BookOpen, AlertCircle, MessageSquare, 
  Clock, CheckCircle2, Flame, Award, Building, Sparkles, Plus, History
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
  const [status, setStatus] = useState<StudentLead["status"]>("New Inquiry");
  const [nextFollowupDate, setNextFollowupDate] = useState("");
  const [followupTakenBy, setFollowupTakenBy] = useState("");

  // Section 5: Next Followup Section
  const [nextFollowupBy, setNextFollowupBy] = useState("");
  const [followupRound, setFollowupRound] = useState("1st Follow-up");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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

      setDemoClassTaken(Boolean(lead.demo_class_taken));
      setDemoDate(lead.demo_date ? lead.demo_date.split("T")[0] : "");
      setInterestedCourse(lead.interested_course || "");
      setInterestLevel(lead.interest_level || "Medium");
      setProblemsFaced(lead.problems_faced || "");
      setRemarks(lead.remarks || "");

      setConversationNotes(lead.conversation_notes || "");
      setNewConversation("");
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
        demo_date: demoClassTaken && demoDate ? demoDate : null,
        interested_course: interestedCourse.trim(),
        interest_level: interestLevel,
        problems_faced: problemsFaced.trim(),
        remarks: remarks.trim(),

        status,
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
                Demo Class Section (If Taken)
              </h3>
            </div>

            {/* Demo class taken toggle */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-neutral-700">
                Has the student attended / taken a Demo Class?
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => setDemoClassTaken(true)}
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
                  No Demo Yet / Pending
                </button>
              </div>
            </div>

            {/* Demo Class Details - Only shown when "Yes, Demo Taken" is selected */}
            {demoClassTaken && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-neutral-200 animate-in fade-in duration-200">
                {/* Date of Joined Demo Class */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Date of Joined Demo Class <span className="text-emerald-600 font-bold">•</span>
                  </label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="date"
                      value={demoDate}
                      onChange={(e) => setDemoDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium text-neutral-900"
                    />
                  </div>
                </div>

                {/* Interested Course Name */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Interested Course Name
                  </label>
                  <div className="relative">
                    <BookOpen size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
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
            )}
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
              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Lead Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
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

              {/* Message Area Conversation (Textarea) */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  {isEditing ? "Record New Conversation Notes / Call Summary" : "Conversation / Call Notes"}
                </label>
                <textarea
                  rows={3}
                  value={isEditing ? newConversation : conversationNotes}
                  onChange={(e) => isEditing ? setNewConversation(e.target.value) : setConversationNotes(e.target.value)}
                  placeholder="Record summary of discussion with student or parents..."
                  className="w-full p-3.5 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all font-medium text-neutral-900 placeholder:text-neutral-400 resize-none"
                />
              </div>

              {/* If editing and has previous conversation notes or history, display them nicely */}
              {isEditing && lead?.followup_history && lead.followup_history.length > 0 && (
                <div className="md:col-span-2 pt-3 border-t border-neutral-200">
                  <div className="flex items-center gap-2 mb-3 text-xs font-bold text-neutral-700 uppercase tracking-wider">
                    <History size={14} className="text-purple-600" />
                    Previous Follow-up History ({lead.followup_history.length})
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                    {lead.followup_history.slice().reverse().map((item, idx) => (
                      <div key={item._id || idx} className="p-3 bg-white border border-neutral-200 rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between text-neutral-500">
                          <span className="font-semibold text-neutral-800">
                            👤 {item.taken_by || "Staff"}
                          </span>
                          <span>{new Date(item.date).toLocaleString()}</span>
                        </div>
                        <p className="text-neutral-700 text-sm">{item.conversation || "(No message)"}</p>
                        <div className="flex items-center gap-3 pt-1 text-[11px] text-neutral-500">
                          <span className="px-1.5 py-0.5 rounded bg-neutral-100 font-semibold">{item.status}</span>
                          {item.next_followup_date && (
                            <span>Next: {new Date(item.next_followup_date).toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    ))}
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

