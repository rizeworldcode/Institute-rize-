import { 
  X, User,
  Calendar, BookOpen, AlertCircle, MessageSquare, 
  Flame, Building, 
  PhoneCall, MessageCircle, Edit2, Copy, Check, CalendarCheck,
  Clock, History, CheckCircle2, RotateCw
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { StudentLead } from "../types";
import { getApiUrl } from "../../../utils/api";

interface StudentLeadDetailsModalProps {
  lead: StudentLead | null;
  onClose: () => void;
  onEdit: (lead: StudentLead) => void;
  onLeadUpdated?: (updatedLead: StudentLead) => void;
}

export function StudentLeadDetailsModal({ lead, onClose, onEdit, onLeadUpdated }: StudentLeadDetailsModalProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeLead, setActiveLead] = useState<StudentLead | null>(lead);
  const [isLoggingCall, setIsLoggingCall] = useState(false);
  const [quickNote, setQuickNote] = useState("");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    setActiveLead(lead);
  }, [lead]);

  // Compile full calls history list for this student with fallback synthesis for older data
  const historyList = useMemo(() => {
    if (!activeLead) return [];
    const list = Array.isArray(activeLead.followup_history) ? [...activeLead.followup_history] : [];

    // If no history exists, synthesize initial registration
    if (list.length === 0) {
      if (activeLead.conversation_notes || activeLead.call_outcome || (activeLead.status && activeLead.status !== "New Inquiry")) {
        list.push({
          _id: "initial-log",
          date: activeLead.created_at || new Date().toISOString(),
          conversation: activeLead.conversation_notes || "Initial lead inquiry registered",
          status: activeLead.status || "New Inquiry",
          call_outcome: activeLead.call_outcome || "Connected",
          taken_by: activeLead.followup_taken_by || "Counselor",
          followup_round: activeLead.followup_round || "1st Follow-up",
          next_followup_date: activeLead.next_followup_date || null,
          demo_date: activeLead.demo_date || null,
        });
      }
    }

    // If only 1 history entry exists (e.g. initial registration), check if a 2nd call was made
    if (list.length === 1) {
      const first = list[0];
      const hasOutcomeDiff = Boolean(activeLead.call_outcome && activeLead.call_outcome !== first.call_outcome);
      const hasStatusDiff = Boolean(activeLead.status && activeLead.status !== "New Inquiry" && activeLead.status !== first.status);
      const hasTimeDiff = Boolean(activeLead.updated_at && activeLead.created_at && (new Date(activeLead.updated_at).getTime() - new Date(activeLead.created_at).getTime() > 60000));
      const hasStaff = Boolean(activeLead.followup_taken_by && (!first.taken_by || activeLead.followup_taken_by !== first.taken_by));

      if (hasOutcomeDiff || (hasStatusDiff && hasTimeDiff) || (hasOutcomeDiff && hasStaff)) {
        list.push({
          _id: "call-2-synth",
          date: activeLead.updated_at || new Date().toISOString(),
          conversation: (activeLead.conversation_notes && activeLead.conversation_notes !== first.conversation)
            ? activeLead.conversation_notes
            : `Call response: ${activeLead.call_outcome || "Follow-up call attended"}`,
          status: activeLead.status || "In Follow-up",
          call_outcome: activeLead.call_outcome || "Not Connected",
          taken_by: activeLead.followup_taken_by || "Counselor",
          followup_round: activeLead.followup_round || "2nd Follow-up",
          next_followup_date: activeLead.next_followup_date || null,
          demo_date: activeLead.demo_date || null,
        });
      }
    }
    return list;
  }, [activeLead]);

  // Compute breakdown of calls: connected vs not connected vs demo
  const callBreakdown = useMemo(() => {
    let connected = 0;
    let notConnected = 0;
    let yesDemo = 0;
    let toldLater = 0;
    let noDropped = 0;

    historyList.forEach((item, idx) => {
      const outcome = item.call_outcome || (idx === 0 && !item.call_outcome ? "Connected" : "");
      const conv = (item.conversation || "").toLowerCase();
      const status = item.status || "";

      if (outcome === "Not Connected") {
        notConnected++;
      } else if (outcome === "Yes for Demo" || status === "Demo Scheduled" || status === "Demo Completed") {
        yesDemo++;
        connected++;
      } else if (outcome === "Told Later" || conv.includes("later") || conv.includes("kal") || conv.includes("busy")) {
        toldLater++;
        connected++;
      } else if (outcome === "No" || status === "Lost") {
        noDropped++;
        connected++;
      } else if (outcome === "Connected") {
        connected++;
      } else {
        // Fallback only if outcome is empty or unspecified
        const isUnreachable = conv.includes("not connect") || conv.includes("not receive") || conv.includes("ringing") || conv.includes("switched off") || conv.includes("did not pick") || conv.includes("didn't pick");
        if (isUnreachable) {
          notConnected++;
        } else {
          connected++;
        }
      }
    });

    const total = Math.max(1, historyList.length);
    return { total, connected, notConnected, yesDemo, toldLater, noDropped };
  }, [historyList]);

  const latestHistoryItem = historyList.length > 0 ? historyList[historyList.length - 1] : null;
  const latestCallOutcome = latestHistoryItem?.call_outcome || activeLead?.call_outcome || "Connected";

  if (!activeLead) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const cleanPhone = (activeLead.phone || "").replace(/\D/g, "");

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

  const renderOutcomePill = (outcome?: string) => {
    switch (outcome) {
      case "Yes for Demo":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 flex items-center gap-1 shadow-2xs">
            <CalendarCheck size={11} className="text-indigo-600 shrink-0" /> Yes for Demo
          </span>
        );
      case "Told Later":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200/80 flex items-center gap-1 shadow-2xs">
            <Clock size={11} className="text-purple-600 shrink-0" /> Told Later
          </span>
        );
      case "No":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200/80 flex items-center gap-1 shadow-2xs">
            <AlertCircle size={11} className="text-rose-600 shrink-0" /> No / Dropped
          </span>
        );
      case "Not Connected":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80 flex items-center gap-1 shadow-2xs">
            📵 Not Connected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1 shadow-2xs">
            📞 Connected
          </span>
        );
    }
  };

  const handleQuickCallLog = async (outcome: string) => {
    if (!activeLead || isLoggingCall) return;
    setIsLoggingCall(true);
    const token = localStorage.getItem("adminAuthToken");
    const nextCallNum = historyList.length + 1;
    const roundName = `${nextCallNum === 1 ? "1st" : nextCallNum === 2 ? "2nd" : nextCallNum === 3 ? "3rd" : `${nextCallNum}th`} Follow-up`;
    const counselorName = activeLead.followup_taken_by || "Counselor";
    const noteText = quickNote.trim() ? quickNote.trim() : `Call response: ${outcome}`;

    const newHistoryEntry = {
      _id: `call-${Date.now()}`,
      date: new Date().toISOString(),
      conversation: noteText,
      status: outcome === "Yes for Demo" ? "Demo Scheduled" : (outcome === "No" ? "Lost" : "In Follow-up"),
      call_outcome: outcome,
      taken_by: counselorName,
      followup_round: roundName,
      next_followup_date: activeLead.next_followup_date || null,
      demo_date: activeLead.demo_date || null,
    };

    const nextStatus = outcome === "Yes for Demo" 
      ? "Demo Scheduled" 
      : (outcome === "No" ? "Lost" : (activeLead.status === "New Inquiry" ? "In Follow-up" : activeLead.status));

    const updatedLead: StudentLead = {
      ...activeLead,
      call_outcome: outcome as any,
      status: nextStatus,
      followup_history: [...historyList, newHistoryEntry],
      conversation_notes: noteText,
      updated_at: new Date().toISOString(),
    };

    setActiveLead(updatedLead);
    setQuickNote("");
    setSuccessToast(`Call #${nextCallNum} logged as "${outcome}"!`);
    setTimeout(() => setSuccessToast(null), 3000);

    if (onLeadUpdated) {
      onLeadUpdated(updatedLead);
    }

    try {
      await fetch(getApiUrl(`/student-leads/${activeLead._id}/followup`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          conversation: noteText,
          status: nextStatus,
          call_outcome: outcome,
          taken_by: counselorName,
          followup_round: roundName,
        }),
      });
    } catch (err) {
      console.warn("Failed to sync call record to server:", err);
    } finally {
      setIsLoggingCall(false);
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
              {activeLead.student_name ? activeLead.student_name.charAt(0).toUpperCase() : "S"}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                  {activeLead.lead_ID}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadgeClass(activeLead.status)}`}>
                  {activeLead.status}
                </span>
                
                {/* Total Calls Pill */}
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-purple-100 text-purple-900 border border-purple-200 shadow-2xs">
                  📞 {callBreakdown.total} {callBreakdown.total === 1 ? "Call Made" : "Calls Made"}
                </span>

                {/* Outcome breakdown pills */}
                {callBreakdown.connected > 0 && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                    ✅ {callBreakdown.connected} Connected
                  </span>
                )}
                {callBreakdown.notConnected > 0 && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
                    📵 {callBreakdown.notConnected} Not Connected
                  </span>
                )}

                {copied === "id" && (
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <Check size={12} /> Copied!
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-neutral-900 mt-1">
                {activeLead.student_name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(activeLead);
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <a
              href={`tel:${activeLead.phone}`}
              className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/70 transition-all flex items-center gap-2.5 text-emerald-700 font-bold text-xs"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <PhoneCall size={16} />
              </div>
              <div className="min-w-0">
                <div>Call Student</div>
                <div className="text-[11px] font-medium text-emerald-600 truncate">{activeLead.phone}</div>
              </div>
            </a>

            <a
              href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hello ${activeLead.student_name}, greetings from RizeWorld Institute!`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-green-50 border border-green-200 hover:bg-green-100/70 transition-all flex items-center gap-2.5 text-green-800 font-bold text-xs"
            >
              <div className="w-8 h-8 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0">
                <MessageCircle size={16} />
              </div>
              <div className="min-w-0">
                <div>WhatsApp Chat</div>
                <div className="text-[11px] font-medium text-green-700">Open Direct Chat</div>
              </div>
            </a>

            {/* Total Calls Counter Card */}
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 flex items-center gap-2.5 text-purple-900 font-bold text-xs shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <History size={16} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold text-purple-600 tracking-wider">Total Calls</div>
                <div className="text-sm font-black text-purple-950 truncate">
                  {callBreakdown.total} {callBreakdown.total === 1 ? "Call Made" : "Calls Made"}
                </div>
                <div className="text-[10px] font-semibold text-purple-700 truncate">
                  {callBreakdown.connected} Conn • {callBreakdown.notConnected} Not Conn
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCopy(activeLead.phone, "phone")}
              className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 transition-all flex items-center gap-2.5 text-neutral-700 font-bold text-xs cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-neutral-200 text-neutral-700 flex items-center justify-center shrink-0">
                {copied === "phone" ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
              </div>
              <div className="text-left min-w-0">
                <div>{copied === "phone" ? "Copied Phone!" : "Copy Phone"}</div>
                <div className="text-[11px] font-normal text-neutral-500 truncate">{activeLead.phone}</div>
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
                <span className="font-bold text-neutral-900">{activeLead.student_name}</span>
              </div>
              <div>
                <span className="text-xs text-neutral-400 block font-medium">Phone Number</span>
                <span className="font-bold text-neutral-900">{activeLead.phone}</span>
              </div>
              <div>
                <span className="text-xs text-neutral-400 block font-medium">School / College</span>
                <span className="font-semibold text-neutral-800">{activeLead.school_name || "—"}</span>
              </div>
              <div>
                <span className="text-xs text-neutral-400 block font-medium">Current Education / Class</span>
                <span className="font-semibold text-neutral-800">{activeLead.current_education || "—"}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-xs text-neutral-400 block font-medium">Address</span>
                <span className="font-medium text-neutral-700">{activeLead.address || "—"}</span>
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
                  activeLead.is_from_workshop ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : "bg-neutral-100 text-neutral-800"
                }`}>
                  {activeLead.is_from_workshop ? "🏫 Workshop" : "🌐 Other Source"}
                </span>
              </div>
              {!activeLead.is_from_workshop && (
                <div>
                  <span className="text-xs text-neutral-400 block font-medium">Specific Source</span>
                  <span className="font-semibold text-neutral-800">{activeLead.source_other || "Direct Walk-in"}</span>
                </div>
              )}
              {activeLead.is_from_workshop && (
                <>
                  <div>
                    <span className="text-xs text-neutral-400 block font-medium">Workshop School / Institution</span>
                    <span className="font-bold text-neutral-900">{activeLead.workshop_school_name || "—"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 block font-medium">Workshop Date</span>
                    <span className="font-semibold text-neutral-800">
                      {activeLead.workshop_date ? new Date(activeLead.workshop_date).toLocaleDateString() : "—"}
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
            {!activeLead.demo_class_taken && (activeLead.status === "Demo Scheduled" || activeLead.demo_date) && (
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
                    {activeLead.demo_date ? new Date(activeLead.demo_date).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }) : "Demo date pending"}
                  </span>
                </div>
                {activeLead.interested_course && (
                  <div className="text-xs text-amber-900 font-semibold pt-1 border-t border-amber-200/80">
                    Demo Course Subject: <span className="font-bold text-neutral-900">{activeLead.interested_course}</span>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-neutral-400 block font-medium">Demo Class Status</span>
                {activeLead.demo_class_taken ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold mt-1 bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ✅ Demo Class Taken
                  </span>
                ) : activeLead.status === "Demo Scheduled" ? (
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
                <span className="font-bold text-neutral-900">{activeLead.interested_course || "—"}</span>
              </div>

              {activeLead.demo_date && (
                <div>
                  <span className="text-xs text-neutral-400 block font-medium">
                    {activeLead.demo_class_taken ? "Date of Attended Demo" : "Scheduled Demo Date & Time"}
                  </span>
                  <span className="font-bold text-amber-800">
                    {new Date(activeLead.demo_date).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              )}

              <div>
                <span className="text-xs text-neutral-400 block font-medium">Level of Interest</span>
                <span className="font-bold text-neutral-900 flex items-center gap-1.5 mt-0.5">
                  {activeLead.interest_level === "High" && <Flame size={15} className="text-rose-500" />}
                  {activeLead.interest_level || "Medium"}
                </span>
              </div>

              {activeLead.problems_faced && (
                <div className="sm:col-span-2 p-3 rounded-xl bg-amber-50/60 border border-amber-200/80">
                  <span className="text-xs font-bold text-amber-800 flex items-center gap-1 mb-1">
                    <AlertCircle size={13} />
                    Reported Problem / Concerns:
                  </span>
                  <p className="text-xs text-amber-900 whitespace-pre-wrap">{activeLead.problems_faced}</p>
                </div>
              )}

              {activeLead.remarks && (
                <div className="sm:col-span-2 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                  <span className="text-xs font-bold text-neutral-700 block mb-1">Remarks & Feedback:</span>
                  <p className="text-xs text-neutral-800 whitespace-pre-wrap">{activeLead.remarks}</p>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: All Calls & Discussion History */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2 text-xs font-black text-neutral-800 uppercase tracking-wider">
                <MessageSquare size={16} className="text-purple-600" />
                <span>Call Logs & Discussion History (सभी कॉल्स का पूरा रिकॉर्ड)</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-black border border-purple-200 shadow-2xs">
                <PhoneCall size={12} className="text-purple-700" />
                <span>Total {callBreakdown.total} {callBreakdown.total === 1 ? "Call Made" : "Calls Made"}</span>
              </div>
            </div>

            {/* Calling Summary Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-gradient-to-r from-purple-50/80 via-indigo-50/50 to-blue-50/40 p-3.5 rounded-xl border border-purple-200/70 shadow-2xs">
              <div>
                <span className="text-[11px] text-neutral-500 block font-medium">Total Calls Made:</span>
                <span className="font-black text-purple-900 text-base">{callBreakdown.total} Calls</span>
              </div>
              <div>
                <span className="text-[11px] text-neutral-500 block font-medium">Connected Calls:</span>
                <span className="font-black text-emerald-700 text-base">{callBreakdown.connected} Calls</span>
              </div>
              <div>
                <span className="text-[11px] text-neutral-500 block font-medium">Not Connected:</span>
                <span className="font-black text-amber-700 text-base">{callBreakdown.notConnected} Calls</span>
              </div>
              <div>
                <span className="text-[11px] text-neutral-500 block font-medium">Latest Outcome:</span>
                <span className="font-bold text-indigo-700 text-xs sm:text-sm mt-0.5 block truncate">
                  {latestCallOutcome}
                </span>
              </div>
            </div>

            {/* ⚡ Quick Log Call Bar */}
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-neutral-800 flex items-center gap-1.5 uppercase tracking-wide">
                  ⚡ Quick Log New Dial (तुरंत नया कॉल रिकॉर्ड करें):
                </span>
                {isLoggingCall && (
                  <span className="text-[11px] text-purple-600 font-bold flex items-center gap-1 animate-pulse">
                    <RotateCw size={12} className="animate-spin" /> Saving call...
                  </span>
                )}
                {successToast && (
                  <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 size={12} /> {successToast}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  placeholder="Optional notes: kya baat hui, response details... (then click outcome below)"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:border-purple-500 text-neutral-800 placeholder:text-neutral-400"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  disabled={isLoggingCall}
                  onClick={() => handleQuickCallLog("Connected")}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-all cursor-pointer shadow-2xs flex items-center gap-1 disabled:opacity-50"
                >
                  <PhoneCall size={12} className="text-emerald-600" /> 📞 Connected
                </button>
                <button
                  type="button"
                  disabled={isLoggingCall}
                  onClick={() => handleQuickCallLog("Not Connected")}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition-all cursor-pointer shadow-2xs flex items-center gap-1 disabled:opacity-50"
                >
                  📵 Not Connected
                </button>
                <button
                  type="button"
                  disabled={isLoggingCall}
                  onClick={() => handleQuickCallLog("Yes for Demo")}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-300 hover:bg-indigo-100 transition-all cursor-pointer shadow-2xs flex items-center gap-1 disabled:opacity-50"
                >
                  <CalendarCheck size={12} className="text-indigo-600" /> 📅 Yes for Demo
                </button>
                <button
                  type="button"
                  disabled={isLoggingCall}
                  onClick={() => handleQuickCallLog("Told Later")}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-50 text-purple-800 border border-purple-300 hover:bg-purple-100 transition-all cursor-pointer shadow-2xs flex items-center gap-1 disabled:opacity-50"
                >
                  <Clock size={12} className="text-purple-600" /> ⏰ Told Later
                </button>
                <button
                  type="button"
                  disabled={isLoggingCall}
                  onClick={() => handleQuickCallLog("No")}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100 transition-all cursor-pointer shadow-2xs flex items-center gap-1 disabled:opacity-50"
                >
                  <AlertCircle size={12} className="text-rose-600" /> ❌ No / Dropped
                </button>
              </div>
            </div>

            {/* Complete Chronological Call List */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-700">
                <span className="flex items-center gap-1.5">
                  <History size={14} className="text-purple-600" />
                  All Call Details & Notes ({historyList.length} Records):
                </span>
                <span className="text-[11px] text-neutral-400 font-normal">
                  Sorted Newest First
                </span>
              </div>

              <div className="space-y-3">
                {historyList.slice().reverse().map((item, idx) => {
                  const callNumber = historyList.length - idx;
                  const roundLabel = item.followup_round || `${callNumber === 1 ? "1st" : callNumber === 2 ? "2nd" : callNumber === 3 ? "3rd" : `${callNumber}th`} Follow-up`;
                  const outcome = item.call_outcome || (callNumber === historyList.length ? activeLead.call_outcome : "") || "Connected";
                  const notesText = item.conversation || (callNumber === 1 && activeLead.conversation_notes ? activeLead.conversation_notes : "");

                  return (
                    <div 
                      key={item._id || idx} 
                      className="p-4 rounded-2xl bg-neutral-50/90 border border-neutral-200/90 shadow-2xs space-y-3 hover:border-purple-200 transition-all"
                    >
                      {/* Call Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-neutral-200/70">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-lg bg-purple-600 text-white text-[11px] font-black tracking-wide shadow-2xs">
                            Call #{callNumber}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md bg-white border border-neutral-200 text-xs font-bold text-neutral-800 shadow-2xs">
                            {roundLabel}
                          </span>
                          <span className="text-xs font-semibold text-neutral-700 flex items-center gap-1">
                            👤 Taken By: <strong className="text-neutral-900">{item.taken_by || activeLead.followup_taken_by || "Staff"}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {renderOutcomePill(outcome)}
                          <span className="text-[11px] font-medium text-neutral-500">
                            {new Date(item.date).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                          </span>
                        </div>
                      </div>

                      {/* Discussion Box: Exactly kya baat hui kya nahi */}
                      <div className="p-3.5 bg-white rounded-xl border border-neutral-200 shadow-2xs space-y-1.5">
                        <div className="text-[10px] font-black text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                          <MessageSquare size={13} className="text-purple-600" />
                          Call Discussion / क्या बात हुई:
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-900 font-medium whitespace-pre-wrap leading-relaxed">
                          {notesText && notesText.trim() !== "" ? notesText : (
                            <span className="italic text-neutral-400">
                              (Call attended with student. Follow-up status updated to: {item.status})
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Footer Details */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-500 pt-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-neutral-100 font-semibold text-neutral-700 border border-neutral-200/60">
                            Status: <strong className="text-neutral-900">{item.status}</strong>
                          </span>
                          {item.demo_date && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-bold flex items-center gap-1 shadow-2xs">
                              <CalendarCheck size={11} className="text-amber-600" />
                              Demo Scheduled: {new Date(item.demo_date).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                            </span>
                          )}
                        </div>

                        {item.next_followup_date && (
                          <div className="text-amber-700 font-bold flex items-center gap-1">
                            <Clock size={12} className="text-amber-600" />
                            Next Follow-up: {new Date(item.next_followup_date).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
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
                    {activeLead.next_followup_date ? new Date(activeLead.next_followup_date).toLocaleString() : "Not scheduled"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {activeLead.followup_round && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                      {activeLead.followup_round}
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    Action: Call
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-amber-200/60 text-xs text-neutral-600 flex items-center gap-2">
                <span className="font-medium text-neutral-500">Assigned To Take Follow-up:</span>
                <span className="font-bold text-neutral-800">{activeLead.next_followup_by || activeLead.followup_taken_by || "Staff"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50/70 flex items-center justify-between">
          <div className="text-xs text-neutral-500 font-medium">
            Created on {new Date(activeLead.created_at).toLocaleDateString()}
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
