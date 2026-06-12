import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Users, Search, Plus, Edit2, LogOut, Shield, Menu,
  AlertCircle, LayoutDashboard, GraduationCap, MessagesSquare, X, ArrowLeft,
  Award, Bell, UserCircle, Mail, IndianRupee, CheckCircle2, Activity
} from "lucide-react";

import { Student } from "./types";
import { StudentModal } from "./modals/StudentModal";
import { StudentDetailsModal } from "./modals/StudentDetailsModal";
import { InquiryTab } from "./tabs/InquiryTab";
import { ReferredByTab } from "./tabs/ReferredByTab";
import { ReferrerModal } from "./modals/ReferrerModal";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { tab, subview } = useParams();
  
  const activeTab = useMemo(() => tab || "dashboard", [tab]);
  const expandedStat = useMemo(() => subview || null, [subview]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Clear" | "Pending">("All");
  const [detailStatusFilter, setDetailStatusFilter] = useState<"All" | "Clear" | "Pending">("All");

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
  const [expandedStats, setExpandedStats] = useState({
    totalEntries: 0,
    growth: "0",
    recentActivity: 0
  });
  const [allStudentsData, setAllStudentsData] = useState<Student[]>([]);
  const [issuedCertificatesData, setIssuedCertificatesData] = useState<any[]>([]);
  const [studentsWithCertificates, setStudentsWithCertificates] = useState<any[]>([]);
  const [unissuedCertificatesData, setUnissuedCertificatesData] = useState<any[]>([]);
  const [clearFeeStudentsData, setClearFeeStudentsData] = useState<any[]>([]);
  const [pendingFeeStudentsData, setPendingFeeStudentsData] = useState<any[]>([]);
  const [earningsDetailsData, setEarningsDetailsData] = useState<any[]>([]);
  const [graphData, setGraphData] = useState<any[]>([]);
  const [topCourses, setTopCourses] = useState<any[]>([]);

  const [isSetAmountModalOpen, setIsSetAmountModalOpen] = useState(false);
  const [globalReferralAmount, setGlobalReferralAmount] = useState<number | string>("");
  const [selectedReferrer, setSelectedReferrer] = useState<any>(null);
  const [referrerStudents, setReferrerStudents] = useState<any[]>([]);
  const [referrerStatusFilter, setReferrerStatusFilter] = useState("All");

  const handleReferrerClick = async (referrer: any) => {
    setSelectedReferrer(referrer);
    try {
      const res = await fetch(`http://localhost:3001/getReferrerStudents/${referrer.id}`, { 
        method: "POST" 
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

  const handleClearReferrerAmount = async (ref: any) => {
     if (window.confirm(`Are you sure you want to clear all pending dues (₹${ref.pendingAmount.replace('₹', '')}) for ${ref.name}?`)) {
        try {
           const pendingValue = parseFloat(ref.pendingAmount.replace(/[₹,]/g, '')) || 0;
           const res = await fetch("http://localhost:3001/updateReferrerPayment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
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
        const res = await fetch("http://localhost:3001/updateReferrerPayment", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
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
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);



  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("adminAuthToken");
      const res = await fetch("http://localhost:3001/getAllInquiries", {
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
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("adminAuthToken");
      await fetch(`http://localhost:3001/markInquiryRead/${id}`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
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
      const res = await fetch("http://localhost:3001/allStudents", {
        method: "POST"
      });
      const data = await res.json();
      if (data.success) {
        const mapped: Student[] = data.data.map((item: any) => {
          // Map admissions if available
          let admissions: any[] = [];
          if (item.admissions && item.admissions.length > 0) {
            admissions = item.admissions.map((adm: any) => ({
              admissionId: adm.admission_id || adm.admissionId || `adm-${Date.now()}`,
              courses: Array.isArray(adm.courses) ? adm.courses : (adm.selected_course_name ? (Array.isArray(adm.selected_course_name) ? adm.selected_course_name : [adm.selected_course_name]) : []),
              courseDuration: adm.course_duration || adm.courseDuration || "N/A",
              totalFee: Number(adm.total_fee) || Number(adm.totalFee) || 0,
              totalPaidFee: Number(adm.total_paid_fee) || Number(adm.totalPaidFee) || 0,
              pendingFee: Number(adm.pending_fee) || Number(adm.pendingFee) || 0,
              feesStatus: adm.status || adm.feesStatus || "Pending",
              feesInstallment: Number(adm.fee_installment) || Number(adm.feesInstallment) || 0,
              payments: adm.payments || [],
              certificates: adm.certificates ? adm.certificates.map((cert: any, idx: number) => ({
                id: `cert-${item.student_ID}-${adm.admission_id}-${idx}`,
                courseName: cert.courseName || cert.course_name,
                url: cert.certificatePath || `http://localhost:3001/${cert.certificate_path || cert.certificatePath}`,
                date: cert.issuedAt || cert.issued_at ? new Date(cert.issuedAt || cert.issued_at).toISOString() : new Date().toISOString()
              })) : [],
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
            }));
          }
          
          // If no admissions, create a default one from the old structure for backward compatibility
          if (admissions.length === 0) {
            // Start with any existing certificates from the new array
            let certificates: any[] = item.certificates ? item.certificates.map((cert: any, idx: number) => ({
              id: `cert-${item.student_ID}-${idx}`,
              courseName: cert.courseName || cert.course_name,
              url: cert.certificatePath || `http://localhost:3001/${cert.certificate_path || cert.certificatePath}`,
              date: cert.issuedAt || cert.issued_at ? new Date(cert.issuedAt || cert.issued_at).toISOString() : new Date().toISOString()
            })) : [];
            
            // Add backward compatibility for old certificate_photo
            if (item.certificate_photo) {
              certificates.push({
                id: `cert-${item.student_ID}-old`,
                courseName: Array.isArray(item.selected_course_name) ? item.selected_course_name[0] : item.selected_course_name || "Course",
                url: `http://localhost:3001/${item.certificate_photo}`,
                date: item.created_at ? new Date(item.created_at).toISOString() : new Date().toISOString()
              });
            }
            
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
          const allClear = admissions.every(adm => adm.feesStatus === "Clear");
          const anyPaid = admissions.some(adm => adm.totalPaidFee > 0);
          if (allClear) overallStatus = "Clear";
          else if (anyPaid) overallStatus = "Partial";
          
          // Collect all unique courses
          const allCourses = [...new Set(admissions.flatMap(adm => adm.courses))];
          
          // Collect all certificates from all admissions
          const allCertificates = admissions.flatMap(adm => adm.certificates);
          
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
            feesInstallment: admissions.reduce((sum, adm) => sum + adm.feesInstallment, 0),
            fee: admissions.flatMap(adm => adm.payments),
            certificates: allCertificates,
            admissions,
            referredByName: item.referredByName,
            referredByPhone: item.referredByPhone,
            referredByEmail: item.referredByEmail,
            referredAmount: Number(item.referredAmount) || 0
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
      const res = await fetch("http://localhost:3001/certificateissuedStudentsData", {
        method: "POST"
      });
      const data = await res.json();
      if (data.success) {
        const mapped: Student[] = data.data.map((item: any) => ({
          id: item.student_ID,
          name: item.student_name,
          feesStatus: "Clear", // Issued usually means clear, or we can use item.status if backend provides it
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
          fee: item.fee,
          certificates: [{
            id: `cert-${item.student_ID}`,
            name: "Certificate",
            url: `http://localhost:3001/${item.certificate_photo}`,
            date: item.updated_at ? new Date(item.updated_at).toISOString().split("T")[0] : ""
          }]
        }));
        setIssuedCertificatesData(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch issued certificates:", error);
    }
  };

  const fetchUnissuedCertificates = async () => {
    try {
      const res = await fetch("http://localhost:3001/certificateunissuedStudentsData", {
        method: "POST"
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
      const res = await fetch("http://localhost:3001/pandingfeeStudentsData", {
        method: "POST"
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
      const res = await fetch("http://localhost:3001/clearfeeStudentsData", {
        method: "POST"
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
      const res = await fetch("http://localhost:3001/totalEarningsDetails", {
        method: "POST"
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
      const res = await fetch("http://localhost:3001/getAllReferrers", {
        method: "POST"
      });
      const data = await res.json();
      if (data.success) {
        setReferrers(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch referrers:", error);
    }
  };

  useEffect(() => {
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
    }
  }, [expandedStat]);

  useEffect(() => {
    if (activeTab === "referred-by") {
      fetchReferrers();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("http://localhost:3001/admin_dashboardGet");
      const data = await res.json();
      if (data.success) {
        const mappedStudents: Student[] = data.tcData.map((item: any) => {
          // Map admissions if available
          let admissions: any[] = [];
          if (item.admissions && item.admissions.length > 0) {
            admissions = item.admissions.map((adm: any) => ({
              admissionId: adm.admission_id || adm.admissionId || `adm-${Date.now()}`,
              courses: Array.isArray(adm.courses) ? adm.courses : (adm.selected_course_name ? (Array.isArray(adm.selected_course_name) ? adm.selected_course_name : [adm.selected_course_name]) : []),
              courseDuration: adm.course_duration || adm.courseDuration || "N/A",
              totalFee: Number(adm.total_fee) || Number(adm.totalFee) || 0,
              totalPaidFee: Number(adm.total_paid_fee) || Number(adm.totalPaidFee) || 0,
              pendingFee: Number(adm.pending_fee) || Number(adm.pendingFee) || 0,
              feesStatus: adm.status || adm.feesStatus || "Pending",
              feesInstallment: Number(adm.fee_installment) || Number(adm.feesInstallment) || 0,
              payments: adm.payments || [],
              certificates: adm.certificates ? adm.certificates.map((cert: any, idx: number) => ({
                id: `cert-${item.student_ID}-${adm.admission_id}-${idx}`,
                courseName: cert.courseName || cert.course_name,
                url: cert.certificatePath || `http://localhost:3001/${cert.certificate_path || cert.certificatePath}`,
                date: cert.issuedAt || cert.issued_at ? new Date(cert.issuedAt || cert.issued_at).toISOString() : new Date().toISOString()
              })) : [],
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
            }));
          }
          
          // If no admissions, create a default one from the old structure for backward compatibility
          if (admissions.length === 0) {
            // Start with any existing certificates from the new array
            let certificates: any[] = item.certificates ? item.certificates.map((cert: any, idx: number) => ({
              id: `cert-${item.student_ID}-${idx}`,
              courseName: cert.courseName || cert.course_name,
              url: cert.certificatePath || `http://localhost:3001/${cert.certificate_path || cert.certificatePath}`,
              date: cert.issuedAt || cert.issued_at ? new Date(cert.issuedAt || cert.issued_at).toISOString() : new Date().toISOString()
            })) : [];
            
            // Add backward compatibility for old certificate_photo
            if (item.certificate_photo) {
              certificates.push({
                id: `cert-${item.student_ID}-old`,
                courseName: Array.isArray(item.selected_course_name) ? item.selected_course_name[0] : item.selected_course_name || "Course",
                url: `http://localhost:3001/${item.certificate_photo}`,
                date: item.created_at ? new Date(item.created_at).toISOString() : new Date().toISOString()
              });
            }
            
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
          const allClear = admissions.every(adm => adm.feesStatus === "Clear");
          const anyPaid = admissions.some(adm => adm.totalPaidFee > 0);
          if (allClear) overallStatus = "Clear";
          else if (anyPaid) overallStatus = "Partial";
          
          // Collect all unique courses
          const allCourses = [...new Set(admissions.flatMap(adm => adm.courses))];
          
          // Collect all certificates from all admissions
          const allCertificates = admissions.flatMap(adm => adm.certificates);
          
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
            feesInstallment: admissions.reduce((sum, adm) => sum + adm.feesInstallment, 0),
            fee: admissions.flatMap(adm => adm.payments),
            certificates: allCertificates,
            admissions,
            referredByName: item.referredByName,
            referredByPhone: item.referredByPhone,
            referredByEmail: item.referredByEmail,
            referredAmount: Number(item.referredAmount) || 0
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
        setGraphData(data.graphData || []);
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
      const res = await fetch("http://localhost:3001/updateReferralAmount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    fetchDashboardData();
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("adminAuthToken");
      if (token) {
        await fetch("http://localhost:3001/admin_logout", {
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
      const matchesStatus = statusFilter === "All" || s.feesStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [students, search, statusFilter]);

  const handleSaveStudent = (updated: Student) => {
    if (editingStudent) {
      setStudents(students.map(s => s.id === editingStudent.id ? updated : s));
    } else {
      setStudents([updated, ...students]);
    }
    setIsStudentModalOpen(false);
    setEditingStudent(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-neutral-900 flex relative overflow-hidden selection:bg-blue-100 font-sans">
      
      {/* Mobile Overlay Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-72 bg-white border-r border-neutral-200 flex flex-col z-50
        fixed md:static top-0 left-0 h-full
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 right-4 md:hidden p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="p-6 border-b border-neutral-100">
          <div className="h-60 w-full relative flex items-center mb-2">
             <img src="/logo/RIZE LOGO HORI PNG.png" alt="RizeWorld" className="w-full h-full object-contain object-left" />
          </div>
          <div className="mt-2 text-[10px] font-bold tracking-widest text-blue-600 uppercase flex items-center gap-2">
            <Shield size={12} className="text-blue-500" /> Super Admin Portal
          </div>
        </div>

        <div className="flex-1 py-6 px-4 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === "dashboard"} onClick={() => { navigate("/admin/dashboard/dashboard"); setIsSidebarOpen(false); }} />
          <SidebarItem icon={MessagesSquare} label="Inquiry" active={activeTab === "inquiry"} onClick={() => { navigate("/admin/dashboard/inquiry"); setIsSidebarOpen(false); }} />
          <SidebarItem icon={UserCircle} label="Referred By" active={activeTab === "referred-by"} onClick={() => { navigate("/admin/dashboard/referred-by"); setIsSidebarOpen(false); }} />
        </div>

        <div className="p-6 border-t border-neutral-100">
          <button onClick={() => setIsLogoutModalOpen(true)} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 font-semibold hover:bg-red-50 hover:text-red-700 rounded-xl transition-all border border-transparent hover:border-red-100 group">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            Logout Securely
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100/50 rounded-full blur-[120px] pointer-events-none" />
        
        <header className="h-20 bg-white/80 backdrop-blur-2xl border-b border-neutral-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger Menu - Mobile Only */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-neutral-100 text-neutral-600 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <h2 className="font-display text-lg md:text-2xl font-bold text-neutral-900 capitalize tracking-tight">
              {activeTab.replace("-", " ")} Overview
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative">
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
                  className="relative p-2 text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
                >
                  <Bell size={20} />
                  {notifications.filter(n => !n.isRead).length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-white"></span>
                  )}
                </button>
                
                {isNotificationsOpen && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-neutral-200 shadow-xl rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                     <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
                        <h3 className="font-bold text-neutral-900">Notifications</h3>
                        <span className="text-xs font-semibold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                          {notifications.filter(n => !n.isRead).length} New
                        </span>
                     </div>
                     <div className="max-h-[300px] overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <div 
                               key={notif.id}
                               onClick={() => {
                                  setIsNotificationsOpen(false);
                                  setSelectedNotification({
                                     ...notif,
                                     content: `Course: ${notif.course}\nPhone: ${notif.phone}\n\nMessage: ${notif.content}`
                                  });
                                  if (!notif.isRead) markNotificationAsRead(notif.id);
                               }}
                               className={`p-4 border-b border-neutral-50 hover:bg-neutral-50 cursor-pointer transition-colors flex gap-3 ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                            >
                               <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${!notif.isRead ? 'bg-blue-100 text-blue-600' : 'bg-neutral-100 text-neutral-400'}`}>
                                  <Mail size={14} />
                               </div>
                               <div>
                                  <div className="text-sm font-bold text-neutral-900">{notif.title}</div>
                                  <div className="text-xs text-neutral-500 mt-1 line-clamp-2">{notif.sender} is interested in {notif.course}.</div>
                                  <div className="text-[10px] text-neutral-400 font-semibold mt-2">{getTimeAgo(notif.date)}</div>
                                </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-neutral-400 text-sm">
                            No new notifications
                          </div>
                        )}
                     </div>
                  </div>
                )}
             </div>

          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent">
          
          {activeTab === "dashboard" && !expandedStat && (
            <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatCard title="Total Students" value={stats.totalStudents} icon={Users} color="blue" onClick={() => navigate("/admin/dashboard/dashboard/total-students")} />
                <StatCard title="Certificate Issued" value={stats.certificatesIssued} icon={Award} color="green" onClick={() => navigate("/admin/dashboard/dashboard/certificate-issued")} />
                <StatCard title="Certificate Unissued" value={stats.unissuedCertificates} icon={AlertCircle} color="orange" onClick={() => navigate("/admin/dashboard/dashboard/certificate-unissued")} />
                <StatCard title="Total Earnings" value={`₹${stats.totalEarnings.toLocaleString()}`} icon={IndianRupee} color="purple" onClick={() => navigate("/admin/dashboard/dashboard/total-earnings")} />
                <StatCard title="Total Clear Fees" value={stats.totalClearFees} icon={CheckCircle2} color="cyan" onClick={() => navigate("/admin/dashboard/dashboard/total-clear-fees")} />
                <StatCard title="Pending Fees" value={stats.pendingFees} icon={AlertCircle} color="red" onClick={() => navigate("/admin/dashboard/dashboard/total-pending-fees")} />
              </div>

              {/* Middle Section: Graph & Top Courses */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Graph Area */}
                <div className="lg:col-span-3 bg-white border border-neutral-200 rounded-3xl p-6 relative overflow-hidden group hover:border-neutral-300 transition-colors shadow-sm">
                   <div className="flex justify-between items-center mb-6">
                     <div>
                       <h3 className="text-lg font-bold text-neutral-900">Revenue & Enrollment Analytics</h3>
                       <p className="text-xs text-neutral-500">Monthly overview of student growth</p>
                     </div>
                     <Activity className="text-blue-500/50" />
                   </div>
                   
                   {/* Custom SVG Line Graph */}
                   <div className="h-[250px] w-full relative mt-4">
                      {graphData.length > 0 ? (
                        <>
                          {/* Background SVG for Grid Lines */}
                          <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                             {graphData.map((_, i) => {
                               const x = (i / (graphData.length - 1 || 1)) * 100;
                               return (
                                 <line key={`v-${i}`} x1={x} y1="0" x2={x} y2="100" stroke="rgba(0,0,0,0.06)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                               );
                             })}
                          </svg>

                          {/* Foreground SVG for Line Path */}
                          <svg 
                             className="absolute inset-0 w-full h-full overflow-visible" 
                             preserveAspectRatio="none" 
                             viewBox="0 0 100 100"
                             style={{ filter: 'drop-shadow(0px 12px 10px rgba(59,130,246,0.3))' }}
                          >
                             {(() => {
                               const maxEarnings = Math.max(...graphData.map(d => d.earnings), 1000);
                               const pts = graphData.map((d, i) => ({
                                 x: (i / (graphData.length - 1 || 1)) * 100,
                                 y: 100 - (d.earnings / maxEarnings) * 80 - 10 // scale to 10-90% range
                               }));
                               
                               if (pts.length < 2) return null;

                               let d = `M ${pts[0].x},${pts[0].y}`;
                               for (let i = 1; i < pts.length; i++) {
                                 const p = pts[i-1];
                                 const c = pts[i];
                                 // Simple bezier curve
                                 d += ` C ${p.x + (c.x - p.x) / 2},${p.y} ${c.x - (c.x - p.x) / 2},${c.y} ${c.x},${c.y}`;
                               }
                               return (
                                 <path 
                                   d={d} 
                                   fill="none" 
                                   stroke="#3b82f6" 
                                   strokeWidth="3.5" 
                                   vectorEffect="non-scaling-stroke" 
                                   strokeLinecap="round" 
                                   strokeLinejoin="round" 
                                 />
                               );
                             })()}
                          </svg>

                          {/* Data Point Dots */}
                          {(() => {
                             const maxEarnings = Math.max(...graphData.map(d => d.earnings), 1000);
                             return graphData.map((d, i) => {
                               const x = (i / (graphData.length - 1 || 1)) * 100;
                               const y = 100 - (d.earnings / maxEarnings) * 80 - 10;
                               return (
                                 <div key={`dot-wrapper-${i}`} className="absolute group/dot" style={{ left: `${x}%`, top: `${y}%` }}>
                                   <div className="w-3.5 h-3.5 bg-blue-500 border-[2.5px] border-white rounded-full shadow-sm hover:scale-150 transition-transform cursor-pointer -translate-x-1/2 -translate-y-1/2" />
                                   
                                   {/* Tooltip */}
                                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white backdrop-blur-md border border-neutral-200 shadow-xl text-neutral-900 text-[10px] font-bold px-2 py-1.5 rounded-lg opacity-0 group-hover/dot:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
                                      <div className="text-blue-600 mb-0.5">{d.month}</div>
                                      <div>Earnings: ₹{d.earnings.toLocaleString()}</div>
                                      <div className="text-neutral-500">New Students: {d.newStudents}</div>
                                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-neutral-200"></div>
                                   </div>
                                 </div>
                               );
                             });
                          })()}
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-neutral-400 text-sm italic">
                          No growth data available yet.
                        </div>
                      )}
                   </div>
                   <div className="flex justify-between text-[10px] text-neutral-400 mt-4 px-2">
                     {graphData.length > 0 ? (
                       graphData.map((d, i) => (
                         <span key={i}>{d.month.split(' ')[0]}</span>
                       ))
                     ) : (
                       <span>No Data</span>
                     )}
                   </div>
                </div>

                {/* Top Courses */}
                <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm flex flex-col">
                   <div className="mb-6">
                     <h3 className="text-lg font-bold text-neutral-900">Top Courses</h3>
                   </div>

                   {/* Stripe Chart */}
                   <div className="flex gap-[2px] w-full h-8 mb-8">
                      {topCourses.length > 0 ? (
                        topCourses.map((course, i) => {
                          const colors = ["bg-emerald-500", "bg-indigo-600", "bg-cyan-500"];
                          const total = topCourses.reduce((acc, c) => acc + c.count, 0);
                          const percentage = (course.count / total) * 100;
                          const stripes = Math.round((percentage / 100) * 45);
                          
                          return [...Array(stripes)].map((_, j) => (
                            <div 
                              key={`stripe-${i}-${j}`} 
                              className={`flex-1 rounded-full ${colors[i % colors.length]}`} 
                            />
                          ));
                        })
                      ) : (
                        [...Array(45)].map((_, i) => (
                           <div key={`stripe-empty-${i}`} className="flex-1 rounded-full bg-neutral-100" />
                        ))
                      )}
                   </div>

                   {/* List */}
                   <div className="flex flex-col">
                      {topCourses.length > 0 ? (
                        topCourses.map((course, i) => {
                          const colors = ["bg-emerald-500", "bg-indigo-600", "bg-cyan-500"];
                          return (
                            <div key={`course-${i}`} className={`flex items-center justify-between py-3 ${i < topCourses.length - 1 ? 'border-b border-neutral-100' : ''}`}>
                               <div className="flex items-start gap-3">
                                  <div className={`w-3 h-3 rounded-sm ${colors[i % colors.length]} mt-1 shrink-0`}></div>
                                  <div>
                                     <div className="text-sm font-bold text-neutral-900">{course._id || "Unknown"}</div>
                                     <div className="text-[10px] text-neutral-400 font-semibold mt-0.5">{course.count} Students</div>
                                  </div>
                               </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-4 text-neutral-400 text-xs italic">
                          No course data available.
                        </div>
                      )}
                   </div>
                </div>

              </div>

              {/* Student Management Table */}
              <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm relative">
                {/* Table Header */}
                <div className="p-6 border-b border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-50/50">
                  <div className="flex flex-col md:flex-row gap-4 items-center flex-1">
                    <div className="relative max-w-sm w-full">
                      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="Search students..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 focus:outline-none transition-all text-sm text-neutral-900 placeholder-neutral-400"
                      />
                    </div>
                    <select 
                      value={statusFilter} 
                      onChange={(e: any) => setStatusFilter(e.target.value)}
                      className="px-4 py-2.5 rounded-xl bg-white border border-neutral-200 text-sm text-neutral-700 focus:border-blue-500 focus:outline-none w-full md:w-48 appearance-none cursor-pointer"
                    >
                      <option value="All">All Status</option>
                      <option value="Clear">Clear Fees</option>
                      <option value="Pending">Pending Fees</option>
                    </select>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingStudent(null);
                      setIsStudentModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all shrink-0 text-sm hover:-translate-y-0.5"
                  >
                    <Plus size={18} /> Add Student
                  </button>
                </div>

                {/* Table Data */}
                <div className="overflow-x-auto min-h-[300px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 text-xs uppercase tracking-wider font-semibold">
                        <th className="py-5 px-6 whitespace-nowrap">ID</th>
                        <th className="py-5 px-6 whitespace-nowrap">Student Name</th>
                        <th className="py-5 px-6 whitespace-nowrap">Course</th>
                        <th className="py-5 px-6 whitespace-nowrap">Duration</th>
                        <th className="py-5 px-6 whitespace-nowrap">Total Fee</th>
                        <th className="py-5 px-6 whitespace-nowrap">Pending Fee</th>
                        <th className="py-5 px-6 whitespace-nowrap">Status</th>
                        <th className="py-5 px-6 text-right whitespace-nowrap">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-sm">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((s) => (
                          <tr key={s.id} className="hover:bg-neutral-50/50 transition-colors group">
                            <td className="py-4 px-6 font-mono text-neutral-500">{s.id}</td>
                            <td className="py-4 px-6 font-semibold text-neutral-900 flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-100 to-purple-100 text-blue-700 flex items-center justify-center text-xs font-bold shadow-sm border border-blue-200">
                                 {s.name.charAt(0).toUpperCase()}
                               </div>
                               {s.name}
                            </td>
                            <td className="py-4 px-6 text-neutral-600">{Array.isArray(s.course) ? s.course.join(", ") : s.course || "N/A"}</td>
                            <td className="py-4 px-6 text-neutral-600">{s.duration || "N/A"}</td>
                            <td className="py-4 px-6 text-neutral-700">₹{s.totalFees || 0}</td>
                            <td className="py-4 px-6 text-neutral-700">₹{s.pendingFees || 0}</td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                s.feesStatus === "Clear" ? "bg-green-100 text-green-700 border-green-200" :
                                s.feesStatus === "Pending" ? "bg-red-100 text-red-700 border-red-200" :
                                "bg-orange-100 text-orange-700 border-orange-200"
                              }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${s.feesStatus === "Clear" ? "bg-green-500" : s.feesStatus === "Pending" ? "bg-red-500" : "bg-orange-500"}`} />
                                {s.feesStatus}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center justify-end gap-2">

                                <button 
                                  onClick={() => { setEditingStudent(s); setIsStudentModalOpen(true); }}
                                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                                  title="Edit Student"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button 
                                  onClick={() => setViewingStudent(s)}
                                  className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-neutral-50 text-neutral-700 rounded-lg border border-neutral-200 shadow-sm transition-all ml-2"
                                >
                                  Details
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="py-20 text-center">
                            <div className="flex flex-col items-center justify-center text-neutral-400">
                               <Users size={48} className="mb-4 opacity-20" />
                               <p>No students found matching your criteria.</p>
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
             <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
                <button onClick={() => navigate("/admin/dashboard/dashboard")} className="mb-6 flex items-center gap-2 text-neutral-500 hover:text-neutral-900 font-semibold transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-neutral-200 shadow-sm hover:shadow">
                   <ArrowLeft size={16} /> Back to Dashboard
                </button>
                <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm min-h-[600px] flex flex-col">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                       <h2 className="text-2xl font-bold text-neutral-900 capitalize flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                             <LayoutDashboard size={20} />
                          </div>
                          {expandedStat.replace(/-/g, ' ')} Details
                       </h2>
                       {expandedStat === "total-students" && (
                          <select 
                            value={detailStatusFilter} 
                            onChange={(e: any) => setDetailStatusFilter(e.target.value)}
                            className="px-4 py-2.5 rounded-xl bg-white border border-neutral-200 text-sm text-neutral-700 focus:border-blue-500 focus:outline-none w-full md:w-48 appearance-none cursor-pointer shadow-sm"
                          >
                            <option value="All">All Status</option>
                            <option value="Clear">Clear Fees</option>
                            <option value="Pending">Pending Fees</option>
                          </select>
                       )}
                   </div>
                   
                   {expandedStat === "total-students" && (
                      <div className="mt-4 flex gap-4 mb-6">
                         <div className="bg-neutral-50 p-4 rounded-2xl flex-1 border border-neutral-100">
                            <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Total Entries</div>
                            <div className="text-2xl font-bold text-neutral-900">{expandedStats.totalEntries}</div>
                         </div>
                         <div className="bg-neutral-50 p-4 rounded-2xl flex-1 border border-neutral-100">
                            <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Growth (Last 30 Days)</div>
                            <div className="text-2xl font-bold text-emerald-600">+{expandedStats.growth}%</div>
                         </div>
                         <div className="bg-neutral-50 p-4 rounded-2xl flex-1 border border-neutral-100">
                            <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Recent Activity</div>
                            <div className="text-2xl font-bold text-blue-600">{expandedStats.recentActivity}</div>
                         </div>
                      </div>
                   )}

                   <div className="flex-1 border border-neutral-200 rounded-2xl overflow-hidden bg-white shadow-sm overflow-x-auto">
                      {(() => {
                         if (expandedStat === "total-students") {
                            return (
                               <table className="w-full text-left border-collapse whitespace-nowrap">
                                  <thead className="bg-neutral-50 border-b border-neutral-200">
                                     <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Student Name</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Course</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Duration</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Fee</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Pending Fee</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                                     </tr>
                                  </thead>
                                  <tbody className="divide-y divide-neutral-100">
                                     {allStudentsData
                                        .filter(row => detailStatusFilter === "All" || row.feesStatus === detailStatusFilter)
                                        .map((row, idx) => (
                                        <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                                           <td className="px-6 py-4 font-mono text-sm font-semibold text-blue-600">{row.id}</td>
                                           <td className="px-6 py-4">
                                              <div className="flex items-center gap-3">
                                                 <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase">{row.name.charAt(0)}</div>
                                                 <div className="font-bold text-neutral-900 capitalize">{row.name}</div>
                                              </div>
                                           </td>
                                           <td className="px-6 py-4 text-sm font-semibold text-neutral-700">{Array.isArray(row.course) ? row.course.join(", ") : row.course}</td>
                                           <td className="px-6 py-4 text-sm text-neutral-600">{row.duration}</td>
                                           <td className="px-6 py-4 text-sm font-bold text-neutral-900">₹{(row.totalFees || 0).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-red-600">₹{(row.pendingFees || 0).toLocaleString()}</td>
                                           <td className="px-6 py-4">
                                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${row.feesStatus === 'Clear' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                                                 {row.feesStatus}
                                              </span>
                                           </td>
                                        </tr>
                                     ))}
                                  </tbody>
                               </table>
                            );
                         }
                         
                         if (expandedStat === "certificate-issued") {
                            return (
                               <table className="w-full text-left border-collapse whitespace-nowrap">
                                  <thead className="bg-neutral-50 border-b border-neutral-200">
                                     <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Student ID</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Student Name</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Issued Courses</th>
                                     </tr>
                                  </thead>
                                  <tbody className="divide-y divide-neutral-100">
                                     {studentsWithCertificates.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                                           <td className="px-6 py-4 font-mono text-sm font-semibold text-emerald-600">{row.studentId}</td>
                                           <td className="px-6 py-4 font-bold text-neutral-900 capitalize">{row.studentName}</td>
                                           <td className="px-6 py-4 text-sm font-semibold text-neutral-700">
                                              <div className="flex flex-wrap gap-2">
                                                 {row.issuedCourses.map((course: string, courseIdx: number) => (
                                                    <span key={courseIdx} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                                                       {course}
                                                    </span>
                                                 ))}
                                              </div>
                                           </td>
                                        </tr>
                                     ))}
                                     {studentsWithCertificates.length === 0 && (
                                        <tr>
                                           <td colSpan={3} className="py-20 text-center text-neutral-400 italic">No issued certificates found.</td>
                                        </tr>
                                     )}
                                  </tbody>
                               </table>
                            );
                         }

                         if (expandedStat === "certificate-unissued") {
                            return (
                               <table className="w-full text-left border-collapse whitespace-nowrap">
                                  <thead className="bg-neutral-50 border-b border-neutral-200">
                                     <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Student Name</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Course</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Action</th>
                                     </tr>
                                  </thead>
                                  <tbody className="divide-y divide-neutral-100">
                                     {unissuedCertificatesData.map((row: Student, idx) => (
                                        <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                                           <td className="px-6 py-4 font-mono text-sm font-semibold text-blue-600">{row.id}</td>
                                           <td className="px-6 py-4 font-bold text-neutral-900 capitalize">{row.name}</td>
                                           <td className="px-6 py-4 text-sm font-semibold text-neutral-700">{Array.isArray(row.course) ? row.course.join(", ") : row.course}</td>
                                           <td className="px-6 py-4">
                                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                                 row.feesStatus === 'Clear' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                                              }`}>
                                                 {row.feesStatus}
                                              </span>
                                           </td>
                                           <td className="px-6 py-4">
                                              <button 
                                                onClick={() => setViewingStudent(row)} 
                                                className="text-neutral-600 hover:text-neutral-700 text-sm font-bold underline cursor-pointer"
                                              >
                                                Details
                                              </button>
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
                            return (
                               <table className="w-full text-left border-collapse whitespace-nowrap">
                                  <thead className="bg-neutral-50 border-b border-neutral-200">
                                     <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">TXN ID</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Student Name</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Method</th>
                                     </tr>
                                  </thead>
                                  <tbody className="divide-y divide-neutral-100">
                                     {earningsDetailsData.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                                           <td className="px-6 py-4 font-mono text-sm font-semibold text-purple-600 truncate max-w-[150px]" title={row.txn_id}>{row.txn_id}</td>
                                           <td className="px-6 py-4 font-bold text-neutral-900 capitalize">{row.student_name}</td>
                                           <td className="px-6 py-4 text-sm font-bold text-emerald-600">₹{Number(row.amount).toLocaleString()}</td>
                                           <td className="px-6 py-4 text-sm text-neutral-600">
                                              {new Date(row.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                           </td>
                                           <td className="px-6 py-4 text-sm font-semibold text-neutral-700 uppercase">{row.method}</td>
                                        </tr>
                                     ))}
                                     {earningsDetailsData.length === 0 && (
                                        <tr>
                                           <td colSpan={5} className="py-20 text-center text-neutral-400 italic">No earnings records found.</td>
                                        </tr>
                                     )}
                                  </tbody>
                                  {earningsDetailsData.length > 0 && (
                                     <tfoot className="bg-neutral-900 text-white">
                                        <tr>
                                           <td colSpan={2} className="px-6 py-5 text-sm font-bold uppercase tracking-widest">Total Earning Amount</td>
                                           <td className="px-6 py-5 text-xl font-black text-emerald-400">
                                              ₹{earningsDetailsData.reduce((acc, curr) => acc + Number(curr.amount || 0), 0).toLocaleString()}
                                           </td>
                                           <td colSpan={2} className="px-6 py-5"></td>
                                        </tr>
                                     </tfoot>
                                  )}
                               </table>
                            );
                         }

                         if (expandedStat === "total-pending-fees") {
                            return (
                               <table className="w-full text-left border-collapse whitespace-nowrap">
                                  <thead className="bg-neutral-50 border-b border-neutral-200">
                                     <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Student Name</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Course</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Fee</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Paid Fee</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Pending Fee</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Phone Number</th>
                                     </tr>
                                  </thead>
                                  <tbody className="divide-y divide-neutral-100">
                                     {pendingFeeStudentsData.map((row: Student, idx) => (
                                        <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                                           <td className="px-6 py-4 font-mono text-sm font-semibold text-red-600">{row.id}</td>
                                           <td className="px-6 py-4 font-bold text-neutral-900 capitalize">{row.name}</td>
                                           <td className="px-6 py-4 text-sm font-semibold text-neutral-700">{Array.isArray(row.course) ? row.course.join(", ") : row.course}</td>
                                           <td className="px-6 py-4 text-sm font-bold text-neutral-900">₹{Number(row.totalFees).toLocaleString()}</td>
                                           <td className="px-6 py-4 text-sm font-bold text-emerald-600">₹{Number(row.paidFees).toLocaleString()}</td>
                                           <td className="px-6 py-4 text-sm font-bold text-red-600">₹{Number(row.pendingFees).toLocaleString()}</td>
                                           <td className="px-6 py-4 text-sm font-semibold text-neutral-700">{row.phone}</td>
                                        </tr>
                                     ))}
                                     {pendingFeeStudentsData.length === 0 && (
                                        <tr>
                                           <td colSpan={7} className="py-20 text-center text-neutral-400 italic">No students with pending fees found.</td>
                                        </tr>
                                     )}
                                  </tbody>
                               </table>
                            );
                         }
                         if (expandedStat === "total-clear-fees") {
                            return (
                               <table className="w-full text-left border-collapse whitespace-nowrap">
                                  <thead className="bg-neutral-50 border-b border-neutral-200">
                                     <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Student Name</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Course</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Paid</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Action</th>
                                     </tr>
                                  </thead>
                                  <tbody className="divide-y divide-neutral-100">
                                     {clearFeeStudentsData.map((row: Student, idx) => (
                                        <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                                           <td className="px-6 py-4 font-mono text-sm font-semibold text-cyan-600">{row.id}</td>
                                           <td className="px-6 py-4 font-bold text-neutral-900 capitalize">{row.name}</td>
                                           <td className="px-6 py-4 text-sm font-semibold text-neutral-700">{Array.isArray(row.course) ? row.course.join(", ") : row.course}</td>
                                           <td className="px-6 py-4 text-sm font-bold text-neutral-900">₹{Number(row.paidFees).toLocaleString()}</td>
                                           <td className="px-6 py-4"><span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Clear</span></td>
                                           <td className="px-6 py-4">
                                              <button 
                                                onClick={() => setViewingStudent(row)} 
                                                className="text-neutral-600 hover:text-neutral-700 text-sm font-bold underline cursor-pointer"
                                              >
                                                Details
                                              </button>
                                           </td>
                                        </tr>
                                     ))}
                                     {clearFeeStudentsData.length === 0 && (
                                        <tr>
                                           <td colSpan={5} className="py-20 text-center text-neutral-400 italic">No students with clear fees found.</td>
                                        </tr>
                                     )}
                                  </tbody>
                               </table>
                            );
                         }

                         if (expandedStat === "total-pending-fees") {
                            return (
                               <table className="w-full text-left border-collapse whitespace-nowrap">
                                  <thead className="bg-neutral-50 border-b border-neutral-200">
                                     <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Student Name</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Course</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Fee</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Paid Fee</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Pending Fee</th>
                                        <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Phone Number</th>
                                     </tr>
                                  </thead>
                                  <tbody className="divide-y divide-neutral-100">
                                     {pendingFeeStudentsData.map((row: Student, idx) => (
                                        <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                                           <td className="px-6 py-4 font-mono text-sm font-semibold text-red-600">{row.id}</td>
                                           <td className="px-6 py-4 font-bold text-neutral-900 capitalize">{row.name}</td>
                                           <td className="px-6 py-4 text-sm font-semibold text-neutral-700">{Array.isArray(row.course) ? row.course.join(", ") : row.course}</td>
                                           <td className="px-6 py-4 text-sm font-bold text-neutral-900">₹{Number(row.totalFees).toLocaleString()}</td>
                                           <td className="px-6 py-4 text-sm font-bold text-emerald-600">₹{Number(row.paidFees).toLocaleString()}</td>
                                           <td className="px-6 py-4 text-sm font-bold text-red-600">₹{Number(row.pendingFees).toLocaleString()}</td>
                                           <td className="px-6 py-4 text-sm font-semibold text-neutral-700">{row.phone}</td>
                                        </tr>
                                     ))}
                                     {pendingFeeStudentsData.length === 0 && (
                                        <tr>
                                           <td colSpan={7} className="py-20 text-center text-neutral-400 italic">No students with pending fees found.</td>
                                        </tr>
                                     )}
                                  </tbody>
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
             />
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
         <StudentDetailsModal student={viewingStudent} onClose={() => setViewingStudent(null)} />
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

    </div>
  );
}

// Subcomponents

function SidebarItem({ icon: Icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all group border ${
        active ? "bg-blue-50 text-blue-700 border-blue-100 shadow-sm" : "text-neutral-500 border-transparent hover:bg-neutral-50 hover:text-neutral-900"
      }`}
    >
      <Icon size={20} className={active ? "text-blue-600" : "group-hover:text-neutral-500 transition-colors"} />
      {label}
    </button>
  );
}

function StatCard({ title, value, icon: Icon, color, onClick }: any) {
  const colorMap: any = {
    blue: "from-blue-50 to-white text-blue-700 border-blue-100 shadow-sm icon-blue",
    green: "from-emerald-50 to-white text-emerald-700 border-emerald-100 shadow-sm icon-emerald",
    orange: "from-orange-50 to-white text-orange-700 border-orange-100 shadow-sm icon-orange",
    purple: "from-purple-50 to-white text-purple-700 border-purple-100 shadow-sm icon-purple",
    cyan: "from-cyan-50 to-white text-cyan-700 border-cyan-100 shadow-sm icon-cyan",
    red: "from-red-50 to-white text-red-700 border-red-100 shadow-sm icon-red",
  };
  
  const iconColors: any = {
     blue: "text-blue-600 bg-blue-100",
     green: "text-emerald-600 bg-emerald-100",
     orange: "text-orange-600 bg-orange-100",
     purple: "text-purple-600 bg-purple-100",
     cyan: "text-cyan-600 bg-cyan-100",
     red: "text-red-600 bg-red-100",
  };

  return (
    <div onClick={onClick} className={`cursor-pointer bg-linear-to-br border rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 ${colorMap[color].split(" icon-")[0]}`}>
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/50 rounded-full blur-2xl group-hover:bg-white transition-colors"></div>
      <div className="flex justify-between items-start mb-4">
         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${iconColors[color]}`}>
           <Icon size={24} />
         </div>
      </div>
      <div>
        <div className="font-display text-3xl font-black text-neutral-900 mb-1 tracking-tight">{value}</div>
        <div className="text-xs font-bold uppercase tracking-wider opacity-80">{title}</div>
      </div>
    </div>
  );
}
