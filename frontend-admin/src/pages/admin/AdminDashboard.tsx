import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Users, Search, Plus, Edit2, LogOut, Shield, Menu,
  AlertCircle, LayoutDashboard, MessagesSquare, MessageSquare, X, ArrowLeft,
  Award, Bell, UserCircle, Mail, IndianRupee, CheckCircle2, Activity, Trash2, UserX, UserMinus, FileText, Filter, Download, Target,
  Phone, Calendar, Clock, AlertTriangle, ChevronRight, UserCheck, RefreshCw,
  MoreHorizontal, ChevronDown
} from "lucide-react";

import { Student } from "./types";
import { StudentModal } from "./modals/StudentModal";
import { StudentDetailsModal } from "./modals/StudentDetailsModal";
import { StudentInvoiceModal } from "./modals/StudentInvoiceModal";
import { InquiryTab } from "./tabs/InquiryTab";
import { ReferredByTab } from "./tabs/ReferredByTab";
import { DeletedReferrersTab } from "./tabs/DeletedReferrersTab";
import { DeletedStudentsTab } from "./tabs/DeletedStudentsTab";
import { StudentLeadCrmTab } from "./tabs/StudentLeadCrmTab";
import { ReferrerModal } from "./modals/ReferrerModal";
import { getApiUrl, API_BASE_URL } from "../../utils/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { tab, subview } = useParams();
  
  const STAT_VIEWS = useMemo(() => [
    "total-students",
    "certificate-issued",
    "certificate-unissued",
    "total-earnings",
    "total-clear-fees",
    "total-pending-fees"
  ], []);

  const activeTab = useMemo(() => {
    if (tab && STAT_VIEWS.includes(tab)) return "dashboard";
    return tab || "dashboard";
  }, [tab, STAT_VIEWS]);

  const expandedStat = useMemo(() => {
    if (subview) return subview;
    if (tab && STAT_VIEWS.includes(tab)) return tab;
    return null;
  }, [tab, subview, STAT_VIEWS]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Clear" | "Pending">("All");
  const [detailStatusFilter, setDetailStatusFilter] = useState<"All" | "Clear" | "Pending">("All");
  const [detailSearch, setDetailSearch] = useState("");
  const [earningsFilter, setEarningsFilter] = useState<"received" | "pending" | "all">("received");

  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    unissuedCertificates: 0,
    certificatesIssued: 0,
    totalEarnings: 0,
    totalClearFees: 0,
    pendingFees: 0,
    totalReferralPaid: 0,
  });
  const [, setExpandedStats] = useState({
    totalEntries: 0,
    growth: "0",
    recentActivity: 0
  });
  const [allStudentsData, setAllStudentsData] = useState<Student[]>([]);
  const [studentsWithCertificates, setStudentsWithCertificates] = useState<any[]>([]);
  const [unissuedCertificatesData, setUnissuedCertificatesData] = useState<any[]>([]);
  const [clearFeeStudentsData, setClearFeeStudentsData] = useState<any[]>([]);
  const [pendingFeeStudentsData, setPendingFeeStudentsData] = useState<any[]>([]);
  const [earningsDetailsData, setEarningsDetailsData] = useState<any[]>([]);
  const [graphData, setGraphData] = useState<any[]>([]);
  const [graphMetric, setGraphMetric] = useState<"earnings" | "students">("earnings");
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [topCourses, setTopCourses] = useState<any[]>([]);
  const [adminEmail, setAdminEmail] = useState<string>(() => {
    return localStorage.getItem("adminEmail") || "admin@rizeworld.com";
  });
  const [adminName, setAdminName] = useState<string>(() => {
    return localStorage.getItem("adminName") || "Super Admin";
  });

  const adminInitials = useMemo(() => {
    if (!adminName) return "SA";
    const parts = adminName.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return adminName.slice(0, 2).toUpperCase();
  }, [adminName]);

  const totalPendingDuesAcrossSystem = useMemo(() => {
    if (pendingFeeStudentsData.length > 0) {
      return pendingFeeStudentsData.reduce((acc, curr) => acc + Number(curr.pendingFees || 0), 0);
    }
    if (allStudentsData.length > 0) {
      return allStudentsData.reduce((acc, curr) => acc + Number(curr.pendingFees || 0), 0);
    }
    return students.reduce((acc, curr) => acc + Number(curr.pendingFees || 0), 0);
  }, [pendingFeeStudentsData, allStudentsData, students]);

  const totalStudentsSummary = useMemo(() => {
    const list = allStudentsData.length > 0 ? allStudentsData : students;
    const totalBilled = list.reduce((acc, curr) => acc + (Number(curr.totalFees) || 0), 0);
    const totalPaid = list.reduce((acc, curr) => acc + (Number(curr.paidFees) || 0), 0);
    const totalPending = list.reduce((acc, curr) => acc + (Number(curr.pendingFees) || 0), 0);
    return {
      count: list.length,
      totalBilled,
      totalPaid,
      totalPending,
      clearCount: list.filter(s => Number(s.pendingFees) <= 0).length,
      pendingCount: list.filter(s => Number(s.pendingFees) > 0).length,
    };
  }, [allStudentsData, students]);

  const totalClearSummary = useMemo(() => {
    const totalPaid = clearFeeStudentsData.reduce((acc, curr) => acc + (Number(curr.paidFees) || 0), 0);
    return {
      count: clearFeeStudentsData.length,
      totalPaid,
      avgPaid: clearFeeStudentsData.length > 0 ? Math.round(totalPaid / clearFeeStudentsData.length) : 0
    };
  }, [clearFeeStudentsData]);

  const totalClearFeesAmount = useMemo(() => {
    if (clearFeeStudentsData.length > 0) {
      return clearFeeStudentsData.reduce((acc, curr) => acc + (Number(curr.paidFees) || 0), 0);
    }
    const list = allStudentsData.length > 0 ? allStudentsData : students;
    const clearList = list.filter(s => Number(s.pendingFees || 0) <= 0);
    return clearList.reduce((acc, curr) => acc + (Number(curr.paidFees) || 0), 0);
  }, [clearFeeStudentsData, allStudentsData, students]);

  const totalClearStudentsCount = useMemo(() => {
    return stats.totalClearFees || clearFeeStudentsData.length || (
      (allStudentsData.length > 0 ? allStudentsData : students).filter(s => Number(s.pendingFees || 0) <= 0).length
    ) || 0;
  }, [stats.totalClearFees, clearFeeStudentsData, allStudentsData, students]);

  const totalEarningsSummary = useMemo(() => {
    const totalReceived = earningsDetailsData.length > 0 
      ? earningsDetailsData.reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
      : (stats.totalEarnings || 0);
    return {
      count: earningsDetailsData.length,
      totalReceived,
      totalPending: totalPendingDuesAcrossSystem,
      totalExpected: totalReceived + totalPendingDuesAcrossSystem
    };
  }, [earningsDetailsData, totalPendingDuesAcrossSystem, stats.totalEarnings]);

  const totalReceivedEarning = useMemo(() => {
    return stats.totalEarnings || totalEarningsSummary.totalReceived || 0;
  }, [stats.totalEarnings, totalEarningsSummary.totalReceived]);

  const totalExpectedEarning = useMemo(() => {
    return Math.max(
      totalStudentsSummary.totalBilled || 0,
      totalEarningsSummary.totalExpected || 0,
      totalReceivedEarning + totalPendingDuesAcrossSystem,
      totalReceivedEarning
    );
  }, [totalStudentsSummary.totalBilled, totalEarningsSummary.totalExpected, totalReceivedEarning, totalPendingDuesAcrossSystem]);

  const [isSetAmountModalOpen, setIsSetAmountModalOpen] = useState(false);
  const [globalReferralAmount, setGlobalReferralAmount] = useState<number | string>("");
  const [selectedReferrer, setSelectedReferrer] = useState<any>(null);
  const [referrerStudents, setReferrerStudents] = useState<any[]>([]);
  const [referrerStatusFilter, setReferrerStatusFilter] = useState("All");
  const handleReferrerClick = async (referrer: any) => {
    setSelectedReferrer(referrer);
    try {
      const token = localStorage.getItem("adminAuthToken");
      const res = await fetch(getApiUrl(`/getReferrerStudents/${referrer.id}`), { 
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        // The backend already returns enriched student data
        const enrichedStudents = data.data.map((s: any) => ({
           student_ID: s.student_ID,
           student_name: s.student_name,
           student_phone: s.student_phone,
           selected_course_name: s.selected_course_name,
           total_fee: s.total_fee,
           total_paid_fee: s.total_paid_fee,
           pending_fee: s.pending_fee,
           created_at: s.created_at
        }));

        setReferrerStudents(enrichedStudents);
      }
    } catch (error) {
      console.error("Error fetching referrer students:", error);
    }
  };

  // Mock Data for new pages


  const [referrers, setReferrers] = useState<any[]>([]);
  const [deletedReferrers, setDeletedReferrers] = useState<any[]>([]);
  const [deletedStudents, setDeletedStudents] = useState<any[]>([]);

  const fetchDeletedStudents = async () => {
    try {
      const token = localStorage.getItem("adminAuthToken");
      const res = await fetch(getApiUrl("/getDeletedStudents"), {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setDeletedStudents(Array.isArray(data.data) ? data.data : []);
      }
    } catch (error) {
      console.error("Failed to fetch deleted students:", error);
    }
  };

  const handleRestoreStudent = async (student: any) => {
    if (window.confirm(`Are you sure you want to restore student "${student.student_name}" (${student.student_ID}) back to Active Students?`)) {
      try {
        const token = localStorage.getItem("adminAuthToken");
        const res = await fetch(getApiUrl("/restoreStudent"), {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ student_ID: student.student_ID })
        });
        const data = await res.json();
        if (data.success) {
          alert("Student restored successfully");
          fetchDeletedStudents();
          fetchAllStudents();
          fetchDashboardData();
        } else {
          alert(data.message || "Failed to restore student");
        }
      } catch (error) {
        console.error("Error restoring student:", error);
        alert("An error occurred while restoring student");
      }
    }
  };

  const handleDeleteReferrer = async (ref: any) => {
    if (window.confirm(`Are you sure you want to delete referrer "${ref.name}"? This referrer will be moved to Deleted Referrers.`)) {
      try {
        const token = localStorage.getItem("adminAuthToken");
        const res = await fetch(getApiUrl("/deleteReferrer"), {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ id: ref.id })
        });
        const data = await res.json();
        if (data.success) {
          alert("Referrer deleted successfully");
          fetchReferrers();
          if (activeTab === "deleted-referrers") fetchDeletedReferrers();
        } else {
          alert(data.message || "Failed to delete referrer");
        }
      } catch (error) {
        console.error("Error deleting referrer:", error);
        alert("An error occurred while deleting referrer");
      }
    }
  };

  const handleRestoreReferrer = async (ref: any) => {
    if (window.confirm(`Are you sure you want to restore referrer "${ref.name}" back to Active Referrers?`)) {
      try {
        const token = localStorage.getItem("adminAuthToken");
        const res = await fetch(getApiUrl("/restoreReferrer"), {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ id: ref.id })
        });
        const data = await res.json();
        if (data.success) {
          alert("Referrer restored successfully");
          fetchDeletedReferrers();
          fetchReferrers();
        } else {
          alert(data.message || "Failed to restore referrer");
        }
      } catch (error) {
        console.error("Error restoring referrer:", error);
        alert("An error occurred while restoring referrer");
      }
    }
  };

  const handleClearReferrerAmount = async (ref: any) => {
     if (window.confirm(`Are you sure you want to clear all pending dues (₹${ref.pendingAmount.replace('₹', '')}) for ${ref.name}?`)) {
        try {
           const pendingValue = parseFloat(ref.pendingAmount.replace(/[₹,]/g, '')) || 0;
           const token = localStorage.getItem("adminAuthToken");
           const res = await fetch(getApiUrl("/updateReferrerPayment"), {
              method: "POST",
              headers: { 
                 "Content-Type": "application/json",
                 "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({ 
                 id: ref.id, 
                 payAmount: pendingValue
              })
           });
           const data = await res.json();
           if (data.success) {
              alert("Referrer dues cleared successfully");
              fetchReferrers();
           }
        } catch (error) {
           console.error("Error clearing referrer dues:", error);
        }
     }
  };

  const [isReferrerModalOpen, setIsReferrerModalOpen] = useState(false);
  const [editingReferrer, setEditingReferrer] = useState<any>(null);

  const handleSaveReferrer = async (updatedReferrer: any) => {
     try {
        const token = localStorage.getItem("adminAuthToken");
        const res = await fetch(getApiUrl("/updateReferrerPayment"), {
           method: "POST",
           headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
           },
           body: JSON.stringify({ 
              id: updatedReferrer.id, 
              payAmount: updatedReferrer.payAmount 
           })
        });
        const data = await res.json();
        if (data.success) {
           alert(data.message);
           fetchReferrers(); // Refresh the list
           setIsReferrerModalOpen(false);
           setEditingReferrer(null);
        } else {
           alert(data.message || "Failed to process payment");
        }
     } catch (error) {
        console.error("Error processing referrer payment:", error);
        alert("An error occurred while processing payment");
     }
  };

  // Modals state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [invoicingStudent, setInvoicingStudent] = useState<{ student: Student; paymentIndex?: number } | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);



  // Notification & Follow-up State
  interface FollowupReminderItem {
    id: string;
    _id: string;
    lead_ID?: string;
    student_name: string;
    phone: string;
    interested_course?: string;
    status: string;
    next_followup_date: string;
    next_followup_by: string; // "how tack that followup"
    followup_round?: string;
    conversation_notes?: string;
    category: "today" | "due" | "upcoming";
    created_at?: string;
  }

  const computeFollowupGroups = (leads: any[]) => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const today: FollowupReminderItem[] = [];
    const due: FollowupReminderItem[] = [];
    const upcoming: FollowupReminderItem[] = [];

    if (!Array.isArray(leads)) return { today, due, upcoming };

    leads.forEach((l: any) => {
      if (!l.next_followup_date || l.is_deleted || l.status === "Converted" || l.status === "Lost") {
        return;
      }
      const fDate = new Date(l.next_followup_date);
      if (isNaN(fDate.getTime())) return;

      const item: FollowupReminderItem = {
        id: l._id || l.id,
        _id: l._id || l.id,
        lead_ID: l.lead_ID || "",
        student_name: l.student_name || "Unknown Student",
        phone: l.phone || "",
        interested_course: l.interested_course || "Course N/A",
        status: l.status || "New Inquiry",
        next_followup_date: l.next_followup_date,
        next_followup_by: l.next_followup_by || l.followup_taken_by || "Staff",
        followup_round: l.followup_round || "1st Follow-up",
        conversation_notes: l.conversation_notes || "",
        created_at: l.created_at || "",
        category: fDate < startOfToday ? "due" : fDate <= endOfToday ? "today" : "upcoming",
      };

      if (item.category === "due") {
        due.push(item);
      } else if (item.category === "today") {
        today.push(item);
      } else {
        upcoming.push(item);
      }
    });

    due.sort((a, b) => new Date(a.next_followup_date).getTime() - new Date(b.next_followup_date).getTime());
    today.sort((a, b) => new Date(a.next_followup_date).getTime() - new Date(b.next_followup_date).getTime());
    upcoming.sort((a, b) => new Date(a.next_followup_date).getTime() - new Date(b.next_followup_date).getTime());

    return { today, due, upcoming };
  };

  const [followupReminders, setFollowupReminders] = useState<{
    today: FollowupReminderItem[];
    due: FollowupReminderItem[];
    upcoming: FollowupReminderItem[];
  }>(() => {
    try {
      const cached = localStorage.getItem("rize_student_leads_cache");
      if (cached) {
        return computeFollowupGroups(JSON.parse(cached));
      }
    } catch (e) {}
    return { today: [], due: [], upcoming: [] };
  });

  interface PaymentReminderNotification {
    id: string;
    student_ID: string;
    student_name: string;
    phone: string;
    email: string;
    pending_fee: number;
    total_fee: number;
    total_paid_fee: number;
    course_name: string;
    last_payment_date: string;
    last_payment_amount: number;
    next_due_date: string;
    days_overdue: number;
    days_since_payment: number;
    months_completed: number;
    studentObj?: Student;
  }

  const computePaymentReminders = (studentsList: Student[]): PaymentReminderNotification[] => {
    if (!Array.isArray(studentsList)) return [];
    const now = new Date();
    const reminders: PaymentReminderNotification[] = [];

    studentsList.forEach((student) => {
      const pendingFee = Number(student.pendingFees || 0);
      if (pendingFee <= 0) return;

      // Collect all payments
      const payments: { amount?: any; date?: string }[] = [];
      if (Array.isArray(student.fee)) {
        payments.push(...student.fee);
      }
      if (Array.isArray(student.admissions)) {
        student.admissions.forEach(adm => {
          if (Array.isArray(adm.payments)) {
            payments.push(...adm.payments);
          }
        });
      }

      let lastPaymentDate: Date | null = null;
      let lastPaymentAmount = 0;

      payments.forEach(p => {
        if (p && p.date) {
          const pDate = new Date(p.date);
          if (!isNaN(pDate.getTime())) {
            if (!lastPaymentDate || pDate.getTime() > lastPaymentDate.getTime()) {
              lastPaymentDate = pDate;
              lastPaymentAmount = Number(p.amount) || 0;
            }
          }
        }
      });

      // Fallback: If no payments recorded yet, use admission start date or student startDate
      if (!lastPaymentDate) {
        const sDateStr = student.startDate || student.admissions?.[0]?.startDate;
        if (sDateStr) {
          const sDate = new Date(sDateStr);
          if (!isNaN(sDate.getTime())) {
            lastPaymentDate = sDate;
          }
        }
      }

      if (!lastPaymentDate) return;

      // Next due date is 1 month after last payment date
      const nextDueDate = new Date(lastPaymentDate);
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);

      // Overdue threshold: 1 month has completed (now >= nextDueDate)
      if (now.getTime() >= nextDueDate.getTime()) {
        const diffTime = now.getTime() - nextDueDate.getTime();
        const daysOverdue = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const totalElapsed = now.getTime() - lastPaymentDate.getTime();
        const daysSincePayment = Math.floor(totalElapsed / (1000 * 60 * 60 * 24));
        const monthsCompleted = Math.max(1, Math.floor(daysSincePayment / 30));

        const courseName = Array.isArray(student.course) 
          ? student.course.join(", ") 
          : (student.course || student.admissions?.[0]?.courses?.join(", ") || "Course");

        reminders.push({
          id: student.id,
          student_ID: student.id,
          student_name: student.name,
          phone: student.phone || "",
          email: student.email || "",
          pending_fee: pendingFee,
          total_fee: Number(student.totalFees || 0),
          total_paid_fee: Number(student.paidFees || 0),
          course_name: courseName,
          last_payment_date: lastPaymentDate.toISOString(),
          last_payment_amount: lastPaymentAmount,
          next_due_date: nextDueDate.toISOString(),
          days_overdue: daysOverdue,
          days_since_payment: daysSincePayment,
          months_completed: monthsCompleted,
          studentObj: student,
        });
      }
    });

    reminders.sort((a, b) => b.days_overdue - a.days_overdue);
    return reminders;
  };

  const [paymentReminders, setPaymentReminders] = useState<PaymentReminderNotification[]>([]);
  const [notifTab, setNotifTab] = useState<"today" | "due" | "fees" | "upcoming" | "inquiries">("today");
  const [isNotifRefreshing, setIsNotifRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Recalculate payment reminders whenever students list changes
  useEffect(() => {
    if (students && students.length > 0) {
      setPaymentReminders(computePaymentReminders(students));
    }
  }, [students]);

  // Real-time listener for lead updates across tabs/CRM actions
  useEffect(() => {
    const handleLeadsUpdated = () => {
      try {
        const cached = localStorage.getItem("rize_student_leads_cache");
        if (cached) {
          setFollowupReminders(computeFollowupGroups(JSON.parse(cached)));
        }
      } catch (e) {}
    };
    window.addEventListener("rize_leads_updated", handleLeadsUpdated);
    window.addEventListener("storage", handleLeadsUpdated);
    return () => {
      window.removeEventListener("rize_leads_updated", handleLeadsUpdated);
      window.removeEventListener("storage", handleLeadsUpdated);
    };
  }, []);

  const fetchNotifications = async () => {
    setIsNotifRefreshing(true);
    const token = localStorage.getItem("adminAuthToken");

    // 1. Fetch Inquiries
    try {
      const res = await fetch(getApiUrl("/getAllInquiries"), {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data.map((inq: any) => ({
          id: inq._id,
          type: 'message',
          title: 'New Course Inquiry',
          sender: inq.name,
          date: inq.created_at,
          color: 'blue',
          icon: Mail,
          content: inq.message,
          phone: inq.phone,
          course: inq.course,
          isRead: inq.is_read
        })));
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }

    // 2. Fetch Followup Reminders from server
    try {
      const resF = await fetch(getApiUrl("/student-leads/followups/reminders"), {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (resF.ok) {
        const dataF = await resF.json();
        if (dataF.success && dataF.data) {
          setFollowupReminders({
            today: dataF.data.today || [],
            due: dataF.data.due || [],
            upcoming: dataF.data.upcoming || [],
          });
        }
      }
    } catch (err) {
      console.warn("Followup reminders server fetch notice:", err);
    }

    // 3. Fetch Payment Reminders from server
    try {
      const resP = await fetch(getApiUrl("/paymentReminders"), {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (resP.ok) {
        const dataP = await resP.json();
        if (dataP.success && Array.isArray(dataP.data)) {
          const enhanced = dataP.data.map((rem: any) => {
            const found = students.find((s) => s.id === rem.student_ID || s.id === rem.id);
            return {
              ...rem,
              studentObj: found || rem.studentObj,
            };
          });
          setPaymentReminders(enhanced);
        }
      }
    } catch (errP) {
      console.warn("Payment reminders server fetch notice:", errP);
    }

    // Fallback: Compute from cached student leads
    try {
      const cached = localStorage.getItem("rize_student_leads_cache");
      if (cached) {
        setFollowupReminders(computeFollowupGroups(JSON.parse(cached)));
      }
    } catch (e) {}
    setIsNotifRefreshing(false);
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("adminAuthToken");
      await fetch(getApiUrl(`/markInquiryRead/${id}`), {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const formatFollowupSchedule = (dateStr: string, category: "today" | "due" | "upcoming") => {
    if (!dateStr) return "Date not set";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;

    const timeStr = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

    if (category === "today") {
      return `Today at ${timeStr}`;
    }

    const dateFormatted = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    if (category === "due") {
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      const leadDate = new Date(d);
      leadDate.setHours(0, 0, 0, 0);
      const diffTime = todayDate.getTime() - leadDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? `Overdue by ${diffDays} day${diffDays > 1 ? 's' : ''} (${dateFormatted})` : `Overdue (${dateFormatted}, ${timeStr})`;
    }

    return `${dateFormatted} at ${timeStr}`;
  };

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " mins ago";
    return Math.floor(seconds) + " seconds ago";
  };



  const fetchAllStudents = async () => {
    try {
      const token = localStorage.getItem("adminAuthToken");
      const res = await fetch(getApiUrl("/allStudents"), {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        const mapped: Student[] = data.data.map((item: any) => {
          // Extract root-level certificates
          const rootCerts: any[] = (item.certificates && Array.isArray(item.certificates))
            ? item.certificates.map((cert: any, idx: number) => {
                const cPath = cert.certificatePath || cert.certificate_path || cert.url || "";
                return {
                  id: cert.id || (cert._id ? cert._id.toString() : `cert-${item.student_ID}-${idx}`),
                  courseName: cert.courseName || cert.course_name || "Course Certificate",
                  url: cPath,
                  certificatePath: cPath,
                  date: cert.issuedAt || cert.issued_at || cert.date ? new Date(cert.issuedAt || cert.issued_at || cert.date).toISOString() : new Date().toISOString()
                };
              })
            : [];

          if (item.certificate_photo && !rootCerts.some(c => c.url === item.certificate_photo || c.certificatePath === item.certificate_photo)) {
            rootCerts.push({
              id: `cert-${item.student_ID}-old`,
              courseName: Array.isArray(item.selected_course_name) ? item.selected_course_name[0] : item.selected_course_name || "Course",
              url: item.certificate_photo,
              certificatePath: item.certificate_photo,
              date: item.created_at ? new Date(item.created_at).toISOString() : new Date().toISOString()
            });
          }

          // Map admissions if available
          let admissions: any[] = [];
          if (item.admissions && item.admissions.length > 0) {
            admissions = item.admissions.map((adm: any) => {
              const admCourses = (Array.isArray(adm.courses) ? adm.courses : (adm.selected_course_name ? (Array.isArray(adm.selected_course_name) ? adm.selected_course_name : [adm.selected_course_name]) : [])).map((c: string) => (c || '').toLowerCase().trim());

              let admCerts = adm.certificates ? adm.certificates.map((cert: any, idx: number) => {
                const cPath = cert.certificatePath || cert.certificate_path || cert.url || "";
                return {
                  id: cert.id || (cert._id ? cert._id.toString() : `cert-${item.student_ID}-${adm.admission_id || adm.admissionId}-${idx}`),
                  courseName: cert.courseName || cert.course_name || "Course Certificate",
                  url: cPath,
                  certificatePath: cPath,
                  date: cert.issuedAt || cert.issued_at || cert.date ? new Date(cert.issuedAt || cert.issued_at || cert.date).toISOString() : new Date().toISOString()
                };
              }) : [];

              // Merge any matching root certificates
              if (rootCerts.length > 0) {
                rootCerts.forEach(rc => {
                  const rcName = (rc.courseName || '').toLowerCase().trim();
                  const matches = (item.admissions.length === 1) || admCourses.some((ac: string) =>
                    ac === rcName ||
                    ac.includes(rcName) ||
                    rcName.includes(ac) ||
                    (ac.includes('creative') && rcName.includes('creative')) ||
                    (ac.includes('seo') && rcName.includes('seo')) ||
                    (ac.includes('master') && rcName.includes('master')) ||
                    (ac.includes('graphic') && rcName.includes('graphic')) ||
                    (ac.includes('video') && rcName.includes('video'))
                  );
                  const exists = admCerts.some((c: any) => c.certificatePath === rc.certificatePath || (c.courseName && c.courseName.toLowerCase().trim() === rcName));
                  if (matches && !exists) {
                    admCerts.push(rc);
                  }
                });
              }

              return {
                admissionId: adm.admission_id || adm.admissionId || `adm-${Date.now()}`,
                courses: Array.isArray(adm.courses) ? adm.courses : (adm.selected_course_name ? (Array.isArray(adm.selected_course_name) ? adm.selected_course_name : [adm.selected_course_name]) : []),
                courseDuration: adm.course_duration || adm.courseDuration || "N/A",
                totalFee: Number(adm.total_fee) || Number(adm.totalFee) || 0,
                totalPaidFee: Number(adm.total_paid_fee) || Number(adm.totalPaidFee) || 0,
                pendingFee: Number(adm.pending_fee) || Number(adm.pendingFee) || 0,
                feesStatus: adm.status || adm.feesStatus || "Pending",
                feesInstallment: Number(adm.fee_installment) || Number(adm.feesInstallment) || 0,
                payments: adm.payments || [],
                certificates: admCerts,
                startDate: adm.course_start_date 
                  ? new Date(adm.course_start_date).toISOString().split('T')[0] 
                  : (adm.startDate 
                      ? (typeof adm.startDate === 'string' 
                          ? new Date(adm.startDate).toISOString().split('T')[0] 
                          : new Date(adm.startDate).toISOString().split('T')[0])
                      : new Date().toISOString().split('T')[0]),
                endDate: adm.course_end_date 
                  ? new Date(adm.course_end_date).toISOString().split('T')[0] 
                  : (adm.endDate 
                      ? (typeof adm.endDate === 'string' 
                          ? new Date(adm.endDate).toISOString().split('T')[0] 
                          : new Date(adm.endDate).toISOString().split('T')[0])
                      : (() => {
                          const date = new Date();
                          date.setMonth(date.getMonth() + 3);
                          return date.toISOString().split('T')[0];
                        })()),
                createdAt: adm.created_at || new Date().toISOString(),
                updatedAt: adm.updated_at || new Date().toISOString()
              };
            });
          }
          
          // If no admissions, create a default one from the old structure for backward compatibility
          if (admissions.length === 0) {
            let certificates = [...rootCerts];
            
            admissions.push({
              admissionId: `adm-${item.student_ID}-default`,
              courses: Array.isArray(item.selected_course_name) ? item.selected_course_name : (item.selected_course_name ? [item.selected_course_name] : ["N/A"]),
              courseDuration: item.course_duration || "N/A",
              totalFee: Number(item.total_fee) || 0,
              totalPaidFee: Number(item.total_paid_fee) || 0,
              pendingFee: Number(item.pending_fee) || 0,
              feesStatus: item.status || "Pending",
              feesInstallment: Number(item.fee_installment) || 0,
              payments: item.fee || [],
              certificates,
              startDate: item.course_start_date ? new Date(item.course_start_date).toISOString().split('T')[0] : "",
              endDate: item.course_end_date ? new Date(item.course_end_date).toISOString().split('T')[0] : "",
              createdAt: item.created_at || new Date().toISOString(),
              updatedAt: item.updated_at || new Date().toISOString()
            });
          }
          
          // Calculate totals from admissions
          const totalFees = admissions.reduce((sum, adm) => sum + adm.totalFee, 0);
          const totalPaidFees = admissions.reduce((sum, adm) => sum + adm.totalPaidFee, 0);
          const totalPendingFees = admissions.reduce((sum, adm) => sum + adm.pendingFee, 0);
          
          // Determine overall fees status
          let overallStatus: "Clear" | "Pending" | "Partial" = "Pending";
          const allClear = admissions.length > 0 
            ? admissions.every(adm => adm.feesStatus === "Clear" || Number(adm.pendingFee) <= 0)
            : (totalPendingFees <= 0 && totalFees > 0);
          const anyPaid = admissions.some(adm => Number(adm.totalPaidFee) > 0) || totalPaidFees > 0;
          if (allClear || (totalPendingFees <= 0 && totalFees > 0)) {
            overallStatus = "Clear";
          } else if (anyPaid) {
            overallStatus = "Partial";
          } else {
            overallStatus = "Pending";
          }
          
          // Collect all unique courses
          const allCourses = [...new Set(admissions.flatMap(adm => adm.courses))];
          
          // Collect all certificates from all admissions + rootCerts
          const allCertificates = admissions.flatMap(adm => adm.certificates);
          rootCerts.forEach(rc => {
            if (!allCertificates.some(c => c.certificatePath === rc.certificatePath || c.id === rc.id)) {
              allCertificates.push(rc);
            }
          });
          
          // Collect and normalize all payments from admissions and item.fee
          const allPaymentsList: any[] = [];
          admissions.forEach(adm => {
            if (Array.isArray(adm.payments)) {
              adm.payments.forEach((p: any) => {
                if (p && (Number(p.amount) > 0 || p.date)) {
                  const amt = Number(p.amount) || 0;
                  const utr = String(p.utrNumber || p.utr_Number || "").trim();
                  const meth = p.paymentMethod || p.payment_method || (utr ? "Online" : "Cash");
                  allPaymentsList.push({
                    id: p._id || p.id,
                    amount: amt,
                    paymentMethod: meth,
                    payment_method: meth,
                    utrNumber: utr,
                    utr_Number: utr,
                    date: p.date ? new Date(p.date).toISOString() : new Date().toISOString()
                  });
                }
              });
            }
          });

          if (Array.isArray(item.fee)) {
            item.fee.forEach((f: any) => {
              if (f && (Number(f.amount) > 0 || f.date)) {
                const amt = Number(f.amount) || 0;
                const utr = String(f.utr_Number || f.utrNumber || "").trim();
                const dateStr = f.date ? new Date(f.date).toISOString().split('T')[0] : "";
                const exists = allPaymentsList.some(existing => {
                  const exUtr = (existing.utrNumber || "").trim();
                  if (utr && exUtr && utr.toLowerCase() === exUtr.toLowerCase()) return true;
                  const exDateStr = existing.date ? new Date(existing.date).toISOString().split('T')[0] : "";
                  return existing.amount === amt && exDateStr === dateStr;
                });
                if (!exists) {
                  const meth = f.payment_method || f.paymentMethod || (utr ? "Online" : "Cash");
                  allPaymentsList.push({
                    id: f._id || f.id,
                    amount: amt,
                    paymentMethod: meth,
                    payment_method: meth,
                    utrNumber: utr,
                    utr_Number: utr,
                    date: f.date ? new Date(f.date).toISOString() : new Date().toISOString()
                  });
                }
              }
            });
          }

          allPaymentsList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

          const totalInstallmentCount = Math.max(
            Number(item.fee_installment) || 0,
            admissions.reduce((sum, adm) => sum + (Number(adm.feesInstallment) || 0), 0),
            allPaymentsList.length
          );

          return {
            id: item.student_ID,
            name: item.student_name,
            feesStatus: overallStatus,
            course: allCourses,
            duration: admissions[0]?.courseDuration || "N/A",
            totalFees,
            paidFees: totalPaidFees,
            pendingFees: totalPendingFees,
            email: item.email,
            phone: item.phone,
            address: item.address,
            startDate: admissions[0]?.startDate || "",
            endDate: admissions[admissions.length - 1]?.endDate || "",
            feesInstallment: totalInstallmentCount,
            fee: allPaymentsList,
            certificates: allCertificates,
            admissions,
            referredByName: item.referredByName,
            referredByPhone: item.referredByPhone,
            referredByEmail: item.referredByEmail,
            referredAmount: Number(item.referredAmount) || 0,
            password: item.password || item.plain_password || (item.student_name ? `${(item.student_name || '').trim().split(' ')[0]}@123` : "")
          };
        });
        setAllStudentsData(mapped);
        setExpandedStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch all students:", error);
    }
  };

  const fetchIssuedCertificates = async () => {
    try {
      const token = localStorage.getItem("adminAuthToken");
      const res = await fetch(getApiUrl("/certificateissuedStudentsData"), {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        const mapped = data.data.map((item: any) => ({
          studentId: item.student_ID,
          studentName: item.student_name,
          certificates: item.certificates || [],
          admissions: item.admissions || [],
          rawItem: item,
          issuedCourses: Array.isArray(item.issuedCourses) && item.issuedCourses.length > 0
            ? item.issuedCourses
            : (Array.isArray(item.selected_course_name) 
                ? item.selected_course_name 
                : (item.selected_course_name ? [item.selected_course_name] : ["N/A"]))
        }));
        setStudentsWithCertificates(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch issued certificates:", error);
    }
  };

  const [isCheckingCertificates, setIsCheckingCertificates] = useState(false);
  const [autoGeneratingId, setAutoGeneratingId] = useState<string | null>(null);
  const [downloadingCertId, setDownloadingCertId] = useState<string | null>(null);

  const handleDownloadCertificateDirect = async (studentId: string, studentName?: string, courseTitle?: string, directUrl?: string) => {
    setDownloadingCertId(`${studentId}_${courseTitle || ''}`);
    try {
      const courseParam = courseTitle || "";
      const filename = `Certificate_${(studentName || studentId).replace(/[^a-zA-Z0-9]/g, '_')}_${courseParam.replace(/[^a-zA-Z0-9]/g, '_')}.png`;

      // 1. If directUrl provided
      if (directUrl) {
        let fullUrl = directUrl;
        if (!directUrl.startsWith("http://") && !directUrl.startsWith("https://") && !directUrl.startsWith("data:") && !directUrl.startsWith("blob:")) {
          const clean = directUrl.startsWith("/") ? directUrl : `/${directUrl}`;
          fullUrl = `${API_BASE_URL}${clean}`;
        }
        try {
          const res = await fetch(fullUrl);
          if (res.ok) {
            const blob = await res.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
            return;
          }
        } catch (e) {
          // fallback
        }
      }

      // 2. Direct backend download endpoint
      const downloadEndpoint = getApiUrl(`/api/certificate/download?id=${encodeURIComponent(studentId)}&course=${encodeURIComponent(courseParam)}&force=1`);
      const link = document.createElement("a");
      link.href = downloadEndpoint;
      link.download = filename;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      console.error("Certificate download error:", err);
      alert("Error downloading certificate: " + (err.message || "Unknown error"));
    } finally {
      setDownloadingCertId(null);
    }
  };

  const handleSyncAndGenerateAll = async () => {
    setIsCheckingCertificates(true);
    try {
      const res = await fetch(getApiUrl("/api/certificate/generate-all"), {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || "Certificates checked and generated successfully!");
        fetchIssuedCertificates();
        fetchUnissuedCertificates();
        fetchDashboardData();
      } else {
        alert(data.message || "Failed to check certificates.");
      }
    } catch (e: any) {
      console.error(e);
      alert("Error checking certificates: " + (e.message || "Network error"));
    } finally {
      setIsCheckingCertificates(false);
    }
  };

  const handleDirectAutoGenerate = async (studentRow: Student) => {
    // STRICT RULE: Fees must be 100% clear AND course completed
    if (studentRow.feesStatus !== "Clear" || (studentRow.pendingFees && Number(studentRow.pendingFees) > 0)) {
      alert(`❌ Cannot generate certificate: Student's fee is pending (Pending: ₹${studentRow.pendingFees || 0}). Both Course Completion and 100% Fee Clearance are strictly required.`);
      return;
    }

    setAutoGeneratingId(studentRow.id);
    const courseTitle = Array.isArray(studentRow.course) ? studentRow.course[0] : studentRow.course;
    try {
      const res = await fetch(getApiUrl("/api/certificate/generate-student"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: studentRow.id,
          courseTitle: courseTitle,
          force: true
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`✅ Certificate for ${studentRow.name} generated successfully!`);
        fetchIssuedCertificates();
        fetchUnissuedCertificates();
        fetchDashboardData();
      } else {
        alert(data.message || "Failed to generate certificate.");
      }
    } catch (e: any) {
      console.error(e);
      alert("Error generating certificate: " + e.message);
    } finally {
      setAutoGeneratingId(null);
    }
  };

  const fetchUnissuedCertificates = async () => {
    try {
      const token = localStorage.getItem("adminAuthToken");
      const res = await fetch(getApiUrl("/certificateunissuedStudentsData"), {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        const mapped: Student[] = data.data.map((item: any) => ({
          id: item.student_ID,
          name: item.student_name,
          feesStatus: item.status,
          course: Array.isArray(item.selected_course_name) ? item.selected_course_name : (item.selected_course_name ? [item.selected_course_name] : ["N/A"]),
          duration: item.course_duration || "N/A",
          totalFees: Number(item.total_fee) || 0,
          paidFees: Number(item.total_paid_fee) || 0,
          pendingFees: Number(item.pending_fee) || 0,
          email: item.email,
          phone: item.phone,
          address: item.address,
          startDate: item.course_start_date 
            ? new Date(item.course_start_date).toISOString().split('T')[0] 
            : new Date().toISOString().split('T')[0],
          endDate: item.course_end_date 
            ? new Date(item.course_end_date).toISOString().split('T')[0] 
            : (() => {
                const date = new Date();
                date.setMonth(date.getMonth() + 3);
                return date.toISOString().split('T')[0];
              })(),
          feesInstallment: item.fee_installment,
          fee: item.fee
        }));
        setUnissuedCertificatesData(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch unissued certificates:", error);
    }
  };

  const fetchPendingFeeStudents = async () => {
    try {
      const token = localStorage.getItem("adminAuthToken");
      const res = await fetch(getApiUrl("/pandingfeeStudentsData"), {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        const mapped: Student[] = data.data.map((item: any) => ({
          id: item.student_ID,
          name: item.student_name,
          feesStatus: item.status,
          course: Array.isArray(item.selected_course_name) ? item.selected_course_name : (item.selected_course_name ? [item.selected_course_name] : ["N/A"]),
          duration: item.course_duration || "N/A",
          totalFees: Number(item.total_fee) || 0,
          paidFees: Number(item.total_paid_fee) || 0,
          pendingFees: Number(item.pending_fee) || 0,
          email: item.email,
          phone: item.phone,
          address: item.address,
          startDate: item.course_start_date,
          endDate: item.course_end_date,
          certificateUrl: ""
        }));
        setPendingFeeStudentsData(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch pending fee students:", error);
    }
  };

  const fetchClearFeeStudents = async () => {
    try {
      const token = localStorage.getItem("adminAuthToken");
      const res = await fetch(getApiUrl("/clearfeeStudentsData"), {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        const mapped: Student[] = data.data.map((item: any) => ({
          id: item.student_ID,
          name: item.student_name,
          feesStatus: item.status,
          course: Array.isArray(item.selected_course_name) ? item.selected_course_name : (item.selected_course_name ? [item.selected_course_name] : ["N/A"]),
          duration: item.course_duration || "N/A",
          totalFees: Number(item.total_fee) || 0,
          paidFees: Number(item.total_paid_fee) || 0,
          pendingFees: Number(item.pending_fee) || 0,
          email: item.email,
          phone: item.phone,
          address: item.address,
          startDate: item.course_start_date 
            ? new Date(item.course_start_date).toISOString().split('T')[0] 
            : new Date().toISOString().split('T')[0],
          endDate: item.course_end_date 
            ? new Date(item.course_end_date).toISOString().split('T')[0] 
            : (() => {
                const date = new Date();
                date.setMonth(date.getMonth() + 3);
                return date.toISOString().split('T')[0];
              })(),
          feesInstallment: item.fee_installment,
          fee: item.fee
        }));
        setClearFeeStudentsData(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch clear fee students:", error);
    }
  };

  const fetchEarningsDetails = async () => {
    try {
      const token = localStorage.getItem("adminAuthToken");
      const res = await fetch(getApiUrl("/totalEarningsDetails"), {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setEarningsDetailsData(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch earnings details:", error);
    }
  };


  const fetchReferrers = async () => {
    try {
      const token = localStorage.getItem("adminAuthToken");
      const res = await fetch(getApiUrl("/getAllReferrers"), {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setReferrers(Array.isArray(data.data) ? data.data : []);
      }
    } catch (error) {
      console.error("Failed to fetch referrers:", error);
    }
  };

  const fetchDeletedReferrers = async () => {
    try {
      const token = localStorage.getItem("adminAuthToken");
      const res = await fetch(getApiUrl("/getDeletedReferrers"), {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setDeletedReferrers(Array.isArray(data.data) ? data.data : []);
      }
    } catch (error) {
      console.error("Failed to fetch deleted referrers:", error);
    }
  };

  useEffect(() => {
    setDetailSearch("");
    setDetailStatusFilter("All");
    setEarningsFilter("received");
    if (expandedStat === "total-students") {
      fetchAllStudents();
    } else if (expandedStat === "certificate-issued") {
      fetchIssuedCertificates();
    } else if (expandedStat === "certificate-unissued") {
      fetchUnissuedCertificates();
    } else if (expandedStat === "total-pending-fees") {
      fetchPendingFeeStudents();
    } else if (expandedStat === "total-clear-fees") {
      fetchClearFeeStudents();
    } else if (expandedStat === "total-earnings") {
      fetchEarningsDetails();
      fetchPendingFeeStudents();
      fetchAllStudents();
    }
  }, [expandedStat]);

  useEffect(() => {
    if (activeTab === "referred-by") {
      fetchReferrers();
    } else if (activeTab === "deleted-referrers") {
      fetchDeletedReferrers();
    } else if (activeTab === "deleted-students") {
      fetchDeletedStudents();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("adminAuthToken");
      const res = await fetch(getApiUrl("/admin_dashboardGet"), {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        const mappedStudents: Student[] = data.tcData.map((item: any) => {
          // Extract root-level certificates
          const rootCerts: any[] = (item.certificates && Array.isArray(item.certificates))
            ? item.certificates.map((cert: any, idx: number) => {
                const cPath = cert.certificatePath || cert.certificate_path || cert.url || "";
                return {
                  id: cert.id || (cert._id ? cert._id.toString() : `cert-${item.student_ID}-${idx}`),
                  courseName: cert.courseName || cert.course_name || "Course Certificate",
                  url: cPath,
                  certificatePath: cPath,
                  date: cert.issuedAt || cert.issued_at || cert.date ? new Date(cert.issuedAt || cert.issued_at || cert.date).toISOString() : new Date().toISOString()
                };
              })
            : [];

          if (item.certificate_photo && !rootCerts.some(c => c.url === item.certificate_photo || c.certificatePath === item.certificate_photo)) {
            rootCerts.push({
              id: `cert-${item.student_ID}-old`,
              courseName: Array.isArray(item.selected_course_name) ? item.selected_course_name[0] : item.selected_course_name || "Course",
              url: item.certificate_photo,
              certificatePath: item.certificate_photo,
              date: item.created_at ? new Date(item.created_at).toISOString() : new Date().toISOString()
            });
          }

          // Map admissions if available
          let admissions: any[] = [];
          if (item.admissions && item.admissions.length > 0) {
            admissions = item.admissions.map((adm: any) => {
              const admCourses = (Array.isArray(adm.courses) ? adm.courses : (adm.selected_course_name ? (Array.isArray(adm.selected_course_name) ? adm.selected_course_name : [adm.selected_course_name]) : [])).map((c: string) => (c || '').toLowerCase().trim());

              let admCerts = adm.certificates ? adm.certificates.map((cert: any, idx: number) => {
                const cPath = cert.certificatePath || cert.certificate_path || cert.url || "";
                return {
                  id: cert.id || (cert._id ? cert._id.toString() : `cert-${item.student_ID}-${adm.admission_id || adm.admissionId}-${idx}`),
                  courseName: cert.courseName || cert.course_name || "Course Certificate",
                  url: cPath,
                  certificatePath: cPath,
                  date: cert.issuedAt || cert.issued_at || cert.date ? new Date(cert.issuedAt || cert.issued_at || cert.date).toISOString() : new Date().toISOString()
                };
              }) : [];

              // Merge any matching root certificates
              if (rootCerts.length > 0) {
                rootCerts.forEach(rc => {
                  const rcName = (rc.courseName || '').toLowerCase().trim();
                  const matches = (item.admissions.length === 1) || admCourses.some((ac: string) =>
                    ac === rcName ||
                    ac.includes(rcName) ||
                    rcName.includes(ac) ||
                    (ac.includes('creative') && rcName.includes('creative')) ||
                    (ac.includes('seo') && rcName.includes('seo')) ||
                    (ac.includes('master') && rcName.includes('master')) ||
                    (ac.includes('graphic') && rcName.includes('graphic')) ||
                    (ac.includes('video') && rcName.includes('video'))
                  );
                  const exists = admCerts.some((c: any) => c.certificatePath === rc.certificatePath || (c.courseName && c.courseName.toLowerCase().trim() === rcName));
                  if (matches && !exists) {
                    admCerts.push(rc);
                  }
                });
              }

              return {
                admissionId: adm.admission_id || adm.admissionId || `adm-${Date.now()}`,
                courses: Array.isArray(adm.courses) ? adm.courses : (adm.selected_course_name ? (Array.isArray(adm.selected_course_name) ? adm.selected_course_name : [adm.selected_course_name]) : []),
                courseDuration: adm.course_duration || adm.courseDuration || "N/A",
                totalFee: Number(adm.total_fee) || Number(adm.totalFee) || 0,
                totalPaidFee: Number(adm.total_paid_fee) || Number(adm.totalPaidFee) || 0,
                pendingFee: Number(adm.pending_fee) || Number(adm.pendingFee) || 0,
                feesStatus: adm.status || adm.feesStatus || "Pending",
                feesInstallment: Number(adm.fee_installment) || Number(adm.feesInstallment) || 0,
                payments: adm.payments || [],
                certificates: admCerts,
                startDate: adm.course_start_date 
                  ? new Date(adm.course_start_date).toISOString().split('T')[0] 
                  : (adm.startDate 
                      ? (typeof adm.startDate === 'string' 
                          ? new Date(adm.startDate).toISOString().split('T')[0] 
                          : new Date(adm.startDate).toISOString().split('T')[0])
                      : new Date().toISOString().split('T')[0]),
                endDate: adm.course_end_date 
                  ? new Date(adm.course_end_date).toISOString().split('T')[0] 
                  : (adm.endDate 
                      ? (typeof adm.endDate === 'string' 
                          ? new Date(adm.endDate).toISOString().split('T')[0] 
                          : new Date(adm.endDate).toISOString().split('T')[0])
                      : (() => {
                          const date = new Date();
                          date.setMonth(date.getMonth() + 3);
                          return date.toISOString().split('T')[0];
                        })()),
                createdAt: adm.created_at || new Date().toISOString(),
                updatedAt: adm.updated_at || new Date().toISOString()
              };
            });
          }
          
          // If no admissions, create a default one from the old structure for backward compatibility
          if (admissions.length === 0) {
            let certificates = [...rootCerts];
            
            admissions.push({
              admissionId: `adm-${item.student_ID}-default`,
              courses: Array.isArray(item.selected_course_name) ? item.selected_course_name : (item.selected_course_name ? [item.selected_course_name] : ["N/A"]),
              courseDuration: item.course_duration || "3 Months",
              totalFee: Number(item.total_fee) || 0,
              totalPaidFee: Number(item.total_paid_fee) || 0,
              pendingFee: Number(item.pending_fee) || 0,
              feesStatus: item.status || "Pending",
              feesInstallment: Number(item.fee_installment) || 0,
              payments: item.fee || [],
              certificates,
              startDate: item.course_start_date ? new Date(item.course_start_date).toISOString().split('T')[0] : "",
              endDate: item.course_end_date ? new Date(item.course_end_date).toISOString().split('T')[0] : "",
              createdAt: item.created_at || new Date().toISOString(),
              updatedAt: item.updated_at || new Date().toISOString()
            });
          }
          
          // Calculate totals from admissions
          const totalFees = admissions.reduce((sum, adm) => sum + adm.totalFee, 0);
          const totalPaidFees = admissions.reduce((sum, adm) => sum + adm.totalPaidFee, 0);
          const totalPendingFees = admissions.reduce((sum, adm) => sum + adm.pendingFee, 0);
          
          // Determine overall fees status
          let overallStatus: "Clear" | "Pending" | "Partial" = "Pending";
          const allClear = admissions.length > 0 
            ? admissions.every(adm => adm.feesStatus === "Clear" || Number(adm.pendingFee) <= 0)
            : (totalPendingFees <= 0 && totalFees > 0);
          const anyPaid = admissions.some(adm => Number(adm.totalPaidFee) > 0) || totalPaidFees > 0;
          if (allClear || (totalPendingFees <= 0 && totalFees > 0)) {
            overallStatus = "Clear";
          } else if (anyPaid) {
            overallStatus = "Partial";
          } else {
            overallStatus = "Pending";
          }
          
          // Collect all unique courses
          const allCourses = [...new Set(admissions.flatMap(adm => adm.courses))];
          
          // Collect all certificates from all admissions + rootCerts
          const allCertificates = admissions.flatMap(adm => adm.certificates);
          rootCerts.forEach(rc => {
            if (!allCertificates.some(c => c.certificatePath === rc.certificatePath || c.id === rc.id)) {
              allCertificates.push(rc);
            }
          });
          
          // Collect and normalize all payments from admissions and item.fee
          const allPaymentsList: any[] = [];
          admissions.forEach(adm => {
            if (Array.isArray(adm.payments)) {
              adm.payments.forEach((p: any) => {
                if (p && (Number(p.amount) > 0 || p.date)) {
                  const amt = Number(p.amount) || 0;
                  const utr = String(p.utrNumber || p.utr_Number || "").trim();
                  const meth = p.paymentMethod || p.payment_method || (utr ? "Online" : "Cash");
                  allPaymentsList.push({
                    id: p._id || p.id,
                    amount: amt,
                    paymentMethod: meth,
                    payment_method: meth,
                    utrNumber: utr,
                    utr_Number: utr,
                    date: p.date ? new Date(p.date).toISOString() : new Date().toISOString()
                  });
                }
              });
            }
          });

          if (Array.isArray(item.fee)) {
            item.fee.forEach((f: any) => {
              if (f && (Number(f.amount) > 0 || f.date)) {
                const amt = Number(f.amount) || 0;
                const utr = String(f.utr_Number || f.utrNumber || "").trim();
                const dateStr = f.date ? new Date(f.date).toISOString().split('T')[0] : "";
                const exists = allPaymentsList.some(existing => {
                  const exUtr = (existing.utrNumber || "").trim();
                  if (utr && exUtr && utr.toLowerCase() === exUtr.toLowerCase()) return true;
                  const exDateStr = existing.date ? new Date(existing.date).toISOString().split('T')[0] : "";
                  return existing.amount === amt && exDateStr === dateStr;
                });
                if (!exists) {
                  const meth = f.payment_method || f.paymentMethod || (utr ? "Online" : "Cash");
                  allPaymentsList.push({
                    id: f._id || f.id,
                    amount: amt,
                    paymentMethod: meth,
                    payment_method: meth,
                    utrNumber: utr,
                    utr_Number: utr,
                    date: f.date ? new Date(f.date).toISOString() : new Date().toISOString()
                  });
                }
              }
            });
          }

          allPaymentsList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

          const totalInstallmentCount = Math.max(
            Number(item.fee_installment) || 0,
            admissions.reduce((sum, adm) => sum + (Number(adm.feesInstallment) || 0), 0),
            allPaymentsList.length
          );

          return {
            id: item.student_ID,
            name: item.student_name,
            feesStatus: overallStatus,
            course: allCourses,
            duration: admissions[0]?.courseDuration || "3 Months",
            totalFees,
            paidFees: totalPaidFees,
            pendingFees: totalPendingFees,
            email: item.email,
            phone: item.phone,
            address: item.address,
            startDate: admissions[0]?.startDate || "",
            endDate: admissions[admissions.length - 1]?.endDate || "",
            feesInstallment: totalInstallmentCount,
            fee: allPaymentsList,
            certificates: allCertificates,
            admissions,
            referredByName: item.referredByName,
            referredByPhone: item.referredByPhone,
            referredByEmail: item.referredByEmail,
            referredAmount: Number(item.referredAmount) || 0,
            password: item.password || item.plain_password || (item.student_name ? `${(item.student_name || '').trim().split(' ')[0]}@123` : "")
          };
        });
        
        setStudents(mappedStudents);
        setStats({
          totalStudents: data.stats.total_students,
          unissuedCertificates: data.stats.total_unissued_certificates,
          certificatesIssued: data.stats.total_issued_certificates,
          totalEarnings: data.stats.net_earnings || data.stats.total_earnings,
          totalClearFees: data.stats.clear_fee_students,
          pendingFees: data.stats.unclear_fee_students,
          totalReferralPaid: data.stats.total_referral_paid || 0
        });
        if (data.adminEmail) {
          setAdminEmail(data.adminEmail);
          localStorage.setItem("adminEmail", data.adminEmail);
        }
        if (data.adminName) {
          setAdminName(data.adminName);
          localStorage.setItem("adminName", data.adminName);
        }
        // Ensure graphData is always a continuous 8-month timeline on frontend
        let rawGraphData: any[] = data.graphData || [];
        const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const now = new Date();
        const formattedGraphData: any[] = [];

        for (let i = 7; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const m = d.getMonth();
          const y = d.getFullYear();
          const monthLabel = `${monthsShort[m]} ${y}`;

          const match = rawGraphData.find((item: any) => {
            if (!item || !item.month) return false;
            const str = String(item.month).toLowerCase();
            return str.includes(monthsShort[m].toLowerCase());
          });

          formattedGraphData.push({
            month: monthLabel,
            monthShort: monthsShort[m],
            newStudents: match ? Number(match.newStudents || 0) : 0,
            earnings: match ? Number(match.earnings || 0) : 0
          });
        }

        setGraphData(formattedGraphData);
        setTopCourses(data.top_courses || []);
        setGlobalReferralAmount(data.referrel_amount?.toString() || "0");
        setStudentsWithCertificates(data.studentsWithCertificates || []);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  const handleSetReferralAmount = async () => {
    try {
      const token = localStorage.getItem("adminAuthToken");
      const res = await fetch(getApiUrl("/updateReferralAmount"), {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ amount: Number(globalReferralAmount) })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setIsSetAmountModalOpen(false);
      } else {
        alert(data.message || "Failed to update amount");
      }
    } catch (error) {
      console.error("Error updating referral amount:", error);
      alert("An error occurred while updating referral amount");
    }
  };

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminAuthToken");
    const authTime = localStorage.getItem("adminAuthTime");
    
    if (!token) {
      navigate("/admin/login");
      return;
    }
    if (authTime && Date.now() - parseInt(authTime) > 3600000) {
      localStorage.removeItem("adminAuthToken");
      localStorage.removeItem("adminAuthTime");
      navigate("/admin/login");
      return;
    }
    
    Promise.all([
      fetchDashboardData(), 
      fetchNotifications(),
      fetchAllStudents(),
      fetchPendingFeeStudents(),
      fetchClearFeeStudents(),
      fetchEarningsDetails()
    ]).finally(() => {
      setIsInitialLoading(false);
    });
    
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("adminAuthToken");
      if (token) {
        await fetch(getApiUrl("/admin_logout"), {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("adminAuthToken");
      localStorage.removeItem("adminAuthTime");
      localStorage.removeItem("rw_students");
      localStorage.removeItem("rw_inquiries");
      navigate("/");
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = s.id.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase());
      let matchesStatus = true;
      if (statusFilter === "Clear") {
        matchesStatus = Number(s.pendingFees) <= 0 && s.feesStatus !== "Pending";
      } else if (statusFilter === "Pending") {
        matchesStatus = Number(s.pendingFees) > 0 || s.feesStatus === "Pending" || s.feesStatus === "Partial";
      }
      return matchesSearch && matchesStatus;
    });
  }, [students, search, statusFilter]);

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (window.confirm(`Are you sure you want to delete student "${studentName}" (${studentId})? This action cannot be undone.`)) {
      try {
        const token = localStorage.getItem("adminAuthToken");
        const res = await fetch(getApiUrl(`/deleteStudent/${studentId}`), {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          alert(data.message || "Student deleted successfully");
          fetchDashboardData();
          fetchAllStudents();
          if (expandedStat === "certificate-issued") fetchIssuedCertificates();
          if (expandedStat === "certificate-unissued") fetchUnissuedCertificates();
          if (expandedStat === "total-pending-fees") fetchPendingFeeStudents();
          if (expandedStat === "total-clear-fees") fetchClearFeeStudents();
        } else {
          alert(data.message || "Failed to delete student");
        }
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("An error occurred while deleting the student.");
      }
    }
  };

  const handleSaveStudent = (updated: Student, openInvoice = false) => {
    if (editingStudent) {
      setStudents(students.map(s => s.id === editingStudent.id ? updated : s));
    } else {
      setStudents([updated, ...students]);
    }
    setIsStudentModalOpen(false);
    setEditingStudent(null);
    if (openInvoice) {
      setInvoicingStudent({ student: updated });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f5f8] text-neutral-900 selection:bg-blue-100 font-sans flex flex-col relative overflow-x-hidden">
      
      {/* Mobile Slide-over Drawer Backdrop & Panel */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div 
            className="w-72 max-w-[85vw] bg-white h-full p-5 sm:p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
                <div className="flex items-center gap-2.5">
                  <img 
                    src="/logo/RIZE_LOGO_CROPPED.png" 
                    alt="RizeWorld Institute" 
                    className="h-8 w-auto object-contain" 
                  />
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                  aria-label="Close navigation menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Primary Action Button: + Add Student on Mobile */}
              <div className="mb-4">
                <button
                  onClick={() => {
                    setEditingStudent(null);
                    setIsStudentModalOpen(true);
                    setIsSidebarOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Plus size={18} className="stroke-[2.5]" />
                  <span>+ Add Student</span>
                </button>
              </div>

              <div className="space-y-1.5">
                <button
                  onClick={() => { navigate("/admin/dashboard/dashboard"); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === "dashboard" ? "bg-[#18181b] text-white shadow-xs" : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <LayoutDashboard size={18} /> Dashboard
                </button>
                <button
                  onClick={() => { navigate("/admin/dashboard/student-crm"); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === "student-crm" || activeTab === "student-leads" ? "bg-[#18181b] text-white shadow-xs" : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <Target size={18} /> Student Leads CRM
                </button>
                <button
                  onClick={() => { navigate("/admin/dashboard/inquiry"); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === "inquiry" ? "bg-[#18181b] text-white shadow-xs" : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <MessagesSquare size={18} /> Inquiries
                </button>
                <button
                  onClick={() => { navigate("/admin/dashboard/referred-by"); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === "referred-by" ? "bg-[#18181b] text-white shadow-xs" : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <UserCircle size={18} /> Referred By
                </button>
                <button
                  onClick={() => { navigate("/admin/dashboard/deleted-referrers"); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === "deleted-referrers" ? "bg-[#18181b] text-white shadow-xs" : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <UserX size={18} /> Deleted Referrers
                </button>
                <button
                  onClick={() => { navigate("/admin/dashboard/deleted-students"); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === "deleted-students" ? "bg-[#18181b] text-white shadow-xs" : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <UserMinus size={18} /> Deleted Students
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 mt-6 space-y-3">
              {/* Profile Details in Drawer */}
              <div className="flex items-center gap-3 px-2 py-1 bg-neutral-50 rounded-xl p-2.5 border border-neutral-100">
                <div className="w-9 h-9 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                  {adminInitials}
                </div>
                <div className="text-left overflow-hidden min-w-0 flex-1">
                  <div className="text-xs font-bold text-neutral-900 leading-tight truncate">{adminName}</div>
                  <div className="text-[11px] text-neutral-400 font-medium truncate">{adminEmail}</div>
                </div>
              </div>

              <button 
                onClick={() => { setIsSidebarOpen(false); setIsLogoutModalOpen(true); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 font-semibold hover:bg-red-50 rounded-xl transition-all cursor-pointer"
              >
                <LogOut size={18} /> Logout Securely
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Pill Top Navbar matching Mockup */}
      <header className="sticky top-2 sm:top-3 z-40 w-full max-w-[1520px] mx-auto px-2 sm:px-6 pt-1 mb-3 sm:mb-6">
        <div className="bg-white rounded-2xl md:rounded-full px-2.5 sm:px-6 py-1.5 sm:py-3 border border-neutral-200/80 shadow-xs flex items-center justify-between gap-1.5 sm:gap-3 backdrop-blur-xl">
          {/* Brand on Left */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu size={18} className="sm:w-5 sm:h-5" />
            </button>
            <div 
              onClick={() => navigate("/admin/dashboard/dashboard")} 
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group py-0.5"
            >
              <img 
                src="/logo/RIZE_LOGO_CROPPED.png" 
                alt="RizeWorld Institute" 
                className="h-7 sm:h-10 md:h-11 w-auto max-w-[105px] sm:max-w-none object-contain transition-transform group-hover:scale-[1.02]" 
              />
              <div className="hidden sm:flex flex-col border-l border-neutral-200/80 pl-3">
                <span className="text-[13px] font-black tracking-tight text-neutral-900 leading-tight">RizeWorld</span>
                <span className="text-[10px] font-medium text-neutral-400">Institute Portal</span>
              </div>
            </div>
          </div>

          {/* Right Controls: Notifications, Logout, User Profile Badge */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
             <div className="relative">
                <button 
                  onClick={() => {
                    const nextOpen = !isNotificationsOpen;
                    setIsNotificationsOpen(nextOpen);
                    if (nextOpen) {
                      const feeCount = paymentReminders?.length || 0;
                      const dueCount = followupReminders?.due?.length || 0;
                      const todayCount = followupReminders?.today?.length || 0;
                      const upcomingCount = followupReminders?.upcoming?.length || 0;

                      if (feeCount > 0 && dueCount === 0 && todayCount === 0) {
                        setNotifTab("fees");
                      } else if (todayCount > 0) {
                        setNotifTab("today");
                      } else if (dueCount > 0) {
                        setNotifTab("due");
                      } else if (feeCount > 0) {
                        setNotifTab("fees");
                      } else if (upcomingCount > 0) {
                        setNotifTab("upcoming");
                      } else {
                        setNotifTab("inquiries");
                      }
                    }
                  }} 
                  className="relative p-1.5 sm:p-2.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
                  title="Notifications, Follow-up Reminders & Fee Dues"
                >
                  <Bell size={18} className="sm:w-[21px] sm:h-[21px]" />
                  {(() => {
                    const unreadInq = (notifications || []).filter(n => !n?.isRead).length;
                    const dueCount = followupReminders?.due?.length || 0;
                    const todayCount = followupReminders?.today?.length || 0;
                    const feeCount = paymentReminders?.length || 0;
                    const totalUrgent = dueCount + todayCount + feeCount + unreadInq;

                    if (totalUrgent === 0) return null;

                    return (
                      <span className={`absolute top-0 right-0 sm:top-0.5 sm:right-0.5 min-w-[17px] h-[17px] sm:min-w-[20px] sm:h-[20px] px-0.5 sm:px-1 text-[10px] sm:text-[11px] font-black text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse ${
                        (feeCount > 0 || dueCount > 0) ? "bg-red-600" : todayCount > 0 ? "bg-amber-500" : "bg-blue-600"
                      }`}>
                        {totalUrgent > 99 ? "99+" : totalUrgent}
                      </span>
                    );
                  })()}
                </button>
                
                {isNotificationsOpen && (
                  <>
                    {/* Backdrop to close when clicking outside */}
                    <div 
                      className="fixed inset-0 z-40 bg-neutral-900/20 backdrop-blur-[1px]"
                      onClick={() => setIsNotificationsOpen(false)}
                    />

                    <div className="fixed sm:absolute top-14 sm:top-full left-2 right-2 sm:left-auto sm:right-0 mt-2 sm:mt-3 w-auto sm:w-[620px] md:w-[680px] max-w-[96vw] bg-white border border-neutral-200/90 shadow-2xl rounded-[22px] sm:rounded-[28px] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 flex flex-col">
                      
                      {/* Modern Header */}
                      <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/60">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-2xs border border-blue-100/60">
                            <Bell size={18} />
                          </div>
                          <div>
                            <h3 className="font-black text-neutral-900 text-sm sm:text-base tracking-tight">Notifications & Reminders</h3>
                            <p className="text-xs text-neutral-400 font-medium">Follow-ups, Fee dues & course inquiries</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                          {(paymentReminders?.length || 0) > 0 && (
                            <button
                              onClick={() => setNotifTab("fees")}
                              className={`text-xs font-black px-3 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                                notifTab === "fees"
                                  ? "bg-red-600 text-white border-red-600 shadow-xs"
                                  : "bg-red-50 text-red-700 border-red-200/70 hover:bg-red-100"
                              }`}
                              title="Click to view Fee Due Notifications"
                            >
                              <IndianRupee size={12} className="stroke-[3]" />
                              {paymentReminders?.length || 0} Fee Due
                            </button>
                          )}
                          {(followupReminders?.due?.length || 0) > 0 && (
                            <button
                              onClick={() => setNotifTab("due")}
                              className={`text-xs font-black px-3 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                                notifTab === "due"
                                  ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                                  : "bg-rose-50 text-rose-700 border-rose-200/70 hover:bg-rose-100"
                              }`}
                              title="Click to view Overdue Follow-ups"
                            >
                              <AlertTriangle size={12} />
                              {followupReminders?.due?.length || 0} Due
                            </button>
                          )}
                          {(followupReminders?.today?.length || 0) > 0 && (
                            <button
                              onClick={() => setNotifTab("today")}
                              className={`text-xs font-black px-3 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                                notifTab === "today"
                                  ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                                  : "bg-amber-50 text-amber-800 border-amber-200/70 hover:bg-amber-100"
                              }`}
                              title="Click to view Today's Follow-ups"
                            >
                              <Clock size={12} />
                              {followupReminders?.today?.length || 0} Today
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              fetchNotifications();
                            }}
                            title="Refresh notifications"
                            className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
                          >
                            <RefreshCw size={15} className={isNotifRefreshing ? "animate-spin text-blue-600" : ""} />
                          </button>
                          <button
                            onClick={() => setIsNotificationsOpen(false)}
                            title="Close"
                            className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Segmented Filter Pills Tab Bar */}
                      <div className="grid grid-cols-5 gap-1.5 p-2 bg-neutral-100/80 border-b border-neutral-200/60 text-xs font-bold">
                        {/* TODAY TAB */}
                        <button
                          onClick={() => setNotifTab("today")}
                          className={`py-2 px-1 rounded-xl text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                            notifTab === "today"
                              ? "bg-white text-amber-900 shadow-xs font-black"
                              : "text-neutral-600 hover:text-neutral-900 hover:bg-white/50"
                          }`}
                        >
                          <span className="flex items-center gap-1 text-[11px] font-bold">
                            <Clock size={13} className={notifTab === "today" ? "text-amber-600" : "text-neutral-400"} />
                            Today
                          </span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            (followupReminders?.today?.length || 0) > 0 ? "bg-amber-100 text-amber-900" : "bg-neutral-200/60 text-neutral-500"
                          }`}>
                            {followupReminders?.today?.length || 0}
                          </span>
                        </button>

                        {/* DUE TAB */}
                        <button
                          onClick={() => setNotifTab("due")}
                          className={`py-2 px-1 rounded-xl text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                            notifTab === "due"
                              ? "bg-white text-rose-800 shadow-xs font-black"
                              : "text-neutral-600 hover:text-neutral-900 hover:bg-white/50"
                          }`}
                        >
                          <span className="flex items-center gap-1 text-[11px] font-bold">
                            <AlertTriangle size={13} className={notifTab === "due" ? "text-rose-600" : "text-neutral-400"} />
                            Due
                          </span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            (followupReminders?.due?.length || 0) > 0 ? "bg-rose-100 text-rose-800 animate-pulse" : "bg-neutral-200/60 text-neutral-500"
                          }`}>
                            {followupReminders?.due?.length || 0}
                          </span>
                        </button>

                        {/* FEE DUES TAB */}
                        <button
                          onClick={() => setNotifTab("fees")}
                          className={`py-2 px-1 rounded-xl text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                            notifTab === "fees"
                              ? "bg-white text-red-700 shadow-xs font-black"
                              : "text-neutral-600 hover:text-neutral-900 hover:bg-white/50"
                          }`}
                        >
                          <span className="flex items-center gap-1 text-[11px] font-bold">
                            <IndianRupee size={13} className={notifTab === "fees" ? "text-red-600" : "text-neutral-400"} />
                            Fee Due
                          </span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            (paymentReminders?.length || 0) > 0 ? "bg-red-100 text-red-700 font-extrabold animate-pulse" : "bg-neutral-200/60 text-neutral-500"
                          }`}>
                            {paymentReminders?.length || 0}
                          </span>
                        </button>

                        {/* UPCOMING TAB */}
                        <button
                          onClick={() => setNotifTab("upcoming")}
                          className={`py-2 px-1 rounded-xl text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                            notifTab === "upcoming"
                              ? "bg-white text-blue-700 shadow-xs font-black"
                              : "text-neutral-600 hover:text-neutral-900 hover:bg-white/50"
                          }`}
                        >
                          <span className="flex items-center gap-1 text-[11px] font-bold">
                            <Calendar size={13} className={notifTab === "upcoming" ? "text-blue-600" : "text-neutral-400"} />
                            Upcoming
                          </span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            (followupReminders?.upcoming?.length || 0) > 0 ? "bg-blue-100 text-blue-800" : "bg-neutral-200/60 text-neutral-500"
                          }`}>
                            {followupReminders?.upcoming?.length || 0}
                          </span>
                        </button>

                        {/* INQUIRIES TAB */}
                        <button
                          onClick={() => setNotifTab("inquiries")}
                          className={`py-2 px-1 rounded-xl text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                            notifTab === "inquiries"
                              ? "bg-white text-neutral-900 shadow-xs font-black"
                              : "text-neutral-600 hover:text-neutral-900 hover:bg-white/50"
                          }`}
                        >
                          <span className="flex items-center gap-1 text-[11px] font-bold">
                            <Mail size={13} className={notifTab === "inquiries" ? "text-neutral-700" : "text-neutral-400"} />
                            Inquiries
                          </span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            (notifications || []).filter(n => !n?.isRead).length > 0 ? "bg-blue-100 text-blue-800" : "bg-neutral-200/60 text-neutral-500"
                          }`}>
                            {(notifications || []).filter(n => !n?.isRead).length}
                          </span>
                        </button>
                      </div>

                      {/* Content Area with Beautiful Cards */}
                      <div className="max-h-[540px] overflow-y-auto p-3 sm:p-4 space-y-3 bg-neutral-50/40">
                        {/* FOLLOW-UP TABS (TODAY, DUE, UPCOMING) */}
                        {(notifTab === "today" || notifTab === "due" || notifTab === "upcoming") && (() => {
                          const items = (followupReminders && Array.isArray(followupReminders[notifTab])) ? followupReminders[notifTab] : [];
                          if (!items || items.length === 0) {
                            return (
                              <div className="py-12 px-6 text-center bg-white rounded-2xl border border-neutral-200/70 shadow-2xs">
                                <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3.5 shadow-2xs ${
                                  notifTab === "due" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                  notifTab === "today" ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                                }`}>
                                  {notifTab === "due" ? <CheckCircle2 size={26} /> : notifTab === "today" ? <Clock size={26} /> : <Calendar size={26} />}
                                </div>
                                <h4 className="font-black text-neutral-900 text-sm sm:text-base">
                                  {notifTab === "due" ? "No Overdue Follow-ups 🎉" :
                                   notifTab === "today" ? "No Follow-ups For Today" :
                                   "No Upcoming Follow-ups"}
                                </h4>
                                <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto font-medium">
                                  {notifTab === "due" ? "Great job! All student follow-up schedules are currently up to date." :
                                   notifTab === "today" ? "No students are scheduled for follow-up today." :
                                   "No future follow-up dates scheduled yet."}
                                </p>
                              </div>
                            );
                          }

                          return items.map((item, idx) => {
                            const cleanPhone = String(item?.phone || "").replace(/\D/g, "");
                            const studentName = String(item?.student_name || "Student");
                            const studentInitial = studentName.charAt(0).toUpperCase() || "S";
                            const leadId = item?.lead_ID || "";
                            const followupRound = item?.followup_round || item?.status || "";
                            const followupBy = item?.next_followup_by || "Staff";
                            const course = item?.interested_course || "Course N/A";
                            const notes = item?.conversation_notes || "";
                            const dateStr = item?.next_followup_date || "";
                            const category = item?.category || (notifTab as "today" | "due" | "upcoming");

                            return (
                              <div
                                key={item?.id || item?._id || idx}
                                className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 shadow-2xs hover:shadow-sm ${
                                  category === "due"
                                    ? "border-rose-200/90 border-l-[5px] border-l-rose-500 hover:border-rose-300"
                                    : category === "today"
                                    ? "border-amber-200/90 border-l-[5px] border-l-amber-500 hover:border-amber-300"
                                    : "border-neutral-200/90 border-l-[5px] border-l-blue-500 hover:border-blue-300"
                                }`}
                              >
                                {/* Header Row: Student Avatar + Name + Category Status Badge */}
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs text-white shrink-0 shadow-2xs ${
                                      category === "due" ? "bg-gradient-to-tr from-rose-600 to-pink-500" :
                                      category === "today" ? "bg-gradient-to-tr from-amber-600 to-orange-500" :
                                      "bg-gradient-to-tr from-blue-600 to-indigo-600"
                                    }`}>
                                      {studentInitial}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-black text-neutral-900 text-sm sm:text-base leading-tight">
                                          {studentName}
                                        </span>
                                        {leadId && (
                                          <span className="text-[11px] font-mono font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full shrink-0">
                                            {leadId}
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                                        <span className="inline-flex items-center gap-1 font-semibold text-neutral-700">
                                          <Phone size={12} className="text-neutral-400" />
                                          {cleanPhone || "N/A"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <span className={`text-[11px] font-black px-3 py-1 rounded-full shrink-0 flex items-center gap-1 ${
                                    category === "due"
                                      ? "bg-rose-100 text-rose-800 border border-rose-200"
                                      : category === "today"
                                      ? "bg-amber-100 text-amber-900 border border-amber-200"
                                      : "bg-blue-50 text-blue-700 border border-blue-200"
                                  }`}>
                                    {category === "due" && <AlertTriangle size={12} />}
                                    {category === "today" && <Clock size={12} />}
                                    {category === "upcoming" && <Calendar size={12} />}
                                    {category === "due" ? "Overdue" : category === "today" ? "Today" : "Upcoming"}
                                  </span>
                                </div>

                                {/* Detail Chips Row */}
                                <div className="flex items-center flex-wrap gap-2 text-xs text-neutral-600 mt-3.5">
                                  {/* Follow-up taken by */}
                                  <div className="inline-flex items-center gap-1.5 bg-neutral-100/80 px-2.5 py-1 rounded-xl text-neutral-700 font-semibold border border-neutral-200/50">
                                    <UserCheck size={13} className="text-blue-600 shrink-0" />
                                    <span>Follow-up by: <strong className="text-neutral-900 font-bold">{followupBy}</strong></span>
                                  </div>

                                  {/* Course */}
                                  {course && course !== "Course N/A" && (
                                    <span className="inline-flex items-center gap-1 bg-neutral-100/80 px-2.5 py-1 rounded-xl text-neutral-700 font-semibold border border-neutral-200/50 truncate max-w-[220px]">
                                      🎓 {course}
                                    </span>
                                  )}

                                  {/* Followup Round */}
                                  {followupRound && (
                                    <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-200/70">
                                      {followupRound}
                                    </span>
                                  )}

                                  {/* Scheduled Date/Time */}
                                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl ${
                                    category === "due" ? "text-rose-700 bg-rose-50 border border-rose-200/60" :
                                    category === "today" ? "text-amber-800 bg-amber-50 border border-amber-200/60" :
                                    "text-blue-700 bg-blue-50 border border-blue-200/60"
                                  }`}>
                                    <Clock size={12} />
                                    {formatFollowupSchedule(dateStr, category)}
                                  </span>
                                </div>

                                {/* Conversation Notes */}
                                {notes && (
                                  <div className="text-xs text-neutral-700 italic bg-neutral-50/80 border border-neutral-200/60 rounded-xl px-3 py-2 mt-3 flex items-start gap-2">
                                    <MessageSquare size={13} className="text-neutral-400 shrink-0 mt-0.5" />
                                    <span className="line-clamp-2 font-medium">"{notes}"</span>
                                  </div>
                                )}

                                {/* Action Buttons Footer */}
                                <div className="flex items-center justify-between pt-3 mt-3 border-t border-neutral-100" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex items-center gap-2">
                                    {cleanPhone && (
                                      <>
                                        <a
                                          href={`tel:${cleanPhone}`}
                                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors cursor-pointer"
                                          title="Call student"
                                        >
                                          <Phone size={12} className="text-blue-600" />
                                          <span>Call</span>
                                        </a>
                                        <a
                                          href={`https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(`Hello ${studentName}, this is regarding your inquiry at RizeWorld Institute.`)}`}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-full transition-colors border border-emerald-200/70 cursor-pointer"
                                          title="Chat on WhatsApp"
                                        >
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                          <span>WhatsApp</span>
                                        </a>
                                      </>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => {
                                      setIsNotificationsOpen(false);
                                      navigate(`/admin/dashboard/student-crm?search=${encodeURIComponent(studentName)}`);
                                    }}
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-white hover:bg-blue-600 bg-blue-50 px-3 py-1.5 rounded-full transition-all cursor-pointer border border-blue-200/60"
                                  >
                                    <span>Open Lead CRM</span>
                                    <ChevronRight size={13} />
                                  </button>
                                </div>
                              </div>
                            );
                          });
                        })()}

                        {/* FEE DUES TAB */}
                        {notifTab === "fees" && (() => {
                          const pReminders = Array.isArray(paymentReminders) ? paymentReminders : [];
                          if (pReminders.length === 0) {
                            return (
                              <div className="py-12 px-6 text-center bg-white rounded-2xl border border-neutral-200/70 shadow-2xs">
                                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-3.5 shadow-2xs">
                                  <CheckCircle2 size={26} />
                                </div>
                                <h4 className="font-black text-neutral-900 text-sm sm:text-base">All Fees Are Up to Date 🎉</h4>
                                <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto font-medium">
                                  No students have pending installment fees overdue past 1 month.
                                </p>
                              </div>
                            );
                          }

                          return pReminders.map((item, idx) => {
                            const cleanPhone = String(item?.phone || "").replace(/\D/g, "");
                            const studentName = String(item?.student_name || "Student");
                            const studentInitial = studentName.charAt(0).toUpperCase() || "S";
                            const studentId = item?.student_ID || "";
                            const studentObj = item?.studentObj || (Array.isArray(students) ? students.find(s => s.id === item?.student_ID || s.id === item?.id) : null);
                            const pendingFee = Number(item?.pending_fee) || 0;
                            const monthsCompleted = Number(item?.months_completed) || 1;
                            const daysOverdue = Number(item?.days_overdue) || 0;
                            const courseName = item?.course_name || "Course";
                            const lastPaidDateFormatted = item?.last_payment_date
                              ? new Date(item.last_payment_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                              : "";

                            return (
                              <div
                                key={item?.id || studentId || idx}
                                className="bg-white rounded-2xl p-4 sm:p-5 border border-red-200/90 border-l-[5px] border-l-red-600 shadow-2xs hover:shadow-sm transition-all duration-200"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center font-black text-xs text-white shrink-0 shadow-2xs">
                                      {studentInitial}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-black text-neutral-900 text-sm sm:text-base leading-tight">
                                          {studentName}
                                        </span>
                                        {studentId && (
                                          <span className="text-[11px] font-mono font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full shrink-0">
                                            {studentId}
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                                        <span className="inline-flex items-center gap-1 font-semibold text-neutral-700">
                                          <Phone size={12} className="text-neutral-400" />
                                          {cleanPhone || "N/A"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <span className="text-xs sm:text-[13px] font-black px-3.5 py-1.5 rounded-full bg-red-100 text-red-700 border border-red-200 shrink-0 flex items-center gap-1 shadow-2xs">
                                    <IndianRupee size={13} className="stroke-[3]" />
                                    {pendingFee.toLocaleString("en-IN")} Due
                                  </span>
                                </div>

                                <div className="flex items-center flex-wrap gap-2 text-xs text-neutral-600 mt-3.5">
                                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200/70 flex items-center gap-1.5">
                                    <AlertTriangle size={13} className="text-rose-600 shrink-0" />
                                    {monthsCompleted} Month{monthsCompleted > 1 ? "s" : ""} Completed ({daysOverdue} days overdue)
                                  </span>

                                  {courseName && (
                                    <span className="inline-flex items-center gap-1 bg-neutral-100/80 px-2.5 py-1 rounded-xl text-neutral-700 font-semibold border border-neutral-200/50">
                                      🎓 {courseName}
                                    </span>
                                  )}
                                </div>

                                {lastPaidDateFormatted && (
                                  <div className="text-xs text-neutral-500 font-medium mt-2.5 bg-neutral-50/80 px-3 py-1.5 rounded-xl border border-neutral-100">
                                    Last paid installment: <strong className="text-neutral-900 font-bold">₹{Number(item?.last_payment_amount || 0).toLocaleString("en-IN")}</strong> on {lastPaidDateFormatted}
                                  </div>
                                )}

                                <div className="flex items-center justify-between pt-3 mt-3 border-t border-neutral-100" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex items-center gap-2">
                                    {cleanPhone && (
                                      <>
                                        <a
                                          href={`tel:${cleanPhone}`}
                                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors cursor-pointer"
                                          title="Call student"
                                        >
                                          <Phone size={12} className="text-blue-600" />
                                          <span>Call</span>
                                        </a>
                                        <a
                                          href={`https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(
                                            `Hello ${studentName}, this is a gentle reminder from RizeWorld Institute regarding your pending fee installment of ₹${pendingFee.toLocaleString("en-IN")}. Kindly clear your pending fee dues at your earliest convenience. Thank you!`
                                          )}`}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-full transition-colors border border-emerald-200/70 cursor-pointer"
                                          title="Send WhatsApp Payment Reminder"
                                        >
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                          <span>WhatsApp</span>
                                        </a>
                                      </>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2">
                                    {studentObj && (
                                      <button
                                        onClick={() => {
                                          setIsNotificationsOpen(false);
                                          setInvoicingStudent({ student: studentObj });
                                        }}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-xs transition-colors cursor-pointer"
                                        title="Collect Fee / Generate Receipt"
                                      >
                                        <FileText size={13} />
                                        <span>Collect Fee</span>
                                      </button>
                                    )}
                                    <button
                                      onClick={() => {
                                        setIsNotificationsOpen(false);
                                        if (studentObj) {
                                          setViewingStudent(studentObj);
                                        } else {
                                          navigate(`/admin/dashboard?search=${encodeURIComponent(studentName)}`);
                                        }
                                      }}
                                      className="inline-flex items-center gap-1 text-xs font-bold text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                                    >
                                      <span>Details</span>
                                      <ChevronRight size={13} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          });
                        })()}

                        {/* INQUIRIES TAB */}
                        {notifTab === "inquiries" && (
                          (notifications || []).length > 0 ? (
                            notifications.map((notif, idx) => (
                              <div 
                                 key={notif?.id || idx}
                                 onClick={() => {
                                    setIsNotificationsOpen(false);
                                    setSelectedNotification({
                                       ...notif,
                                       content: `Course: ${notif?.course || "N/A"}\nPhone: ${notif?.phone || "N/A"}\n\nMessage: ${notif?.content || ""}`
                                    });
                                    if (!notif?.isRead && notif?.id) markNotificationAsRead(notif.id);
                                 }}
                                 className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 shadow-2xs hover:shadow-sm cursor-pointer ${
                                   !notif?.isRead ? 'border-blue-200/90 border-l-[5px] border-l-blue-600 bg-blue-50/20' : 'border-neutral-200/80 hover:border-neutral-300'
                                 }`}
                              >
                                 <div className="flex items-start gap-3">
                                   <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                                     !notif?.isRead ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-2xs' : 'bg-neutral-100 text-neutral-500'
                                   }`}>
                                      <Mail size={16} />
                                   </div>
                                   <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-1">
                                        <div className="text-sm sm:text-base font-black text-neutral-900 truncate">{notif?.title || "Inquiry"}</div>
                                        {!notif?.isRead && (
                                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 shrink-0">New</span>
                                        )}
                                      </div>
                                      <div className="text-xs text-neutral-600 mt-1 line-clamp-2 font-medium">
                                        {notif?.sender || "Prospect"} is interested in <strong className="text-neutral-900">{notif?.course || "Course"}</strong>
                                      </div>
                                      <div className="text-[11px] text-neutral-400 font-semibold mt-2">{getTimeAgo(notif?.date)}</div>
                                   </div>
                                 </div>
                              </div>
                            ))
                          ) : (
                            <div className="py-12 px-6 text-center bg-white rounded-2xl border border-neutral-200/70 shadow-2xs">
                              <div className="w-14 h-14 mx-auto rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mb-3.5 shadow-2xs">
                                <Mail size={24} />
                              </div>
                              <h4 className="font-black text-neutral-900 text-sm">No Website Inquiries</h4>
                              <p className="text-xs text-neutral-400 mt-1 font-medium">Course inquiries from website forms will appear here.</p>
                            </div>
                          )
                        )}
                      </div>

                      {/* Dropdown Footer */}
                      <div className="p-4 border-t border-neutral-100 bg-neutral-50/80 flex items-center justify-between">
                        <span className="text-xs text-neutral-500 font-semibold">
                          {((followupReminders?.today?.length || 0) + (followupReminders?.due?.length || 0) + (followupReminders?.upcoming?.length || 0))} follow-ups • {(paymentReminders?.length || 0)} fee dues
                        </span>
                        <div className="flex items-center gap-2.5">
                          {(paymentReminders?.length || 0) > 0 && (
                            <button
                              onClick={() => {
                                setIsNotificationsOpen(false);
                                navigate("/admin/dashboard/total-pending-fees");
                              }}
                              className="text-xs font-bold text-red-600 hover:text-red-800 transition-colors cursor-pointer bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full border border-red-200/60"
                            >
                              Pending Fees
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setIsNotificationsOpen(false);
                              navigate("/admin/dashboard/student-crm");
                            }}
                            className="text-xs font-bold text-blue-600 hover:text-white hover:bg-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer border border-blue-200/60"
                          >
                            <span>CRM Leads</span>
                            <ChevronRight size={13} />
                          </button>
                        </div>
                      </div>

                    </div>
                  </>
                )}
             </div>
              {/* Logout Button */}
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="p-1.5 sm:p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                title="Logout Securely"
              >
                <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>

              {/* Admin Profile Chip (Real Admin ID) */}
              <div 
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-1.5 sm:gap-2.5 pl-1.5 sm:pl-3 border-l border-neutral-200 cursor-pointer"
                title="View Admin Profile & Navigation"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold text-[10px] sm:text-xs flex items-center justify-center shadow-2xs shrink-0">
                  {adminInitials}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-neutral-900 leading-tight">{adminName}</div>
                  <div className="text-[10px] text-neutral-400 font-medium">{adminEmail}</div>
                </div>
              </div>

            </div>
          </div>
        </header>

        {/* Main Canvas Content Area */}
        <main className="flex-1 w-full max-w-[1520px] mx-auto px-3 sm:px-6 pt-4 sm:pt-6 pb-10 lg:pb-48 space-y-6">
          <div className="w-full space-y-6">
          
          {isInitialLoading ? (
            <div className="w-full space-y-6 animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-36 bg-neutral-200/60 rounded-3xl" />
                ))}
              </div>
              <div className="h-72 bg-neutral-200/60 rounded-3xl" />
            </div>
          ) : (
            <>
          {activeTab === "dashboard" && !expandedStat && (
            <div className="w-full space-y-6 animate-in fade-in duration-300">
              
              {/* KPI Stat Cards Row (3-3 Pairs: Top = Students, Earnings, Pending; Bottom = Clear, Issued, Unissued) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* 1. Total Students */}
                <StatCard 
                  isPrimary={true}
                  title="Total Students" 
                  value={stats.totalStudents} 
                  icon={Users} 
                  badgeText="Active"
                  badgeTrend="up"
                  subtitle={`Active enrolled: ${stats.totalStudents}`}
                  onClick={() => navigate("/admin/dashboard/dashboard/total-students")} 
                />

                {/* 2. Total Earnings (Dual: Expected on Left, Received on Right) */}
                <div 
                  onClick={() => navigate("/admin/dashboard/dashboard/total-earnings")} 
                  className="cursor-pointer bg-white rounded-[26px] p-6 border border-neutral-200/80 shadow-xs hover:border-neutral-300 hover:shadow-sm hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[165px]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Earnings</span>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-50 text-purple-600 shadow-2xs">
                      <IndianRupee size={19} />
                    </div>
                  </div>

                  <div className="my-auto py-1">
                    <div className="grid grid-cols-2 divide-x divide-neutral-200/80 gap-3 sm:gap-4">
                      {/* Left Side: Expected */}
                      <div className="pr-2">
                        <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                          Total Expected
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                          ₹{totalExpectedEarning.toLocaleString('en-IN')}
                        </div>
                      </div>

                      {/* Right Side: Received */}
                      <div className="pl-3 sm:pl-4">
                        <div className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider mb-1">
                          Total Received
                        </div>
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">
                            ₹{totalReceivedEarning.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-neutral-400 font-medium">
                    Total fee collected
                  </div>
                </div>

                {/* 3. Total Pending Fees (Dual: Pending Amount on Left, Total Students on Right) */}
                <div 
                  onClick={() => navigate("/admin/dashboard/dashboard/total-pending-fees")} 
                  className="cursor-pointer bg-white rounded-[26px] p-6 border border-neutral-200/80 shadow-xs hover:border-neutral-300 hover:shadow-sm hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[165px]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Pending Fees</span>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-rose-50 text-rose-600 shadow-2xs">
                      <AlertCircle size={19} />
                    </div>
                  </div>

                  <div className="my-auto py-1">
                    <div className="grid grid-cols-2 divide-x divide-neutral-200/80 gap-3 sm:gap-4">
                      {/* Left Side: Pending Amount */}
                      <div className="pr-2">
                        <div className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider mb-1">
                          Pending Amount
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-rose-600 tracking-tight">
                          ₹{totalPendingDuesAcrossSystem.toLocaleString('en-IN')}
                        </div>
                      </div>

                      {/* Right Side: Total Students */}
                      <div className="pl-3 sm:pl-4">
                        <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                          Total Students
                        </div>
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                            {stats.pendingFees || totalStudentsSummary.pendingCount || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-neutral-400 font-medium">
                    Pending installments
                  </div>
                </div>

                {/* 4. Total Clear Fees (Dual: Cleared Amount on Left, Total Students on Right) */}
                <div 
                  onClick={() => navigate("/admin/dashboard/dashboard/total-clear-fees")} 
                  className="cursor-pointer bg-white rounded-[26px] p-6 border border-neutral-200/80 shadow-xs hover:border-neutral-300 hover:shadow-sm hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[165px]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Clear Fees</span>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-cyan-50 text-cyan-600 shadow-2xs">
                      <CheckCircle2 size={19} />
                    </div>
                  </div>

                  <div className="my-auto py-1">
                    <div className="grid grid-cols-2 divide-x divide-neutral-200/80 gap-3 sm:gap-4">
                      {/* Left Side: Cleared Amount */}
                      <div className="pr-2">
                        <div className="text-[11px] font-semibold text-cyan-700 uppercase tracking-wider mb-1">
                          Cleared Amount
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-cyan-700 tracking-tight">
                          ₹{totalClearFeesAmount.toLocaleString('en-IN')}
                        </div>
                      </div>

                      {/* Right Side: Total Students */}
                      <div className="pl-3 sm:pl-4">
                        <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                          Total Students
                        </div>
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                            {totalClearStudentsCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-neutral-400 font-medium">
                    Fully paid students
                  </div>
                </div>

                {/* 5. Certificate Issued */}
                <StatCard 
                  title="Certificate Issued" 
                  value={stats.certificatesIssued} 
                  icon={Award} 
                  color="green" 
                  badgeText="Issued"
                  badgeTrend="up"
                  subtitle="Completed courses"
                  onClick={() => navigate("/admin/dashboard/dashboard/certificate-issued")} 
                />

                {/* 6. Certificate Unissued */}
                <StatCard 
                  title="Certificate Unissued" 
                  value={stats.unissuedCertificates} 
                  icon={AlertCircle} 
                  color="orange" 
                  badgeText="Pending"
                  badgeTrend="neutral"
                  subtitle="Awaiting issue"
                  onClick={() => navigate("/admin/dashboard/dashboard/certificate-unissued")} 
                />
              </div>

              {/* Middle Section: Performance Overview (Dual-Layer Bar Chart) & Sales Overview (Speedometer) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Performance Overview (lg:col-span-8) - Matches height of Sales Overview */}
                <div className="lg:col-span-8 bg-white rounded-[26px] p-6 sm:p-7 border border-neutral-200/80 shadow-xs flex flex-col justify-between">
                  <div className="flex flex-wrap justify-between items-center gap-4 mb-2">
                    <div>
                      <h3 className="text-lg font-black text-neutral-900 tracking-tight">Performance Overview</h3>
                      <p className="text-xs text-neutral-400 font-medium">Monthly student growth & collection activity</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-neutral-100/80 p-1 rounded-full text-xs font-semibold border border-neutral-200/50">
                        <button
                          onClick={() => setGraphMetric("earnings")}
                          className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                            graphMetric === "earnings" ? "bg-white text-blue-600 shadow-xs font-bold" : "text-neutral-500 hover:text-neutral-900"
                          }`}
                        >
                          Earnings (₹)
                        </button>
                        <button
                          onClick={() => setGraphMetric("students")}
                          className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                            graphMetric === "students" ? "bg-white text-blue-600 shadow-xs font-bold" : "text-neutral-500 hover:text-neutral-900"
                          }`}
                        >
                          Enrollments
                        </button>
                      </div>
                    </div>
                  </div>
                   
                  {/* Dual-layer Rounded Pill Bar Graph */}
                  <div className="h-[250px] w-full relative mt-3 flex flex-col justify-between">
                    {graphData.length > 0 ? (
                      <>
                        <svg 
                          className="w-full h-[210px] overflow-visible" 
                          viewBox="0 0 800 210"
                          preserveAspectRatio="none"
                        >
                          <defs>
                            <pattern 
                              id="diagonalBlueStripes" 
                              width="8" 
                              height="8" 
                              patternTransform="rotate(45 0 0)" 
                              patternUnits="userSpaceOnUse"
                            >
                              <rect width="8" height="8" fill="#3b82f6" />
                              <line x1="0" y1="0" x2="0" y2="8" stroke="#93c5fd" strokeWidth="3" />
                            </pattern>
                          </defs>

                          {/* Dotted horizontal Y-axis gridlines */}
                          {(() => {
                            const yTicks = [
                              { label: graphMetric === "earnings" ? "40k" : "40", y: 20 },
                              { label: graphMetric === "earnings" ? "30k" : "30", y: 55 },
                              { label: graphMetric === "earnings" ? "20k" : "20", y: 90 },
                              { label: graphMetric === "earnings" ? "10k" : "10", y: 125 },
                              { label: graphMetric === "earnings" ? "5k" : "5",   y: 155 },
                              { label: "0k",                                      y: 185 },
                            ];

                            return yTicks.map((tick, idx) => {
                              return (
                                <g key={idx}>
                                  <text 
                                    x="32" 
                                    y={tick.y + 4} 
                                    textAnchor="end" 
                                    className="text-[11px] font-semibold fill-neutral-400 select-none"
                                  >
                                    {tick.label}
                                  </text>
                                  <line 
                                    x1="45" 
                                    y1={tick.y} 
                                    x2="780" 
                                    y2={tick.y} 
                                    stroke="#f1f3f6" 
                                    strokeWidth="1.5" 
                                    strokeDasharray="4 4" 
                                  />
                                </g>
                              );
                            });
                          })()}

                          {/* Dual-layer Bars */}
                          {(() => {
                            const values = graphData.map(d => graphMetric === "earnings" ? Number(d.earnings) : Number(d.newStudents));
                            const maxVal = Math.max(...values, graphMetric === "earnings" ? 40000 : 20);
                            const totalBars = graphData.length;
                            const chartStart = 70;
                            const chartWidth = 710;
                            const step = chartWidth / totalBars;
                            const barWidth = 44;
                            const barRadius = 22;
                            const trackHeight = 165;
                            const trackY = 20;
                            const bottomY = trackY + trackHeight;

                            return graphData.map((d, i) => {
                              const val = graphMetric === "earnings" ? Number(d.earnings) : Number(d.newStudents);
                              const x = chartStart + i * step + (step - barWidth) / 2;
                              
                              let barHeight = val > 0 ? Math.max(24, (val / (maxVal || 1)) * (trackHeight - 8)) : 14;
                              if (barHeight > trackHeight) barHeight = trackHeight;
                              const barY = bottomY - barHeight;

                              const isHighlighted = hoveredBarIndex !== null ? hoveredBarIndex === i : (i === 3 || (totalBars < 4 && i === totalBars - 1));

                              return (
                                <g 
                                  key={i} 
                                  className="cursor-pointer group"
                                  onMouseEnter={() => setHoveredBarIndex(i)}
                                  onMouseLeave={() => setHoveredBarIndex(null)}
                                >
                                  {/* Background soft gray capsule track */}
                                  <rect 
                                    x={x} 
                                    y={trackY} 
                                    width={barWidth} 
                                    height={trackHeight} 
                                    rx={barRadius} 
                                    fill="#f1f3f6" 
                                    className="transition-colors group-hover:fill-neutral-200/70"
                                  />

                                  {/* Foreground data capsule pill */}
                                  <rect 
                                    x={x} 
                                    y={barY} 
                                    width={barWidth} 
                                    height={barHeight} 
                                    rx={barRadius} 
                                    fill={isHighlighted ? "url(#diagonalBlueStripes)" : "#cbd5e1"} 
                                    className="transition-all duration-300"
                                  />

                                  {/* Highlighted indicator dot on top */}
                                  {isHighlighted && (
                                    <circle 
                                      cx={x + barWidth / 2} 
                                      cy={barY} 
                                      r="4.5" 
                                      fill="#2563eb" 
                                      stroke="#ffffff" 
                                      strokeWidth="2" 
                                    />
                                  )}
                                </g>
                              );
                            });
                          })()}
                        </svg>

                        {/* Floating Tooltip Card above highlighted bar */}
                        {(() => {
                          const totalBars = graphData.length;
                          const activeIdx = hoveredBarIndex !== null ? hoveredBarIndex : (totalBars > 3 ? 3 : totalBars - 1);
                          const activeItem = graphData[activeIdx];
                          if (!activeItem) return null;

                          const values = graphData.map(d => graphMetric === "earnings" ? Number(d.earnings) : Number(d.newStudents));
                          const maxVal = Math.max(...values, graphMetric === "earnings" ? 40000 : 20);
                          const val = graphMetric === "earnings" ? Number(activeItem.earnings) : Number(activeItem.newStudents);
                          
                          const leftPct = ((70 + activeIdx * (710 / totalBars) + (710 / totalBars) / 2) / 800) * 100;
                          
                          const trackHeight = 165;
                          const bottomY = 185;
                          let barHeight = val > 0 ? Math.max(24, (val / (maxVal || 1)) * (trackHeight - 8)) : 14;
                          if (barHeight > trackHeight) barHeight = trackHeight;
                          const barY = bottomY - barHeight;
                          const topPct = (barY / 210) * 100;

                          return (
                            <div 
                              className="absolute z-20 pointer-events-none transition-all duration-200"
                              style={{
                                left: `${leftPct}%`,
                                top: `${topPct}%`,
                                transform: "translate(-50%, -115%)"
                              }}
                            >
                              <div className="bg-white rounded-2xl p-3.5 shadow-xl border border-neutral-150 min-w-[155px] text-left">
                                <div className="text-xs font-bold text-neutral-900 mb-2">{activeItem.month || "Month"}</div>
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between gap-3 text-[11px] font-medium text-neutral-500">
                                    <span className="flex items-center gap-1.5">
                                      <span className="w-2 h-2 rounded-full bg-neutral-300"></span> Total Sales
                                    </span>
                                    <span className="font-bold text-neutral-900">{activeItem.newStudents || 0}</span>
                                  </div>
                                  <div className="flex items-center justify-between gap-3 text-[11px] font-medium text-neutral-500">
                                    <span className="flex items-center gap-1.5">
                                      <span className="w-2 h-2 rounded-full bg-blue-600"></span> Total Revenue
                                    </span>
                                    <span className="font-bold text-neutral-900">₹{Number(activeItem.earnings || 0).toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Month Labels along X-Axis */}
                        <div className="relative h-6 w-full flex justify-between pl-12 pr-4 text-xs font-semibold text-neutral-500">
                          {graphData.map((d, i) => {
                            const displayLabel = d.monthShort || d.month?.split(" ")[0] || `M${i+1}`;
                            const isHighlighted = hoveredBarIndex !== null ? hoveredBarIndex === i : (i === 3 || (graphData.length < 4 && i === graphData.length - 1));
                            return (
                              <div 
                                key={i} 
                                className={`flex-1 text-center transition-colors cursor-pointer ${
                                  isHighlighted ? "text-neutral-900 font-bold" : "text-neutral-400 hover:text-neutral-700"
                                }`}
                                onMouseEnter={() => setHoveredBarIndex(i)}
                                onMouseLeave={() => setHoveredBarIndex(null)}
                              >
                                {displayLabel}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center text-neutral-400 text-sm italic">
                        No growth data available yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* Sales Overview / Fee Recovery (Speedometer) - lg:col-span-4 matches Performance Overview height */}
                <div className="lg:col-span-4 bg-white rounded-[26px] p-6 sm:p-7 border border-neutral-200/80 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-black text-neutral-900 tracking-tight">Sales Overview</h3>
                      <p className="text-xs text-neutral-400 font-medium">Institute fee collection rate</p>
                    </div>
                    <button 
                      type="button" 
                      className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                      title="More options"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </div>

                  {/* Radial Speedometer Gauge */}
                  <div className="my-auto py-2">
                    <RadialSpeedometerGauge 
                      percentage={stats.totalStudents > 0 ? (stats.totalClearFees / stats.totalStudents) * 100 : 70.8} 
                    />
                  </div>

                  {/* 2 Bottom Stat Pill Boxes matching mockup */}
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {/* Box 1: Clear Fee Students / Number of Sales */}
                    <div className="bg-neutral-50/80 rounded-2xl p-3.5 border border-neutral-200/60">
                      <div className="text-[11px] font-semibold text-neutral-400">Clear Fee Students</div>
                      <div className="flex items-baseline justify-between mt-1.5">
                        <span className="text-lg font-black text-neutral-900">{stats.totalClearFees}</span>
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
                          ↑ {stats.totalStudents > 0 ? ((stats.totalClearFees / stats.totalStudents) * 100).toFixed(0) : 0}%
                        </span>
                      </div>
                    </div>

                    {/* Box 2: Total Revenue */}
                    <div className="bg-neutral-50/80 rounded-2xl p-3.5 border border-neutral-200/60">
                      <div className="text-[11px] font-semibold text-neutral-400">Total Revenue</div>
                      <div className="flex items-baseline justify-between mt-1.5">
                        <span className="text-lg font-black text-neutral-900">
                          ₹{stats.totalEarnings >= 1000 ? `${(stats.totalEarnings / 1000).toFixed(1)}k` : stats.totalEarnings}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Full Width Top Courses Card - Covering both Performance Overview & Sales Overview */}
              <div className="bg-white rounded-[26px] p-6 sm:p-7 border border-neutral-200/80 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-lg font-black text-neutral-900 tracking-tight">Top Courses</h3>
                    <p className="text-xs text-neutral-400 font-medium">Real-time student enrollment distribution across programs</p>
                  </div>
                  <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-neutral-100 text-neutral-700 shrink-0 self-start sm:self-auto border border-neutral-200/60">
                    {topCourses.reduce((acc, c) => acc + (c.count || 0), 0)} Enrolled • {topCourses.length} Programs
                  </span>
                </div>

                {/* Multi-segmented Stripes Progress Bar */}
                <div className="flex gap-1 w-full h-3 mb-5 rounded-full overflow-hidden bg-neutral-100 p-0.5">
                  {topCourses.length > 0 ? (
                    topCourses.map((course, i) => {
                      const colors = [
                        "bg-blue-600",
                        "bg-indigo-500",
                        "bg-sky-400",
                        "bg-emerald-500",
                        "bg-violet-500",
                        "bg-amber-500",
                        "bg-rose-500"
                      ];
                      const total = topCourses.reduce((acc, c) => acc + c.count, 0) || 1;
                      const percentage = (course.count / total) * 100;
                      return (
                        <div 
                          key={i} 
                          className={`${colors[i % colors.length]} h-full rounded-full transition-all`}
                          style={{ width: `${Math.max(4, percentage)}%` }}
                          title={`${course._id}: ${course.count} students (${percentage.toFixed(1)}%)`}
                        />
                      );
                    })
                  ) : (
                    <div className="w-full bg-neutral-200 h-full rounded-full" />
                  )}
                </div>

                {/* Responsive Grid of Course Items - Centered 3 Balanced Columns */}
                <div className={`grid gap-3.5 sm:gap-4 ${topCourses.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : topCourses.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                  {topCourses.length > 0 ? (
                    topCourses.map((course, i) => {
                      const dotColors = [
                        "bg-blue-600",
                        "bg-indigo-500",
                        "bg-sky-400",
                        "bg-emerald-500",
                        "bg-violet-500",
                        "bg-amber-500",
                        "bg-rose-500"
                      ];
                      const total = topCourses.reduce((acc, c) => acc + c.count, 0) || 1;
                      const percentage = ((course.count / total) * 100).toFixed(0);
                      return (
                        <div 
                          key={i} 
                          className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50/70 border border-neutral-200/50 hover:bg-neutral-100/60 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColors[i % dotColors.length]}`}></span>
                            <span className="font-bold text-xs text-neutral-800 truncate" title={course._id || "Course"}>
                              {course._id || "Course"}
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-black text-neutral-900">{course.count}</span>
                            <span className="text-[11px] font-semibold text-neutral-400 ml-1">({percentage}%)</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full py-4 text-center text-xs text-neutral-400 font-medium">
                      No enrolled course data available yet
                    </div>
                  )}
                </div>
              </div>

              {/* Student Management Table (Recent Orders styling matching mockup) */}
              <div className="bg-white rounded-[26px] p-6 sm:p-7 border border-neutral-200/80 shadow-xs">
                {/* Table Header Controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-black text-neutral-900 tracking-tight">Recent Students</h3>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                      {filteredStudents.length} total
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Pill Search Bar */}
                    <div className="relative">
                      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="Search students..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-full bg-neutral-50/80 border border-neutral-200/80 focus:bg-white focus:border-blue-500 focus:outline-none transition-all text-xs font-medium text-neutral-900 placeholder-neutral-400 shadow-2xs"
                      />
                    </div>

                    {/* Pill Status Filter */}
                    <div className="relative">
                      <select 
                        value={statusFilter} 
                        onChange={(e: any) => setStatusFilter(e.target.value)}
                        className="appearance-none bg-neutral-50/80 border border-neutral-200/80 rounded-full pl-4 pr-8 py-2 text-xs font-semibold text-neutral-700 hover:border-neutral-300 focus:outline-none cursor-pointer shadow-2xs"
                      >
                        <option value="All">All Status</option>
                        <option value="Clear">Clear Fees</option>
                        <option value="Pending">Pending Fees</option>
                      </select>
                      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    </div>

                    {/* Add Student Pill */}
                    <button 
                      onClick={() => {
                        setEditingStudent(null);
                        setIsStudentModalOpen(true);
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#2563eb] hover:bg-blue-700 text-white font-semibold rounded-full text-xs transition-all shadow-xs cursor-pointer hover:shadow"
                    >
                      <Plus size={15} /> Add Student
                    </button>
                  </div>
                </div>

                {/* Clean Minimalist Table */}
                <div className="overflow-x-auto min-h-[300px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-100 text-neutral-400 text-[11px] uppercase tracking-wider font-bold">
                        <th className="py-4 px-4 font-semibold">ID</th>
                        <th className="py-4 px-4 font-semibold">Student Name</th>
                        <th className="py-4 px-4 font-semibold">Course</th>
                        <th className="py-4 px-4 font-semibold">Duration</th>
                        <th className="py-4 px-4 font-semibold">Total Fee</th>
                        <th className="py-4 px-4 font-semibold">Pending Fee</th>
                        <th className="py-4 px-4 font-semibold">Status</th>
                        <th className="py-4 px-4 text-right font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100/70 text-xs font-medium">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((s) => (
                          <tr key={s.id} className="hover:bg-neutral-50/70 transition-colors group">
                            <td className="py-4 px-4 font-mono text-neutral-500 font-semibold">{s.id}</td>
                            <td className="py-4 px-4 font-bold text-neutral-900">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center text-xs font-bold shadow-2xs border border-blue-200/50">
                                  {s.name.charAt(0).toUpperCase()}
                                </div>
                                <span>{s.name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-neutral-600">{Array.isArray(s.course) ? s.course.join(", ") : s.course || "N/A"}</td>
                            <td className="py-4 px-4 text-neutral-500">{s.duration || "N/A"}</td>
                            <td className="py-4 px-4 text-neutral-800 font-semibold">₹{s.totalFees || 0}</td>
                            <td className="py-4 px-4 text-neutral-800 font-semibold">₹{s.pendingFees || 0}</td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                s.feesStatus === "Clear" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                s.feesStatus === "Pending" ? "bg-rose-50 text-rose-700 border-rose-200" :
                                "bg-amber-50 text-amber-700 border-amber-200"
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${s.feesStatus === "Clear" ? "bg-emerald-500" : s.feesStatus === "Pending" ? "bg-rose-500" : "bg-amber-500"}`} />
                                {s.feesStatus}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-end gap-1.5">
                                <button 
                                  onClick={() => setInvoicingStudent({ student: s })}
                                  className="p-1.5 text-[#FF5A36] hover:bg-orange-50 rounded-lg transition-all cursor-pointer"
                                  title="Fee Bill / Invoice"
                                >
                                  <FileText size={15} />
                                </button>
                                <button 
                                  onClick={() => { setEditingStudent(s); setIsStudentModalOpen(true); }}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                                  title="Edit Student"
                                >
                                  <Edit2 size={15} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteStudent(s.id, s.name)}
                                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                                  title="Delete Student"
                                >
                                  <Trash2 size={15} />
                                </button>
                                <button 
                                  onClick={() => setViewingStudent(s)}
                                  className="px-2.5 py-1 text-xs font-semibold bg-white hover:bg-neutral-100 text-neutral-700 rounded-lg border border-neutral-200 shadow-2xs transition-all ml-1 cursor-pointer"
                                >
                                  Details
                                </button>
                                {s.certificates && s.certificates.length > 0 && (
                                  <button
                                    onClick={() => handleDownloadCertificateDirect(s.id, s.name, Array.isArray(s.course) ? s.course[0] : s.course, s.certificates[0]?.url)}
                                    disabled={downloadingCertId?.startsWith(s.id)}
                                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-200 transition-all ml-1 cursor-pointer disabled:opacity-50"
                                    title="Download Certificate"
                                  >
                                    <Award size={15} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="py-16 text-center">
                            <div className="flex flex-col items-center justify-center text-neutral-400">
                              <Users size={40} className="mb-3 opacity-25" />
                              <p className="text-sm font-medium">No students found matching your criteria.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {activeTab === "dashboard" && expandedStat && (
             <div className="max-w-[1520px] mx-auto animate-in fade-in duration-300 space-y-6">
                <button onClick={() => navigate("/admin/dashboard/dashboard")} className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 font-bold transition-all cursor-pointer bg-white px-4 py-2 rounded-full border border-neutral-200/80 shadow-xs hover:border-neutral-300 text-xs">
                   <ArrowLeft size={16} /> Back to Dashboard
                </button>
                <div className="bg-white rounded-[26px] p-6 sm:p-8 border border-neutral-200/80 shadow-xs min-h-[600px] flex flex-col">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                       <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight capitalize flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-2xs border border-blue-100/60">
                             <LayoutDashboard size={20} />
                          </div>
                          {expandedStat.replace(/-/g, ' ')} Details
                       </h2>
                        {expandedStat === "total-students" && (
                           <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                              <div className="relative w-full sm:w-64">
                                 <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                                 <input
                                    type="text"
                                    placeholder="Search student, course, phone..."
                                    value={detailSearch}
                                    onChange={(e) => setDetailSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 focus:outline-none transition-all text-sm text-neutral-900 placeholder-neutral-400 shadow-xs"
                                 />
                              </div>
                              <select 
                                value={detailStatusFilter} 
                                onChange={(e: any) => setDetailStatusFilter(e.target.value)}
                                className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-sm text-neutral-700 focus:border-blue-500 focus:outline-none w-full sm:w-36 appearance-none cursor-pointer shadow-xs"
                              >
                                <option value="All">All Status</option>
                                <option value="Clear">Clear Fees</option>
                                <option value="Pending">Pending Fees</option>
                              </select>
                              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/90 px-3 py-2 rounded-xl shrink-0">
                                 <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Received:</span>
                                 <span className="text-sm font-black text-emerald-600">
                                    ₹{totalStudentsSummary.totalPaid.toLocaleString('en-IN')}
                                 </span>
                              </div>
                              <div className="flex items-center gap-2 bg-red-50 border border-red-200/90 px-3 py-2 rounded-xl shrink-0">
                                 <span className="text-xs font-bold uppercase tracking-wider text-red-700">Pending:</span>
                                 <span className="text-sm font-black text-red-600">
                                    ₹{totalStudentsSummary.totalPending.toLocaleString('en-IN')}
                                 </span>
                              </div>
                           </div>
                        )}
                        {expandedStat === "total-clear-fees" && (
                           <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                              <div className="relative w-full sm:w-64">
                                 <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                                 <input
                                    type="text"
                                    placeholder="Search student, course, phone..."
                                    value={detailSearch}
                                    onChange={(e) => setDetailSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-neutral-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 focus:outline-none transition-all text-sm text-neutral-900 placeholder-neutral-400 shadow-xs"
                                 />
                              </div>
                              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/90 px-3.5 py-2 rounded-xl shrink-0">
                                 <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Total Cleared:</span>
                                 <span className="text-base font-black text-emerald-600">
                                    ₹{totalClearSummary.totalPaid.toLocaleString('en-IN')}
                                 </span>
                              </div>
                           </div>
                        )}
                        {expandedStat === "total-earnings" && (
                           <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                              <div className="relative w-full sm:w-64">
                                 <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                                 <input
                                    type="text"
                                    placeholder={
                                      earningsFilter === "pending" ? "Search pending student, course..." :
                                      earningsFilter === "all" ? "Search student, course, phone..." :
                                      "Search txn ID, student, method..."
                                    }
                                    value={detailSearch}
                                    onChange={(e) => setDetailSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-neutral-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 focus:outline-none transition-all text-sm text-neutral-900 placeholder-neutral-400 shadow-xs"
                                 />
                              </div>
                              <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200 text-xs font-bold gap-1 shrink-0">
                                 <button
                                   type="button"
                                   onClick={() => setEarningsFilter("received")}
                                   className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                                     earningsFilter === "received" ? "bg-white text-emerald-700 shadow-xs font-extrabold" : "text-neutral-600 hover:text-neutral-900"
                                   }`}
                                 >
                                   <CheckCircle2 size={13} />
                                   Received Txns
                                 </button>
                                 <button
                                   type="button"
                                   onClick={() => setEarningsFilter("pending")}
                                   className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                                     earningsFilter === "pending" ? "bg-white text-red-600 shadow-xs font-extrabold" : "text-neutral-600 hover:text-neutral-900"
                                   }`}
                                 >
                                   <AlertCircle size={13} />
                                   Pending Dues
                                 </button>
                                 <button
                                   type="button"
                                   onClick={() => setEarningsFilter("all")}
                                   className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                                     earningsFilter === "all" ? "bg-white text-blue-700 shadow-xs font-extrabold" : "text-neutral-600 hover:text-neutral-900"
                                   }`}
                                 >
                                   <Users size={13} />
                                   All Revenue
                                 </button>
                              </div>
                              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/90 px-3 py-2 rounded-xl shrink-0">
                                 <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Received:</span>
                                 <span className="text-sm font-black text-emerald-600">
                                    ₹{totalEarningsSummary.totalReceived.toLocaleString('en-IN')}
                                 </span>
                              </div>
                              <div className="flex items-center gap-2 bg-red-50 border border-red-200/90 px-3 py-2 rounded-xl shrink-0">
                                 <span className="text-xs font-bold uppercase tracking-wider text-red-700">Pending:</span>
                                 <span className="text-sm font-black text-red-600">
                                    ₹{totalEarningsSummary.totalPending.toLocaleString('en-IN')}
                                 </span>
                              </div>
                           </div>
                        )}
                        {expandedStat === "total-pending-fees" && (
                           <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                              <div className="relative w-full sm:w-64">
                                 <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                                 <input
                                    type="text"
                                    placeholder="Search student, course, phone..."
                                    value={detailSearch}
                                    onChange={(e) => setDetailSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-neutral-200 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 focus:outline-none transition-all text-sm text-neutral-900 placeholder-neutral-400 shadow-xs"
                                 />
                              </div>
                              <div className="flex items-center gap-2 bg-red-50 border border-red-200/90 px-3.5 py-2 rounded-xl shrink-0">
                                 <span className="text-xs font-bold uppercase tracking-wider text-red-700">Total Pending Dues:</span>
                                 <span className="text-base font-black text-red-600">
                                    ₹{pendingFeeStudentsData.reduce((acc, curr) => acc + (Number(curr.pendingFees) || 0), 0).toLocaleString('en-IN')}
                                 </span>
                              </div>
                           </div>
                        )}
                        {(expandedStat === "certificate-issued" || expandedStat === "certificate-unissued") && (
                           <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                              <button
                                 onClick={handleSyncAndGenerateAll}
                                 disabled={isCheckingCertificates}
                                 className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                              >
                                 <Award size={15} />
                                 {isCheckingCertificates ? "Checking..." : "⚡ Check & Auto-Generate All"}
                              </button>
                           </div>
                        )}
                   </div>
                   
                    {/* STAT CARDS FOR TOTAL-STUDENTS */}
                    {expandedStat === "total-students" && (
                       <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                          <div 
                             onClick={() => setDetailStatusFilter("All")}
                             className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none relative overflow-hidden group ${
                                detailStatusFilter === "All"
                                   ? "bg-blue-50/60 border-blue-500 ring-2 ring-blue-500/30 shadow-md"
                                   : "bg-white border-neutral-200 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5"
                             }`}
                          >
                             <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Enrolled Students</span>
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                                   detailStatusFilter === "All" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700"
                                }`}>
                                   <Users size={16} />
                                </div>
                             </div>
                             <div className="text-2xl lg:text-3xl font-black text-neutral-900 tracking-tight">
                                {totalStudentsSummary.count}
                             </div>
                             <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-100">
                                <div className="text-xs font-medium text-neutral-500">
                                   {totalStudentsSummary.clearCount} Clear • {totalStudentsSummary.pendingCount} Pending
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full transition-all ${
                                   detailStatusFilter === "All" 
                                      ? "bg-blue-600 text-white shadow-xs" 
                                      : "bg-neutral-100 text-neutral-600 group-hover:bg-blue-50 group-hover:text-blue-700"
                                }`}>
                                   {detailStatusFilter === "All" ? "Active (All)" : "Show All"}
                                </span>
                             </div>
                          </div>

                          <div 
                             onClick={() => setDetailStatusFilter(detailStatusFilter === "Clear" ? "All" : "Clear")}
                             className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none relative overflow-hidden group ${
                                detailStatusFilter === "Clear"
                                   ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/40 shadow-md"
                                   : "bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border-emerald-200/80 hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5"
                             }`}
                          >
                             <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Total Received Fees</span>
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                                   detailStatusFilter === "Clear" ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-700"
                                }`}>
                                   <CheckCircle2 size={16} />
                                </div>
                             </div>
                             <div className="text-2xl lg:text-3xl font-black text-emerald-600 tracking-tight">
                                ₹{totalStudentsSummary.totalPaid.toLocaleString('en-IN')}
                             </div>
                             <div className="flex items-center justify-between mt-2 pt-1 border-t border-emerald-200/40">
                                <div className="text-xs font-medium text-emerald-700/80">Total amount collected</div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full transition-all ${
                                   detailStatusFilter === "Clear" 
                                      ? "bg-emerald-600 text-white shadow-xs" 
                                      : "bg-emerald-100/90 text-emerald-800 group-hover:bg-emerald-200"
                                }`}>
                                   {detailStatusFilter === "Clear" ? "Filter Active" : "Click to filter"}
                                </span>
                             </div>
                          </div>

                          <div 
                             onClick={() => setDetailStatusFilter(detailStatusFilter === "Pending" ? "All" : "Pending")}
                             className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none relative overflow-hidden group ${
                                detailStatusFilter === "Pending"
                                   ? "bg-red-50 border-red-500 ring-2 ring-red-500/40 shadow-md"
                                   : "bg-gradient-to-br from-red-50 via-rose-50/50 to-white border-red-200/80 hover:border-red-400 hover:shadow-md hover:-translate-y-0.5"
                             }`}
                          >
                             <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Total Pending Dues</span>
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                                   detailStatusFilter === "Pending" ? "bg-red-600 text-white" : "bg-red-100 text-red-600"
                                }`}>
                                   <AlertCircle size={16} />
                                </div>
                             </div>
                             <div className="text-2xl lg:text-3xl font-black text-red-600 tracking-tight">
                                ₹{totalStudentsSummary.totalPending.toLocaleString('en-IN')}
                             </div>
                             <div className="flex items-center justify-between mt-2 pt-1 border-t border-red-200/40">
                                <div className="text-xs font-medium text-red-500/90">Outstanding pending balance</div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full transition-all ${
                                   detailStatusFilter === "Pending" 
                                      ? "bg-red-600 text-white shadow-xs" 
                                      : "bg-red-100/90 text-red-800 group-hover:bg-red-200"
                                }`}>
                                   {detailStatusFilter === "Pending" ? "Filter Active" : "Click to filter"}
                                </span>
                             </div>
                          </div>

                          <div 
                             onClick={() => setDetailStatusFilter("All")}
                             className="bg-white p-5 rounded-2xl border border-neutral-200 hover:border-neutral-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer select-none shadow-xs group"
                          >
                             <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Course Value</span>
                                <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
                                   <IndianRupee size={16} />
                                </div>
                             </div>
                             <div className="text-2xl lg:text-3xl font-black text-neutral-900 tracking-tight">
                                ₹{totalStudentsSummary.totalBilled.toLocaleString('en-IN')}
                             </div>
                             <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-100">
                                <div className="text-xs font-medium text-neutral-500">Agreed total course fees</div>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200">
                                   Reset view
                                </span>
                             </div>
                          </div>
                       </div>
                    )}
                   {/* STAT CARDS FOR TOTAL-CLEAR-FEES */}
                   {expandedStat === "total-clear-fees" && (
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                         <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs">
                            <div className="flex items-center justify-between mb-2">
                               <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Total Fees Cleared</span>
                               <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                  <CheckCircle2 size={16} />
                               </div>
                            </div>
                            <div className="text-2xl lg:text-3xl font-black text-emerald-600 tracking-tight">
                               ₹{totalClearSummary.totalPaid.toLocaleString('en-IN')}
                            </div>
                            <div className="text-xs font-medium text-emerald-600/80 mt-1">100% collected from cleared students</div>
                         </div>

                         <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                            <div className="flex items-center justify-between mb-2">
                               <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Cleared Students</span>
                               <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
                                  <Users size={16} />
                               </div>
                            </div>
                            <div className="text-2xl lg:text-3xl font-black text-neutral-900 tracking-tight">
                               {totalClearSummary.count}
                            </div>
                            <div className="text-xs font-medium text-neutral-500 mt-1">Students with zero pending dues</div>
                         </div>

                         <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                            <div className="flex items-center justify-between mb-2">
                               <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Pending Dues</span>
                               <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                  <Shield size={16} />
                               </div>
                            </div>
                            <div className="text-2xl lg:text-3xl font-black text-emerald-600 tracking-tight">
                               ₹0
                            </div>
                            <div className="text-xs font-medium text-emerald-600/80 mt-1">Zero pending dues for these students</div>
                         </div>

                         <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                            <div className="flex items-center justify-between mb-2">
                               <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Average Paid Fee</span>
                               <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                                  <IndianRupee size={16} />
                               </div>
                            </div>
                            <div className="text-2xl lg:text-3xl font-black text-neutral-900 tracking-tight">
                               ₹{totalClearSummary.avgPaid.toLocaleString('en-IN')}
                            </div>
                            <div className="text-xs font-medium text-neutral-500 mt-1">Per cleared student average</div>
                         </div>
                      </div>
                   )}

                    {/* STAT CARDS FOR TOTAL-EARNINGS */}
                    {expandedStat === "total-earnings" && (
                       <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                          <div 
                             onClick={() => setEarningsFilter("received")}
                             className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none relative overflow-hidden group ${
                                earningsFilter === "received"
                                   ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/40 shadow-md"
                                   : "bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border-emerald-200/80 hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5"
                             }`}
                          >
                             <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Total Received (Collected)</span>
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                                   earningsFilter === "received" ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-700"
                                }`}>
                                   <CheckCircle2 size={16} />
                                </div>
                             </div>
                             <div className="text-2xl lg:text-3xl font-black text-emerald-600 tracking-tight">
                                ₹{totalEarningsSummary.totalReceived.toLocaleString('en-IN')}
                             </div>
                             <div className="flex items-center justify-between mt-2 pt-1 border-t border-emerald-200/40">
                                <div className="text-xs font-medium text-emerald-700/80">Total revenue collected to date</div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full transition-all ${
                                   earningsFilter === "received" 
                                      ? "bg-emerald-600 text-white shadow-xs" 
                                      : "bg-emerald-100/90 text-emerald-800 group-hover:bg-emerald-200"
                                }`}>
                                   {earningsFilter === "received" ? "Active Filter" : "Click to view"}
                                </span>
                             </div>
                          </div>

                          <div 
                             onClick={() => setEarningsFilter(earningsFilter === "pending" ? "received" : "pending")}
                             className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none relative overflow-hidden group ${
                                earningsFilter === "pending"
                                   ? "bg-red-50 border-red-500 ring-2 ring-red-500/40 shadow-md"
                                   : "bg-gradient-to-br from-red-50 via-rose-50/50 to-white border-red-200/80 hover:border-red-400 hover:shadow-md hover:-translate-y-0.5"
                             }`}
                          >
                             <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Total Pending Dues</span>
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                                   earningsFilter === "pending" ? "bg-red-600 text-white" : "bg-red-100 text-red-600"
                                }`}>
                                   <AlertCircle size={16} />
                                </div>
                             </div>
                             <div className="text-2xl lg:text-3xl font-black text-red-600 tracking-tight">
                                ₹{totalEarningsSummary.totalPending.toLocaleString('en-IN')}
                             </div>
                             <div className="flex items-center justify-between mt-2 pt-1 border-t border-red-200/40">
                                <div className="text-xs font-medium text-red-500/90">Outstanding pending balance</div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full transition-all ${
                                   earningsFilter === "pending" 
                                      ? "bg-red-600 text-white shadow-xs" 
                                      : "bg-red-100/90 text-red-800 group-hover:bg-red-200"
                                }`}>
                                   {earningsFilter === "pending" ? "Filter Active" : "Click to filter"}
                                </span>
                             </div>
                          </div>

                          <div 
                             onClick={() => setEarningsFilter(earningsFilter === "all" ? "received" : "all")}
                             className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none relative overflow-hidden group ${
                                earningsFilter === "all"
                                   ? "bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/30 shadow-md"
                                   : "bg-white border-neutral-200 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5"
                             }`}
                          >
                             <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Expected Revenue</span>
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                                   earningsFilter === "all" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700"
                                }`}>
                                   <IndianRupee size={16} />
                                </div>
                             </div>
                             <div className="text-2xl lg:text-3xl font-black text-neutral-900 tracking-tight">
                                ₹{totalEarningsSummary.totalExpected.toLocaleString('en-IN')}
                             </div>
                             <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-100">
                                <div className="text-xs font-medium text-neutral-500">Agreed fees (Received + Pending)</div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full transition-all ${
                                   earningsFilter === "all" 
                                      ? "bg-blue-600 text-white shadow-xs" 
                                      : "bg-neutral-100 text-neutral-600 group-hover:bg-blue-50 group-hover:text-blue-700"
                                }`}>
                                   {earningsFilter === "all" ? "Filter Active" : "Click to view"}
                                </span>
                             </div>
                          </div>

                          <div 
                             onClick={() => setEarningsFilter("received")}
                             className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none relative overflow-hidden group ${
                                earningsFilter === "received"
                                   ? "bg-purple-50/50 border-purple-500 ring-2 ring-purple-500/30 shadow-md"
                                   : "bg-white border-neutral-200 hover:border-purple-300 hover:shadow-md hover:-translate-y-0.5"
                             }`}
                          >
                             <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Transactions</span>
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                                   earningsFilter === "received" ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-700"
                                }`}>
                                   <Activity size={16} />
                                </div>
                             </div>
                             <div className="text-2xl lg:text-3xl font-black text-neutral-900 tracking-tight">
                                {totalEarningsSummary.count}
                             </div>
                             <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-100">
                                <div className="text-xs font-medium text-neutral-500">Payment entries recorded</div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full transition-all ${
                                   earningsFilter === "received" 
                                      ? "bg-purple-600 text-white shadow-xs" 
                                      : "bg-neutral-100 text-neutral-600 group-hover:bg-purple-50 group-hover:text-purple-700"
                                }`}>
                                   {earningsFilter === "received" ? "Active" : "Click to view"}
                                </span>
                             </div>
                          </div>
                       </div>
                    )}
                   {/* STAT CARDS FOR TOTAL-PENDING-FEES */}
                   {expandedStat === "total-pending-fees" && (
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                         <div className="bg-gradient-to-br from-red-50 via-rose-50/50 to-white p-5 rounded-2xl border border-red-200/80 shadow-xs">
                            <div className="flex items-center justify-between mb-2">
                               <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Total Pending Dues</span>
                               <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                                  <AlertCircle size={16} />
                               </div>
                            </div>
                            <div className="text-2xl lg:text-3xl font-black text-red-600 tracking-tight">
                               ₹{pendingFeeStudentsData.reduce((acc, curr) => acc + (Number(curr.pendingFees) || 0), 0).toLocaleString('en-IN')}
                            </div>
                            <div className="text-xs font-medium text-red-500/80 mt-1">Total outstanding fee balance</div>
                         </div>

                         <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                            <div className="flex items-center justify-between mb-2">
                               <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Students with Dues</span>
                               <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
                                  <Users size={16} />
                               </div>
                            </div>
                            <div className="text-2xl lg:text-3xl font-black text-neutral-900 tracking-tight">
                               {pendingFeeStudentsData.length}
                            </div>
                            <div className="text-xs font-medium text-neutral-500 mt-1">Students awaiting payment</div>
                         </div>

                         <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                            <div className="flex items-center justify-between mb-2">
                               <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Fee Collected</span>
                               <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                  <CheckCircle2 size={16} />
                               </div>
                            </div>
                            <div className="text-2xl lg:text-3xl font-black text-emerald-600 tracking-tight">
                               ₹{pendingFeeStudentsData.reduce((acc, curr) => acc + (Number(curr.paidFees) || 0), 0).toLocaleString('en-IN')}
                            </div>
                            <div className="text-xs font-medium text-emerald-600/80 mt-1">Already received from them</div>
                         </div>

                         <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                            <div className="flex items-center justify-between mb-2">
                               <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Agreed Fees</span>
                               <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                                  <IndianRupee size={16} />
                               </div>
                            </div>
                            <div className="text-2xl lg:text-3xl font-black text-neutral-900 tracking-tight">
                               ₹{pendingFeeStudentsData.reduce((acc, curr) => acc + (Number(curr.totalFees) || 0), 0).toLocaleString('en-IN')}
                            </div>
                            <div className="text-xs font-medium text-neutral-500 mt-1">Total course fees for these students</div>
                         </div>
                      </div>
                   )}

                    {/* ACTIVE FILTER INDICATORS */}
                    {expandedStat === "total-students" && detailStatusFilter !== "All" && (
                       <div className="flex items-center justify-between mb-3 px-1">
                          <div className="flex items-center gap-2">
                             <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Filtered View:</span>
                             <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                detailStatusFilter === "Pending" 
                                   ? "bg-red-100 text-red-700 border border-red-200" 
                                   : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                             }`}>
                                <Filter size={12} />
                                {detailStatusFilter === "Pending" ? `Pending Dues (${totalStudentsSummary.pendingCount} Students)` : `Clear Fees (${totalStudentsSummary.clearCount} Students)`}
                             </span>
                          </div>
                          <button 
                             onClick={() => setDetailStatusFilter("All")}
                             className="text-xs font-bold text-neutral-600 hover:text-neutral-900 underline cursor-pointer flex items-center gap-1"
                          >
                             <X size={12} /> Clear Filter (Show All {totalStudentsSummary.count} Students)
                          </button>
                       </div>
                    )}

                    {expandedStat === "total-earnings" && (
                       <div className="flex items-center justify-between mb-3 px-1">
                          <div className="flex items-center gap-2">
                             <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Table View:</span>
                             <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                earningsFilter === "pending" 
                                   ? "bg-red-100 text-red-700 border border-red-200" 
                                   : earningsFilter === "all"
                                   ? "bg-blue-100 text-blue-700 border border-blue-200"
                                   : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                             }`}>
                                <Filter size={12} />
                                {earningsFilter === "pending" ? `Students with Pending Dues (${pendingFeeStudentsData.length})` :
                                 earningsFilter === "all" ? `All Students Revenue Breakdown (${allStudentsData.length || students.length})` :
                                 `Received Payment Transactions (${earningsDetailsData.length})`}
                             </span>
                          </div>
                          {earningsFilter !== "received" && (
                             <button 
                                onClick={() => setEarningsFilter("received")}
                                className="text-xs font-bold text-neutral-600 hover:text-neutral-900 underline cursor-pointer flex items-center gap-1"
                             >
                                <X size={12} /> Reset to Received Transactions
                             </button>
                          )}
                       </div>
                    )}

                   <div className="flex-1 border border-neutral-200/80 rounded-[22px] overflow-hidden bg-white shadow-2xs overflow-x-auto">
                      {(() => {
                         if (expandedStat === "total-students") {
                            const filteredStudents = allStudentsData
                               .filter(row => {
                                  if (detailStatusFilter === "Clear") {
                                     if (Number(row.pendingFees) > 0 || row.feesStatus === "Pending") return false;
                                  } else if (detailStatusFilter === "Pending") {
                                     if (Number(row.pendingFees) <= 0 && row.feesStatus !== "Pending" && row.feesStatus !== "Partial") return false;
                                  }
                                  if (!detailSearch.trim()) return true;
                                  const q = detailSearch.toLowerCase().trim();
                                  const name = (row.name || '').toLowerCase();
                                  const id = (row.id || '').toLowerCase();
                                  const phone = (row.phone || '').toLowerCase();
                                  const courseStr = Array.isArray(row.course) ? row.course.join(' ').toLowerCase() : (row.course || '').toLowerCase();
                                  return name.includes(q) || id.includes(q) || phone.includes(q) || courseStr.includes(q);
                               });

                            const sumTotal = filteredStudents.reduce((acc, curr) => acc + (Number(curr.totalFees) || 0), 0);
                            const sumPaid = filteredStudents.reduce((acc, curr) => acc + (Number(curr.paidFees) || 0), 0);
                            const sumPending = filteredStudents.reduce((acc, curr) => acc + (Number(curr.pendingFees) || 0), 0);

                            return (
                               <table className="w-full text-left border-collapse text-sm">
                                  <thead className="bg-neutral-50/70 border-b border-neutral-100">
                                     <tr>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">ID</th>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Student Name</th>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Course</th>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Duration</th>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Fee</th>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Paid Fee</th>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Pending Fee</th>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Action</th>
                                     </tr>
                                  </thead>
                                  <tbody className="divide-y divide-neutral-100">
                                     {filteredStudents.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                                           <td className="px-3 py-3 text-sm font-mono font-semibold text-blue-600">{row.id}</td>
                                           <td className="px-3 py-3 text-sm">
                                              <div className="flex items-center gap-3">
                                                 <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase">{row.name.charAt(0)}</div>
                                                 <div className="font-bold text-neutral-900 capitalize">{row.name}</div>
                                              </div>
                                           </td>
                                           <td className="px-3 py-3 text-sm font-semibold text-neutral-700">{Array.isArray(row.course) ? row.course.join(", ") : row.course}</td>
                                           <td className="px-3 py-3 text-sm text-neutral-600">{row.duration}</td>
                                           <td className="px-3 py-3 text-sm font-bold text-neutral-900">₹{(row.totalFees || 0).toLocaleString('en-IN')}</td>
                                           <td className="px-3 py-3 text-sm font-bold text-emerald-600">₹{(row.paidFees || 0).toLocaleString('en-IN')}</td>
                                           <td className="px-3 py-3 text-sm font-bold text-red-600">₹{(row.pendingFees || 0).toLocaleString('en-IN')}</td>
                                           <td className="px-3 py-3 text-sm">
                                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${row.feesStatus === 'Clear' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                                                 {row.feesStatus}
                                              </span>
                                           </td>
                                           <td className="px-3 py-3 text-sm">
                                              <div className="flex items-center gap-2">
                                                 <button 
                                                   onClick={() => setViewingStudent(row)} 
                                                   className="text-neutral-600 hover:text-neutral-700 text-sm font-bold underline cursor-pointer"
                                                 >
                                                   Details
                                                 </button>
                                                 {row.certificates && row.certificates.length > 0 && (
                                                    <button
                                                       onClick={() => handleDownloadCertificateDirect(row.id, row.name, Array.isArray(row.course) ? row.course[0] : row.course, row.certificates[0]?.url)}
                                                       disabled={downloadingCertId?.startsWith(row.id)}
                                                       className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs disabled:opacity-50"
                                                       title="Download Certificate"
                                                    >
                                                       <Download size={11} />
                                                       Cert
                                                    </button>
                                                 )}
                                              </div>
                                           </td>
                                        </tr>
                                     ))}
                                     {filteredStudents.length === 0 && (
                                        <tr>
                                           <td colSpan={9} className="py-20 text-center text-neutral-400 italic">No students found matching your criteria.</td>
                                        </tr>
                                     )}
                                  </tbody>
                                  {filteredStudents.length > 0 && (
                                     <tfoot className="bg-neutral-900 text-white border-t-2 border-neutral-800">
                                        <tr>
                                           <td colSpan={4} className="px-3 py-4 text-xs font-bold uppercase tracking-wider text-neutral-300">
                                              Total Summary ({filteredStudents.length} Students)
                                           </td>
                                           <td className="px-3 py-4 text-sm font-bold text-neutral-100">
                                              ₹{sumTotal.toLocaleString('en-IN')}
                                           </td>
                                           <td className="px-3 py-4 text-sm font-bold text-emerald-400">
                                              ₹{sumPaid.toLocaleString('en-IN')}
                                           </td>
                                           <td className="px-3 py-4 text-base font-black text-rose-400">
                                              ₹{sumPending.toLocaleString('en-IN')}
                                           </td>
                                           <td colSpan={2} className="px-3 py-4 text-xs font-semibold text-neutral-400">
                                              {filteredStudents.filter(s => Number(s.pendingFees) <= 0).length} Clear • {filteredStudents.filter(s => Number(s.pendingFees) > 0).length} Pending
                                           </td>
                                        </tr>
                                     </tfoot>
                                  )}
                               </table>
                            );
                         }
                         
                         if (expandedStat === "certificate-issued") {
                            return (
                               <table className="w-full text-left border-collapse text-sm">
                                  <thead className="bg-neutral-50/70 border-b border-neutral-100">
                                     <tr>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Student ID</th>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Student Name</th>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Issued Courses</th>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                                     </tr>
                                  </thead>
                                  <tbody className="divide-y divide-neutral-100">
                                     {studentsWithCertificates.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                                           <td className="px-3 py-3 text-sm font-mono font-semibold text-emerald-600">{row.studentId}</td>
                                           <td className="px-3 py-3 text-sm font-bold text-neutral-900 capitalize">{row.studentName}</td>
                                           <td className="px-3 py-3 text-sm font-semibold text-neutral-700">
                                              <div className="flex flex-wrap gap-2">
                                                 {row.issuedCourses.map((course: string, courseIdx: number) => (
                                                    <span key={courseIdx} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                                                       {course}
                                                    </span>
                                                 ))}
                                              </div>
                                           </td>
                                           <td className="px-3 py-3 text-sm text-right">
                                              <div className="flex items-center justify-end gap-2">
                                                 {row.issuedCourses.map((course: string, cIdx: number) => (
                                                    <button
                                                       key={cIdx}
                                                       onClick={() => handleDownloadCertificateDirect(row.studentId, row.studentName, course)}
                                                       disabled={downloadingCertId === `${row.studentId}_${course}`}
                                                       className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs disabled:opacity-50"
                                                       title={`Download ${course} Certificate`}
                                                    >
                                                       <Download size={12} />
                                                       {downloadingCertId === `${row.studentId}_${course}` ? "..." : (row.issuedCourses.length > 1 ? `Download ${course}` : "Download")}
                                                    </button>
                                                 ))}
                                                 <button
                                                    onClick={() => {
                                                       const fullStudent = allStudentsData.find(s => s.id === row.studentId);
                                                       if (fullStudent) {
                                                          setViewingStudent(fullStudent);
                                                       } else if (row.rawItem) {
                                                          setViewingStudent({
                                                             id: row.rawItem.student_ID,
                                                             name: row.rawItem.student_name,
                                                             feesStatus: row.rawItem.fees_status || "Clear",
                                                             course: row.rawItem.selected_course_name,
                                                             duration: row.rawItem.course_duration,
                                                             totalFees: row.rawItem.total_fee,
                                                             paidFees: row.rawItem.total_paid_fee,
                                                             pendingFees: row.rawItem.total_pending_fee,
                                                             email: row.rawItem.email,
                                                             phone: row.rawItem.phone,
                                                             address: row.rawItem.address,
                                                             certificates: row.rawItem.certificates || [],
                                                             admissions: row.rawItem.admissions || [],
                                                             fee: row.rawItem.fee || []
                                                          } as any);
                                                       }
                                                    }}
                                                    className="text-neutral-600 hover:text-neutral-700 text-sm font-bold underline cursor-pointer"
                                                 >
                                                    Details
                                                 </button>
                                              </div>
                                           </td>
                                        </tr>
                                     ))}
                                     {studentsWithCertificates.length === 0 && (
                                        <tr>
                                           <td colSpan={4} className="py-20 text-center text-neutral-400 italic">No issued certificates found.</td>
                                        </tr>
                                     )}
                                  </tbody>
                               </table>
                            );
                         }

                         if (expandedStat === "certificate-unissued") {
                            return (
                               <table className="w-full text-left border-collapse text-sm">
                                  <thead className="bg-neutral-50/70 border-b border-neutral-100">
                                     <tr>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">ID</th>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Student Name</th>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Course</th>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Action</th>
                                     </tr>
                                  </thead>
                                  <tbody className="divide-y divide-neutral-100">
                                     {unissuedCertificatesData.map((row: Student, idx) => (
                                        <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                                           <td className="px-3 py-3 text-sm font-mono font-semibold text-blue-600">{row.id}</td>
                                           <td className="px-3 py-3 text-sm font-bold text-neutral-900 capitalize">{row.name}</td>
                                           <td className="px-3 py-3 text-sm font-semibold text-neutral-700">{Array.isArray(row.course) ? row.course.join(", ") : row.course}</td>
                                           <td className="px-3 py-3 text-sm">
                                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                                 row.feesStatus === 'Clear' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                                              }`}>
                                                 {row.feesStatus}
                                              </span>
                                           </td>
                                           <td className="px-3 py-3 text-sm">
                                              <div className="flex items-center gap-2">
                                                <button 
                                                  onClick={() => setViewingStudent(row)} 
                                                  className="text-neutral-600 hover:text-neutral-700 text-sm font-bold underline cursor-pointer"
                                                >
                                                  Details
                                                </button>
                                                <button
                                                  onClick={() => handleDirectAutoGenerate(row)}
                                                  disabled={autoGeneratingId === row.id || row.feesStatus !== 'Clear' || Boolean(row.pendingFees && Number(row.pendingFees) > 0)}
                                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-2xs ${
                                                    row.feesStatus === 'Clear' && (!row.pendingFees || Number(row.pendingFees) <= 0)
                                                      ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 cursor-pointer'
                                                      : 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed opacity-60'
                                                  }`}
                                                  title={row.feesStatus === 'Clear' && (!row.pendingFees || Number(row.pendingFees) <= 0) ? "Template aur QR code ke sath automatically certificate banayein" : `Fee pending (₹${row.pendingFees || 0}). Clear fee first to generate certificate.`}
                                                >
                                                  <Award size={12} />
                                                  {autoGeneratingId === row.id ? "..." : (row.feesStatus === 'Clear' && (!row.pendingFees || Number(row.pendingFees) <= 0) ? "⚡ Generate" : "🔒 Fee Pending")}
                                                </button>
                                              </div>
                                           </td>
                                        </tr>
                                     ))}
                                     {unissuedCertificatesData.length === 0 && (
                                        <tr>
                                           <td colSpan={5} className="py-20 text-center text-neutral-400 italic">No unissued certificates found.</td>
                                        </tr>
                                     )}
                                  </tbody>
                               </table>
                            );
                         }

                          if (expandedStat === "total-earnings") {
                             if (earningsFilter === "pending") {
                                const filteredPending = pendingFeeStudentsData.filter(s => {
                                   if (!detailSearch.trim()) return true;
                                   const q = detailSearch.toLowerCase().trim();
                                   const name = (s.name || '').toLowerCase();
                                   const id = (s.id || '').toLowerCase();
                                   const phone = (s.phone || '').toLowerCase();
                                   const courseStr = Array.isArray(s.course) ? s.course.join(' ').toLowerCase() : (s.course || '').toLowerCase();
                                   return name.includes(q) || id.includes(q) || phone.includes(q) || courseStr.includes(q);
                                });

                                const sumTotal = filteredPending.reduce((acc, curr) => acc + (Number(curr.totalFees) || 0), 0);
                                const sumPaid = filteredPending.reduce((acc, curr) => acc + (Number(curr.paidFees) || 0), 0);
                                const sumPending = filteredPending.reduce((acc, curr) => acc + (Number(curr.pendingFees) || 0), 0);

                                return (
                                   <table className="w-full text-left border-collapse text-sm">
                                      <thead className="bg-neutral-50/70 border-b border-neutral-100">
                                         <tr>
                                            <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">ID</th>
                                            <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Student Name</th>
                                            <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Course</th>
                                            <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Duration</th>
                                            <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Fee</th>
                                            <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Paid Fee</th>
                                            <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Pending Fee</th>
                                            <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                                            <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Action</th>
                                         </tr>
                                      </thead>
                                      <tbody className="divide-y divide-neutral-100">
                                         {filteredPending.map((row: Student, idx: number) => (
                                            <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                                               <td className="px-3 py-3 text-sm font-mono font-semibold text-blue-600">{row.id}</td>
                                               <td className="px-3 py-3 text-sm">
                                                  <div className="flex items-center gap-3">
                                                     <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs uppercase">{row.name.charAt(0)}</div>
                                                     <div className="font-bold text-neutral-900 capitalize">{row.name}</div>
                                                  </div>
                                               </td>
                                               <td className="px-3 py-3 text-sm font-semibold text-neutral-700">{Array.isArray(row.course) ? row.course.join(", ") : row.course}</td>
                                               <td className="px-3 py-3 text-sm text-neutral-600">{row.duration}</td>
                                               <td className="px-3 py-3 text-sm font-bold text-neutral-900">₹{(row.totalFees || 0).toLocaleString('en-IN')}</td>
                                               <td className="px-3 py-3 text-sm font-bold text-emerald-600">₹{(row.paidFees || 0).toLocaleString('en-IN')}</td>
                                               <td className="px-3 py-3 text-sm font-bold text-red-600">₹{(row.pendingFees || 0).toLocaleString('en-IN')}</td>
                                               <td className="px-3 py-3 text-sm">
                                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                                                     {row.feesStatus || 'Pending'}
                                                  </span>
                                               </td>
                                               <td className="px-3 py-3 text-sm">
                                                  <button 
                                                    onClick={() => setViewingStudent(row)} 
                                                    className="text-neutral-600 hover:text-neutral-700 text-sm font-bold underline cursor-pointer"
                                                  >
                                                    Details
                                                  </button>
                                               </td>
                                            </tr>
                                         ))}
                                         {filteredPending.length === 0 && (
                                            <tr>
                                               <td colSpan={9} className="py-20 text-center text-neutral-400 italic">No students with pending dues found.</td>
                                            </tr>
                                         )}
                                      </tbody>
                                      {filteredPending.length > 0 && (
                                         <tfoot className="bg-neutral-900 text-white border-t-2 border-neutral-800">
                                            <tr>
                                               <td colSpan={4} className="px-3 py-4 text-xs font-bold uppercase tracking-wider text-neutral-300">
                                                  Total Pending Summary ({filteredPending.length} Students)
                                               </td>
                                               <td className="px-3 py-4 text-sm font-bold text-neutral-100">
                                                  ₹{sumTotal.toLocaleString('en-IN')}
                                               </td>
                                               <td className="px-3 py-4 text-sm font-bold text-emerald-400">
                                                  ₹{sumPaid.toLocaleString('en-IN')}
                                               </td>
                                               <td className="px-3 py-4 text-base font-black text-rose-400">
                                                  ₹{sumPending.toLocaleString('en-IN')}
                                               </td>
                                               <td colSpan={2} className="px-3 py-4 text-xs font-semibold text-rose-300">
                                                  Total Outstanding Dues
                                               </td>
                                            </tr>
                                         </tfoot>
                                      )}
                                   </table>
                                );
                             }

                             if (earningsFilter === "all") {
                                const studentList = allStudentsData.length > 0 ? allStudentsData : students;
                                const filteredAll = studentList.filter(row => {
                                   if (!detailSearch.trim()) return true;
                                   const q = detailSearch.toLowerCase().trim();
                                   const name = (row.name || '').toLowerCase();
                                   const id = (row.id || '').toLowerCase();
                                   const phone = (row.phone || '').toLowerCase();
                                   const courseStr = Array.isArray(row.course) ? row.course.join(' ').toLowerCase() : (row.course || '').toLowerCase();
                                   return name.includes(q) || id.includes(q) || phone.includes(q) || courseStr.includes(q);
                                });

                                const sumTotal = filteredAll.reduce((acc, curr) => acc + (Number(curr.totalFees) || 0), 0);
                                const sumPaid = filteredAll.reduce((acc, curr) => acc + (Number(curr.paidFees) || 0), 0);
                                const sumPending = filteredAll.reduce((acc, curr) => acc + (Number(curr.pendingFees) || 0), 0);

                                return (
                                   <table className="w-full text-left border-collapse text-sm">
                                      <thead className="bg-neutral-50/70 border-b border-neutral-100">
                                         <tr>
                                            <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">ID</th>
                                            <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Student Name</th>
                                            <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Course</th>
                                            <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Duration</th>
                                            <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Fee</th>
                                            <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Paid Fee</th>
                                            <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Pending Fee</th>
                                            <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                                            <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Action</th>
                                         </tr>
                                      </thead>
                                      <tbody className="divide-y divide-neutral-100">
                                         {filteredAll.map((row: Student, idx: number) => (
                                            <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                                               <td className="px-3 py-3 text-sm font-mono font-semibold text-blue-600">{row.id}</td>
                                               <td className="px-3 py-3 text-sm">
                                                  <div className="flex items-center gap-3">
                                                     <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase">{row.name.charAt(0)}</div>
                                                     <div className="font-bold text-neutral-900 capitalize">{row.name}</div>
                                                  </div>
                                               </td>
                                               <td className="px-3 py-3 text-sm font-semibold text-neutral-700">{Array.isArray(row.course) ? row.course.join(", ") : row.course}</td>
                                               <td className="px-3 py-3 text-sm text-neutral-600">{row.duration}</td>
                                               <td className="px-3 py-3 text-sm font-bold text-neutral-900">₹{(row.totalFees || 0).toLocaleString('en-IN')}</td>
                                               <td className="px-3 py-3 text-sm font-bold text-emerald-600">₹{(row.paidFees || 0).toLocaleString('en-IN')}</td>
                                               <td className="px-3 py-3 text-sm font-bold text-red-600">₹{(row.pendingFees || 0).toLocaleString('en-IN')}</td>
                                               <td className="px-3 py-3 text-sm">
                                                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${row.feesStatus === 'Clear' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                                                     {row.feesStatus}
                                                  </span>
                                               </td>
                                               <td className="px-3 py-3 text-sm">
                                                  <button 
                                                    onClick={() => setViewingStudent(row)} 
                                                    className="text-neutral-600 hover:text-neutral-700 text-sm font-bold underline cursor-pointer"
                                                  >
                                                    Details
                                                  </button>
                                               </td>
                                            </tr>
                                         ))}
                                         {filteredAll.length === 0 && (
                                            <tr>
                                               <td colSpan={9} className="py-20 text-center text-neutral-400 italic">No student revenue records found.</td>
                                            </tr>
                                         )}
                                      </tbody>
                                      {filteredAll.length > 0 && (
                                         <tfoot className="bg-neutral-900 text-white border-t-2 border-neutral-800">
                                            <tr>
                                               <td colSpan={4} className="px-3 py-4 text-xs font-bold uppercase tracking-wider text-neutral-300">
                                                  Total Expected Revenue ({filteredAll.length} Students)
                                               </td>
                                               <td className="px-3 py-4 text-sm font-bold text-neutral-100">
                                                  ₹{sumTotal.toLocaleString('en-IN')}
                                               </td>
                                               <td className="px-3 py-4 text-sm font-bold text-emerald-400">
                                                  ₹{sumPaid.toLocaleString('en-IN')}
                                               </td>
                                               <td className="px-3 py-4 text-base font-black text-rose-400">
                                                  ₹{sumPending.toLocaleString('en-IN')}
                                               </td>
                                               <td colSpan={2} className="px-3 py-4 text-xs font-semibold text-neutral-400">
                                                  {filteredAll.filter(s => Number(s.pendingFees) <= 0).length} Clear • {filteredAll.filter(s => Number(s.pendingFees) > 0).length} Pending
                                               </td>
                                            </tr>
                                         </tfoot>
                                      )}
                                   </table>
                                );
                             }

                             const filteredEarnings = earningsDetailsData.filter(row => {
                                if (!detailSearch.trim()) return true;
                                const q = detailSearch.toLowerCase().trim();
                                const txn = (row.txn_id || '').toLowerCase();
                                const student = (row.student_name || '').toLowerCase();
                                const method = (row.method || '').toLowerCase();
                                return txn.includes(q) || student.includes(q) || method.includes(q);
                             });
                             const sumEarningsFiltered = filteredEarnings.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

                             return (
                                <table className="w-full text-left border-collapse text-sm">
                                   <thead className="bg-neutral-50/70 border-b border-neutral-100">
                                      <tr>
                                         <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">TXN ID</th>
                                         <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Student Name</th>
                                         <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Amount</th>
                                         <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Date</th>
                                         <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Method</th>
                                      </tr>
                                   </thead>
                                   <tbody className="divide-y divide-neutral-100">
                                      {filteredEarnings.map((row, idx) => (
                                         <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                                            <td className="px-3 py-3 text-sm font-mono font-semibold text-purple-600 truncate max-w-[150px]" title={row.txn_id}>{row.txn_id}</td>
                                            <td className="px-3 py-3 text-sm font-bold text-neutral-900 capitalize">{row.student_name}</td>
                                            <td className="px-3 py-3 text-sm font-bold text-emerald-600">₹{Number(row.amount).toLocaleString('en-IN')}</td>
                                            <td className="px-3 py-3 text-sm text-neutral-600">
                                               {new Date(row.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-3 py-3 text-sm font-semibold text-neutral-700 uppercase">{row.method}</td>
                                         </tr>
                                      ))}
                                      {filteredEarnings.length === 0 && (
                                         <tr>
                                            <td colSpan={5} className="py-20 text-center text-neutral-400 italic">
                                               {detailSearch ? "No earnings records matching your search." : "No earnings records found."}
                                            </td>
                                         </tr>
                                      )}
                                   </tbody>
                                   {filteredEarnings.length > 0 && (
                                      <tfoot className="bg-neutral-900 text-white border-t-2 border-neutral-800">
                                         <tr>
                                            <td colSpan={2} className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-neutral-300">
                                               Total Received ({filteredEarnings.length} Transactions)
                                            </td>
                                            <td className="px-3 py-4 text-base font-black text-emerald-400">
                                               ₹{sumEarningsFiltered.toLocaleString('en-IN')}
                                            </td>
                                            <td colSpan={2} className="px-4 py-4 text-xs font-semibold text-neutral-400">
                                               System Pending Dues: <span className="text-rose-400 font-bold ml-1">₹{totalEarningsSummary.totalPending.toLocaleString('en-IN')}</span>
                                            </td>
                                         </tr>
                                      </tfoot>
                                   )}
                                </table>
                             );
                          }
                         if (expandedStat === "total-pending-fees") {
                            const filteredList = pendingFeeStudentsData.filter(s => {
                               if (!detailSearch.trim()) return true;
                               const q = detailSearch.toLowerCase().trim();
                               const name = (s.name || '').toLowerCase();
                               const id = (s.id || '').toLowerCase();
                               const phone = (s.phone || '').toLowerCase();
                               const courseStr = Array.isArray(s.course) ? s.course.join(' ').toLowerCase() : (s.course || '').toLowerCase();
                               return name.includes(q) || id.includes(q) || phone.includes(q) || courseStr.includes(q);
                            });

                            const sumTotalFees = filteredList.reduce((acc, curr) => acc + Number(curr.totalFees || 0), 0);
                            const sumPaidFees = filteredList.reduce((acc, curr) => acc + Number(curr.paidFees || 0), 0);
                            const sumPendingFees = filteredList.reduce((acc, curr) => acc + Number(curr.pendingFees || 0), 0);

                            return (
                               <table className="w-full text-left border-collapse text-sm">
                                  <thead className="bg-neutral-50/70 border-b border-neutral-100">
                                     <tr>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">ID</th>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Student Name</th>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Course</th>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Fee</th>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Paid Fee</th>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Pending Fee</th>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Phone Number</th>
                                     </tr>
                                  </thead>
                                  <tbody className="divide-y divide-neutral-100">
                                     {filteredList.map((row: Student, idx) => (
                                        <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                                           <td className="px-3 py-3 text-sm font-mono font-semibold text-red-600">{row.id}</td>
                                           <td className="px-3 py-3 text-sm font-bold text-neutral-900 capitalize">{row.name}</td>
                                           <td className="px-3 py-3 text-sm font-semibold text-neutral-700">{Array.isArray(row.course) ? row.course.join(", ") : row.course}</td>
                                           <td className="px-3 py-3 text-sm font-bold text-neutral-900">₹{Number(row.totalFees).toLocaleString('en-IN')}</td>
                                           <td className="px-3 py-3 text-sm font-bold text-emerald-600">₹{Number(row.paidFees).toLocaleString('en-IN')}</td>
                                           <td className="px-3 py-3 text-sm font-bold text-red-600">₹{Number(row.pendingFees).toLocaleString('en-IN')}</td>
                                           <td className="px-3 py-3 text-sm font-semibold text-neutral-700">{row.phone}</td>
                                        </tr>
                                     ))}
                                     {filteredList.length === 0 && (
                                        <tr>
                                           <td colSpan={7} className="py-20 text-center text-neutral-400 italic">
                                              {detailSearch ? "No students matching your search." : "No students with pending fees found."}
                                           </td>
                                        </tr>
                                     )}
                                  </tbody>
                                  {filteredList.length > 0 && (
                                     <tfoot className="bg-neutral-900 text-white border-t-2 border-neutral-800">
                                        <tr>
                                           <td colSpan={3} className="px-3 py-4 text-xs font-bold uppercase tracking-wider text-neutral-300">
                                              Total Pending Dues ({filteredList.length} {filteredList.length === 1 ? 'Student' : 'Students'})
                                           </td>
                                           <td className="px-3 py-4 text-sm font-bold text-neutral-100">
                                              ₹{sumTotalFees.toLocaleString('en-IN')}
                                           </td>
                                           <td className="px-3 py-4 text-sm font-bold text-emerald-400">
                                              ₹{sumPaidFees.toLocaleString('en-IN')}
                                           </td>
                                           <td className="px-3 py-4 text-base font-black text-rose-400">
                                              ₹{sumPendingFees.toLocaleString('en-IN')}
                                           </td>
                                           <td className="px-3 py-4 text-xs font-semibold text-neutral-400">
                                              Total Dues: ₹{sumPendingFees.toLocaleString('en-IN')}
                                           </td>
                                        </tr>
                                     </tfoot>
                                  )}
                               </table>
                            );
                         }
                         if (expandedStat === "total-clear-fees") {
                            const filteredClear = clearFeeStudentsData.filter(s => {
                               if (!detailSearch.trim()) return true;
                               const q = detailSearch.toLowerCase().trim();
                               const name = (s.name || '').toLowerCase();
                               const id = (s.id || '').toLowerCase();
                               const phone = (s.phone || '').toLowerCase();
                               const courseStr = Array.isArray(s.course) ? s.course.join(' ').toLowerCase() : (s.course || '').toLowerCase();
                               return name.includes(q) || id.includes(q) || phone.includes(q) || courseStr.includes(q);
                            });
                            const sumPaidClear = filteredClear.reduce((acc, curr) => acc + Number(curr.paidFees || 0), 0);

                            return (
                               <table className="w-full text-left border-collapse text-sm">
                                  <thead className="bg-neutral-50/70 border-b border-neutral-100">
                                     <tr>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">ID</th>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Student Name</th>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Course</th>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Paid</th>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                                        <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Action</th>
                                     </tr>
                                  </thead>
                                  <tbody className="divide-y divide-neutral-100">
                                     {filteredClear.map((row: Student, idx) => (
                                        <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                                           <td className="px-3 py-3 text-sm font-mono font-semibold text-cyan-600">{row.id}</td>
                                           <td className="px-3 py-3 text-sm font-bold text-neutral-900 capitalize">{row.name}</td>
                                           <td className="px-3 py-3 text-sm font-semibold text-neutral-700">{Array.isArray(row.course) ? row.course.join(", ") : row.course}</td>
                                           <td className="px-3 py-3 text-sm font-bold text-emerald-600">₹{Number(row.paidFees).toLocaleString('en-IN')}</td>
                                           <td className="px-3 py-3 text-sm"><span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Clear</span></td>
                                           <td className="px-3 py-3 text-sm">
                                              <button 
                                                onClick={() => setViewingStudent(row)} 
                                                className="text-neutral-600 hover:text-neutral-700 text-sm font-bold underline cursor-pointer"
                                              >
                                                Details
                                              </button>
                                           </td>
                                        </tr>
                                     ))}
                                     {filteredClear.length === 0 && (
                                        <tr>
                                           <td colSpan={6} className="py-20 text-center text-neutral-400 italic">
                                              {detailSearch ? "No cleared fee students matching your search." : "No students with clear fees found."}
                                           </td>
                                        </tr>
                                     )}
                                  </tbody>
                                  {filteredClear.length > 0 && (
                                     <tfoot className="bg-neutral-900 text-white border-t-2 border-neutral-800">
                                        <tr>
                                           <td colSpan={3} className="px-3 py-4 text-xs font-bold uppercase tracking-wider text-neutral-300">
                                              Total Cleared Fees ({filteredClear.length} {filteredClear.length === 1 ? 'Student' : 'Students'})
                                           </td>
                                           <td className="px-3 py-4 text-sm font-black text-emerald-400">
                                              ₹{sumPaidClear.toLocaleString('en-IN')}
                                           </td>
                                           <td className="px-3 py-4 text-xs font-semibold text-emerald-300">
                                              100% Cleared
                                           </td>
                                           <td className="px-3 py-4 text-xs font-semibold text-neutral-400">
                                              ₹0 Pending
                                           </td>
                                        </tr>
                                     </tfoot>
                                  )}
                               </table>
                            );
                         }




                         return null;
                      })()}
                   </div>
                </div>
             </div>
          )}

          {/* INQUIRY PAGE */}
          {activeTab === "inquiry" && <InquiryTab />}

          {/* REFERRED BY PAGE */}
          {activeTab === "referred-by" && (
             <ReferredByTab
                selectedReferrer={selectedReferrer}
                setSelectedReferrer={setSelectedReferrer}
                referrerStatusFilter={referrerStatusFilter}
                setReferrerStatusFilter={setReferrerStatusFilter}
                referrerStudents={referrerStudents}
                referrers={referrers}
                handleReferrerClick={handleReferrerClick}
                setEditingReferrer={setEditingReferrer}
                setIsReferrerModalOpen={setIsReferrerModalOpen}
                handleClearReferrerAmount={handleClearReferrerAmount}
                handleDeleteReferrer={handleDeleteReferrer}
             />
          )}

          {/* DELETED REFERRERS PAGE */}
          {activeTab === "deleted-referrers" && (
             <DeletedReferrersTab 
                deletedReferrers={deletedReferrers}
                handleRestoreReferrer={handleRestoreReferrer}
             />
          )}

          {/* DELETED STUDENTS PAGE */}
          {activeTab === "deleted-students" && (
             <DeletedStudentsTab 
                deletedStudents={deletedStudents}
                handleRestoreStudent={handleRestoreStudent}
             />
          )}

          {/* STUDENT LEADS CRM PAGE */}
          {(activeTab === "student-crm" || activeTab === "student-leads") && (
             <StudentLeadCrmTab />
          )}
            </>
          )}
        </div>
      </main>

      {/* --- MODALS --- */}

      {/* Edit Referrer Modal */}
      {isReferrerModalOpen && (
        <ReferrerModal 
          referrer={editingReferrer} 
          onClose={() => setIsReferrerModalOpen(false)} 
          onSave={handleSaveReferrer} 
        />
      )}



      {/* Details Modal */}
      {viewingStudent && (
         <StudentDetailsModal 
            student={viewingStudent} 
            onClose={() => setViewingStudent(null)} 
            onDelete={() => {
               const st = viewingStudent;
               setViewingStudent(null);
               handleDeleteStudent(st.id, st.name);
            }}
         />
      )}

      {/* Student Fee Bill / Invoice Modal */}
      {invoicingStudent && (
        <StudentInvoiceModal 
          student={invoicingStudent.student} 
          initialPaymentIndex={invoicingStudent.paymentIndex}
          onClose={() => setInvoicingStudent(null)} 
        />
      )}

      {/* Add / Edit Student Modal */}
      {isStudentModalOpen && (
        <StudentModal 
          student={editingStudent} 
          onClose={() => setIsStudentModalOpen(false)} 
          onSave={handleSaveStudent} 
        />
      )}

      {/* Set Referred Amount Modal */}
      {isSetAmountModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={() => setIsSetAmountModalOpen(false)}></div>
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full relative z-10 shadow-2xl animate-in zoom-in-95">
               <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
                  <IndianRupee className="text-orange-600" /> Set Referred Amount
               </h3>
               <div className="mb-6">
                  <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Amount (₹)</label>
                  <input type="number" placeholder="E.g. 500" value={globalReferralAmount} onChange={(e) => setGlobalReferralAmount(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-orange-500 focus:outline-none transition-all text-neutral-900 shadow-sm" />
               </div>
               <div className="flex gap-3">
                  <button onClick={() => setIsSetAmountModalOpen(false)} className="flex-1 py-2.5 rounded-xl font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer">Cancel</button>
                  <button onClick={handleSetReferralAmount} className="flex-1 py-2.5 rounded-xl font-semibold text-white bg-orange-600 hover:bg-orange-700 transition-colors shadow-sm cursor-pointer">Submit</button>
               </div>
            </div>
         </div>
      )}

      {/* Logout Modal */}
      {isLogoutModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={() => setIsLogoutModalOpen(false)}></div>
            <div className="relative bg-white border border-neutral-200 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200">
               <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <LogOut size={32} />
               </div>
               <h3 className="text-2xl font-bold text-neutral-900 mb-2">Confirm Logout</h3>
               <p className="text-neutral-500 text-sm mb-8">Are you sure you want to securely end your admin session?</p>
               <div className="flex gap-4">
                  <button onClick={() => setIsLogoutModalOpen(false)} className="flex-1 py-3 bg-white hover:bg-neutral-50 text-neutral-700 rounded-xl font-semibold transition-colors border border-neutral-200 shadow-sm">Cancel</button>
                  <button onClick={handleLogout} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-red-600/20">Logout Now</button>
               </div>
            </div>
         </div>
      )}

      {/* Notification Message Modal */}
      {selectedNotification && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={() => setSelectedNotification(null)}></div>
            <div className="relative bg-white border border-neutral-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
               <div className="p-6 border-b border-neutral-100 flex items-start justify-between bg-neutral-50/50">
                  <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md ${selectedNotification.color === 'blue' ? 'bg-blue-500' : 'bg-green-500'}`}>
                        <selectedNotification.icon size={24} />
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-neutral-900">{selectedNotification.title}</h3>
                        <p className="text-sm text-neutral-500 font-semibold">{selectedNotification.sender} &bull; {selectedNotification.date}</p>
                     </div>
                  </div>
                  <button onClick={() => setSelectedNotification(null)} className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer">
                     <X size={20} />
                  </button>
               </div>
               <div className="p-8">
                  <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-6 text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed shadow-inner">
                     {selectedNotification.content}
                  </div>
               </div>
               <div className="p-6 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3">
                  <button onClick={() => setSelectedNotification(null)} className="px-6 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-50 transition-colors shadow-sm cursor-pointer">Close</button>
               </div>
            </div>
         </div>
      )}

      {/* Floating Bottom Center Navigation Dock with Authentic Neumorphism Effect */}
      <nav 
        aria-label="Main Navigation Dock"
        className="hidden lg:block fixed bottom-8 sm:bottom-10 md:bottom-12 lg:bottom-14 left-1/2 -translate-x-1/2 z-40 max-w-[96vw] animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto"
      >
        <div className="neumorphism-dock px-3 sm:px-4 py-2.5 sm:py-3 min-h-[72px] sm:min-h-[78px] md:min-h-[82px] flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar max-w-full">
          <button
            onClick={() => navigate("/admin/dashboard/dashboard")}
            className={`px-6 sm:px-7 md:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm md:text-[15px] whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "dashboard"
                ? "neumorphism-dock-active font-black tracking-tight"
                : "neumorphism-dock-inactive font-bold"
            }`}
          >
            Dashboard
          </button>

          {/* Add Student Action in Bottom Dock (matches other dock buttons) */}
          <button
            onClick={() => {
              setEditingStudent(null);
              setIsStudentModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-6 sm:px-7 md:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm md:text-[15px] whitespace-nowrap transition-all cursor-pointer neumorphism-dock-inactive font-bold shrink-0"
            title="Add New Student"
          >
            <Plus size={16} className="stroke-[2.5]" />
            <span>Add Student</span>
          </button>

          <button
            onClick={() => navigate("/admin/dashboard/student-crm")}
            className={`px-6 sm:px-7 md:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm md:text-[15px] whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "student-crm" || activeTab === "student-leads"
                ? "neumorphism-dock-active font-black tracking-tight"
                : "neumorphism-dock-inactive font-bold"
            }`}
          >
            Student Leads CRM
          </button>
          <button
            onClick={() => navigate("/admin/dashboard/inquiry")}
            className={`px-6 sm:px-7 md:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm md:text-[15px] whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "inquiry"
                ? "neumorphism-dock-active font-black tracking-tight"
                : "neumorphism-dock-inactive font-bold"
            }`}
          >
            Inquiries
          </button>
          <button
            onClick={() => navigate("/admin/dashboard/referred-by")}
            className={`px-6 sm:px-7 md:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm md:text-[15px] whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "referred-by"
                ? "neumorphism-dock-active font-black tracking-tight"
                : "neumorphism-dock-inactive font-semibold"
            }`}
          >
            Referred By
          </button>
          <button
            onClick={() => navigate("/admin/dashboard/deleted-referrers")}
            className={`px-6 sm:px-7 md:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm md:text-[15px] whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "deleted-referrers"
                ? "neumorphism-dock-active font-black tracking-tight"
                : "neumorphism-dock-inactive font-semibold"
            }`}
          >
            Deleted Referrers
          </button>
          <button
            onClick={() => navigate("/admin/dashboard/deleted-students")}
            className={`px-6 sm:px-7 md:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm md:text-[15px] whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "deleted-students"
                ? "neumorphism-dock-active font-black tracking-tight"
                : "neumorphism-dock-inactive font-semibold"
            }`}
          >
            Deleted Students
          </button>
        </div>
      </nav>
    </div>
  );
}

// Subcomponents

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color = "blue", 
  onClick,
  isPrimary = false,
  badgeText = "",
  badgeTrend = "up",
  subtitle = ""
}: any) {
  if (isPrimary) {
    return (
      <div 
        onClick={onClick} 
        className="cursor-pointer bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#3b82f6] text-white rounded-[26px] p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[165px]"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-blue-100 uppercase tracking-wider">{title}</span>
          <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-xs">
            <Icon size={20} />
          </div>
        </div>
        <div className="my-auto">
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl md:text-4xl font-black text-white tracking-tight">{value}</span>
            {badgeText && (
              <span className="inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
                {badgeTrend === "up" ? "↑" : badgeTrend === "down" ? "↓" : ""} {badgeText}
              </span>
            )}
          </div>
        </div>
        <div className="text-xs text-blue-100 font-medium opacity-90">
          {subtitle || "Active enrolled"}
        </div>
      </div>
    );
  }

  const iconColors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
    cyan: "bg-cyan-50 text-cyan-600",
    red: "bg-rose-50 text-rose-600",
    dark: "bg-neutral-900 text-white"
  };

  const badgeColors: Record<string, string> = {
    up: "bg-blue-50 text-blue-700 border border-blue-200/60",
    down: "bg-rose-50 text-rose-700 border border-rose-200/60",
    neutral: "bg-neutral-100 text-neutral-600 border border-neutral-200/60"
  };

  return (
    <div 
      onClick={onClick} 
      className="cursor-pointer bg-white rounded-[26px] p-6 border border-neutral-200/80 shadow-xs hover:border-neutral-300 hover:shadow-sm hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[165px]"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{title}</span>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-2xs ${iconColors[color] || "bg-neutral-100 text-neutral-700"}`}>
          <Icon size={19} />
        </div>
      </div>
      <div className="my-auto">
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <span className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">{value}</span>
          {badgeText && (
            <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${badgeColors[badgeTrend] || badgeColors.neutral}`}>
              {badgeTrend === "up" ? "↑" : badgeTrend === "down" ? "↓" : ""} {badgeText}
            </span>
          )}
        </div>
      </div>
      <div className="text-xs text-neutral-400 font-medium">
        {subtitle || "Current status"}
      </div>
    </div>
  );
}

function RadialSpeedometerGauge({ percentage }: { percentage: number }) {
  const totalSegments = 18;
  const pct = Math.min(100, Math.max(0, percentage));
  const filledSegments = Math.round((pct / 100) * totalSegments);

  const cx = 110;
  const cy = 110;
  const innerR = 64;
  const outerR = 96;

  const colors = [
    "#1e40af", "#1d4ed8", "#2563eb", "#2563eb", "#3b82f6", 
    "#3b82f6", "#60a5fa", "#60a5fa", "#93c5fd", "#93c5fd", 
    "#bfdbfe", "#bfdbfe", "#c7d2fe", "#dbeafe", "#e0e7ff",
    "#ede9fe", "#f3e8ff", "#fae8ff"
  ];

  const segments = [];
  for (let i = 0; i < totalSegments; i++) {
    const angleStep = 180 / totalSegments;
    const startDeg = 180 - i * angleStep;
    const endDeg = startDeg - (angleStep - 2.5);

    const startRad = (startDeg * Math.PI) / 180;
    const endRad = (endDeg * Math.PI) / 180;

    const x1 = cx + innerR * Math.cos(startRad);
    const y1 = cy - innerR * Math.sin(startRad);
    const x2 = cx + outerR * Math.cos(startRad);
    const y2 = cy - outerR * Math.sin(startRad);

    const x3 = cx + outerR * Math.cos(endRad);
    const y3 = cy - outerR * Math.sin(endRad);
    const x4 = cx + innerR * Math.cos(endRad);
    const y4 = cy - innerR * Math.sin(endRad);

    const d = `M ${x1} ${y1} L ${x2} ${y2} A ${outerR} ${outerR} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerR} ${innerR} 0 0 0 ${x1} ${y1} Z`;

    segments.push(
      <path 
        key={i} 
        d={d} 
        fill={i < filledSegments ? (colors[i] || "#2563eb") : "#f1f3f6"} 
        className="transition-all duration-300"
      />
    );
  }

  return (
    <div className="relative w-full max-w-[240px] mx-auto flex items-center justify-center my-2">
      <svg viewBox="0 0 220 120" className="w-full overflow-visible">
        {segments}
      </svg>
      <div className="absolute bottom-0 left-0 right-0 text-center flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-neutral-900 tracking-tight leading-none">
          {pct.toFixed(1)}%
        </span>
        <span className="text-[11px] font-semibold text-neutral-400 mt-1">
          Fee Recovery
        </span>
      </div>
    </div>
  );
}
