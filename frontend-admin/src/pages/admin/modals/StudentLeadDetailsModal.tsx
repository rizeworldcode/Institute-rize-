import { 
  X, User,
  Calendar, BookOpen, AlertCircle, MessageSquare, 
  Flame, Building, 
  PhoneCall, MessageCircle, Edit2, Copy, Check, CalendarCheck
} from "lucide-react";
import { useState } from "react";
import { StudentLead } from "../types";

interface StudentLeadDetailsModalProps {
  lead: StudentLead | null;
  onClose: () => void;
  onEdit: (lead: StudentLead) => void;
}

export function StudentLeadDetailsModal({ lead, onClose, onEdit }: StudentLeadDetailsModalProps) {
  const [copied, setCopied] = useState<string | null>(null);

  if (!lead) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const cleanPhone = (lead.phone || "").replace(/\D/g, "");

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Converted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "In Follow-up":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Demo Scheduled":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Demo Completed":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "Lost":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 overflow-y-auto bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative bg-white border border-neutral-200 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-neutral-200 bg-neutral-50/70 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20 font-bold text-lg">
              {lead.student_name ? lead.student_name.charAt(0).toUpperCase() : "S"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                  {lead.lead_ID}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadgeClass(lead.status)}`}>
                  {lead.status}
                </span>
                {copied === "id" && (
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <Check size={12} /> Copied!
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-neutral-900 mt-1">
                {lead.student_name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(lead);
              }}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold border border-blue-200 cursor-pointer"
            >
              <Edit2 size={15} />
              <span className="hidden sm:inline">Edit / Follow-up</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded-xl transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          {/* Quick Action Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <a
              href={`tel:${lead.phone}`}
              className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/70 transition-all flex items-center gap-2.5 text-emerald-700 font-bold text-xs"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <PhoneCall size={16} />
              </div>
              <div>
                <div>Call Student</div>
                <div className="text-[11px] font-medium text-emerald-600 truncate">{lead.phone}</div>
              </div>
            </a>

            <a
              href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hello ${lead.student_name}, greetings from RizeWorld Institute!`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-green-50 border border-green-200 hover:bg-green-100/70 transition-all flex items-center gap-2.5 text-green-800 font-bold text-xs"
            >
              <div className="w-8 h-8 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0">
                <MessageCircle size={16} />
              </div>
              <div>
                <div>WhatsApp Chat</div>
                <div className="text-[11px] font-medium text-green-700">Open Direct Chat</div>
              </div>
            </a>

            <button
              onClick={() => handleCopy(lead.phone, "phone")}
              className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 transition-all flex items-center gap-2.5 text-neutral-700 font-bold text-xs cursor-pointer col-span-2 sm:col-span-1"
            >
              <div className="w-8 h-8 rounded-xl bg-neutral-200 text-neutral-700 flex items-center justify-center shrink-0">
                {copied === "phone" ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
              </div>
              <div className="text-left">
                <div>{copied === "phone" ? "Copied Phone!" : "Copy Phone"}</div>
                <div className="text-[11px] font-normal text-neutral-500">{lead.phone}</div>
              </div>
            </button>
          </div>

          {/* Section 1: Student Information */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider pb-2 border-b border-neutral-100">
              <User size={15} className="text-blue-600" />
              Student Profile & Education
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-neutral-400 block font-medium">Student Name</span>
                <span className="font-bold text-neutral-900">{lead.student_name}</span>
              </div>
              <div>
                <span className="text-xs text-neutral-400 block font-medium">Phone Number</span>
                <span className="font-bold text-neutral-900">{lead.phone}</span>
              </div>
              <div>
                <span className="text-xs text-neutral-400 block font-medium">School / College</span>
                <span className="font-semibold text-neutral-800">{lead.school_name || "—"}</span>
              </div>
              <div>
                <span className="text-xs text-neutral-400 block font-medium">Current Education / Class</span>
                <span className="font-semibold text-neutral-800">{lead.current_education || "—"}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-xs text-neutral-400 block font-medium">Address</span>
                <span className="font-medium text-neutral-700">{lead.address || "—"}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Workshop & Source Information */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider pb-2 border-b border-neutral-100">
              <Building size={15} className="text-indigo-600" />
              Workshop & Lead Source
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-neutral-400 block font-medium">Lead Origin / Source Type</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold mt-1 ${
                  lead.is_from_workshop ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : "bg-neutral-100 text-neutral-800"
                }`}>
                  {lead.is_from_workshop ? "🏫 Workshop" : "🌐 Other Source"}
                </span>
              </div>
              {!lead.is_from_workshop && (
                <div>
                  <span className="text-xs text-neutral-400 block font-medium">Specific Source</span>
                  <span className="font-semibold text-neutral-800">{lead.source_other || "Direct Walk-in"}</span>
                </div>
              )}
              {lead.is_from_workshop && (
                <>
                  <div>
                    <span className="text-xs text-neutral-400 block font-medium">Workshop School / Institution</span>
                    <span className="font-bold text-neutral-900">{lead.workshop_school_name || "—"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 block font-medium">Workshop Date</span>
                    <span className="font-semibold text-neutral-800">
                      {lead.workshop_date ? new Date(lead.workshop_date).toLocaleDateString() : "—"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Section 3: Demo Class Details */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider pb-2 border-b border-neutral-100">
              <BookOpen size={15} className="text-emerald-600" />
              Demo Class & Course Interests
            </div>

            {/* Scheduled Demo Banner if Demo Scheduled or demo_date exists without demo taken */}
            {!lead.demo_class_taken && (lead.status === "Demo Scheduled" || lead.demo_date) && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/60 to-amber-50 border-2 border-amber-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-950 flex items-center gap-1.5 uppercase tracking-wide">
                    <CalendarCheck size={16} className="text-amber-600" />
                    Scheduled Demo Class
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-200/90 text-amber-900 border border-amber-300">
                    Upcoming Demo
                  </span>
                </div>
                <div className="text-base font-black text-neutral-900 flex items-center gap-2">
                  <Calendar size={16} className="text-amber-600" />
                  <span>
                    {lead.demo_date ? new Date(lead.demo_date).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }) : "Demo date pending"}
                  </span>
                </div>
                {lead.interested_course && (
                  <div className="text-xs text-amber-900 font-semibold pt-1 border-t border-amber-200/80">
                    Demo Course Subject: <span className="font-bold text-neutral-900">{lead.interested_course}</span>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-neutral-400 block font-medium">Demo Class Status</span>
                {lead.demo_class_taken ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold mt-1 bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ✅ Demo Class Taken
                  </span>
                ) : lead.status === "Demo Scheduled" ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold mt-1 bg-amber-50 text-amber-800 border border-amber-200 font-mono">
                    🟠 Demo Scheduled
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold mt-1 bg-neutral-100 text-neutral-600">
                    ⏳ No Demo Class Taken Yet
                  </span>
                )}
              </div>

              <div>
                <span className="text-xs text-neutral-400 block font-medium">Interested Course</span>
                <span className="font-bold text-neutral-900">{lead.interested_course || "—"}</span>
              </div>

              {lead.demo_date && (
                <div>
                  <span className="text-xs text-neutral-400 block font-medium">
                    {lead.demo_class_taken ? "Date of Attended Demo" : "Scheduled Demo Date & Time"}
                  </span>
                  <span className="font-bold text-amber-800">
                    {new Date(lead.demo_date).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              )}

              <div>
                <span className="text-xs text-neutral-400 block font-medium">Level of Interest</span>
                <span className="font-bold text-neutral-900 flex items-center gap-1.5 mt-0.5">
                  {lead.interest_level === "High" && <Flame size={15} className="text-rose-500" />}
                  {lead.interest_level || "Medium"}
                </span>
              </div>

              {lead.problems_faced && (
                <div className="sm:col-span-2 p-3 rounded-xl bg-amber-50/60 border border-amber-200/80">
                  <span className="text-xs font-bold text-amber-800 flex items-center gap-1 mb-1">
                    <AlertCircle size={13} />
                    Reported Problem / Concerns:
                  </span>
                  <p className="text-xs text-amber-900 whitespace-pre-wrap">{lead.problems_faced}</p>
                </div>
              )}

              {lead.remarks && (
                <div className="sm:col-span-2 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                  <span className="text-xs font-bold text-neutral-700 block mb-1">Remarks & Feedback:</span>
                  <p className="text-xs text-neutral-800 whitespace-pre-wrap">{lead.remarks}</p>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Current Follow-up */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                <MessageSquare size={15} className="text-purple-600" />
                Current Follow-up & Conversation
              </div>
              <span className="text-xs text-neutral-400 font-medium">
                {lead.followup_history?.length || 0} interactions recorded
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-purple-50/40 p-3.5 rounded-xl border border-purple-100">
              <div>
                <span className="text-neutral-500 block">Lead Status:</span>
                <span className="font-bold text-neutral-800 text-sm">{lead.status}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Call Response:</span>
                <span className="font-bold text-indigo-700 text-sm">{lead.call_outcome || "Connected"}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Follow-up Taken By:</span>
                <span className="font-bold text-neutral-800 text-sm">{lead.followup_taken_by || "Staff"}</span>
              </div>
            </div>

            {lead.conversation_notes ? (
              <div>
                <span className="text-xs text-neutral-400 block font-medium mb-1">Conversation / Discussion Notes:</span>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm text-neutral-800 whitespace-pre-wrap">
                  {lead.conversation_notes}
                </div>
              </div>
            ) : (
              <div className="text-xs text-neutral-400 italic">No conversation notes recorded.</div>
            )}

            {/* Chronological History Log */}
            {lead.followup_history && lead.followup_history.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-bold text-neutral-600 block">Conversation History Timeline:</span>
                <div className="space-y-2">
                  {lead.followup_history.slice().reverse().map((item, idx) => (
                    <div key={item._id || idx} className="p-3 bg-neutral-50/70 border border-neutral-200/80 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between text-neutral-500">
                        <span className="font-bold text-neutral-800">👤 {item.taken_by || "Staff"}</span>
                        <span>{new Date(item.date).toLocaleString()}</span>
                      </div>
                      <p className="text-neutral-700 text-xs mt-1">{item.conversation}</p>
                      <div className="flex items-center gap-3 pt-1 text-[11px] text-neutral-500">
                        <span className="px-1.5 py-0.5 rounded bg-white border border-neutral-200 font-semibold">
                          Status: {item.status}
                        </span>
                        {item.next_followup_date && (
                          <span>Next Follow-up: {new Date(item.next_followup_date).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Next Follow-up Schedule */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider pb-2 border-b border-neutral-100">
              <Calendar size={15} className="text-amber-600" />
              Next Follow-up Schedule
            </div>
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/70 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs text-neutral-500 block">Scheduled Date & Time</span>
                  <span className="font-bold text-neutral-900 text-base mt-0.5 block">
                    {lead.next_followup_date ? new Date(lead.next_followup_date).toLocaleString() : "Not scheduled"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {lead.followup_round && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                      {lead.followup_round}
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    Action: Call
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-amber-200/60 text-xs text-neutral-600 flex items-center gap-2">
                <span className="font-medium text-neutral-500">Assigned To Take Follow-up:</span>
                <span className="font-bold text-neutral-800">{lead.next_followup_by || lead.followup_taken_by || "Staff"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50/70 flex items-center justify-between">
          <div className="text-xs text-neutral-500 font-medium">
            Created on {new Date(lead.created_at).toLocaleDateString()}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

