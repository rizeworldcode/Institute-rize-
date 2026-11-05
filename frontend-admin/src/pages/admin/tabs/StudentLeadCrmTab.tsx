import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { 
  Plus, RotateCw, Search, Phone, Copy, Check, 
  Trash2, Edit2, FileText, Calendar, User, 
  Clock, TrendingUp, CheckCircle2, AlertCircle, 
  Building, Target, ChevronDown, PhoneCall, PhoneIncoming, PhoneOff, CalendarCheck, XCircle,
  X, MessageSquare, ArrowLeft, ArrowRight, FileDown
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { StudentLead, StudentLeadStats } from "../types";
import { StudentLeadModal } from "../modals/StudentLeadModal";
import { StudentLeadDetailsModal } from "../modals/StudentLeadDetailsModal";
import { getApiUrl } from "../../../utils/api";

export const CATEGORY_CONFIG = {
  "total-leads": {
    key: "total-leads",
    title: "Total Leads",
    badge: "All Registered",
    description: "Complete directory of all registered inquiries, workshop participants, and student leads across all pipeline stages.",
    themeColor: "from-[#ee591e] via-[#ea580c] to-[#c2410c]",
    bgLight: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-[#c2410c]",
    icon: Building,
  },
  "new-inquiries": {
    key: "new-inquiries",
    title: "New Inquiries",
    badge: "Fresh Prospects",
    description: "Newly submitted student inquiries and workshop leads requiring initial dialer contact and profiling.",
    themeColor: "from-sky-500 to-blue-600",
    bgLight: "bg-sky-50",
    borderColor: "border-sky-200",
    textColor: "text-sky-700",
    icon: Clock,
  },
  "in-follow-up": {
    key: "in-follow-up",
    title: "In Follow-up Leads",
    badge: "Active Engagement",
    description: "Active prospect leads undergoing follow-up calls, scheduled demo sessions, or completed demo evaluations.",
    themeColor: "from-amber-500 via-amber-600 to-orange-500",
    bgLight: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-800",
    icon: TrendingUp,
  },
  "converted": {
    key: "converted",
    title: "Converted Students",
    badge: "Enrolled",
    description: "Leads who successfully enrolled into courses with registered admissions and fee records.",
    themeColor: "from-[#2a7c37] via-[#246c30] to-[#1e5827]",
    bgLight: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-[#1e4a24]",
    icon: CheckCircle2,
  },
  "lost-leads": {
    key: "lost-leads",
    title: "Lost Leads",
    badge: "Dropped Inquiries",
    description: "Inquiries marked as lost, not interested, or discontinued from the telecalling funnel.",
    themeColor: "from-rose-600 to-pink-600",
    bgLight: "bg-rose-50",
    borderColor: "border-rose-200",
    textColor: "text-rose-700",
    icon: AlertCircle,
  },
} as const;

export type CategoryKey = keyof typeof CATEGORY_CONFIG;
export const CATEGORY_KEYS: CategoryKey[] = ["total-leads", "new-inquiries", "in-follow-up", "converted", "lost-leads"];

export const getCategoryBaseLeads = (catKey: CategoryKey, leadsList: StudentLead[]) => {
  switch (catKey) {
    case "total-leads":
      return leadsList;
    case "new-inquiries":
      return leadsList.filter((l) => l.status === "New Inquiry");
    case "in-follow-up":
      return leadsList.filter(
        (l) => l.status === "In Follow-up" || l.status === "Demo Scheduled" || l.status === "Demo Completed"
      );
    case "converted":
      return leadsList.filter((l) => l.status === "Converted");
    case "lost-leads":
      return leadsList.filter((l) => l.status === "Lost");
    default:
      return leadsList;
  }
};

export function StudentLeadCrmTab() {
  const [leads, setLeads] = useState<StudentLead[]>(() => {
    try {
      const saved = localStorage.getItem("rize_student_leads_cache");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [stats, setStats] = useState<StudentLeadStats>(() => {
    try {
      const saved = localStorage.getItem("rize_student_leads_stats_cache");
      return saved ? JSON.parse(saved) : {
        totalLeads: 0,
        newInquiries: 0,
        inFollowUp: 0,
        converted: 0,
        lostLeads: 0,
      };
    } catch {
      return {
        totalLeads: 0,
        newInquiries: 0,
        inFollowUp: 0,
        converted: 0,
        lostLeads: 0,
      };
    }
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  // URL Routing & Category Subview
  const { subview } = useParams<{ tab?: string; subview?: string }>();
  const navigate = useNavigate();

  const isCategoryActive = Boolean(subview && subview in CATEGORY_CONFIG);
  const activeCategory = isCategoryActive ? (subview as CategoryKey) : null;
  const currentCategory = activeCategory ? CATEGORY_CONFIG[activeCategory] : null;

  // Individual category page specific filters
  const [categorySearch, setCategorySearch] = useState("");
  const [categorySourceFilter, setCategorySourceFilter] = useState("All Sources");
  const [categoryCallFilter, setCategoryCallFilter] = useState("All");
  const [categoryDateFilterMode, setCategoryDateFilterMode] = useState<"all" | "today" | "yesterday" | "7days" | "custom">("all");
  const [categoryCustomDate, setCategoryCustomDate] = useState<string>("");
  const [subStatusFilter, setSubStatusFilter] = useState<"All" | "In Follow-up" | "Demo Scheduled" | "Demo Completed">("All");

  // URL Query Params
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";

  // Filters
  const [search, setSearch] = useState(urlSearch);
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [sourceFilter, setSourceFilter] = useState("All Sources");
  const [callResponseFilter, setCallResponseFilter] = useState("All");

  // Date-wise Filter State
  const [dateFilterMode, setDateFilterMode] = useState<"all" | "today" | "yesterday" | "7days" | "custom">("all");
  const [customDate, setCustomDate] = useState<string>("");

  useEffect(() => {
    const q = searchParams.get("search");
    if (q !== null && q !== search) {
      setSearch(q);
    }
  }, [searchParams]);

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedLeadForEdit, setSelectedLeadForEdit] = useState<StudentLead | null>(null);
  const [selectedLeadForDetails, setSelectedLeadForDetails] = useState<StudentLead | null>(null);

  // Copy feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const saveLeadsToCacheAndNotify = useCallback((data: StudentLead[]) => {
    try {
      localStorage.setItem("rize_student_leads_cache", JSON.stringify(data));
      window.dispatchEvent(new Event("rize_leads_updated"));
    } catch (e) {
      console.warn("Could not cache leads:", e);
    }
  }, []);

  const fetchLeads = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const token = localStorage.getItem("adminAuthToken");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(getApiUrl("/student-leads"), {
        signal: controller.signal,
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        if (data.data.length > 0) {
          setLeads(data.data);
          saveLeadsToCacheAndNotify(data.data);
        } else {
          // If server returned 0 leads, preserve any locally created leads in cache
          try {
            const cached = localStorage.getItem("rize_student_leads_cache");
            if (cached) {
              const localList = JSON.parse(cached);
              if (Array.isArray(localList) && localList.length > 0) {
                setLeads(localList);
                return;
              }
            }
          } catch (e) {}
          setLeads([]);
          saveLeadsToCacheAndNotify([]);
        }
      }
    } catch (err) {
      console.warn("Notice: Fetch student leads completed or offline fallback active:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [saveLeadsToCacheAndNotify]);

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("adminAuthToken");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(getApiUrl("/student-leads/stats"), {
        signal: controller.signal,
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
        try {
          localStorage.setItem("rize_student_leads_stats_cache", JSON.stringify(data.stats));
        } catch (e) {
          console.warn("Could not cache stats:", e);
        }
      }
    } catch (err) {
      console.warn("Notice: Fetch lead stats notice:", err);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, [fetchLeads, fetchStats]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveLead = async (formData: Partial<StudentLead>) => {
    const token = localStorage.getItem("adminAuthToken");
    const isEdit = Boolean(selectedLeadForEdit && selectedLeadForEdit._id);
    const url = getApiUrl(isEdit ? `/student-leads/${selectedLeadForEdit!._id}` : "/student-leads");
    const method = isEdit ? "PUT" : "POST";

    // Optimistically update local state immediately so user sees their lead with 0ms delay
    let updatedLead: StudentLead;
    if (isEdit) {
      const newNote = (formData as any).new_conversation || formData.conversation_notes;
      const historyItem = newNote || formData.call_outcome || formData.status ? [{
        _id: `hist-${Date.now()}`,
        date: new Date().toISOString(),
        conversation: newNote || (formData.call_outcome ? `Call response: ${formData.call_outcome}` : `Follow-up updated: Status set to ${formData.status || selectedLeadForEdit!.status}`),
        status: formData.status || selectedLeadForEdit!.status,
        call_outcome: formData.call_outcome || selectedLeadForEdit!.call_outcome || "",
        next_followup_date: formData.next_followup_date || null,
        demo_date: formData.demo_date || null,
        taken_by: formData.followup_taken_by || selectedLeadForEdit!.followup_taken_by || "Admin",
        next_followup_by: formData.next_followup_by || "",
        followup_round: formData.followup_round || "Follow-up",
      }] : [];

      updatedLead = {
        ...selectedLeadForEdit!,
        ...formData,
        conversation_notes: newNote || selectedLeadForEdit!.conversation_notes || "",
        followup_history: [...(selectedLeadForEdit!.followup_history || []), ...historyItem],
        updated_at: new Date().toISOString(),
      } as StudentLead;
      setLeads((prev) => {
        const next = prev.map((l) => (l._id === updatedLead._id ? updatedLead : l));
        saveLeadsToCacheAndNotify(next);
        return next;
      });
      if (selectedLeadForDetails && selectedLeadForDetails._id === updatedLead._id) {
        setSelectedLeadForDetails(updatedLead);
      }
    } else {
      const nextSeq = 1001 + leads.length;
      updatedLead = {
        _id: `lead-${Date.now()}`,
        lead_ID: `SL-${nextSeq}`,
        student_name: formData.student_name || "New Student",
        phone: formData.phone || "",
        address: formData.address || "",
        school_name: formData.school_name || "",
        current_education: formData.current_education || "",
        is_from_workshop: Boolean(formData.is_from_workshop),
        workshop_school_name: formData.workshop_school_name || "",
        workshop_date: formData.workshop_date || null,
        source_other: formData.source_other || "Direct Walk-in",
        demo_class_taken: Boolean(formData.demo_class_taken),
        demo_date: formData.demo_date || null,
        interested_course: formData.interested_course || "",
        interest_level: formData.interest_level || "Medium",
        problems_faced: formData.problems_faced || "",
        remarks: formData.remarks || "",
        conversation_notes: formData.conversation_notes || "",
        call_outcome: formData.call_outcome || "",
        status: formData.status || "New Inquiry",
        next_followup_date: formData.next_followup_date || null,
        next_followup_by: formData.next_followup_by || "",
        followup_round: formData.followup_round || "1st Follow-up",
        followup_taken_by: formData.followup_taken_by || "",
        followup_history: (formData.conversation_notes || formData.status === "Demo Scheduled") ? [{
          date: new Date().toISOString(),
          conversation: formData.conversation_notes || (formData.status === "Demo Scheduled" ? "Demo Scheduled" : "Lead created"),
          status: formData.status || "New Inquiry",
          call_outcome: formData.call_outcome || (formData.status === "Demo Scheduled" ? "Yes for Demo" : ""),
          next_followup_date: formData.next_followup_date || null,
          demo_date: formData.demo_date || null,
          taken_by: formData.followup_taken_by || "Admin",
          next_followup_by: formData.next_followup_by || "",
          followup_round: formData.followup_round || "1st Follow-up"
        }] : [],
        created_at: new Date().toISOString(),
      };
      setLeads((prev) => {
        const next = [updatedLead, ...prev];
        saveLeadsToCacheAndNotify(next);
        return next;
      });

      // Clear search and reset filters so the newly created lead is immediately visible!
      setSearch("");
      setStatusFilter("All Statuses");
      setSourceFilter("All Sources");
      searchParams.delete("search");
      setSearchParams(searchParams, { replace: true });
    }

    // Background sync with API
    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const serverLead = data.data;
        setLeads((prev) => {
          const index = prev.findIndex((l) => l._id === updatedLead._id || l._id === serverLead._id);
          let next: StudentLead[];
          if (index !== -1) {
            next = [...prev];
            next[index] = serverLead;
          } else {
            next = [serverLead, ...prev];
          }
          saveLeadsToCacheAndNotify(next);
          return next;
        });
        setSelectedLeadForDetails((prev) => {
          if (prev && (prev._id === updatedLead._id || prev._id === serverLead._id)) {
            return serverLead;
          }
          return prev;
        });
        fetchStats();
      } else {
        console.warn("Backend response notice:", data.message || "Saved locally");
      }
      return true;
    } catch (err) {
      console.warn("Saved locally (offline/sync notice):", err);
      return true;
    }
  };

  const handleDeleteLead = async (lead: StudentLead) => {
    if (!window.confirm(`Are you sure you want to delete lead "${lead.student_name}" (${lead.lead_ID})?`)) {
      return;
    }

    const remaining = leads.filter(l => l._id !== lead._id);
    setLeads(remaining);
    saveLeadsToCacheAndNotify(remaining);

    try {
      const token = localStorage.getItem("adminAuthToken");
      await fetch(getApiUrl(`/student-leads/${lead._id}`), {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      fetchStats();
    } catch (err) {
      console.error("Delete lead error:", err);
    }
  };

  // Helper to convert any date string/timestamp to YYYY-MM-DD in local time
  const toLocalDateKey = (dStr?: string | Date | null): string => {
    if (!dStr) return "";
    try {
      const d = new Date(dStr);
      if (isNaN(d.getTime())) return "";
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch {
      return "";
    }
  };

  const isDateMatching = (
    dateStr: string | Date | undefined | null,
    mode: "all" | "today" | "yesterday" | "7days" | "custom",
    targetDate: string
  ): boolean => {
    if (mode === "all") return true;
    if (!dateStr) return false;

    const itemDateKey = toLocalDateKey(dateStr);
    if (!itemDateKey) return false;

    const today = new Date();
    const todayKey = toLocalDateKey(today);

    if (mode === "today") {
      return itemDateKey === todayKey;
    }

    if (mode === "yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return itemDateKey === toLocalDateKey(yesterday);
    }

    if (mode === "7days") {
      const d = new Date(dateStr);
      const diffMs = today.getTime() - d.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      return diffDays >= -1 && diffDays <= 7;
    }

    if (mode === "custom") {
      return Boolean(targetDate && itemDateKey === targetDate);
    }

    return true;
  };

  // Get specific calls matching date filter for a lead (or all calls if mode === "all")
  const getLeadCallsForDateFilter = (
    lead: StudentLead,
    mode: "all" | "today" | "yesterday" | "7days" | "custom",
    targetDate: string
  ): any[] => {
    const calls: any[] = [];
    if (Array.isArray(lead.followup_history) && lead.followup_history.length > 0) {
      lead.followup_history.forEach((histItem) => {
        if (isDateMatching(histItem.date, mode, targetDate)) {
          calls.push(histItem);
        }
      });
    } else if (lead.conversation_notes || lead.call_outcome || (lead.status && lead.status !== "New Inquiry")) {
      // Single call recorded at lead registration
      if (isDateMatching(lead.created_at, mode, targetDate)) {
        calls.push({
          date: lead.created_at,
          call_outcome: lead.call_outcome || "",
          status: lead.status || "New Inquiry",
          conversation: lead.conversation_notes || "",
          taken_by: lead.followup_taken_by || "Counselor",
          demo_date: lead.demo_date,
          next_followup_date: lead.next_followup_date,
        });
      }
    }

    return calls;
  };

  // Friendly label for currently selected date filter
  const dateLabel = useMemo(() => {
    if (dateFilterMode === "today") return "Today";
    if (dateFilterMode === "yesterday") return "Yesterday";
    if (dateFilterMode === "7days") return "Last 7 Days";
    if (dateFilterMode === "custom" && customDate) {
      try {
        const parts = customDate.split("-");
        if (parts.length === 3) {
          const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
          return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
        }
        return customDate;
      } catch {
        return customDate;
      }
    }
    return "";
  }, [dateFilterMode, customDate]);

  // Top 5 Summary Cards Stats (Aware of date filter when active)
  const displayStats = useMemo(() => {
    const targetLeads = dateFilterMode !== "all"
      ? leads.filter((l) => {
          const calls = getLeadCallsForDateFilter(l, dateFilterMode, customDate);
          const isCreated = isDateMatching(l.created_at, dateFilterMode, customDate);
          return calls.length > 0 || isCreated;
        })
      : leads;

    if (targetLeads.length > 0) {
      return {
        totalLeads: targetLeads.length,
        newInquiries: targetLeads.filter(l => l.status === "New Inquiry").length,
        inFollowUp: targetLeads.filter(l => l.status === "In Follow-up" || l.status === "Demo Scheduled" || l.status === "Demo Completed").length,
        converted: targetLeads.filter(l => l.status === "Converted").length,
        lostLeads: targetLeads.filter(l => l.status === "Lost").length,
      };
    }
    return {
      totalLeads: dateFilterMode !== "all" ? 0 : (stats.totalLeads || 0),
      newInquiries: dateFilterMode !== "all" ? 0 : (stats.newInquiries || 0),
      inFollowUp: dateFilterMode !== "all" ? 0 : (stats.inFollowUp || 0),
      converted: dateFilterMode !== "all" ? 0 : (stats.converted || 0),
      lostLeads: dateFilterMode !== "all" ? 0 : (stats.lostLeads || 0),
    };
  }, [stats, leads, dateFilterMode, customDate]);

  // Helper to extract the LATEST call outcome, status, notes, and activity timestamp for a lead (scoped to date filter if active)
  const getLeadLatestCallInfo = (
    lead: StudentLead,
    mode: "all" | "today" | "yesterday" | "7days" | "custom" = "all",
    targetDate: string = ""
  ) => {
    const history = Array.isArray(lead.followup_history) && lead.followup_history.length > 0
      ? lead.followup_history
      : [];

    let matchingCalls = history;
    if (mode !== "all") {
      matchingCalls = history.filter((h) => isDateMatching(h.date, mode, targetDate));
    }

    let latestCall: any = null;
    if (matchingCalls.length > 0) {
      latestCall = matchingCalls[matchingCalls.length - 1];
    } else if (isDateMatching(lead.created_at, mode, targetDate)) {
      if (lead.conversation_notes || lead.call_outcome || (lead.status && lead.status !== "New Inquiry")) {
        latestCall = {
          date: lead.created_at,
          call_outcome: lead.call_outcome || "",
          status: lead.status || "New Inquiry",
          conversation: lead.conversation_notes || "",
          demo_date: lead.demo_date,
          next_followup_date: lead.next_followup_date,
        };
      }
    }

    if (!latestCall && mode !== "all") {
      return null;
    }

    // Latest outcome: check latest call in history first, then root lead.call_outcome
    const latestOutcome = latestCall?.call_outcome || (mode === "all" ? lead.call_outcome : "") || "";

    // Latest status: root lead.status takes precedence if set in all mode, otherwise latest call status
    const latestStatus: string = (mode === "all" ? (lead.status || latestCall?.status) : (latestCall?.status || lead.status)) || "New Inquiry";

    // Notes: latest call conversation notes or root conversation_notes
    const latestNotes = (latestCall?.conversation || (mode === "all" ? lead.conversation_notes : "") || "").toLowerCase();

    // Interest level
    const interest = lead.interest_level;

    // Has scheduled or attended demo
    const hasDemo = Boolean(latestCall?.demo_date || (mode === "all" ? lead.demo_date : null));

    // DEMO COMPLETED:
    const isDemoCompleted = latestStatus === "Demo Completed" || latestOutcome === "Demo Completed" || Boolean(lead.demo_class_taken);

    // YES FOR DEMO (DEMO SCHEDULED ONLY - strictly excludes Demo Completed):
    const isDemo = !isDemoCompleted && (
      latestOutcome === "Yes for Demo" ||
      latestStatus === "Demo Scheduled" ||
      hasDemo
    );

    // Dropped / Lost / Refused
    const isNo = latestOutcome === "No" || interest === "Not Interested" || latestStatus === "Lost" || latestNotes.includes("not interest") || latestNotes.includes("refused") || latestNotes.includes("nahi karna");

    // Not Connected (strictly unanswered)
    const isNotConnected = !isDemo && !isDemoCompleted && !isNo && (latestOutcome === "Not Connected" || (!latestOutcome && (
      latestNotes.includes("not connect") || latestNotes.includes("not receive") || latestNotes.includes("did not pick") || latestNotes.includes("didn't pick") || latestNotes.includes("switched off") || latestNotes.includes("ringing") || latestNotes.includes("unanswered")
    )));

    // Told Later / Callback / Busy schedule (student answered and said they are busy)
    const isToldLater = !isDemo && !isDemoCompleted && !isNo && !isNotConnected && (
      latestOutcome === "Told Later" || latestNotes.includes("later") || latestNotes.includes("kal") || latestNotes.includes("baad me") || latestNotes.includes("busy") || latestNotes.includes("call back") || Boolean((latestCall?.next_followup_date || (mode === "all" ? lead.next_followup_date : null)) && latestStatus === "In Follow-up")
    );

    // Connected: Spoke with counselor (Demo Scheduled, Demo Completed, Told Later, or explicit Connected or active follow-up/converted)
    const isConnected = !isNo && !isNotConnected && (
      latestOutcome === "Connected" || isDemo || isDemoCompleted || isToldLater || latestStatus === "In Follow-up" || latestStatus === "Demo Scheduled" || latestStatus === "Demo Completed" || latestStatus === "Converted"
    );

    // Activity timestamp for sorting by latest follow-up / call activity
    const latestActivityTime = new Date(
      latestCall?.date || lead.updated_at || lead.created_at || Date.now()
    ).getTime();

    return {
      latestCall,
      latestOutcome,
      latestStatus,
      latestNotes,
      isDemo,
      isDemoCompleted,
      isNo,
      isNotConnected,
      isToldLater,
      isConnected,
      latestActivityTime,
    };
  };

  // Helper to accurately compute total calls made for a lead
  const getLeadTotalCalls = (lead: StudentLead): number => {
    const histLen = Array.isArray(lead.followup_history) ? lead.followup_history.length : 0;
    if (histLen >= 2) return histLen;
    if (histLen === 1 && lead.followup_history?.[0]) {
      const first = lead.followup_history[0];
      const hasOutcomeDiff = Boolean(lead.call_outcome && lead.call_outcome !== first.call_outcome);
      const hasStatusDiff = Boolean(lead.status && lead.status !== "New Inquiry" && lead.status !== first.status);
      const hasTimeDiff = Boolean(lead.updated_at && lead.created_at && (new Date(lead.updated_at).getTime() - new Date(lead.created_at).getTime() > 60000));
      const hasStaff = Boolean(lead.followup_taken_by && (!first.taken_by || lead.followup_taken_by !== first.taken_by));
      if (hasOutcomeDiff || (hasStatusDiff && hasTimeDiff) || (hasOutcomeDiff && hasStaff)) {
        return 2;
      }
      return 1;
    }
    if (lead.conversation_notes || lead.call_outcome || (lead.status && lead.status !== "New Inquiry")) return 1;
    return 1;
  };

  // Filtered Leads (Filtered by Search, Status, Source, Call Response, Date, and Sorted by Latest Activity Date)
  const filteredLeads = useMemo(() => {
    const list = leads.filter((lead) => {
      // Search
      if (search.trim() !== "") {
        const query = search.toLowerCase();
        const matchId = (lead.lead_ID || "").toLowerCase().includes(query);
        const matchName = (lead.student_name || "").toLowerCase().includes(query);
        const matchPhone = (lead.phone || "").toLowerCase().includes(query);
        const matchSchool = (lead.school_name || "").toLowerCase().includes(query);
        const matchWorkshopSchool = (lead.workshop_school_name || "").toLowerCase().includes(query);
        const matchCourse = (lead.interested_course || "").toLowerCase().includes(query);
        const matchEducation = (lead.current_education || "").toLowerCase().includes(query);
        const matchStaff = (lead.followup_taken_by || "").toLowerCase().includes(query);

        if (!matchId && !matchName && !matchPhone && !matchSchool && !matchWorkshopSchool && !matchCourse && !matchEducation && !matchStaff) {
          return false;
        }
      }

      // Status
      if (statusFilter !== "All Statuses") {
        if (lead.status !== statusFilter) return false;
      }

      // Source
      if (sourceFilter === "Workshop") {
        if (!lead.is_from_workshop) return false;
      } else if (sourceFilter === "Other") {
        if (lead.is_from_workshop) return false;
      }

      // Date Filter & Latest Call Response Filter
      const info = getLeadLatestCallInfo(lead, dateFilterMode, customDate);
      const isCreatedOnDate = isDateMatching(lead.created_at, dateFilterMode, customDate);

      if (dateFilterMode !== "all") {
        if (!info && !isCreatedOnDate) return false;
      }

      // Match Call Response filter using the exact same latest follow-up outcome
      if (callResponseFilter !== "All") {
        if (!info) return false;
        if (callResponseFilter === "Demo Completed" && !info.isDemoCompleted) return false;
        if (callResponseFilter === "Yes for Demo" && !info.isDemo) return false;
        if (callResponseFilter === "No" && !info.isNo) return false;
        if (callResponseFilter === "Told Later" && !info.isToldLater) return false;
        if (callResponseFilter === "Not Connected" && !info.isNotConnected) return false;
        if (callResponseFilter === "Connected" && !info.isConnected) return false;
      }

      return true;
    });

    // Sort by latest call / follow-up activity date (newest updates first)
    return list.sort((a, b) => {
      const timeA = getLeadLatestCallInfo(a)?.latestActivityTime || 0;
      const timeB = getLeadLatestCallInfo(b)?.latestActivityTime || 0;
      return timeB - timeA;
    });
  }, [leads, search, statusFilter, sourceFilter, callResponseFilter, dateFilterMode, customDate]);

  // Compute Call & Demo Performance Stats directly from current leads using latest follow-up
  const callStats = useMemo(() => {
    let totalCalls = 0;
    let connected = 0;
    let notConnected = 0;
    let yesForDemo = 0;
    let demoCompleted = 0;
    let noLeads = 0;
    let toldLater = 0;

    leads.forEach((lead) => {
      // 1. Total dials/calls made
      const history = Array.isArray(lead.followup_history) ? lead.followup_history : [];
      if (dateFilterMode === "all") {
        totalCalls += Math.max(history.length, lead.conversation_notes || lead.call_outcome ? 1 : 0);
      } else {
        const dateCalls = history.filter((h) => isDateMatching(h.date, dateFilterMode, customDate));
        totalCalls += dateCalls.length;
      }

      // 2. Count each lead according to their LATEST follow-up/call outcome
      const info = getLeadLatestCallInfo(lead, dateFilterMode, customDate);
      if (info) {
        if (info.isDemoCompleted) demoCompleted++;
        else if (info.isDemo) yesForDemo++;
        if (info.isNo) noLeads++;
        if (info.isToldLater) toldLater++;
        if (info.isNotConnected) notConnected++;
        if (info.isConnected) connected++;
      }
    });

    return {
      totalCalls: dateFilterMode !== "all" ? totalCalls : Math.max(totalCalls, leads.length),
      connected,
      notConnected,
      yesForDemo,
      demoCompleted,
      noLeads,
      toldLater,
    };
  }, [leads, dateFilterMode, customDate]);

  // Format Call Outcome Badge for table based on LATEST call status
  const renderCallOutcomeBadge = (lead: StudentLead) => {
    const info = getLeadLatestCallInfo(lead);

    if (info?.isDemoCompleted) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200/80 shadow-2xs whitespace-nowrap shrink-0">
          <CheckCircle2 size={11} className="text-teal-600 shrink-0" />
          Demo Completed
        </span>
      );
    }
    if (info?.isDemo) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 shadow-2xs whitespace-nowrap shrink-0">
          <CalendarCheck size={11} className="text-indigo-600 shrink-0" />
          Yes for Demo
        </span>
      );
    }
    if (info?.isNo) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200/60 shadow-2xs whitespace-nowrap shrink-0">
          <XCircle size={11} className="text-rose-600 shrink-0" />
          No / Dropped
        </span>
      );
    }
    if (info?.isToldLater) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200/60 shadow-2xs whitespace-nowrap shrink-0">
          <Clock size={11} className="text-purple-600 shrink-0" />
          Told Later
        </span>
      );
    }
    if (info?.isNotConnected) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60 shadow-2xs whitespace-nowrap shrink-0">
          <PhoneOff size={11} className="text-amber-600 shrink-0" />
          Not Connected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs whitespace-nowrap shrink-0">
        <PhoneIncoming size={11} className="text-emerald-600 shrink-0" />
        Connected
      </span>
    );
  };

  // Format Status Badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Converted":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs whitespace-nowrap shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            Converted
          </span>
        );
      case "In Follow-up":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200/60 shadow-2xs whitespace-nowrap shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
            In Follow-up
          </span>
        );
      case "Demo Scheduled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60 shadow-2xs whitespace-nowrap shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            Demo Scheduled
          </span>
        );
      case "Demo Completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200/60 shadow-2xs whitespace-nowrap shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
            Demo Completed
          </span>
        );
      case "Lost":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/60 shadow-2xs whitespace-nowrap shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
            Lost
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60 shadow-2xs whitespace-nowrap shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
            New Inquiry
          </span>
        );
    }
  };

  // Base leads list corresponding to the current active category
  const categoryBaseLeads = useMemo(() => {
    if (!activeCategory) return [];
    return getCategoryBaseLeads(activeCategory, leads);
  }, [activeCategory, leads]);

  // Sub-status counts specifically for the "In Follow-up" category
  const inFollowUpCounts = useMemo(() => {
    const followUpLeads = leads.filter(
      (l) => l.status === "In Follow-up" || l.status === "Demo Scheduled" || l.status === "Demo Completed"
    );
    return {
      all: followUpLeads.length,
      followUp: followUpLeads.filter((l) => l.status === "In Follow-up").length,
      scheduled: followUpLeads.filter((l) => l.status === "Demo Scheduled").length,
      completed: followUpLeads.filter((l) => l.status === "Demo Completed").length,
    };
  }, [leads]);

  // Date label for individual category page
  const categoryDateLabel = useMemo(() => {
    if (categoryDateFilterMode === "today") return "Today";
    if (categoryDateFilterMode === "yesterday") return "Yesterday";
    if (categoryDateFilterMode === "7days") return "Last 7 Days";
    if (categoryDateFilterMode === "custom" && categoryCustomDate) {
      try {
        const parts = categoryCustomDate.split("-");
        if (parts.length === 3) {
          const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
          return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
        }
        return categoryCustomDate;
      } catch {
        return categoryCustomDate;
      }
    }
    return "";
  }, [categoryDateFilterMode, categoryCustomDate]);

  // Filtered leads within the active individual category page
  const categoryFilteredLeads = useMemo(() => {
    if (!activeCategory) return [];
    let list = categoryBaseLeads;

    // Sub-status filter (only for In Follow-up category)
    if (activeCategory === "in-follow-up" && subStatusFilter !== "All") {
      list = list.filter((l) => l.status === subStatusFilter);
    }

    // Date filter
    if (categoryDateFilterMode !== "all") {
      list = list.filter((l) => {
        const calls = getLeadCallsForDateFilter(l, categoryDateFilterMode, categoryCustomDate);
        const isCreated = isDateMatching(l.created_at, categoryDateFilterMode, categoryCustomDate);
        return calls.length > 0 || isCreated;
      });
    }

    // Call response filter
    if (categoryCallFilter !== "All") {
      list = list.filter((l) => {
        const info = getLeadLatestCallInfo(l, categoryDateFilterMode, categoryCustomDate);
        if (!info) return false;
        if (categoryCallFilter === "Connected") return info.isConnected;
        if (categoryCallFilter === "Not Connected") return info.isNotConnected;
        if (categoryCallFilter === "Yes for Demo") return info.isDemo;
        if (categoryCallFilter === "Demo Completed") return info.isDemoCompleted;
        if (categoryCallFilter === "Told Later") return info.isToldLater;
        if (categoryCallFilter === "No") return info.isNo;
        return true;
      });
    }

    // Source filter
    if (categorySourceFilter === "Workshop") {
      list = list.filter((l) => l.is_from_workshop);
    } else if (categorySourceFilter === "Other") {
      list = list.filter((l) => !l.is_from_workshop);
    }

    // Search filter
    if (categorySearch.trim() !== "") {
      const q = categorySearch.toLowerCase().trim();
      list = list.filter((lead) => {
        const matchId = (lead.lead_ID || "").toLowerCase().includes(q);
        const matchName = (lead.student_name || "").toLowerCase().includes(q);
        const matchPhone = (lead.phone || "").toLowerCase().includes(q);
        const matchSchool = (lead.school_name || "").toLowerCase().includes(q);
        const matchWorkshopSchool = (lead.workshop_school_name || "").toLowerCase().includes(q);
        const matchCourse = (lead.interested_course || "").toLowerCase().includes(q);
        const matchEducation = (lead.current_education || "").toLowerCase().includes(q);
        const matchStaff = (lead.followup_taken_by || "").toLowerCase().includes(q);
        return matchId || matchName || matchPhone || matchSchool || matchWorkshopSchool || matchCourse || matchEducation || matchStaff;
      });
    }

    // Sort by latest activity timestamp descending
    return [...list].sort((a, b) => {
      const timeA = getLeadLatestCallInfo(a, categoryDateFilterMode, categoryCustomDate)?.latestActivityTime || 0;
      const timeB = getLeadLatestCallInfo(b, categoryDateFilterMode, categoryCustomDate)?.latestActivityTime || 0;
      return timeB - timeA;
    });
  }, [
    activeCategory,
    categoryBaseLeads,
    subStatusFilter,
    categoryDateFilterMode,
    categoryCustomDate,
    categoryCallFilter,
    categorySourceFilter,
    categorySearch,
  ]);

  // Export currently filtered/selected leads to PDF
  // Showing ONLY: S.No., Student Name, Phone Number, Latest Call Response, School Name
  const exportLeadsToPdf = (targetList: StudentLead[], titlePrefix: string = "Student_Leads") => {
    if (!targetList || targetList.length === 0) {
      alert("No student leads found matching current filter criteria to download.");
      return;
    }

    const mode = activeCategory ? categoryDateFilterMode : dateFilterMode;
    const dateParam = activeCategory ? categoryCustomDate : customDate;

    // Filter label text for header
    let filterDescription = "All Leads";
    if (!activeCategory) {
      const parts: string[] = [];
      if (callResponseFilter !== "All") parts.push(`Response: ${callResponseFilter}`);
      if (statusFilter !== "All Statuses") parts.push(`Status: ${statusFilter}`);
      if (sourceFilter !== "All Sources") parts.push(`Source: ${sourceFilter}`);
      if (search.trim()) parts.push(`Search: "${search.trim()}"`);
      filterDescription = parts.length > 0 ? parts.join(" | ") : "All Registered Inquiries";
    } else {
      const parts: string[] = [currentCategory?.title || "Category"];
      if (subStatusFilter !== "All") parts.push(`Stage: ${subStatusFilter}`);
      if (categoryCallFilter !== "All") parts.push(`Response: ${categoryCallFilter}`);
      if (categorySourceFilter !== "All Sources") parts.push(`Source: ${categorySourceFilter}`);
      if (categorySearch.trim()) parts.push(`Search: "${categorySearch.trim()}"`);
      filterDescription = parts.join(" | ");
    }

    let dateDescription = "All Time";
    const activeDateMode = activeCategory ? categoryDateFilterMode : dateFilterMode;
    const activeDateParam = activeCategory ? categoryCustomDate : customDate;
    if (activeDateMode === "today") dateDescription = "Today";
    else if (activeDateMode === "yesterday") dateDescription = "Yesterday";
    else if (activeDateMode === "7days") dateDescription = "Last 7 Days";
    else if (activeDateMode === "custom" && activeDateParam) dateDescription = activeDateParam;

    // Table Header - EXACT 5 COLUMNS as requested:
    // S.No., Student Name, Phone Number, Latest Call Response, School Name
    const tableHead = [["S.No.", "Student Name", "Phone Number", "Latest Call Response", "School Name"]];

    const tableBody = targetList.map((lead, idx) => {
      const info = getLeadLatestCallInfo(lead, mode, dateParam);

      let callOutcome = "Connected";
      if (info?.isDemoCompleted) callOutcome = "Demo Completed";
      else if (info?.isDemo) callOutcome = "Yes for Demo";
      else if (info?.isNo) callOutcome = "No / Dropped";
      else if (info?.isToldLater) callOutcome = "Told Later";
      else if (info?.isNotConnected) callOutcome = "Not Connected";
      else if (info?.isConnected) callOutcome = "Connected";

      const school = lead.school_name || lead.workshop_school_name || "—";
      const studentName = lead.student_name || "—";
      const phone = lead.phone || "—";

      return [
        (idx + 1).toString(),
        studentName,
        phone,
        callOutcome,
        school,
      ];
    });

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    // Document Brand Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(29, 78, 216); // Brand Primary Blue (#1d4ed8)
    doc.text("RIZEWORLD INSTITUTE OF AI & DIGITAL MARKETING", 14, 15);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.text(`Student Leads Report — ${titlePrefix.replace(/_/g, " ")}`, 14, 21.5);

    // Metadata Row
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139); // Slate-500
    const metaLine = `Filter: ${filterDescription}  •  Date: ${dateDescription}  •  Total Records: ${targetList.length}`;
    doc.text(metaLine, 14, 27);
    const genLine = `Generated on: ${new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}`;
    doc.text(genLine, 14, 31.5);

    // Top Divider Line
    doc.setDrawColor(226, 232, 240); // Slate-200
    doc.setLineWidth(0.4);
    doc.line(14, 34, doc.internal.pageSize.getWidth() - 14, 34);

    // AutoTable with exact 5 columns
    autoTable(doc, {
      startY: 37,
      head: tableHead,
      body: tableBody,
      theme: "grid",
      headStyles: {
        fillColor: [29, 78, 216], // Brand Blue (#1d4ed8)
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8.5,
        halign: "left",
        cellPadding: 3,
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [30, 41, 59],
        cellPadding: 2.8,
        lineColor: [226, 232, 240],
        lineWidth: 0.1,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252], // Slate-50 zebra
      },
      columnStyles: {
        0: { cellWidth: 14, halign: "center", fontStyle: "bold", textColor: [100, 116, 139] },
        1: { cellWidth: 46, fontStyle: "bold", textColor: [15, 23, 42] },
        2: { cellWidth: 32 },
        3: { cellWidth: 38, fontStyle: "bold" },
        4: { cellWidth: "auto", textColor: [71, 85, 105] },
      },
      didParseCell: (data) => {
        // Color-code Latest Call Response column (column index 3)
        if (data.section === "body" && data.column.index === 3) {
          const val = String(data.cell.raw || "");
          if (val === "Connected") {
            data.cell.styles.textColor = [22, 101, 52]; // green-800
          } else if (val === "Demo Completed") {
            data.cell.styles.textColor = [15, 118, 110]; // teal-700
          } else if (val === "Yes for Demo") {
            data.cell.styles.textColor = [67, 56, 202]; // indigo-700
          } else if (val === "Told Later") {
            data.cell.styles.textColor = [126, 34, 206]; // purple-700
          } else if (val === "Not Connected") {
            data.cell.styles.textColor = [180, 83, 9]; // amber-700
          } else if (val === "No / Dropped") {
            data.cell.styles.textColor = [190, 18, 60]; // rose-700
          }
        }
      },
      margin: { left: 14, right: 14, bottom: 15 },
    });

    // Page Numbering Footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184); // Slate-400
      doc.text(
        "RizeWorld Institute of AI & Digital Marketing  •  Student CRM Official Report",
        14,
        doc.internal.pageSize.getHeight() - 7
      );
      doc.text(
        `Page ${i} of ${totalPages}`,
        doc.internal.pageSize.getWidth() - 14,
        doc.internal.pageSize.getHeight() - 7,
        { align: "right" }
      );
    }

    // Dynamic PDF filename
    const nameParts = [titlePrefix.replace(/\s+/g, "_")];
    if (!activeCategory) {
      if (callResponseFilter !== "All") nameParts.push(callResponseFilter.replace(/\s+/g, "_"));
      if (statusFilter !== "All Statuses") nameParts.push(statusFilter.replace(/\s+/g, "_"));
      if (dateFilterMode !== "all") {
        if (dateFilterMode === "today") nameParts.push("Today");
        else if (dateFilterMode === "yesterday") nameParts.push("Yesterday");
        else if (dateFilterMode === "7days") nameParts.push("Last_7_Days");
        else if (dateFilterMode === "custom" && customDate) nameParts.push(customDate);
      } else {
        nameParts.push("All_Time");
      }
    } else {
      if (subStatusFilter !== "All") nameParts.push(subStatusFilter.replace(/\s+/g, "_"));
      if (categoryCallFilter !== "All") nameParts.push(categoryCallFilter.replace(/\s+/g, "_"));
      if (categoryDateFilterMode !== "all") {
        if (categoryDateFilterMode === "today") nameParts.push("Today");
        else if (categoryDateFilterMode === "yesterday") nameParts.push("Yesterday");
        else if (categoryDateFilterMode === "7days") nameParts.push("Last_7_Days");
        else if (categoryDateFilterMode === "custom" && categoryCustomDate) nameParts.push(categoryCustomDate);
      } else {
        nameParts.push("All_Time");
      }
    }

    const todayDateStr = new Date().toISOString().split("T")[0];
    nameParts.push(todayDateStr);
    const filename = `RizeWorld_${nameParts.join("_")}.pdf`;

    // Download PDF directly
    doc.save(filename);
  };

  // Shared renderer for the lead list: mobile cards (< md) and desktop table (>= md)
  const renderLeadList = (targetList: StudentLead[], emptyTitle: string, emptySubtitle: string) => {
    if (targetList.length === 0) {
      return (
        <div className="py-12 sm:py-16 text-center">
          <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center">
              <Target size={24} />
            </div>
            <h4 className="text-base font-bold text-neutral-800">{emptyTitle}</h4>
            <p className="text-xs text-neutral-400 text-center font-medium">
              {emptySubtitle}
            </p>
            <button
              onClick={() => {
                setSelectedLeadForEdit(null);
                setIsFormModalOpen(true);
              }}
              className="mt-2 px-4 py-2 bg-[#2563eb] hover:bg-blue-700 text-white rounded-full text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={15} />
              <span>Enter Lead</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        {/* Mobile Lead Cards View (< md) */}
        <div className="block md:hidden space-y-3 pt-3">
          {targetList.map((lead) => {
            const cleanPhone = (lead.phone || "").replace(/\D/g, "");
            const isIdCopied = copiedId === `id-${lead._id}`;
            const isPhoneCopied = copiedId === `phone-${lead._id}`;

            let formattedFollowup = "Not scheduled";
            let isFollowupDue = false;
            if (lead.next_followup_date) {
              try {
                const d = new Date(lead.next_followup_date);
                formattedFollowup = d.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                isFollowupDue = d.getTime() <= Date.now() + 24 * 60 * 60 * 1000;
              } catch {
                formattedFollowup = lead.next_followup_date;
              }
            }

            const createdDate = new Date(lead.created_at).toLocaleDateString("en-US");

            return (
              <div
                key={lead._id}
                className="p-3 sm:p-4 rounded-2xl border border-neutral-200/80 bg-white hover:border-blue-200 transition-all space-y-2.5 shadow-2xs"
              >
                {/* Header: Lead ID, Copy, Date, Status */}
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1 font-mono text-xs font-bold text-neutral-700 min-w-0">
                    <span className="whitespace-nowrap">{lead.lead_ID}</span>
                    <button
                      onClick={() => handleCopy(lead.lead_ID, `id-${lead._id}`)}
                      className="p-0.5 text-neutral-400 hover:text-neutral-700 rounded cursor-pointer"
                      title="Copy Lead ID"
                    >
                      {isIdCopied ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                    </button>
                    <span className="text-[10px] text-neutral-400 font-sans font-normal whitespace-nowrap">
                      ({createdDate})
                    </span>
                    <span className="text-[10px] text-purple-700 bg-purple-50 font-bold px-1.5 py-0.5 rounded border border-purple-200">
                      {getLeadTotalCalls(lead)} {getLeadTotalCalls(lead) === 1 ? "call" : "calls"}
                    </span>
                  </div>
                  <div className="shrink-0">
                    {renderStatusBadge(lead.status)}
                  </div>
                </div>

                {/* Student Info & Call Response Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div
                    onClick={() => setSelectedLeadForDetails(lead)}
                    className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center text-xs font-bold shadow-2xs border border-blue-200/50 shrink-0">
                      {lead.student_name ? lead.student_name.charAt(0).toUpperCase() : "L"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-neutral-900 group-hover:text-blue-600 transition-colors text-xs sm:text-sm truncate">
                        {lead.student_name}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-medium truncate mt-0.5">
                        <span className="truncate">{lead.interested_course || "Course N/A"}</span>
                        {lead.school_name && <span className="truncate">• {lead.school_name}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {renderCallOutcomeBadge(lead)}
                  </div>
                </div>

                {/* Scheduled Demo Badge on Mobile */}
                {lead.demo_date && (lead.status === "Demo Scheduled" || lead.call_outcome === "Yes for Demo") && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-900 text-[11px] font-bold">
                    <CalendarCheck size={12} className="text-amber-600 shrink-0" />
                    <span className="truncate">
                      Demo: {new Date(lead.demo_date).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                )}

                {/* Quick Call & WhatsApp Action Row */}
                {cleanPhone ? (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100">
                    <a
                      href={`tel:${cleanPhone}`}
                      className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 active:scale-98 border border-blue-200/60 transition-all cursor-pointer shadow-2xs"
                    >
                      <Phone size={12} className="text-blue-600" />
                      <span>Call</span>
                    </a>
                    <a
                      href={`https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(
                        `Hello ${lead.student_name}, greetings from RizeWorld Institute!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:scale-98 border border-emerald-200/60 transition-all cursor-pointer shadow-2xs"
                    >
                      <MessageSquare size={12} className="text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                ) : (
                  <div className="text-center text-[10px] text-neutral-400 pt-1.5 border-t border-neutral-100 italic">
                    No phone number available
                  </div>
                )}

                {/* Bottom Toolbar Row */}
                <div className="flex items-center justify-between gap-1.5 pt-1 text-xs">
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 min-w-0 flex-1">
                    <Calendar size={11} className={isFollowupDue ? "text-amber-600 shrink-0" : "text-neutral-400 shrink-0"} />
                    <span className={`truncate ${isFollowupDue ? "text-amber-700 font-bold" : ""}`}>
                      {formattedFollowup}
                    </span>
                    {(lead.next_followup_by || lead.followup_taken_by) && (
                      <span className="text-neutral-400 truncate">
                        • {lead.next_followup_by || lead.followup_taken_by}
                      </span>
                    )}
                  </div>

                  {/* Toolbar Icons */}
                  <div className="flex items-center gap-0.5 shrink-0">
                    {cleanPhone && (
                      <button
                        onClick={() => handleCopy(lead.phone, `phone-${lead._id}`)}
                        className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                        title="Copy Phone Number"
                      >
                        {isPhoneCopied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedLeadForDetails(lead)}
                      className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="View Full Details"
                    >
                      <FileText size={15} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedLeadForEdit(lead);
                        setIsFormModalOpen(true);
                      }}
                      className="p-1.5 text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Lead"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteLead(lead)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Lead"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Full Table View (>= md) */}
        <div className="hidden md:block overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 text-neutral-400 text-[11px] uppercase tracking-wider font-bold">
                <th className="py-4 px-4 font-semibold">LEAD ID</th>
                <th className="py-4 px-4 font-semibold">STUDENT NAME</th>
                <th className="py-4 px-4 font-semibold">CONTACT & WHATSAPP</th>
                <th className="py-4 px-4 font-semibold">STATUS & RESPONSE</th>
                <th className="py-4 px-4 font-semibold">NEXT FOLLOW-UP</th>
                <th className="py-4 px-4 font-semibold">FOLLOW-UP BY</th>
                <th className="py-4 px-4 text-right font-semibold">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100/70 text-xs font-medium">
              {targetList.map((lead) => {
                const cleanPhone = (lead.phone || "").replace(/\D/g, "");
                const isIdCopied = copiedId === `id-${lead._id}`;
                const isPhoneCopied = copiedId === `phone-${lead._id}`;

                let formattedFollowup = "Not scheduled";
                let isFollowupDue = false;
                if (lead.next_followup_date) {
                  try {
                    const d = new Date(lead.next_followup_date);
                    formattedFollowup = d.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    isFollowupDue = d.getTime() <= Date.now() + 24 * 60 * 60 * 1000;
                  } catch {
                    formattedFollowup = lead.next_followup_date;
                  }
                }

                const createdDate = new Date(lead.created_at).toLocaleDateString("en-US");

                return (
                  <tr 
                    key={lead._id}
                    className="hover:bg-neutral-50/70 transition-colors group"
                  >
                    {/* UNIQUE ID */}
                    <td className="py-4 px-4 font-mono text-neutral-500 font-semibold text-xs">
                      <div className="flex items-center gap-1.5">
                        <span>{lead.lead_ID}</span>
                        <button
                          onClick={() => handleCopy(lead.lead_ID, `id-${lead._id}`)}
                          title="Copy Lead ID"
                          className="text-neutral-400 hover:text-neutral-600 transition-colors p-0.5 cursor-pointer"
                        >
                          {isIdCopied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        </button>
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-0.5 font-sans font-medium">
                        {createdDate}
                      </div>
                    </td>

                    {/* STUDENT NAME */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-100 via-amber-100 to-emerald-100 text-[#c2410c] flex items-center justify-center text-xs font-black shadow-2xs border border-orange-200/60 shrink-0">
                          {lead.student_name ? lead.student_name.charAt(0).toUpperCase() : "L"}
                        </div>
                        <div className="min-w-0">
                          <div 
                            onClick={() => setSelectedLeadForDetails(lead)}
                            className="font-bold text-neutral-900 hover:text-[#ee591e] transition-colors cursor-pointer text-xs sm:text-sm truncate"
                          >
                            {lead.student_name}
                          </div>
                          {lead.interested_course && (
                            <div className="text-[11px] text-neutral-400 font-medium truncate max-w-[200px]">
                              {lead.interested_course}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* CONTACT & WHATSAPP */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 font-semibold text-neutral-800 text-xs">
                        <Phone size={12} className="text-neutral-400 shrink-0" />
                        <span>{lead.phone}</span>
                        <button
                          onClick={() => handleCopy(lead.phone, `phone-${lead._id}`)}
                          title="Copy Phone"
                          className="text-neutral-400 hover:text-neutral-600 transition-colors p-0.5 cursor-pointer"
                        >
                          {isPhoneCopied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        </button>
                      </div>
                      {cleanPhone && (
                        <div className="mt-1">
                          <a
                            href={`https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(`Hello ${lead.student_name}, greetings from RizeWorld Institute!`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full hover:bg-emerald-100 transition-colors border border-emerald-200/60 shadow-2xs"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>WA: {cleanPhone.slice(-10)}</span>
                          </a>
                        </div>
                      )}
                    </td>

                    {/* STATUS & RESPONSE */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        {renderStatusBadge(lead.status)}
                        {renderCallOutcomeBadge(lead)}
                        {lead.demo_date && (lead.status === "Demo Scheduled" || lead.call_outcome === "Yes for Demo") && (
                          <div className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 shadow-2xs mt-0.5 whitespace-nowrap">
                            <CalendarCheck size={11} className="text-amber-600 shrink-0" />
                            <span>Demo: {new Date(lead.demo_date).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* NEXT FOLLOW-UP DATE */}
                    <td className="py-4 px-4">
                      <div className={`flex items-center gap-1.5 text-xs font-bold ${
                        isFollowupDue ? "text-amber-700" : "text-neutral-800"
                      }`}>
                        <Calendar size={13} className={`shrink-0 ${isFollowupDue ? "text-amber-600" : "text-neutral-400"}`} />
                        <span>{formattedFollowup}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                        {lead.followup_round && (
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60 shadow-2xs">
                            {lead.followup_round}
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded-full border border-neutral-200 shadow-2xs">
                          {getLeadTotalCalls(lead)} {getLeadTotalCalls(lead) === 1 ? "call" : "calls"}
                        </span>
                      </div>
                    </td>

                    {/* FOLLOW-UP BY */}
                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-1.5 bg-neutral-100 px-2.5 py-1 rounded-full text-neutral-800 font-semibold text-xs border border-neutral-200/60 shadow-2xs">
                        <User size={12} className="text-blue-600 shrink-0" />
                        <span className="truncate max-w-[130px]">{lead.next_followup_by || lead.followup_taken_by || "Counselor"}</span>
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedLeadForDetails(lead)}
                          className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all cursor-pointer"
                          title="View Full Lead Details"
                        >
                          <FileText size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedLeadForEdit(lead);
                            setIsFormModalOpen(true);
                          }}
                          className="p-2 text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50/80 rounded-xl transition-all cursor-pointer"
                          title="Edit / Record Follow-up"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead)}
                          className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50/80 rounded-xl transition-all cursor-pointer"
                          title="Delete Lead"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  // INDIVIDUAL CATEGORY PAGE VIEW (If subview matches one of the 5 top cards)
  if (activeCategory && currentCategory) {
    const isFollowUpCat = activeCategory === "in-follow-up";

    return (
      <div className="max-w-[1520px] mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
        {/* Top Navigation Row: Back Button & Category Switcher Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            onClick={() => {
              setCategorySearch("");
              setSubStatusFilter("All");
              navigate("/admin/dashboard/student-crm");
            }}
            className="inline-flex items-center gap-2 text-neutral-700 hover:text-neutral-900 font-bold transition-all cursor-pointer bg-white px-4 py-2 rounded-full border border-neutral-200/80 shadow-xs hover:border-neutral-300 text-xs self-start"
          >
            <ArrowLeft size={16} />
            <span>Back to Student Leads CRM</span>
          </button>

          {/* Quick Category Switcher Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
            {CATEGORY_KEYS.map((key) => {
              const cfg = CATEGORY_CONFIG[key];
              const isTabActive = key === activeCategory;
              const tabCount = getCategoryBaseLeads(key, leads).length;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setCategorySearch("");
                    setSubStatusFilter("All");
                    navigate(`/admin/dashboard/student-crm/${key}`);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shadow-2xs ${
                    isTabActive
                      ? "bg-neutral-900 text-white shadow-xs"
                      : "bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200/80 hover:border-neutral-300"
                  }`}
                >
                  <cfg.icon size={13} className={isTabActive ? "text-white" : cfg.textColor} />
                  <span>{cfg.title}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isTabActive ? "bg-white/20 text-white font-black" : "bg-neutral-100 text-neutral-700 font-semibold"
                  }`}>
                    {tabCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hero Category Banner */}
        <div className="bg-white rounded-2xl sm:rounded-[26px] p-5 sm:p-7 border border-neutral-200/80 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${currentCategory.bgLight} ${currentCategory.textColor} flex items-center justify-center shadow-xs border ${currentCategory.borderColor} shrink-0`}>
                <currentCategory.icon size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
                    {currentCategory.title}
                  </h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${currentCategory.bgLight} ${currentCategory.textColor} border ${currentCategory.borderColor}`}>
                    {categoryBaseLeads.length} {categoryBaseLeads.length === 1 ? "Lead" : "Leads"}
                  </span>
                  {categoryDateLabel && (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 flex items-center gap-1 shadow-2xs">
                      <Calendar size={12} className="text-blue-600" /> {categoryDateLabel}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-1 max-w-2xl">
                  {currentCategory.description}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  fetchLeads();
                  fetchStats();
                }}
                disabled={isRefreshing}
                className="p-2 sm:px-3 sm:py-2 rounded-full border border-neutral-200/80 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Refresh leads list"
              >
                <RotateCw size={14} className={isRefreshing ? "animate-spin text-blue-600" : ""} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={() => exportLeadsToPdf(categoryFilteredLeads, currentCategory.title)}
                className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-rose-600/20 hover:shadow"
                title={`Download PDF sheet of ${categoryFilteredLeads.length} leads in ${currentCategory.title}`}
              >
                <FileDown size={15} />
                <span>Download PDF ({categoryFilteredLeads.length})</span>
              </button>
              <button
                onClick={() => {
                  setSelectedLeadForEdit(null);
                  setIsFormModalOpen(true);
                }}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#2563eb] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-all shadow-xs shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer hover:shadow"
              >
                <Plus size={16} />
                <span>Enter Lead</span>
              </button>
            </div>
          </div>

          {/* Sub-status stage tabs (Only displayed on In Follow-up category page) */}
          {isFollowUpCat && (
            <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider mr-1">Stage Filter:</span>
              {[
                { label: "All In Follow-up", value: "All", count: inFollowUpCounts.all },
                { label: "In Follow-up Only", value: "In Follow-up", count: inFollowUpCounts.followUp },
                { label: "Demo Scheduled", value: "Demo Scheduled", count: inFollowUpCounts.scheduled },
                { label: "Demo Completed", value: "Demo Completed", count: inFollowUpCounts.completed },
              ].map((pill) => (
                <button
                  key={pill.value}
                  onClick={() => setSubStatusFilter(pill.value as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 ${
                    subStatusFilter === pill.value
                      ? "bg-purple-600 text-white shadow-xs"
                      : "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/60"
                  }`}
                >
                  <span>{pill.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    subStatusFilter === pill.value ? "bg-white/20 text-white font-black" : "bg-purple-200/70 text-purple-800 font-semibold"
                  }`}>
                    {pill.count}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Entries Table Container */}
        <div className="bg-white rounded-2xl sm:rounded-[26px] p-3.5 sm:p-6 md:p-7 border border-neutral-200/80 shadow-xs">
          {/* Table Header Controls */}
          <div className="flex flex-col gap-3 pb-4 sm:pb-6 border-b border-neutral-100">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">
                  {currentCategory.title} Directory
                </h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200/60">
                  {categoryFilteredLeads.length} of {categoryBaseLeads.length} leads
                </span>
                {categoryDateLabel && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 flex items-center gap-1 shadow-2xs">
                    <Calendar size={12} className="text-blue-600" /> {categoryDateLabel}
                  </span>
                )}
              </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => exportLeadsToPdf(categoryFilteredLeads, currentCategory.title)}
                className="text-[11px] font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 px-2.5 py-1 rounded-full transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                title={`Download PDF sheet of ${categoryFilteredLeads.length} leads in this category`}
              >
                <FileDown size={12} />
                <span>Download PDF ({categoryFilteredLeads.length})</span>
              </button>
              {(categorySearch || categoryCallFilter !== "All" || categorySourceFilter !== "All Sources" || categoryDateFilterMode !== "all" || (isFollowUpCat && subStatusFilter !== "All")) && (
                <button
                  onClick={() => {
                    setCategorySearch("");
                    setCategoryCallFilter("All");
                    setCategorySourceFilter("All Sources");
                    setCategoryDateFilterMode("all");
                    setCategoryCustomDate("");
                    setSubStatusFilter("All");
                  }}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-full transition-all cursor-pointer shadow-2xs"
                >
                  Reset Filters
                </button>
              )}
            </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  placeholder={`Search ${currentCategory.title.toLowerCase()} by name, phone, school, course, ID...`}
                  className="w-full pl-9 pr-8 py-2 rounded-full bg-neutral-50/80 border border-neutral-200/80 focus:bg-white focus:border-blue-500 focus:outline-none transition-all text-xs font-medium text-neutral-900 placeholder-neutral-400 shadow-2xs"
                />
                {categorySearch && (
                  <button
                    onClick={() => setCategorySearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Filter Dropdowns */}
              <div className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 sm:gap-2">
                <div className="relative flex-1">
                  <select
                    value={categoryCallFilter}
                    onChange={(e) => setCategoryCallFilter(e.target.value)}
                    className="w-full appearance-none bg-neutral-50/80 border border-neutral-200/80 rounded-full pl-2.5 sm:pl-3.5 pr-6 py-2 text-[11px] sm:text-xs font-semibold text-neutral-700 hover:border-neutral-300 focus:outline-none cursor-pointer shadow-2xs truncate"
                  >
                    <option value="All">All Calls</option>
                    <option value="Connected">📞 Connected</option>
                    <option value="Yes for Demo">✨ Demo Sched.</option>
                    <option value="Demo Completed">🎓 Demo Done</option>
                    <option value="Told Later">⏳ Later</option>
                    <option value="No">❌ Dropped</option>
                    <option value="Not Connected">📵 Not Connected</option>
                  </select>
                  <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                </div>

                <div className="relative flex-1">
                  <select
                    value={categorySourceFilter}
                    onChange={(e) => setCategorySourceFilter(e.target.value)}
                    className="w-full appearance-none bg-neutral-50/80 border border-neutral-200/80 rounded-full pl-2.5 sm:pl-3.5 pr-6 py-2 text-[11px] sm:text-xs font-semibold text-neutral-700 hover:border-neutral-300 focus:outline-none cursor-pointer shadow-2xs truncate"
                  >
                    <option value="All Sources">All Source</option>
                    <option value="Workshop">🏫 Workshop</option>
                    <option value="Other">🌐 Other</option>
                  </select>
                  <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                </div>

                <div className="relative col-span-3 sm:col-span-1">
                  <input
                    type="date"
                    value={categoryCustomDate}
                    onChange={(e) => {
                      if (e.target.value) {
                        setCategoryDateFilterMode("custom");
                        setCategoryCustomDate(e.target.value);
                      } else {
                        setCategoryDateFilterMode("all");
                        setCategoryCustomDate("");
                      }
                    }}
                    className={`w-full appearance-none rounded-full px-3 py-2 text-[11px] sm:text-xs font-semibold focus:outline-none cursor-pointer shadow-2xs border transition-all ${
                      categoryDateFilterMode !== "all"
                        ? "bg-blue-50 text-blue-900 border-blue-300 ring-2 ring-blue-100 font-bold"
                        : "bg-neutral-50/80 text-neutral-600 border-neutral-200/80 hover:border-neutral-300"
                    }`}
                    title="Filter leads by specific date"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Render Leads List using the shared helper */}
          {renderLeadList(
            categoryFilteredLeads,
            `No ${currentCategory.title} Found`,
            categorySearch || categoryCallFilter !== "All" || categorySourceFilter !== "All Sources" || categoryDateFilterMode !== "all" || (isFollowUpCat && subStatusFilter !== "All")
              ? "No leads matched your filter criteria in this category. Try resetting filters."
              : `Currently there are no registered student inquiries in ${currentCategory.title}.`
          )}

          {/* Table Footer with Summary */}
          <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 font-medium gap-2 mt-2">
            <div className="flex items-center gap-3">
              <span>
                Showing <span className="font-bold text-neutral-900">{categoryFilteredLeads.length}</span> of{" "}
                <span className="font-bold text-neutral-900">{categoryBaseLeads.length}</span> {currentCategory.title}
              </span>
              <button
                onClick={() => exportLeadsToPdf(categoryFilteredLeads, currentCategory.title)}
                className="text-rose-700 hover:text-rose-800 font-bold flex items-center gap-1 text-[11px] hover:underline cursor-pointer"
              >
                <FileDown size={12} />
                <span>Download PDF</span>
              </button>
            </div>
            <button
              onClick={() => {
                setCategorySearch("");
                setSubStatusFilter("All");
                navigate("/admin/dashboard/student-crm");
              }}
              className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer text-xs flex items-center gap-1"
            >
              <span>View all student leads in CRM overview</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* MODALS */}
        <StudentLeadModal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setSelectedLeadForEdit(null);
          }}
          onSave={handleSaveLead}
          lead={selectedLeadForEdit}
        />

        <StudentLeadDetailsModal
          lead={selectedLeadForDetails}
          onClose={() => setSelectedLeadForDetails(null)}
          onEdit={(lead) => {
            setSelectedLeadForEdit(lead);
            setIsFormModalOpen(true);
          }}
          onLeadUpdated={(updated) => {
            setSelectedLeadForDetails(updated);
            setLeads((prev) => {
              const next = prev.map((l) => (l._id === updated._id ? updated : l));
              saveLeadsToCacheAndNotify(next);
              return next;
            });
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1520px] mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#c2410c] text-xs font-bold mb-1.5 border border-orange-200/80 shadow-2xs">
            <span className="text-[#ee591e]">#</span> CRM Leads Hub
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-orange-50 border border-orange-200/80 text-[#ee591e] flex items-center justify-center shadow-xs shrink-0">
              <Target size={20} className="text-[#ee591e] sm:w-[22px] sm:h-[22px]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
                Student Leads CRM
              </h1>
              <p className="text-[11px] sm:text-xs md:text-sm text-neutral-400 font-medium">
                Track inquiries, manage follow-up schedules & convert prospects.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-wrap">
          <button
            onClick={() => {
              fetchLeads();
              fetchStats();
            }}
            disabled={isRefreshing}
            className="flex-1 sm:flex-initial px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-white border border-neutral-200/80 hover:bg-neutral-50 text-neutral-700 text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <RotateCw size={14} className={isRefreshing ? "animate-spin text-[#ee591e]" : ""} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => exportLeadsToPdf(filteredLeads, "Student_Leads")}
            className="flex-1 sm:flex-initial px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-[#18181b] hover:bg-black text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-black/10 hover:shadow"
            title={`Download PDF sheet of ${filteredLeads.length} currently filtered leads`}
          >
            <FileDown size={15} className="text-[#ee591e]" />
            <span>Download PDF ({filteredLeads.length})</span>
          </button>

          <button
            onClick={() => {
              setSelectedLeadForEdit(null);
              setIsFormModalOpen(true);
            }}
            className="flex-1 sm:flex-initial px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-[#ee591e] to-[#ff7a1a] hover:from-[#d84810] hover:to-[#ee591e] text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-[#ee591e]/25 flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg active:scale-[0.98]"
          >
            <Plus size={16} className="stroke-[2.5]" />
            <span>Enter Lead</span>
          </button>
        </div>
      </div>

      {/* COMBINED HERO ANALYTICS COMMAND CENTER (DARK BACKGROUND THEME) */}
      <div className="bg-[#141417] rounded-3xl sm:rounded-[32px] p-4 sm:p-6 md:p-7 border border-neutral-800 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Subtle Ambient Brand Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#ee591e]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#2a7c37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* 5 KPI Stat Cards (Smooth Horizontal Swipe on Mobile, Full Grid on Desktop) - CLICKABLE */}
          <div className="flex overflow-x-auto no-scrollbar gap-2.5 sm:gap-4 pb-1 -mx-2 px-2 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-5 snap-x">
            {/* 1. Total Leads (Signature Rize Orange Gradient matching Logo) */}
            <div 
              onClick={() => navigate("/admin/dashboard/student-crm/total-leads")}
              role="button"
              tabIndex={0}
              title="Click to view all registered leads"
              className="cursor-pointer select-none min-w-[145px] max-w-[170px] sm:min-w-0 sm:max-w-none snap-start shrink-0 sm:shrink bg-gradient-to-br from-[#ee591e] via-[#ea580c] to-[#c2410c] text-white rounded-2xl sm:rounded-[26px] p-4 sm:p-6 shadow-lg shadow-[#ee591e]/25 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[135px] sm:min-h-[175px] border border-orange-400/30"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] sm:text-xs font-bold text-orange-100 uppercase tracking-wider">Total Leads</span>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-[#ee591e] flex items-center justify-center shadow-xs">
                  <Building size={17} className="sm:w-5 sm:h-5 stroke-[2.2]" />
                </div>
              </div>
              <div className="my-auto">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                    {displayStats.totalLeads}
                  </span>
                  <span className="inline-flex items-center text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs border border-white/20">
                    Active
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] sm:text-xs text-orange-100 font-medium opacity-95 truncate mt-2 pt-2 border-t border-white/20">
                <span className="truncate">{dateLabel ? `Active on ${dateLabel}` : "All inquiries"}</span>
                <span className="shrink-0 text-white font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  View <ArrowRight size={12} />
                </span>
              </div>
            </div>

            {/* 2. New Inquiries */}
            <div 
              onClick={() => navigate("/admin/dashboard/student-crm/new-inquiries")}
              role="button"
              tabIndex={0}
              title="Click to view fresh new inquiries"
              className="cursor-pointer select-none min-w-[145px] max-w-[170px] sm:min-w-0 sm:max-w-none snap-start shrink-0 sm:shrink bg-[#1f1f24] hover:bg-[#26262d] rounded-2xl sm:rounded-[26px] p-4 sm:p-6 border border-neutral-800 hover:border-blue-500/40 shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[135px] sm:min-h-[175px] text-white"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider">New Inquiries</span>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20 flex items-center justify-center shadow-2xs">
                  <Clock size={16} className="sm:w-[19px] sm:h-[19px]" />
                </div>
              </div>
              <div className="my-auto">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {displayStats.newInquiries}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] sm:text-xs text-neutral-400 font-medium truncate mt-2 pt-2 border-t border-neutral-800/90">
                <span className="truncate">{dateLabel ? `New on ${dateLabel}` : "Fresh prospects"}</span>
                <span className="shrink-0 text-blue-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  View <ArrowRight size={12} />
                </span>
              </div>
            </div>

            {/* 3. In Follow-up (Rize Gold / Amber matching Logo) */}
            <div 
              onClick={() => navigate("/admin/dashboard/student-crm/in-follow-up")}
              role="button"
              tabIndex={0}
              title="Click to view active follow-up leads"
              className="cursor-pointer select-none min-w-[145px] max-w-[170px] sm:min-w-0 sm:max-w-none snap-start shrink-0 sm:shrink bg-[#1f1f24] hover:bg-[#26262d] rounded-2xl sm:rounded-[26px] p-4 sm:p-6 border border-neutral-800 hover:border-amber-500/40 shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[135px] sm:min-h-[175px] text-white"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider">In Follow-up</span>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 flex items-center justify-center shadow-2xs">
                  <TrendingUp size={16} className="sm:w-[19px] sm:h-[19px]" />
                </div>
              </div>
              <div className="my-auto">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {displayStats.inFollowUp}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] sm:text-xs text-neutral-400 font-medium truncate mt-2 pt-2 border-t border-neutral-800/90">
                <span className="truncate">{dateLabel ? `In follow-up on ${dateLabel}` : "Active engagement"}</span>
                <span className="shrink-0 text-amber-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  View <ArrowRight size={12} />
                </span>
              </div>
            </div>

            {/* 4. Converted (Rize Forest Green matching WORLD in Logo) */}
            <div 
              onClick={() => navigate("/admin/dashboard/student-crm/converted")}
              role="button"
              tabIndex={0}
              title="Click to view enrolled converted students"
              className="cursor-pointer select-none min-w-[145px] max-w-[170px] sm:min-w-0 sm:max-w-none snap-start shrink-0 sm:shrink bg-[#1f1f24] hover:bg-[#26262d] rounded-2xl sm:rounded-[26px] p-4 sm:p-6 border border-neutral-800 hover:border-emerald-500/40 shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[135px] sm:min-h-[175px] text-white"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider">Converted</span>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-2xs">
                  <CheckCircle2 size={16} className="sm:w-[19px] sm:h-[19px]" />
                </div>
              </div>
              <div className="my-auto">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
                    {displayStats.converted}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] sm:text-xs text-neutral-400 font-medium truncate mt-2 pt-2 border-t border-neutral-800/90">
                <span className="truncate">{dateLabel ? `Converted on ${dateLabel}` : "Enrolled students"}</span>
                <span className="shrink-0 text-emerald-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  View <ArrowRight size={12} />
                </span>
              </div>
            </div>

            {/* 5. Lost Leads */}
            <div 
              onClick={() => navigate("/admin/dashboard/student-crm/lost-leads")}
              role="button"
              tabIndex={0}
              title="Click to view dropped inquiries"
              className="cursor-pointer select-none min-w-[145px] max-w-[170px] sm:min-w-0 sm:max-w-none snap-start shrink-0 sm:shrink bg-[#1f1f24] hover:bg-[#26262d] rounded-2xl sm:rounded-[26px] p-4 sm:p-6 border border-neutral-800 hover:border-rose-500/40 shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[135px] sm:min-h-[175px] text-white"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider">Lost Leads</span>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/20 flex items-center justify-center shadow-2xs">
                  <AlertCircle size={16} className="sm:w-[19px] sm:h-[19px]" />
                </div>
              </div>
              <div className="my-auto">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-rose-400 tracking-tight">
                    {displayStats.lostLeads}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] sm:text-xs text-neutral-400 font-medium truncate mt-2 pt-2 border-t border-neutral-800/90">
                <span className="truncate">{dateLabel ? `Dropped on ${dateLabel}` : "Dropped inquiries"}</span>
                <span className="shrink-0 text-rose-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  View <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </div>

          {/* Section Divider */}
          <div className="border-t border-neutral-800/90" />

          {/* Calling & Demo Telecalling Performance Cards (Horizontal Swipe on Mobile, 7 Grid on Desktop) */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1 pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-[#ee591e] border border-orange-500/30 flex items-center justify-center shadow-2xs">
                  <PhoneCall size={15} />
                </div>
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                  Calling & Demo Response Performance
                </h3>
                {dateLabel && (
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 shadow-2xs flex items-center gap-1">
                    <Calendar size={11} className="text-[#ee591e]" />
                    {dateLabel}
                  </span>
                )}
              </div>

              {/* Date-wise Quick Filter Toolbar */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setDateFilterMode("all");
                    setCustomDate("");
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer shadow-2xs ${
                    dateFilterMode === "all"
                      ? "bg-white text-neutral-950 font-black shadow-xs"
                      : "bg-neutral-800/90 text-neutral-300 hover:bg-neutral-700 hover:text-white border border-neutral-700/80"
                  }`}
                >
                  All Time
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const todayStr = toLocalDateKey(new Date());
                    setDateFilterMode("today");
                    setCustomDate(todayStr);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer shadow-2xs ${
                    dateFilterMode === "today"
                      ? "bg-[#ee591e] text-white font-black shadow-xs"
                      : "bg-neutral-800/90 text-neutral-300 hover:bg-neutral-700 hover:text-white border border-neutral-700/80"
                  }`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const y = new Date();
                    y.setDate(y.getDate() - 1);
                    setDateFilterMode("yesterday");
                    setCustomDate(toLocalDateKey(y));
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer shadow-2xs ${
                    dateFilterMode === "yesterday"
                      ? "bg-amber-500 text-neutral-950 font-black shadow-xs"
                      : "bg-neutral-800/90 text-neutral-300 hover:bg-neutral-700 hover:text-white border border-neutral-700/80"
                  }`}
                >
                  Yesterday
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDateFilterMode("7days");
                    setCustomDate("");
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer shadow-2xs ${
                    dateFilterMode === "7days"
                      ? "bg-blue-600 text-white font-black shadow-xs"
                      : "bg-neutral-800/90 text-neutral-300 hover:bg-neutral-700 hover:text-white border border-neutral-700/80"
                  }`}
                >
                  Last 7 Days
                </button>

                {/* Specific Date Picker */}
                <div className="relative inline-flex items-center">
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => {
                      if (e.target.value) {
                        setDateFilterMode("custom");
                        setCustomDate(e.target.value);
                      } else {
                        setDateFilterMode("all");
                        setCustomDate("");
                      }
                    }}
                    className={`text-[11px] font-semibold pl-2 pr-1.5 py-1 rounded-full border transition-all cursor-pointer focus:outline-none shadow-2xs [color-scheme:dark] ${
                      dateFilterMode === "custom"
                        ? "bg-orange-950/70 text-orange-200 border-orange-500 ring-2 ring-orange-500/30 font-bold"
                        : "bg-neutral-800/90 text-neutral-200 border-neutral-700 hover:border-neutral-600"
                    }`}
                    title="Select a specific date to view calls made on that date"
                  />
                </div>

                {dateFilterMode !== "all" && (
                  <button
                    type="button"
                    onClick={() => {
                      setDateFilterMode("all");
                      setCustomDate("");
                    }}
                    className="text-[10px] font-bold text-rose-300 hover:text-white bg-rose-500/20 hover:bg-rose-500/30 px-2 py-1 rounded-full border border-rose-500/40 transition-all cursor-pointer flex items-center gap-0.5 shadow-2xs"
                    title="Reset date filter"
                  >
                    <X size={11} /> Clear Date
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => exportLeadsToPdf(filteredLeads, callResponseFilter !== "All" ? callResponseFilter : "Calling_Response")}
                  className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer shadow-2xs flex items-center gap-1 shrink-0 ml-auto sm:ml-0"
                  title={`Download PDF sheet of ${filteredLeads.length} leads matching current call & date selection`}
                >
                  <FileDown size={11} className="text-[#ee591e]" />
                  <span>Download PDF ({filteredLeads.length})</span>
                </button>
              </div>
            </div>

            <div className="flex overflow-x-auto no-scrollbar gap-2.5 sm:gap-3.5 pb-1 -mx-2 px-2 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 snap-x">
              {/* 1. Total Calls */}
              <div 
                onClick={() => setCallResponseFilter("All")}
                className={`cursor-pointer min-w-[135px] max-w-[155px] sm:min-w-0 sm:max-w-none snap-start shrink-0 sm:shrink bg-[#1f1f24] hover:bg-[#26262d] rounded-2xl sm:rounded-[24px] p-3.5 sm:p-5 border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[115px] sm:min-h-[145px] text-white ${
                  callResponseFilter === "All" ? "border-[#ee591e] ring-2 ring-[#ee591e]/30 bg-[#262023]" : "border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Total Calls</span>
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-orange-500/15 text-[#ee591e] border border-orange-500/20 flex items-center justify-center shadow-2xs">
                    <PhoneCall size={15} className="sm:w-[17px] sm:h-[17px]" />
                  </div>
                </div>
                <div className="my-auto">
                  <span className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                    {callStats.totalCalls}
                  </span>
                </div>
                <div className="text-[10px] sm:text-xs text-neutral-400 font-medium truncate">
                  {dateLabel ? `Dials on ${dateLabel}` : "All dials made"}
                </div>
              </div>

              {/* 2. Total Connected (Rize Forest Green matching WORLD in Logo) */}
              <div 
                onClick={() => setCallResponseFilter(callResponseFilter === "Connected" ? "All" : "Connected")}
                className={`cursor-pointer min-w-[135px] max-w-[155px] sm:min-w-0 sm:max-w-none snap-start shrink-0 sm:shrink bg-[#1f1f24] hover:bg-[#26262d] rounded-2xl sm:rounded-[24px] p-3.5 sm:p-5 border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[115px] sm:min-h-[145px] text-white ${
                  callResponseFilter === "Connected" ? "border-[#2a7c37] ring-2 ring-[#2a7c37]/40 bg-[#1c2920]" : "border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Connected</span>
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-2xs">
                    <PhoneIncoming size={15} className="sm:w-[17px] sm:h-[17px]" />
                  </div>
                </div>
                <div className="my-auto">
                  <span className="text-xl sm:text-2xl md:text-3xl font-black text-[#34d399] tracking-tight">
                    {callStats.connected}
                  </span>
                </div>
                <div className="text-[10px] sm:text-xs text-neutral-400 font-medium truncate">
                  {dateLabel ? `Connected on ${dateLabel}` : "Connected calls"}
                </div>
              </div>

              {/* 3. Total Not Connected (Rize Yellow / Amber matching Logo) */}
              <div 
                onClick={() => setCallResponseFilter(callResponseFilter === "Not Connected" ? "All" : "Not Connected")}
                className={`cursor-pointer min-w-[135px] max-w-[155px] sm:min-w-0 sm:max-w-none snap-start shrink-0 sm:shrink bg-[#1f1f24] hover:bg-[#26262d] rounded-2xl sm:rounded-[24px] p-3.5 sm:p-5 border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[115px] sm:min-h-[145px] text-white ${
                  callResponseFilter === "Not Connected" ? "border-amber-500 ring-2 ring-amber-500/30 bg-[#2b251c]" : "border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Not Connected</span>
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 flex items-center justify-center shadow-2xs">
                    <PhoneOff size={15} className="sm:w-[17px] sm:h-[17px]" />
                  </div>
                </div>
                <div className="my-auto">
                  <span className="text-xl sm:text-2xl md:text-3xl font-black text-amber-400 tracking-tight">
                    {callStats.notConnected}
                  </span>
                </div>
                <div className="text-[10px] sm:text-xs text-neutral-400 font-medium truncate">
                  {dateLabel ? `Unanswered on ${dateLabel}` : "Unanswered / busy"}
                </div>
              </div>

              {/* 4. Yes for Demo (Rize Blue matching Logo) */}
              <div 
                onClick={() => setCallResponseFilter(callResponseFilter === "Yes for Demo" ? "All" : "Yes for Demo")}
                className={`cursor-pointer min-w-[135px] max-w-[155px] sm:min-w-0 sm:max-w-none snap-start shrink-0 sm:shrink bg-[#1f1f24] hover:bg-[#26262d] rounded-2xl sm:rounded-[24px] p-3.5 sm:p-5 border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[115px] sm:min-h-[145px] text-white ${
                  callResponseFilter === "Yes for Demo" ? "border-blue-500 ring-2 ring-blue-500/30 bg-[#1c232d]" : "border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Yes for Demo</span>
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20 flex items-center justify-center shadow-2xs">
                    <CalendarCheck size={15} className="sm:w-[17px] sm:h-[17px]" />
                  </div>
                </div>
                <div className="my-auto">
                  <span className="text-xl sm:text-2xl md:text-3xl font-black text-blue-400 tracking-tight">
                    {callStats.yesForDemo}
                  </span>
                </div>
                <div className="text-[10px] sm:text-xs text-neutral-400 font-medium truncate">
                  {dateLabel ? `Scheduled on ${dateLabel}` : "Demo scheduled"}
                </div>
              </div>

              {/* 5. Demo Completed */}
              <div 
                onClick={() => setCallResponseFilter(callResponseFilter === "Demo Completed" ? "All" : "Demo Completed")}
                className={`cursor-pointer min-w-[135px] max-w-[155px] sm:min-w-0 sm:max-w-none snap-start shrink-0 sm:shrink bg-[#1f1f24] hover:bg-[#26262d] rounded-2xl sm:rounded-[24px] p-3.5 sm:p-5 border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[115px] sm:min-h-[145px] text-white ${
                  callResponseFilter === "Demo Completed" ? "border-teal-500 ring-2 ring-teal-500/30 bg-[#1c2a27]" : "border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Demo Completed</span>
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-teal-500/15 text-teal-400 border border-teal-500/20 flex items-center justify-center shadow-2xs">
                    <CheckCircle2 size={15} className="sm:w-[17px] sm:h-[17px]" />
                  </div>
                </div>
                <div className="my-auto">
                  <span className="text-xl sm:text-2xl md:text-3xl font-black text-teal-400 tracking-tight">
                    {callStats.demoCompleted}
                  </span>
                </div>
                <div className="text-[10px] sm:text-xs text-neutral-400 font-medium truncate">
                  {dateLabel ? `Completed on ${dateLabel}` : "Demo attended"}
                </div>
              </div>

              {/* 6. Told Later */}
              <div 
                onClick={() => setCallResponseFilter(callResponseFilter === "Told Later" ? "All" : "Told Later")}
                className={`cursor-pointer min-w-[135px] max-w-[155px] sm:min-w-0 sm:max-w-none snap-start shrink-0 sm:shrink bg-[#1f1f24] hover:bg-[#26262d] rounded-2xl sm:rounded-[24px] p-3.5 sm:p-5 border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[115px] sm:min-h-[145px] text-white ${
                  callResponseFilter === "Told Later" ? "border-purple-500 ring-2 ring-purple-500/30 bg-[#261d2d]" : "border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Told Later</span>
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20 flex items-center justify-center shadow-2xs">
                    <Clock size={15} className="sm:w-[17px] sm:h-[17px]" />
                  </div>
                </div>
                <div className="my-auto">
                  <span className="text-xl sm:text-2xl md:text-3xl font-black text-purple-400 tracking-tight">
                    {callStats.toldLater}
                  </span>
                </div>
                <div className="text-[10px] sm:text-xs text-neutral-400 font-medium truncate">
                  {dateLabel ? `Callbacks on ${dateLabel}` : "Callback later"}
                </div>
              </div>

              {/* 7. No (Not Interested / Dropped) */}
              <div 
                onClick={() => setCallResponseFilter(callResponseFilter === "No" ? "All" : "No")}
                className={`cursor-pointer min-w-[135px] max-w-[155px] sm:min-w-0 sm:max-w-none snap-start shrink-0 sm:shrink bg-[#1f1f24] hover:bg-[#26262d] rounded-2xl sm:rounded-[24px] p-3.5 sm:p-5 border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[115px] sm:min-h-[145px] text-white ${
                  callResponseFilter === "No" ? "border-rose-500 ring-2 ring-rose-500/30 bg-[#2c1d23]" : "border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">No / Dropped</span>
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/20 flex items-center justify-center shadow-2xs">
                    <XCircle size={15} className="sm:w-[17px] sm:h-[17px]" />
                  </div>
                </div>
                <div className="my-auto">
                  <span className="text-xl sm:text-2xl md:text-3xl font-black text-rose-400 tracking-tight">
                    {callStats.noLeads}
                  </span>
                </div>
                <div className="text-[10px] sm:text-xs text-neutral-400 font-medium truncate">
                  {dateLabel ? `Dropped on ${dateLabel}` : "Not interested"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main CRM Table & Cards Container */}
      <div className="bg-white rounded-2xl sm:rounded-[26px] p-3.5 sm:p-6 md:p-7 border border-neutral-200/80 shadow-xs">
        {/* Table Header Controls */}
        <div className="flex flex-col gap-3 pb-4 sm:pb-6 border-b border-neutral-100">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">Student Leads Directory</h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200/60">
                {filteredLeads.length} total
              </span>
              {dateLabel && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-[#c2410c] border border-orange-200/60 flex items-center gap-1 shadow-2xs">
                  <Calendar size={12} className="text-[#ee591e]" /> {dateLabel}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => exportLeadsToPdf(filteredLeads, "Student_Leads")}
                className="text-[11px] font-bold text-neutral-800 hover:text-black bg-neutral-100 hover:bg-neutral-200 border border-neutral-300/80 px-2.5 py-1 rounded-full transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                title={`Download PDF sheet of ${filteredLeads.length} leads matching current filters`}
              >
                <FileDown size={12} className="text-[#ee591e]" />
                <span>Download PDF ({filteredLeads.length})</span>
              </button>
              {(callResponseFilter !== "All" || statusFilter !== "All Statuses" || sourceFilter !== "All Sources" || search || dateFilterMode !== "all") && (
                <button
                  onClick={() => {
                    setCallResponseFilter("All");
                    setStatusFilter("All Statuses");
                    setSourceFilter("All Sources");
                    setSearch("");
                    setDateFilterMode("all");
                    setCustomDate("");
                    searchParams.delete("search");
                    setSearchParams(searchParams, { replace: true });
                  }}
                  className="text-[11px] font-bold text-[#ee591e] hover:text-[#c2410c] bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-full transition-all cursor-pointer shadow-2xs"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            {/* Pill Search Bar */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (!e.target.value) {
                    searchParams.delete("search");
                    setSearchParams(searchParams, { replace: true });
                  }
                }}
                placeholder="Search name, phone, course..."
                className="w-full pl-9 pr-8 py-2 rounded-full bg-neutral-50/80 border border-neutral-200/80 focus:bg-white focus:border-[#ee591e] focus:ring-2 focus:ring-[#ee591e]/15 focus:outline-none transition-all text-xs font-medium text-neutral-900 placeholder-neutral-400 shadow-2xs"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    searchParams.delete("search");
                    setSearchParams(searchParams, { replace: true });
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Filter Dropdowns (Clean on Mobile, Row on Desktop) */}
            <div className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 sm:gap-2">
              {/* Pill Call Response Filter */}
              <div className="relative flex-1">
                <select
                  value={callResponseFilter}
                  onChange={(e) => setCallResponseFilter(e.target.value)}
                  className="w-full appearance-none bg-neutral-50/80 border border-neutral-200/80 rounded-full pl-2.5 sm:pl-3.5 pr-6 py-2 text-[11px] sm:text-xs font-semibold text-neutral-700 hover:border-neutral-300 focus:outline-none cursor-pointer shadow-2xs truncate"
                  title="Filter by Call Response"
                >
                  <option value="All">All Calls</option>
                  <option value="Connected">📞 Connected</option>
                  <option value="Yes for Demo">✨ Demo Sched.</option>
                  <option value="Demo Completed">🎓 Demo Done</option>
                  <option value="Told Later">⏳ Later</option>
                  <option value="No">❌ Dropped</option>
                  <option value="Not Connected">📵 Not Connected</option>
                </select>
                <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>

              {/* Pill Status Filter */}
              <div className="relative flex-1">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none bg-neutral-50/80 border border-neutral-200/80 rounded-full pl-2.5 sm:pl-3.5 pr-6 py-2 text-[11px] sm:text-xs font-semibold text-neutral-700 hover:border-neutral-300 focus:outline-none cursor-pointer shadow-2xs truncate"
                  title="Filter by Status"
                >
                  <option value="All Statuses">All Status</option>
                  <option value="New Inquiry">New Inquiry</option>
                  <option value="In Follow-up">In Follow-up</option>
                  <option value="Demo Scheduled">Demo Sched.</option>
                  <option value="Demo Completed">Demo Done</option>
                  <option value="Converted">Converted</option>
                  <option value="Lost">Lost</option>
                </select>
                <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>

              {/* Pill Source Filter */}
              <div className="relative flex-1">
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="w-full appearance-none bg-neutral-50/80 border border-neutral-200/80 rounded-full pl-2.5 sm:pl-3.5 pr-6 py-2 text-[11px] sm:text-xs font-semibold text-neutral-700 hover:border-neutral-300 focus:outline-none cursor-pointer shadow-2xs truncate"
                  title="Filter by Source"
                >
                  <option value="All Sources">All Source</option>
                  <option value="Workshop">🏫 Workshop</option>
                  <option value="Other">🌐 Other</option>
                </select>
                <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>

              {/* Date Filter Input in Table Row */}
              <div className="relative col-span-3 sm:col-span-1">
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => {
                    if (e.target.value) {
                      setDateFilterMode("custom");
                      setCustomDate(e.target.value);
                    } else {
                      setDateFilterMode("all");
                      setCustomDate("");
                    }
                  }}
                  className={`w-full appearance-none rounded-full px-3 py-2 text-[11px] sm:text-xs font-semibold focus:outline-none cursor-pointer shadow-2xs border transition-all ${
                    dateFilterMode !== "all"
                      ? "bg-blue-50 text-blue-900 border-blue-300 ring-2 ring-blue-100 font-bold"
                      : "bg-neutral-50/80 text-neutral-600 border-neutral-200/80 hover:border-neutral-300"
                  }`}
                  title="Filter leads by specific date"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Subtle background sync bar */}
        {isRefreshing && (
          <div className="h-0.5 w-full bg-blue-100 overflow-hidden my-1">
            <div className="h-full bg-blue-600 animate-pulse w-full" />
          </div>
        )}

        {/* Render Leads List using the shared helper */}
        {renderLeadList(
          filteredLeads,
          "No Student Leads Found",
          search || statusFilter !== "All Statuses" || sourceFilter !== "All Sources" || callResponseFilter !== "All" || dateFilterMode !== "all"
            ? "No leads matched your filter criteria. Try resetting filters."
            : "Start tracking student inquiries and workshop participants by adding your first lead."
        )}

        {/* Table Footer with Summary */}
        <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 font-medium gap-2 mt-2">
          <div className="flex items-center gap-3 flex-wrap">
            <div>
              Showing <span className="font-bold text-neutral-900">{filteredLeads.length}</span> of{" "}
              <span className="font-bold text-neutral-900">{leads.length}</span> total student leads
            </div>
            <button
              type="button"
              onClick={() => exportLeadsToPdf(filteredLeads, "Student_Leads")}
              className="text-[11px] font-bold text-rose-700 hover:text-rose-800 hover:underline flex items-center gap-1 cursor-pointer"
              title="Download currently filtered leads as PDF"
            >
              <FileDown size={12} /> Export to PDF ({filteredLeads.length})
            </button>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Converted: <strong className="text-neutral-800">{stats.converted}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" /> In Follow-up: <strong className="text-neutral-800">{stats.inFollowUp}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> New: <strong className="text-neutral-800">{stats.newInquiries}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <StudentLeadModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedLeadForEdit(null);
        }}
        onSave={handleSaveLead}
        lead={selectedLeadForEdit}
      />

      <StudentLeadDetailsModal
        lead={selectedLeadForDetails}
        onClose={() => setSelectedLeadForDetails(null)}
        onEdit={(lead) => {
          setSelectedLeadForEdit(lead);
          setIsFormModalOpen(true);
        }}
        onLeadUpdated={(updated) => {
          setSelectedLeadForDetails(updated);
          setLeads((prev) => {
            const next = prev.map((l) => (l._id === updated._id ? updated : l));
            saveLeadsToCacheAndNotify(next);
            return next;
          });
        }}
      />
    </div>
  );
}

