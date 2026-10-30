import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  Plus, RotateCw, Search, Phone, Copy, Check, 
  Trash2, Edit2, FileText, Calendar, User, 
  Clock, TrendingUp, CheckCircle2, AlertCircle, 
  Building, Target, Sparkles, Filter, ChevronDown, 
  School, GraduationCap, Flame, ArrowUpRight, X
} from "lucide-react";
import { StudentLead, StudentLeadStats } from "../types";
import { StudentLeadModal } from "../modals/StudentLeadModal";
import { StudentLeadDetailsModal } from "../modals/StudentLeadDetailsModal";
import { getApiUrl } from "../../../utils/api";

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

  // URL Query Params
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";

  // Filters
  const [search, setSearch] = useState(urlSearch);
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [sourceFilter, setSourceFilter] = useState("All Sources");

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

  const displayStats = useMemo(() => {
    if (stats.totalLeads > 0) return stats;
    return {
      totalLeads: leads.length,
      newInquiries: leads.filter(l => l.status === "New Inquiry").length,
      inFollowUp: leads.filter(l => l.status === "In Follow-up" || l.status === "Demo Scheduled" || l.status === "Demo Completed").length,
      converted: leads.filter(l => l.status === "Converted").length,
      lostLeads: leads.filter(l => l.status === "Lost").length,
    };
  }, [stats, leads]);

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
      updatedLead = {
        ...selectedLeadForEdit!,
        ...formData,
        updated_at: new Date().toISOString(),
      } as StudentLead;
      setLeads((prev) => {
        const next = prev.map((l) => (l._id === updatedLead._id ? updatedLead : l));
        saveLeadsToCacheAndNotify(next);
        return next;
      });
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
        status: formData.status || "New Inquiry",
        next_followup_date: formData.next_followup_date || null,
        next_followup_by: formData.next_followup_by || "",
        followup_round: formData.followup_round || "1st Follow-up",
        followup_taken_by: formData.followup_taken_by || "",
        followup_history: formData.conversation_notes ? [{
          date: new Date().toISOString(),
          conversation: formData.conversation_notes,
          status: formData.status || "New Inquiry",
          next_followup_date: formData.next_followup_date || null,
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

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
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

      return true;
    });
  }, [leads, search, statusFilter, sourceFilter]);

  // Format Status Badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Converted":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
            Converted
          </span>
        );
      case "In Follow-up":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-600 border border-purple-200">
            In Follow-up
          </span>
        );
      case "Demo Scheduled":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">
            Demo Scheduled
          </span>
        );
      case "Demo Completed":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-600 border border-cyan-200">
            Demo Completed
          </span>
        );
      case "Lost":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
            Lost
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200">
            New Inquiry
          </span>
        );
    }
  };

  return (
    <div className="max-w-[1520px] mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold mb-2 border border-blue-100">
            <span>#</span> CRM Leads Hub
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center border border-blue-200/50">
              <Target size={22} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
                Student Leads CRM
              </h1>
              <p className="text-xs md:text-sm text-neutral-500 font-medium">
                Track inquiries, manage follow-up schedules, assign team members, and convert prospects.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => {
              fetchLeads();
              fetchStats();
            }}
            disabled={isRefreshing}
            className="px-4 py-2 rounded-full bg-white border border-neutral-200/80 hover:bg-neutral-50 text-neutral-700 text-xs md:text-sm font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <RotateCw size={15} className={isRefreshing ? "animate-spin text-blue-600" : ""} />
            Refresh
          </button>

          <button
            onClick={() => {
              setSelectedLeadForEdit(null);
              setIsFormModalOpen(true);
            }}
            className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-bold transition-all shadow-xs shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
          >
            <Plus size={18} />
            <span>Enter New Lead</span>
          </button>
        </div>
      </div>

      {/* 5 KPI Stat Cards (Matching screenshot layout) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Leads */}
        <div className="bg-white rounded-[26px] p-6 border border-neutral-200/80 shadow-xs hover:border-neutral-300 hover:shadow-sm hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[155px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Leads</span>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs">
              <Building size={18} />
            </div>
          </div>
          <div className="my-auto">
            <span className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
              {displayStats.totalLeads}
            </span>
          </div>
          <div className="text-xs text-neutral-400 font-medium">All registered inquiries</div>
        </div>

        {/* New Inquiries */}
        <div className="bg-white rounded-[26px] p-6 border border-neutral-200/80 shadow-xs hover:border-neutral-300 hover:shadow-sm hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[155px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">New Inquiries</span>
            <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shadow-2xs">
              <Clock size={18} />
            </div>
          </div>
          <div className="my-auto">
            <span className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
              {displayStats.newInquiries}
            </span>
          </div>
          <div className="text-xs text-neutral-400 font-medium">Fresh prospects</div>
        </div>

        {/* In Follow-up */}
        <div className="bg-white rounded-[26px] p-6 border border-neutral-200/80 shadow-xs hover:border-neutral-300 hover:shadow-sm hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[155px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">In Follow-up</span>
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shadow-2xs">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="my-auto">
            <span className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
              {displayStats.inFollowUp}
            </span>
          </div>
          <div className="text-xs text-neutral-400 font-medium">Active engagement</div>
        </div>

        {/* Converted */}
        <div className="bg-white rounded-[26px] p-6 border border-neutral-200/80 shadow-xs hover:border-neutral-300 hover:shadow-sm hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[155px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Converted</span>
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="my-auto">
            <span className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
              {displayStats.converted}
            </span>
          </div>
          <div className="text-xs text-neutral-400 font-medium">Enrolled students</div>
        </div>

        {/* Lost Leads */}
        <div className="bg-white rounded-[26px] p-6 border border-neutral-200/80 shadow-xs hover:border-neutral-300 hover:shadow-sm hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[155px] col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Lost Leads</span>
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shadow-2xs">
              <AlertCircle size={18} />
            </div>
          </div>
          <div className="my-auto">
            <span className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
              {displayStats.lostLeads}
            </span>
          </div>
          <div className="text-xs text-neutral-400 font-medium">Dropped inquiries</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-neutral-200/80 rounded-[26px] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
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
            placeholder="Search by ID, name, phone, school, course, staff..."
            className="w-full pl-11 pr-14 py-2.5 bg-neutral-50/70 border border-neutral-200/80 rounded-full text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                searchParams.delete("search");
                setSearchParams(searchParams, { replace: true });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1 rounded-md text-xs font-bold flex items-center gap-0.5"
            >
              <X size={14} />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Source Filter */}
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
            <span className="hidden sm:inline">Source:</span>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-4 py-2 bg-neutral-50/70 border border-neutral-200/80 rounded-full text-xs font-bold text-neutral-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="All Sources">All Sources</option>
              <option value="Workshop">🏫 Workshop</option>
              <option value="Other">🌐 Other Sources</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
            <span className="hidden sm:inline">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-neutral-50/70 border border-neutral-200/80 rounded-full text-xs font-bold text-neutral-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="New Inquiry">New Inquiry</option>
              <option value="In Follow-up">In Follow-up</option>
              <option value="Demo Scheduled">Demo Scheduled</option>
              <option value="Demo Completed">Demo Completed</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main CRM Table (Matching screenshot columns & style) */}
      <div className="bg-white border border-neutral-200/80 rounded-[26px] overflow-hidden shadow-xs">
        {/* Subtle background sync bar */}
        {isRefreshing && (
          <div className="h-0.5 w-full bg-blue-100 overflow-hidden">
            <div className="h-full bg-blue-600 animate-pulse w-full" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-400 text-[11px] font-bold uppercase tracking-wider bg-white">
                <th className="py-4 px-6">UNIQUE ID</th>
                <th className="py-4 px-6">STUDENT NAME</th>
                <th className="py-4 px-6">CONTACT & WHATSAPP</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6">NEXT FOLLOW-UP DATE</th>
                <th className="py-4 px-6">FOLLOW-UP BY</th>
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center">
                        <Target size={24} />
                      </div>
                      <h4 className="text-base font-bold text-neutral-800">No Student Leads Found</h4>
                      <p className="text-xs text-neutral-400 text-center">
                        {search || statusFilter !== "All Statuses" || sourceFilter !== "All Sources"
                          ? "No leads matched your filter criteria. Try resetting filters."
                          : "Start tracking student inquiries and workshop participants by adding your first lead."}
                      </p>
                      <button
                        onClick={() => {
                          setSelectedLeadForEdit(null);
                          setIsFormModalOpen(true);
                        }}
                        className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus size={15} />
                        <span>Enter First Lead</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const cleanPhone = (lead.phone || "").replace(/\D/g, "");
                  const isIdCopied = copiedId === `id-${lead._id}`;
                  const isPhoneCopied = copiedId === `phone-${lead._id}`;

                  // Next followup formatting
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
                      <td className="py-4 px-6 align-middle">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-neutral-900 text-xs">
                          <span>{lead.lead_ID}</span>
                          <button
                            onClick={() => handleCopy(lead.lead_ID, `id-${lead._id}`)}
                            title="Copy Lead ID"
                            className="text-neutral-400 hover:text-neutral-600 transition-colors p-0.5"
                          >
                            {isIdCopied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                          </button>
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-0.5 font-medium">
                          {createdDate}
                        </div>
                      </td>

                      {/* STUDENT NAME */}
                      <td className="py-4 px-6 align-middle">
                        <div 
                          onClick={() => setSelectedLeadForDetails(lead)}
                          className="font-bold text-neutral-900 hover:text-blue-600 transition-colors cursor-pointer text-sm"
                        >
                          {lead.student_name}
                        </div>
                      </td>

                      {/* CONTACT & WHATSAPP */}
                      <td className="py-4 px-6 align-middle">
                        <div className="flex items-center gap-1.5 font-semibold text-neutral-800 text-xs">
                          <Phone size={12} className="text-neutral-400 shrink-0" />
                          <span>{lead.phone}</span>
                          <button
                            onClick={() => handleCopy(lead.phone, `phone-${lead._id}`)}
                            title="Copy Phone"
                            className="text-neutral-400 hover:text-neutral-600 transition-colors p-0.5"
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
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md hover:bg-emerald-100 transition-colors border border-emerald-200"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>WA: {cleanPhone.slice(-10)}</span>
                            </a>
                          </div>
                        )}
                      </td>

                      {/* STATUS */}
                      <td className="py-4 px-6 align-middle">
                        {renderStatusBadge(lead.status)}
                      </td>

                      {/* NEXT FOLLOW-UP DATE */}
                      <td className="py-4 px-6 align-middle">
                        <div className={`flex items-center gap-1.5 text-xs font-bold ${
                          isFollowupDue ? "text-amber-700" : "text-neutral-800"
                        }`}>
                          <Calendar size={13} className={`shrink-0 ${isFollowupDue ? "text-amber-600" : "text-neutral-400"}`} />
                          <span>{formattedFollowup}</span>
                        </div>
                        {lead.followup_round && (
                          <div className="mt-1">
                            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                              {lead.followup_round}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* FOLLOW-UP BY */}
                      <td className="py-4 px-6 align-middle">
                        <div className="inline-flex items-center gap-1.5 bg-neutral-100/80 px-2.5 py-1 rounded-lg text-neutral-800 font-semibold text-xs border border-neutral-200/60">
                          <User size={13} className="text-blue-600 shrink-0" />
                          <span className="truncate max-w-[140px]">{lead.next_followup_by || lead.followup_taken_by || "Counselor"}</span>
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="py-4 px-6 align-middle text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedLeadForDetails(lead)}
                            className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="View Full Lead Details"
                          >
                            <FileText size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedLeadForEdit(lead);
                              setIsFormModalOpen(true);
                            }}
                            className="p-1.5 text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit / Record Follow-up"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteLead(lead)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Summary */}
        <div className="p-4 bg-neutral-50/50 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 font-medium gap-2">
          <div>
            Showing <span className="font-bold text-neutral-800">{filteredLeads.length}</span> of{" "}
            <span className="font-bold text-neutral-800">{leads.length}</span> total student leads
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Converted: {stats.converted}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" /> In Follow-up: {stats.inFollowUp}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> New: {stats.newInquiries}
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
      />
    </div>
  );
}

