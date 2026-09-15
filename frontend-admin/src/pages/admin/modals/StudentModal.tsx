import { useState, useEffect } from "react";
import { X, FileText, CalendarPlus, Check, Eye, EyeOff, Upload, Award, Trash2, Download, ExternalLink } from "lucide-react";
import { Student, Admission } from "../types";
import { getApiUrl, API_BASE_URL } from "../../../utils/api";
import { checkPasswordValidity, PasswordRequirements } from "../AdminLogin";

const ALL_COURSES = [
  { value: "Master Course Program", label: "Master Course Program" },
  { value: "AI Tools + DM Basics", label: "AI Tools + DM Basics" },
  { value: "Graphic Design + Photoshop", label: "Graphic Design + Photoshop" },
  { value: "Video Editing", label: "Video Editing" },
  { value: "SMO", label: "SMO" },
  { value: "SEO", label: "SEO" },
  { value: "Performance Marketing", label: "Performance Marketing" },
  { value: "Website Development", label: "Website Development" },
  { value: "Marketing Pro (SEO+SMO+Performance)", label: "Marketing Pro (SEO+SMO+Performance)" },
  { value: "Creative Pro (Graphic+Video)", label: "Creative Pro (Graphic+Video)" },
  { value: "Tech Pro (Web Dev+AI Tools)", label: "Tech Pro (Web Dev+AI Tools)" },
  { value: "Other Inquiry", label: "Other Inquiry" },
];

export function StudentModal({ student, onClose, onSave }: {
  student: Student | null;
  onClose: () => void;
  onSave: (updatedStudent: Student, openInvoice?: boolean) => void;
}) {
  const getInitialPassword = () => {
    if (!student) return "";
    return student.password || (student.name ? `${(student.name || '').trim().split(' ')[0]}@123` : "");
  };

  const [shouldOpenInvoice, setShouldOpenInvoice] = useState(false);
  const [showStudentPassword, setShowStudentPassword] = useState(true);
  const [showReferralPassword, setShowReferralPassword] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  // Student personal info
  const [studentInfo, setStudentInfo] = useState({
    id: student ? student.id : `RW-${Math.floor(1000 + Math.random() * 9000)}`,
    name: student ? student.name : "",
    password: getInitialPassword(),
    email: student ? student.email || "" : "",
    phone: student ? student.phone || "" : "",
    address: student ? student.address || "" : "",
    referredByName: student?.referredByName || "",
    referredByPhone: student?.referredByPhone || "",
    referredByEmail: student?.referredByEmail || "",
    referredAmount: student?.referredAmount || "",
    referredByPassword: "",
  });

  // Certificate Preview Modal state
  const [previewCertificate, setPreviewCertificate] = useState<{
    courseName: string;
    fullUrl: string;
    rawUrl: string;
    isPdf: boolean;
  } | null>(null);

  // Deleting certificate progress indicator
  const [isDeletingCert, setIsDeletingCert] = useState<string | null>(null);

  // Helper to resolve certificate URL safely
  const resolveCertificateUrl = (rawPath?: string) => {
    if (!rawPath) return "";
    if (rawPath.startsWith("http://") || rawPath.startsWith("https://") || rawPath.startsWith("data:") || rawPath.startsWith("blob:")) {
      return rawPath;
    }
    const clean = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
    return `${API_BASE_URL}${clean}`;
  };

  const isPdfFile = (url: string) => {
    return url.toLowerCase().endsWith(".pdf") || url.includes(".pdf?");
  };

  // Process student admissions to ensure they have all required fields and certificates
  const getInitialAdmissions = (): Admission[] => {
    if (!student?.admissions || student.admissions.length === 0) return [];
    
    // Also extract any student-level root certificates
    const rootCerts = Array.isArray(student.certificates) ? [...student.certificates] : [];
    const photoCert = (student as any)?.certificate_photo;
    if (photoCert && !rootCerts.some(c => (c.certificatePath || c.url) === photoCert)) {
      rootCerts.push({
        id: `cert-${student.id}-photo`,
        courseName: Array.isArray(student.course) ? student.course[0] : (student.course || "Course Certificate"),
        certificatePath: photoCert,
        url: photoCert,
        date: student.startDate || new Date().toISOString()
      });
    }

    return student.admissions.map(adm => {
      let certs = Array.isArray(adm.certificates) ? [...adm.certificates] : [];
      
      if (rootCerts.length > 0) {
        const admCourses = (adm.courses || []).map(c => (c || '').toLowerCase().trim());
        rootCerts.forEach(sc => {
          const scName = (sc.courseName || (sc as any).course_name || '').toLowerCase().trim();
          const scPath = sc.certificatePath || (sc as any).certificate_path || sc.url;
          const matches = (student.admissions && student.admissions.length === 1) || admCourses.some(ac => 
            ac === scName || 
            ac.includes(scName) || 
            scName.includes(ac) || 
            (ac.includes('creative') && scName.includes('creative')) ||
            (ac.includes('seo') && scName.includes('seo')) ||
            (ac.includes('master') && scName.includes('master')) ||
            (ac.includes('graphic') && scName.includes('graphic')) ||
            (ac.includes('video') && scName.includes('video'))
          );
          const alreadyExists = certs.some(c => 
            (scPath && (c.certificatePath === scPath || c.url === scPath)) ||
            (c.courseName && c.courseName.toLowerCase().trim() === scName)
          );
          if (matches && !alreadyExists) {
            certs.push({
              ...sc,
              certificatePath: scPath,
              url: scPath,
              courseName: sc.courseName || (sc as any).course_name || "Course Certificate"
            });
          }
        });
      }

      return {
        ...adm,
        admissionId: adm.admissionId || `ADM-${Date.now()}-${student.id}`,
        certificates: certs
      };
    });
  };

  const [localAdmissions, setLocalAdmissions] = useState<Admission[]>(getInitialAdmissions);

  useEffect(() => {
    setLocalAdmissions(getInitialAdmissions());
    if (student) {
      const pwd = student.password || (student.name ? `${(student.name || '').trim().split(' ')[0]}@123` : "");
      setStudentInfo(prev => ({
        ...prev,
        id: student.id,
        name: student.name || "",
        password: pwd,
        email: student.email || "",
        phone: student.phone || "",
        address: student.address || "",
        referredByName: student.referredByName || "",
        referredByPhone: student.referredByPhone || "",
        referredByEmail: student.referredByEmail || "",
        referredAmount: student.referredAmount || "",
      }));
      setShowStudentPassword(true);
    }
  }, [student]);

  const handleDeleteCertificate = async (cert: any, admissionId: string) => {
    const courseTitle = cert.courseName || cert.course_name || "this course";
    const confirmed = window.confirm(
      `Are you sure you want to delete the certificate for "${courseTitle}"?\n\nThis will permanently delete the certificate.`
    );
    if (!confirmed) return;

    try {
      setIsDeletingCert(cert.id || courseTitle);
      const token = localStorage.getItem("adminAuthToken");
      const certPath = cert.certificatePath || cert.certificate_path || cert.url;
      
      const res = await fetch(getApiUrl("/deleteCertificate"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          student_ID: studentInfo.id,
          courseName: courseTitle,
          certificate_id: cert.id,
          certificate_path: certPath,
          admission_id: admissionId
        })
      });

      const data = await res.json();
      if (data.success) {
        // Update local admissions state immediately
        const updatedAdmissions = localAdmissions.map(adm => {
          if (adm.admissionId === admissionId) {
            return {
              ...adm,
              certificates: (adm.certificates || []).filter(c => {
                const cId = c.id;
                const cName = c.courseName || (c as any).course_name;
                const cP = c.url || (c as any).certificatePath || (c as any).certificate_path;
                if (cert.id && cId && cId === cert.id) return false;
                if (certPath && cP && cP === certPath) return false;
                if (cName && courseTitle && cName === courseTitle) return false;
                return true;
              })
            };
          }
          return adm;
        });

        setLocalAdmissions(updatedAdmissions);

        if (student) {
          const updatedStudentObj: Student = {
            ...student,
            admissions: updatedAdmissions,
            certificates: (student.certificates || []).filter(c => {
              const cName = c.courseName || (c as any).course_name;
              const cP = c.url || (c as any).certificatePath || (c as any).certificate_path;
              if (certPath && cP && cP === certPath) return false;
              if (cName && courseTitle && cName === courseTitle) return false;
              return true;
            })
          };
          onSave(updatedStudentObj, false);
        }

        alert(`✅ Certificate for "${courseTitle}" deleted successfully!`);
      } else {
        alert(data.message || "Failed to delete certificate");
      }
    } catch (err) {
      console.error("Error deleting certificate:", err);
      alert("An error occurred while deleting the certificate: " + (err as Error).message);
    } finally {
      setIsDeletingCert(null);
    }
  };

  const handlePreviewCertificate = (cert: any) => {
    const rawUrl = cert.certificatePath || cert.certificate_path || cert.url || "";
    const fullUrl = resolveCertificateUrl(rawUrl);
    setPreviewCertificate({
      courseName: cert.courseName || cert.course_name || "Course Certificate",
      fullUrl,
      rawUrl,
      isPdf: isPdfFile(fullUrl)
    });
  };

  // Current admission being edited
  const [currentAdmission, setCurrentAdmission] = useState({
    admissionId: `ADM-${Date.now()}`,
    courses: [] as string[],
    courseDuration: "",
    totalFee: "",
    paidFee: "",
    feesStatus: "Pending" as "Clear" | "Pending" | "Partial",
    feesInstallment: "",
    startDate: "",
    endDate: "",
    feeType: "Online" as "Online" | "Cash",
    utrNumber: "",
  });

  // State for certificate upload for selected admission
  const [selectedAdmissionForCertificate, setSelectedAdmissionForCertificate] = useState<string | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [certificateCourse, setCertificateCourse] = useState<string>("");

  // Show admission form for adding new admission
  const [showAddAdmissionForm, setShowAddAdmissionForm] = useState(false);
  
  // State for fee payment for selected admission
  const [selectedAdmissionForPayment, setSelectedAdmissionForPayment] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentType, setPaymentType] = useState<"Online" | "Cash">("Online");
  const [paymentUtr, setPaymentUtr] = useState("");
  const [admissionPaymentUpdates, setAdmissionPaymentUpdates] = useState<Record<string, { amount: number; type: "Online" | "Cash"; utr: string; clearFull?: boolean }>>({});

  // State for course duration extension for selected admission
  const [selectedAdmissionForExtension, setSelectedAdmissionForExtension] = useState<string | null>(null);
  const [extensionMonths, setExtensionMonths] = useState<number>(1);
  const [customExtensionMonths, setCustomExtensionMonths] = useState<string>("");
  const [newDurationText, setNewDurationText] = useState<string>("");
  const [newEndDateText, setNewEndDateText] = useState<string>("");
  const [extensionFee, setExtensionFee] = useState<string>("0");
  const [admissionExtensionUpdates, setAdmissionExtensionUpdates] = useState<Record<string, {
    extensionMonths: number;
    newDuration: string;
    newEndDate: string;
    additionalFee: number;
  }>>({});

  const initExtensionForm = (admission: Admission) => {
    const existingExt = admissionExtensionUpdates[admission.admissionId];
    if (existingExt) {
      setExtensionMonths(existingExt.extensionMonths);
      setCustomExtensionMonths(existingExt.extensionMonths > 3 && existingExt.extensionMonths !== 6 ? String(existingExt.extensionMonths) : "");
      setNewDurationText(existingExt.newDuration);
      setNewEndDateText(existingExt.newEndDate);
      setExtensionFee(String(existingExt.additionalFee || 0));
      return;
    }

    const match = (admission.courseDuration || "").match(/(\d+)/);
    const existingMonths = match ? parseInt(match[1], 10) : 3;
    const addM = 1;
    setExtensionMonths(addM);
    setCustomExtensionMonths("");
    setNewDurationText(`${existingMonths + addM} Months`);

    const baseEndDate = admission.endDate ? new Date(admission.endDate) : new Date();
    const newEnd = new Date(baseEndDate);
    newEnd.setMonth(newEnd.getMonth() + addM);

    const y = newEnd.getFullYear();
    const m = String(newEnd.getMonth() + 1).padStart(2, "0");
    const d = String(newEnd.getDate()).padStart(2, "0");
    setNewEndDateText(`${y}-${m}-${d}`);
    setExtensionFee("0");
  };

  const handleSelectExtensionMonths = (admission: Admission, addM: number) => {
    setExtensionMonths(addM);
    setCustomExtensionMonths("");

    const match = (admission.courseDuration || "").match(/(\d+)/);
    const existingMonths = match ? parseInt(match[1], 10) : 3;
    setNewDurationText(`${existingMonths + addM} Months`);

    const baseEndDate = admission.endDate ? new Date(admission.endDate) : new Date();
    const newEnd = new Date(baseEndDate);
    newEnd.setMonth(newEnd.getMonth() + addM);

    const y = newEnd.getFullYear();
    const m = String(newEnd.getMonth() + 1).padStart(2, "0");
    const d = String(newEnd.getDate()).padStart(2, "0");
    setNewEndDateText(`${y}-${m}-${d}`);
  };

  const handleCustomExtensionChange = (admission: Admission, val: number) => {
    setCustomExtensionMonths(val ? String(val) : "");
    if (val && val > 0) {
      setExtensionMonths(val);
      const match = (admission.courseDuration || "").match(/(\d+)/);
      const existingMonths = match ? parseInt(match[1], 10) : 3;
      setNewDurationText(`${existingMonths + val} Months`);

      const baseEndDate = admission.endDate ? new Date(admission.endDate) : new Date();
      const newEnd = new Date(baseEndDate);
      newEnd.setMonth(newEnd.getMonth() + val);

      const y = newEnd.getFullYear();
      const m = String(newEnd.getMonth() + 1).padStart(2, "0");
      const d = String(newEnd.getDate()).padStart(2, "0");
      setNewEndDateText(`${y}-${m}-${d}`);
    }
  };

  const saveExtension = (admissionId: string) => {
    if (!newDurationText.trim()) {
      alert("Please enter a valid course duration");
      return;
    }
    if (!newEndDateText.trim()) {
      alert("Please select a valid new end date");
      return;
    }
    setAdmissionExtensionUpdates(prev => ({
      ...prev,
      [admissionId]: {
        extensionMonths: extensionMonths || 1,
        newDuration: newDurationText.trim(),
        newEndDate: newEndDateText,
        additionalFee: Math.max(0, Number(extensionFee) || 0)
      }
    }));
    setSelectedAdmissionForExtension(null);
  };

  const removeExtension = (admissionId: string) => {
    setAdmissionExtensionUpdates(prev => {
      const copy = { ...prev };
      delete copy[admissionId];
      return copy;
    });
    setSelectedAdmissionForExtension(null);
  };

  // Validate student info
  const validateStudentInfo = () => {
    if (!studentInfo.name.trim()) return "Student name is required";
    if (!studentInfo.phone.trim()) return "Student phone is required";
    if (!/^\d+$/.test(studentInfo.phone.trim())) return "Phone number should contain only numbers";
    if (!student) { // Only require password for new students
      if (!studentInfo.password) return "Password is required";
    }
    if (studentInfo.password && !checkPasswordValidity(studentInfo.password)) {
      return "Password does not meet the security requirements (6-20 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character).";
    }
    if (studentInfo.referredByPassword && !checkPasswordValidity(studentInfo.referredByPassword)) {
      return "Referral Password does not meet the security requirements (6-20 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character).";
    }
    return null;
  };

  // Helper to automatically compute End Date based on Start Date and Course Duration
  const calculateEndDate = (startDateStr: string, durationStr: string): string => {
    if (!startDateStr || !durationStr) return "";
    const match = durationStr.match(/(\d+)/);
    if (!match) return "";
    const months = parseInt(match[1], 10);
    if (isNaN(months) || months <= 0) return "";

    const parts = startDateStr.split("-");
    if (parts.length !== 3) return "";
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    const date = new Date(year, month, day);
    date.setMonth(date.getMonth() + months);

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // Validate admission info
  const validateAdmission = () => {
    if (currentAdmission.courses.length === 0) return "At least one course is required";
    if (!currentAdmission.courseDuration) return "Course duration is required";
    if (!currentAdmission.totalFee) return "Total fee is required";
    if (!currentAdmission.startDate) return "Start date is required";
    if (!currentAdmission.endDate) return "End date is required";
    if (new Date(currentAdmission.endDate) < new Date(currentAdmission.startDate)) return "End date cannot be earlier than start date";
    if (Number(currentAdmission.paidFee) > Number(currentAdmission.totalFee)) return "Paid fee cannot exceed total fee";
    return null;
  };

  // Calculate fees status
  const calculateFeesStatus = (total: number, paid: number) => {
    if (paid >= total && total > 0) return "Clear" as const;
    if (paid > 0 && paid < total) return "Partial" as const;
    return "Pending" as const;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("=== handleSubmit CALLED ===");
    e.preventDefault();

    // Validate student info
    const studentError = validateStudentInfo();
    if (studentError) {
      alert(studentError);
      return;
    }

    try {
      if (!student) {
        // New student - create first admission
        const admissionError = validateAdmission();
        if (admissionError) {
          alert(admissionError);
          return;
        }

        const total = Number(currentAdmission.totalFee);
        const paid = Number(currentAdmission.paidFee);
        const feesStatus = calculateFeesStatus(total, paid);
        const pendingFee = Math.max(0, total - paid);

        const newAdmission: Admission = {
          admissionId: currentAdmission.admissionId,
          courses: currentAdmission.courses,
          courseDuration: currentAdmission.courseDuration,
          totalFee: total,
          totalPaidFee: paid,
          pendingFee: pendingFee,
          feesStatus: feesStatus,
          feesInstallment: Number(currentAdmission.feesInstallment || 0),
          payments: paid > 0 ? [{
            id: `PAY-${Date.now()}`,
            amount: paid,
            paymentMethod: currentAdmission.feeType,
            utrNumber: currentAdmission.feeType === "Online" ? currentAdmission.utrNumber : "",
            date: new Date().toISOString()
          }] : [],
          certificates: [],
          startDate: currentAdmission.startDate,
          endDate: currentAdmission.endDate,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const newStudent: Student = {
          id: studentInfo.id,
          name: studentInfo.name,
          password: studentInfo.password,
          email: studentInfo.email,
          phone: studentInfo.phone,
          address: studentInfo.address,
          admissions: [newAdmission],
          referredByName: studentInfo.referredByName,
          referredByPhone: studentInfo.referredByPhone,
          referredByEmail: studentInfo.referredByEmail,
          referredAmount: Number(studentInfo.referredAmount || 0),
          feesStatus: newAdmission.feesStatus,
          certificates: newAdmission.certificates,
        };

        // Backward compatibility fields
        newStudent.course = newAdmission.courses;
        newStudent.duration = newAdmission.courseDuration;
        newStudent.totalFees = newAdmission.totalFee;
        newStudent.paidFees = newAdmission.totalPaidFee;
        newStudent.pendingFees = newAdmission.pendingFee;
        newStudent.feesStatus = newAdmission.feesStatus;
        newStudent.startDate = newAdmission.startDate;
        newStudent.endDate = newAdmission.endDate;
        newStudent.certificates = newAdmission.certificates;

        // Call backend API to add student
        const payload = {
          student_ID: studentInfo.id,
          student_name: studentInfo.name,
          student_password: studentInfo.password,
          selected_course_name: currentAdmission.courses,
          course_duration: currentAdmission.courseDuration,
          total_fee: currentAdmission.totalFee,
          total_paid_fee: currentAdmission.paidFee,
          fee_type: currentAdmission.feeType,
          fee_utr: currentAdmission.utrNumber,
          phone: studentInfo.phone,
          email: studentInfo.email,
          address: studentInfo.address,
          course_start_date: currentAdmission.startDate,
          course_end_date: currentAdmission.endDate,
          fee_installment: currentAdmission.feesInstallment,
          referredByName: studentInfo.referredByName,
          referredByPhone: studentInfo.referredByPhone,
          referredByEmail: studentInfo.referredByEmail,
          referredAmount: studentInfo.referredAmount,
          referredByPassword: studentInfo.referredByPassword
        };

        const token = localStorage.getItem("adminAuthToken");
        const res = await fetch(getApiUrl("/add_student"), {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        
        if (data.success) {
          onSave(newStudent, shouldOpenInvoice);
        } else {
          alert(data.message || "Failed to add student");
        }
      } else {
        console.log("=== Updating existing student ===");
        // Existing student - update info, add new admission, and apply payments
        const formData = new FormData();

        // Add basic student info to FormData
        formData.append("student_name", studentInfo.name);
        formData.append("phone", studentInfo.phone);
        formData.append("email", studentInfo.email);
        formData.append("address", studentInfo.address);
        if (studentInfo.referredByName) formData.append("referredByName", studentInfo.referredByName);
        if (studentInfo.referredByPhone) formData.append("referredByPhone", studentInfo.referredByPhone);
        if (studentInfo.referredByEmail) formData.append("referredByEmail", studentInfo.referredByEmail);
        if (studentInfo.referredAmount) formData.append("referredAmount", studentInfo.referredAmount.toString());
        
        if (studentInfo.password) {
          formData.append("student_password", studentInfo.password);
        }

        // Prepare admission payments
        const admissionPayments = Object.keys(admissionPaymentUpdates).map(admissionId => ({
          admissionId,
          ...admissionPaymentUpdates[admissionId]
        }));
        if (admissionPayments.length > 0) {
          formData.append("admission_payments", JSON.stringify(admissionPayments));
        }

        // Prepare admission duration extensions
        const admissionExtensions = Object.keys(admissionExtensionUpdates).map(admissionId => ({
          admissionId,
          ...admissionExtensionUpdates[admissionId]
        }));
        if (admissionExtensions.length > 0) {
          formData.append("admission_extensions", JSON.stringify(admissionExtensions));
        }

        // Add new admission if needed
        if (showAddAdmissionForm) {
          const admissionError = validateAdmission();
          if (admissionError) {
            alert(admissionError);
            return;
          }

          formData.append("add_admission", JSON.stringify(currentAdmission));
        }

        // Add certificate if needed
        if (certificateFile && certificateCourse && selectedAdmissionForCertificate) {
          formData.append("certificate_photo", certificateFile);
          formData.append("certificate_course", certificateCourse);
          formData.append("certificate_admission_id", selectedAdmissionForCertificate);
          console.log("Certificate upload data added to formData");
        }

        // Log formData
        console.log("FormData contents:");
        for (let [key, value] of formData.entries()) {
          console.log(`- ${key}:`, value);
        }


        console.log("=== About to make API call ===");
        console.log("student object:", student);
        console.log("student.id:", student.id);
        const url = getApiUrl(`/updateStudentdetails/${student.id}`);
        console.log("URL:", url);
        console.log("FormData has:", formData);
        // Log formData contents one more time
        console.log("FormData entries:");
        for (let entry of formData.entries()) {
            console.log("-", entry[0], ":", entry[1]);
        }
        console.log("Done logging formData, moving on to fetch!");
        
        let res: Response;
        try {
          console.log("Starting fetch with timeout...");
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
          
          const token = localStorage.getItem("adminAuthToken");
          res = await fetch(getApiUrl(`/updateStudentdetails/${student.id}`), {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`
            },
            body: formData,
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          console.log("Response from server received:", res);
          console.log("Response status:", res.status);
          console.log("Response status text:", res.statusText);
        } catch (fetchErr) {
          console.error("=== Fetch Error ===", fetchErr);
          console.error("Error name:", (fetchErr as Error).name);
          console.error("Error message:", (fetchErr as Error).message);
          alert(`Network error: ${(fetchErr as Error).message}`);
          return;
        }

        let data: any;
        try {
          console.log("Starting to parse response as JSON...");
          data = await res.json();
          console.log("Response data from server (JSON):", data);
        } catch (jsonErr) {
          console.error("=== JSON Parse Error ===", jsonErr);
          try {
            const text = await res.text();
            console.error("Response text (not JSON):", text);
            alert(`Error parsing server response! Response was: ${text}`);
          } catch (textErr) {
            console.error("Could not even get response text:", textErr);
            alert("Error parsing server response!");
          }
          return;
        }
        
        if (data.success) {
          // Update local state with updated data
          let updatedStudent: Student = {
            ...student,
            name: studentInfo.name,
            email: studentInfo.email,
            phone: studentInfo.phone,
            address: studentInfo.address,
            referredByName: studentInfo.referredByName,
            referredByPhone: studentInfo.referredByPhone,
            referredByEmail: studentInfo.referredByEmail,
            referredAmount: Number(studentInfo.referredAmount || 0),
            admissions: [...localAdmissions]
          };

          if (studentInfo.password) {
            updatedStudent.password = studentInfo.password;
          }

          if (showAddAdmissionForm) {
            const total = Number(currentAdmission.totalFee);
            const paid = Number(currentAdmission.paidFee);
            const feesStatus = calculateFeesStatus(total, paid);
            const pendingFee = Math.max(0, total - paid);

            const newAdmission: Admission = {
              admissionId: currentAdmission.admissionId,
              courses: currentAdmission.courses,
              courseDuration: currentAdmission.courseDuration,
              totalFee: total,
              totalPaidFee: paid,
              pendingFee: pendingFee,
              feesStatus: feesStatus,
              feesInstallment: Number(currentAdmission.feesInstallment || 0),
              payments: paid > 0 ? [{
                id: `PAY-${Date.now()}`,
                amount: paid,
                paymentMethod: currentAdmission.feeType,
                utrNumber: currentAdmission.feeType === "Online" ? currentAdmission.utrNumber : "",
                date: new Date().toISOString()
              }] : [],
              certificates: [],
              startDate: currentAdmission.startDate,
              endDate: currentAdmission.endDate,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };

            updatedStudent.admissions = [...updatedStudent.admissions, newAdmission];
          }

          // Apply payment updates to admissions in local state
          updatedStudent.admissions = updatedStudent.admissions.map(admission => {
            const update = admissionPaymentUpdates[admission.admissionId];
            if (update) {
              const newTotalPaid = admission.totalPaidFee + update.amount;
              const newPending = Math.max(0, admission.totalFee - newTotalPaid);
              const newStatus = calculateFeesStatus(admission.totalFee, newTotalPaid);

              return {
                ...admission,
                totalPaidFee: newTotalPaid,
                pendingFee: newPending,
                feesStatus: newStatus,
                payments: [
                  ...(admission.payments || []),
                  {
                    id: `PAY-${Date.now()}`,
                    amount: update.amount,
                    paymentMethod: update.type,
                    utrNumber: update.utr,
                    date: new Date().toISOString()
                  }
                ],
                updatedAt: new Date().toISOString()
              };
            }
            return admission;
          });

          // Apply extension updates to admissions in local state
          if (admissionExtensions.length > 0) {
            updatedStudent.admissions = updatedStudent.admissions.map(admission => {
              const ext = admissionExtensionUpdates[admission.admissionId];
              if (ext) {
                const addFee = Number(ext.additionalFee || 0);
                const newTotal = admission.totalFee + addFee;
                const newPending = Math.max(0, newTotal - admission.totalPaidFee);
                const newStatus = calculateFeesStatus(newTotal, admission.totalPaidFee);
                return {
                  ...admission,
                  courseDuration: ext.newDuration,
                  endDate: ext.newEndDate,
                  totalFee: newTotal,
                  pendingFee: newPending,
                  feesStatus: newStatus,
                  updatedAt: new Date().toISOString()
                };
              }
              return admission;
            });
            const firstExt = admissionExtensionUpdates[updatedStudent.admissions[0]?.admissionId];
            if (firstExt) {
              updatedStudent.duration = firstExt.newDuration;
              updatedStudent.endDate = firstExt.newEndDate;
            }
          }

          // Update certificates if needed
          if (certificateFile && certificateCourse && selectedAdmissionForCertificate) {
            // Find the admission by selectedAdmissionForCertificate and add the certificate
            updatedStudent.admissions = (updatedStudent.admissions || []).map(admission => {
              if (admission.admissionId === selectedAdmissionForCertificate) {
                return {
                  ...admission,
                  certificates: [
                    ...(admission.certificates || []),
                    {
                      id: `cert-${Date.now()}`,
                      courseName: certificateCourse,
                      url: URL.createObjectURL(certificateFile), // Temporary URL until next data refresh
                      date: new Date().toISOString()
                    }
                  ],
                  updatedAt: new Date().toISOString()
                };
              }
              return admission;
            });

            const uploadedCourseName = certificateCourse;
            // Clear certificate state after successful update
            setSelectedAdmissionForCertificate(null);
            setCertificateFile(null);
            setCertificateCourse("");
            setLocalAdmissions(updatedStudent.admissions || []);
            alert(`✅ Certificate for "${uploadedCourseName}" uploaded successfully! It is now available on the student's portal.`);
          }

          onSave(updatedStudent, shouldOpenInvoice);
        } else {
          alert(data.message || "Failed to update student");
        }
      }
    } catch (error) {
      console.error("Error saving student:", error);
      alert("Failed to save student: " + (error as Error).message);
    }
  };

  // Calculate total fees across all admissions
  const totalFeesAcrossAdmissions = localAdmissions.reduce((sum, adm) => {
    const extFee = admissionExtensionUpdates[adm.admissionId]?.additionalFee || 0;
    return sum + adm.totalFee + extFee;
  }, 0);
  const totalPaidFeesAcrossAdmissions = localAdmissions.reduce((sum, adm) => sum + adm.totalPaidFee, 0);
  const totalPendingFeesAcrossAdmissions = localAdmissions.reduce((sum, adm) => {
    const extFee = admissionExtensionUpdates[adm.admissionId]?.additionalFee || 0;
    return sum + adm.pendingFee + extFee;
  }, 0);

  return (
    <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-neutral-200 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom-8 duration-300 max-h-[90vh]">
        <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50 shrink-0">
          <h3 className="font-display text-xl font-bold text-neutral-900 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            {student ? "Edit Student & Add Admission" : "Add New Student"}
          </h3>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-neutral-900 transition-colors bg-white hover:bg-neutral-100 p-2 rounded-full border border-neutral-200 shadow-sm cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-200">
          <form id="student-form" onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Student Personal Info */}
            <div className="space-y-4 bg-neutral-50 p-5 rounded-2xl border border-neutral-100">
              <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">Student Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Student ID</label>
                  <input type="text" value={studentInfo.id} readOnly className="w-full px-4 py-2.5 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-500 font-semibold cursor-not-allowed shadow-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Student Name {!student ? "*" : ""}</label>
                  <input required={!student} type="text" value={studentInfo.name} onChange={(e) => { if (e.target.value.length <= 120) setStudentInfo({ ...studentInfo, name: e.target.value }); }} className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all text-neutral-900 shadow-sm" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-neutral-600 block">
                      Student Password {student ? "(Optional)" : "*"}
                    </label>
                    {studentInfo.password && (
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(studentInfo.password);
                          setCopiedPassword(true);
                          setTimeout(() => setCopiedPassword(false), 2000);
                        }}
                        className="text-[11px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                        title="Copy password"
                      >
                        {copiedPassword ? (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <Check size={12} /> Copied!
                          </span>
                        ) : (
                          "Copy Password"
                        )}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      required={!student}
                      type={showStudentPassword ? "text" : "password"}
                      value={studentInfo.password}
                      onChange={(e) => setStudentInfo({ ...studentInfo, password: e.target.value })}
                      placeholder={student ? `${(student.name || '').trim().split(' ')[0]}@123` : "Enter password"}
                      className="w-full pl-4 pr-11 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all text-neutral-900 font-medium shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowStudentPassword(!showStudentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 focus:outline-none p-1 transition-colors cursor-pointer"
                      aria-label={showStudentPassword ? "Hide password" : "Show password"}
                      title={showStudentPassword ? "Hide password" : "Show password"}
                    >
                      {showStudentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1.5">
                    <span>🔑</span>
                    <span>Student login password. Eye button se hide/show kar sakte hain.</span>
                  </p>
                  <PasswordRequirements password={studentInfo.password} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Student Phone {!student ? "*" : ""}</label>
                  <div className="relative flex items-center w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all shadow-sm overflow-hidden">
                    <span className="text-neutral-500 font-bold pr-3 border-r border-neutral-200">+91</span>
                    <input required={!student} type="tel" maxLength={10} value={studentInfo.phone} onChange={(e) => setStudentInfo({ ...studentInfo, phone: e.target.value.replace(/\D/g, '') })} className="w-full pl-3 bg-transparent outline-none text-neutral-900" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Student Email</label>
                  <input type="email" value={studentInfo.email} onChange={(e) => setStudentInfo({ ...studentInfo, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all text-neutral-900 shadow-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Student Address</label>
                  <input type="text" value={studentInfo.address} onChange={(e) => setStudentInfo({ ...studentInfo, address: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all text-neutral-900 shadow-sm" />
                </div>
              </div>
            </div>

            {/* Referral Info - only for new students */}
            {!student && (
              <div className="space-y-4 bg-neutral-50 p-5 rounded-2xl border border-neutral-100">
                <h4 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-4">Referral Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Referral Name</label>
                    <input type="text" value={studentInfo.referredByName} onChange={(e) => { if (e.target.value.length <= 120) setStudentInfo({ ...studentInfo, referredByName: e.target.value }); }} className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-all text-neutral-900 shadow-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Referral Phone</label>
                    <div className="relative flex items-center w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all shadow-sm overflow-hidden">
                      <span className="text-neutral-500 font-bold pr-3 border-r border-neutral-200">+91</span>
                      <input type="tel" maxLength={10} value={studentInfo.referredByPhone} onChange={(e) => setStudentInfo({ ...studentInfo, referredByPhone: e.target.value.replace(/\D/g, '') })} className="w-full pl-3 bg-transparent outline-none text-neutral-900" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Referral Email</label>
                    <input type="email" value={studentInfo.referredByEmail} onChange={(e) => setStudentInfo({ ...studentInfo, referredByEmail: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-all text-neutral-900 shadow-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Referral Password</label>
                    <div className="relative">
                      <input
                        type={showReferralPassword ? "text" : "password"}
                        value={studentInfo.referredByPassword}
                        onChange={(e) => setStudentInfo({ ...studentInfo, referredByPassword: e.target.value })}
                        className="w-full pl-4 pr-11 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-all text-neutral-900 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowReferralPassword(!showReferralPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none p-1 transition-colors"
                        aria-label={showReferralPassword ? "Hide password" : "Show password"}
                      >
                        {showReferralPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <PasswordRequirements password={studentInfo.referredByPassword} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Referred Amount (₹)</label>
                    <input type="number" value={studentInfo.referredAmount} onChange={(e) => { if (e.target.value.length <= 9) setStudentInfo({ ...studentInfo, referredAmount: e.target.value }); }} className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-all text-neutral-900 shadow-sm" />
                  </div>
                </div>
              </div>
            )}

            {/* Existing Admissions (only for existing students) */}
            {student && localAdmissions.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-purple-600 uppercase tracking-widest">Student Admissions ({localAdmissions.length})</h4>
                  <div className="text-sm text-neutral-600">
                    Total Fees: <span className="font-bold text-neutral-900">₹{totalFeesAcrossAdmissions}</span> |
                    Total Paid: <span className="font-bold text-green-600">₹{totalPaidFeesAcrossAdmissions}</span> |
                    Total Pending: <span className="font-bold text-red-600">₹{totalPendingFeesAcrossAdmissions}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {localAdmissions.map((admission, idx) => (
                    <div key={admission.admissionId} className="border border-neutral-200 rounded-xl p-4 bg-white shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h5 className="font-semibold text-neutral-900">
                            Admission #{idx + 1} - {admission.admissionId}
                            {admissionPaymentUpdates[admission.admissionId] && (
                              <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs">
                                Payment pending
                              </span>
                            )}
                          </h5>
                          <div className="text-xs text-neutral-500">
                            From {new Date(admission.startDate).toLocaleDateString()} to{" "}
                            <span className={admissionExtensionUpdates[admission.admissionId] ? "text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded" : ""}>
                              {new Date(admissionExtensionUpdates[admission.admissionId]?.newEndDate || admission.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          admission.feesStatus === "Clear" ? "bg-green-100 text-green-700" :
                          admission.feesStatus === "Partial" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {admission.feesStatus}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-neutral-600">Courses:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {admission.courses.map((course) => (
                              <span key={course} className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs">
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-neutral-600">Duration:</span>{" "}
                          <span className="font-semibold text-neutral-900">
                            {admissionExtensionUpdates[admission.admissionId]?.newDuration || admission.courseDuration}
                          </span>
                          {admissionExtensionUpdates[admission.admissionId] && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold inline-flex items-center gap-1">
                              <Check size={11} />
                              +{admissionExtensionUpdates[admission.admissionId].extensionMonths} Month Extended
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-neutral-600">Total Fee:</span> ₹{admission.totalFee + (admissionExtensionUpdates[admission.admissionId]?.additionalFee || 0)}
                        </div>
                        <div>
                          <span className="font-medium text-neutral-600">Paid:</span> ₹{admission.totalPaidFee}
                        </div>
                        <div>
                          <span className="font-medium text-neutral-600">Pending:</span> ₹{admission.pendingFee + (admissionExtensionUpdates[admission.admissionId]?.additionalFee || 0)}
                        </div>
                        <div>
                          <span className="font-medium text-neutral-600">Installments:</span> {admission.feesInstallment}
                        </div>
                      </div>

                      {/* Payment Controls */}
                      <div className="mt-3 pt-3 border-t border-neutral-100">
                        {admissionPaymentUpdates[admission.admissionId] ? (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h6 className="text-sm font-semibold text-blue-800">
                                Pending Payment: ₹{admissionPaymentUpdates[admission.admissionId].amount}
                                {admissionPaymentUpdates[admission.admissionId].clearFull && " (Full Clearance)"}
                              </h6>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedAdmissionForPayment(admission.admissionId);
                                    setPaymentAmount(admissionPaymentUpdates[admission.admissionId].amount.toString());
                                    setPaymentType(admissionPaymentUpdates[admission.admissionId].type);
                                    setPaymentUtr(admissionPaymentUpdates[admission.admissionId].utr);
                                  }}
                                  className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded hover:bg-blue-200"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAdmissionPaymentUpdates(prev => {
                                      const newUpdates = { ...prev };
                                      delete newUpdates[admission.admissionId];
                                      return newUpdates;
                                    });
                                  }}
                                  className="px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded hover:bg-red-200"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
                              <div>Type: {admissionPaymentUpdates[admission.admissionId].type}</div>
                              {admissionPaymentUpdates[admission.admissionId].type === "Online" && admissionPaymentUpdates[admission.admissionId].utr && (
                                <div>UTR: {admissionPaymentUpdates[admission.admissionId].utr}</div>
                              )}
                            </div>
                          </div>
                        ) : selectedAdmissionForPayment === admission.admissionId ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Payment Amount (₹)</label>
                                <input
                                  type="number"
                                  value={paymentAmount}
                                  onChange={(e) => setPaymentAmount(e.target.value)}
                                  placeholder={admission.pendingFee > 0 ? `Max: ₹${admission.pendingFee}` : "0"}
                                  max={admission.pendingFee}
                                  min={0}
                                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Payment Type</label>
                                <select
                                  value={paymentType}
                                  onChange={(e) => setPaymentType(e.target.value as "Online" | "Cash")}
                                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm"
                                >
                                  <option value="Online">Online</option>
                                  <option value="Cash">Cash</option>
                                </select>
                              </div>
                              {paymentType === "Online" && (
                                <div className="md:col-span-2">
                                  <label className="text-xs font-semibold text-neutral-600 block mb-1.5">UTR Number</label>
                                  <input
                                    type="text"
                                    value={paymentUtr}
                                    onChange={(e) => { if (e.target.value.length <= 120) setPaymentUtr(e.target.value); }}
                                    placeholder="Enter UTR number"
                                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const amount = Number(paymentAmount);
                                  if (amount <= 0) {
                                    alert("Please enter a valid payment amount");
                                    return;
                                  }
                                  if (amount > admission.pendingFee) {
                                    alert(`Payment amount cannot exceed pending fee of ₹${admission.pendingFee}`);
                                    return;
                                  }
                                  // Save payment to state
                                  setAdmissionPaymentUpdates(prev => ({
                                    ...prev,
                                    [admission.admissionId]: {
                                      amount,
                                      type: paymentType,
                                      utr: paymentUtr
                                    }
                                  }));
                                  setSelectedAdmissionForPayment(null);
                                  setPaymentAmount("");
                                  setPaymentUtr("");
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                              >
                                {admissionPaymentUpdates[admission.admissionId] ? "Update Payment" : "Record Payment"}
                              </button>
                              {admission.pendingFee > 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    // Save full fee clearance to state
                                    setAdmissionPaymentUpdates(prev => ({
                                      ...prev,
                                      [admission.admissionId]: {
                                        amount: admission.pendingFee,
                                        type: paymentType,
                                        utr: paymentUtr,
                                        clearFull: true
                                      }
                                    }));
                                    setSelectedAdmissionForPayment(null);
                                    setPaymentAmount("");
                                    setPaymentUtr("");
                                  }}
                                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700"
                                >
                                  Clear Full Fee
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedAdmissionForPayment(null);
                                  setPaymentAmount("");
                                  setPaymentUtr("");
                                }}
                                className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-lg text-sm font-semibold hover:bg-neutral-300"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2 flex-wrap items-center">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedAdmissionForPayment(admission.admissionId);
                                setPaymentAmount("");
                                setPaymentUtr("");
                              }}
                              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold hover:bg-purple-200 transition-colors"
                            >
                              + Record Payment
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (selectedAdmissionForExtension === admission.admissionId) {
                                  setSelectedAdmissionForExtension(null);
                                } else {
                                  setSelectedAdmissionForExtension(admission.admissionId);
                                  initExtensionForm(admission);
                                }
                              }}
                              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                                admissionExtensionUpdates[admission.admissionId]
                                  ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300"
                                  : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                              }`}
                            >
                              <CalendarPlus size={15} />
                              {admissionExtensionUpdates[admission.admissionId]
                                ? `Extended (+${admissionExtensionUpdates[admission.admissionId].extensionMonths} Month) - Edit`
                                : "+ Extend Duration / Month"}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Course Duration Extension Panel */}
                      {selectedAdmissionForExtension === admission.admissionId && (
                        <div className="mt-3 p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200 rounded-xl space-y-4">
                          <div className="flex items-center justify-between">
                            <h6 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                              <CalendarPlus size={16} className="text-blue-600" />
                              Extend Course Duration (Month Extension)
                            </h6>
                            {admissionExtensionUpdates[admission.admissionId] && (
                              <button
                                type="button"
                                onClick={() => removeExtension(admission.admissionId)}
                                className="text-xs text-red-600 hover:text-red-800 font-semibold underline cursor-pointer"
                              >
                                Remove Extension
                              </button>
                            )}
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                              Quick Extend By:
                            </label>
                            <div className="flex items-center gap-2 flex-wrap">
                              {[1, 2, 3, 6].map((m) => (
                                <button
                                  key={m}
                                  type="button"
                                  onClick={() => handleSelectExtensionMonths(admission, m)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    extensionMonths === m && !customExtensionMonths
                                      ? "bg-blue-600 text-white shadow-sm"
                                      : "bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100"
                                  }`}
                                >
                                  +{m} Month{m > 1 ? "s" : ""}
                                </button>
                              ))}
                              <div className="flex items-center gap-1.5 ml-1">
                                <span className="text-xs text-neutral-500 font-medium">or custom:</span>
                                <input
                                  type="number"
                                  min="1"
                                  max="24"
                                  value={customExtensionMonths}
                                  onChange={(e) => handleCustomExtensionChange(admission, Number(e.target.value))}
                                  placeholder="Months"
                                  className="w-16 px-2 py-1 text-xs border border-neutral-300 rounded-md bg-white text-neutral-900 outline-none focus:border-blue-500"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="text-xs font-semibold text-neutral-600 block mb-1">
                                New Duration
                              </label>
                              <input
                                type="text"
                                value={newDurationText}
                                onChange={(e) => setNewDurationText(e.target.value)}
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 bg-white font-semibold text-neutral-900 outline-none focus:border-blue-500"
                                placeholder="e.g. 4 Months"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-neutral-600 block mb-1">
                                New End Date
                              </label>
                              <input
                                type="date"
                                value={newEndDateText}
                                onChange={(e) => setNewEndDateText(e.target.value)}
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 bg-white font-semibold text-neutral-900 outline-none focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-neutral-600 block mb-1">
                                Additional Fee (Optional ₹)
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={extensionFee}
                                onChange={(e) => setExtensionFee(e.target.value)}
                                placeholder="0"
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 bg-white text-neutral-900 outline-none focus:border-blue-500"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => saveExtension(admission.admissionId)}
                              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                            >
                              Confirm Extension
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedAdmissionForExtension(null)}
                              className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Certificates Section for this Admission */}
                      <div className="mt-4 pt-3.5 border-t border-neutral-200/80 space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                              <Award size={14} />
                            </div>
                            <span className="text-xs font-bold text-neutral-800 tracking-wide uppercase">
                              Certificates ({admission.certificates?.length || 0})
                            </span>
                            {admission.certificates && admission.certificates.length > 0 && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                {admission.certificates.length} Issued
                              </span>
                            )}
                          </div>

                          {/* Upload Certificate toggle - if fees are clear */}
                          {admission.feesStatus === "Clear" && selectedAdmissionForCertificate !== admission.admissionId && (
                            <button 
                              type="button" 
                              onClick={() => {
                                setSelectedAdmissionForCertificate(admission.admissionId);
                                if (admission.courses.length === 1) {
                                  setCertificateCourse(admission.courses[0]);
                                }
                              }} 
                              className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                            >
                              <Upload size={13} />
                              + Upload Certificate
                            </button>
                          )}
                        </div>

                        {/* Uploaded Certificates List */}
                        {admission.certificates && admission.certificates.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            {admission.certificates.map((cert: any, cIdx: number) => {
                              const isCurrentDeleting = isDeletingCert === (cert.id || cert.courseName || cert.course_name);

                              return (
                                <div 
                                  key={cert.id || cIdx} 
                                  className="flex items-center justify-between p-3 bg-neutral-50/80 hover:bg-emerald-50/40 border border-neutral-200 hover:border-emerald-300 rounded-2xl transition-all shadow-2xs"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
                                      <Award size={16} />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="text-xs font-bold text-neutral-900 truncate" title={cert.courseName || cert.course_name}>
                                        {cert.courseName || cert.course_name}
                                      </div>
                                      <div className="text-[10px] text-neutral-500 flex items-center gap-1">
                                        <span>Issued: {cert.date ? new Date(cert.date).toLocaleDateString('en-IN') : 'Available'}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Action Buttons: View & Delete */}
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {/* View in Admin Panel Button */}
                                    <button
                                      type="button"
                                      onClick={() => handlePreviewCertificate(cert)}
                                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 hover:border-blue-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                                      title="Admin panel mein certificate dekhein"
                                    >
                                      <Eye size={13} />
                                      <span>View</span>
                                    </button>

                                    {/* Delete Certificate Button */}
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteCertificate(cert, admission.admissionId)}
                                      disabled={isCurrentDeleting}
                                      className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 hover:border-red-300 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                                      title="Certificate delete karein"
                                    >
                                      <Trash2 size={13} />
                                      <span>{isCurrentDeleting ? "..." : "Delete"}</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-xs text-neutral-400 italic py-1 bg-neutral-50/50 px-3 rounded-lg border border-dashed border-neutral-200">
                            Abhi tak koi certificate upload ya issue nahi hua hai.
                          </div>
                        )}

                        {/* Upload Form */}
                        {selectedAdmissionForCertificate === admission.admissionId && (
                          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-3 mt-2 animate-in fade-in duration-200">
                            <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                              <Upload size={14} className="text-blue-600" />
                              Upload Certificate for this Admission
                            </div>
                            <div className="flex gap-2 flex-wrap items-center">
                              <select 
                                value={certificateCourse} 
                                onChange={(e) => setCertificateCourse(e.target.value)} 
                                className="px-3 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-semibold text-neutral-800 outline-none focus:border-blue-500 shadow-2xs"
                              >
                                <option value="">Select course for certificate *</option>
                                {admission.courses.map((course) => (
                                  <option key={course} value={course}>{course}</option>
                                ))}
                              </select>
                              <input 
                                type="file" 
                                accept="application/pdf, image/*" 
                                onChange={(e) => setCertificateFile(e.target.files?.[0] || null)} 
                                className="text-xs text-neutral-700 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer" 
                              />
                              <button 
                                type="button" 
                                onClick={(e) => {
                                  if (!certificateCourse) {
                                    alert("Please select a course for the certificate!");
                                    return;
                                  }
                                  if (!certificateFile) {
                                    alert("Please choose a certificate file (PNG, JPG, or PDF)!");
                                    return;
                                  }
                                  const form = (e.currentTarget as HTMLElement).closest("form");
                                  if (form) {
                                    form.requestSubmit();
                                  }
                                }} 
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                              >
                                <Upload size={13} />
                                Upload & Save
                              </button>
                              <button 
                                type="button" 
                                onClick={() => {
                                  setSelectedAdmissionForCertificate(null);
                                  setCertificateFile(null);
                                  setCertificateCourse("");
                                }} 
                                className="px-3.5 py-2 bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold hover:bg-neutral-300 transition-all cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                            {certificateFile && (
                              <div className="text-[11px] text-blue-700 font-medium">
                                Selected file: <span className="font-bold">{certificateFile.name}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Admission Form */}
            {(showAddAdmissionForm || !student) && (
              <div className="space-y-4 bg-neutral-50 p-5 rounded-2xl border border-neutral-100">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-purple-600 uppercase tracking-widest">
                    {!student ? "First Admission" : "Add New Admission"}
                  </h4>
                  {student && (
                    <button type="button" onClick={() => setShowAddAdmissionForm(false)} className="text-xs text-red-600 hover:text-red-700 font-semibold">
                      Cancel
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Select Courses *</label>
                    <div className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-white shadow-sm">
                      <div className="flex flex-wrap gap-2">
                        {ALL_COURSES.map((course) => (
                          <label key={course.value} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-200 cursor-pointer hover:bg-purple-50 hover:border-purple-300 transition-all">
                            <input
                              type="checkbox"
                              checked={currentAdmission.courses.includes(course.value)}
                              onChange={(e) => {
                                setCurrentAdmission({
                                  ...currentAdmission,
                                  courses: e.target.checked
                                    ? [...currentAdmission.courses, course.value]
                                    : currentAdmission.courses.filter(c => c !== course.value)
                                });
                              }}
                              className="rounded border-neutral-300 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-xs font-semibold text-neutral-700">{course.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Course Duration *</label>
                    <select
                      required={!student || showAddAdmissionForm}
                      value={currentAdmission.courseDuration}
                      onChange={(e) => {
                        const newDuration = e.target.value;
                        const computedEnd = calculateEndDate(currentAdmission.startDate, newDuration);
                        setCurrentAdmission(prev => ({
                          ...prev,
                          courseDuration: newDuration,
                          endDate: computedEnd ? computedEnd : prev.endDate
                        }));
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-purple-500 focus:outline-none transition-all text-neutral-900 shadow-sm"
                    >
                      <option value="">Select duration</option>
                      <option value="1 Month">1 Month</option>
                      <option value="2 Months">2 Months</option>
                      <option value="3 Months">3 Months</option>
                      <option value="4 Months">4 Months</option>
                      <option value="5 Months">5 Months</option>
                      <option value="6 Months">6 Months</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Total Fee (₹) *</label>
                    <input type="number" required={!student || showAddAdmissionForm} min={0} value={currentAdmission.totalFee} onChange={(e) => { if (e.target.value.length <= 9) setCurrentAdmission({ ...currentAdmission, totalFee: e.target.value }); }} className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-purple-500 focus:outline-none transition-all text-neutral-900 shadow-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Paid Fee (₹)</label>
                    <input type="number" min={0} value={currentAdmission.paidFee} onChange={(e) => { if (e.target.value.length <= 9) setCurrentAdmission({ ...currentAdmission, paidFee: e.target.value }); }} className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-purple-500 focus:outline-none transition-all text-green-600 font-bold shadow-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Fee Type</label>
                    <select value={currentAdmission.feeType} onChange={(e) => setCurrentAdmission({ ...currentAdmission, feeType: e.target.value as "Online" | "Cash" })} className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-purple-500 focus:outline-none transition-all text-neutral-900 shadow-sm">
                      <option value="Online">Online</option>
                      <option value="Cash">Cash</option>
                    </select>
                  </div>
                  {currentAdmission.feeType === "Online" && (
                    <div>
                      <label className="text-xs font-semibold text-neutral-600 block mb-1.5">UTR Number</label>
                      <input type="text" value={currentAdmission.utrNumber} onChange={(e) => { if (e.target.value.length <= 120) setCurrentAdmission({ ...currentAdmission, utrNumber: e.target.value }); }} className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-purple-500 focus:outline-none transition-all text-neutral-900 shadow-sm" />
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Installments Paid</label>
                    <input type="number" min={0} value={currentAdmission.feesInstallment} onChange={(e) => { if (e.target.value.length <= 120) setCurrentAdmission({ ...currentAdmission, feesInstallment: e.target.value }); }} className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-purple-500 focus:outline-none transition-all text-neutral-900 shadow-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Start Date *</label>
                    <input
                      type="date"
                      required={!student || showAddAdmissionForm}
                      value={currentAdmission.startDate}
                      onChange={(e) => {
                        const newStartDate = e.target.value;
                        const computedEnd = calculateEndDate(newStartDate, currentAdmission.courseDuration);
                        setCurrentAdmission(prev => ({
                          ...prev,
                          startDate: newStartDate,
                          endDate: computedEnd ? computedEnd : prev.endDate
                        }));
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-purple-500 focus:outline-none transition-all text-neutral-900 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-600 block mb-1.5">End Date *</label>
                    <input
                      type="date"
                      required={!student || showAddAdmissionForm}
                      value={currentAdmission.endDate}
                      onChange={(e) => setCurrentAdmission(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-purple-500 focus:outline-none transition-all text-neutral-900 shadow-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Add Admission Button (for existing students) */}
            {student && !showAddAdmissionForm && (
              <button type="button" onClick={() => setShowAddAdmissionForm(true)} className="w-full py-3 border-2 border-dashed border-purple-300 rounded-xl text-purple-600 font-semibold hover:bg-purple-50 transition-all">
                + Add New Admission
              </button>
            )}
          </form>
        </div>

        <div className="p-6 border-t border-neutral-200 flex justify-between items-center shrink-0 bg-white relative z-10">
          {student && Object.keys(admissionPaymentUpdates).length > 0 && (
            <div className="text-blue-600 font-semibold text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              {Object.keys(admissionPaymentUpdates).length} payment{Object.keys(admissionPaymentUpdates).length > 1 ? 's' : ''} pending - click Save to apply
            </div>
          )}
          <div className="flex items-center gap-3 ml-auto">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-all cursor-pointer">
              Cancel
            </button>
            <button 
              type="submit" 
              form="student-form"
              onClick={() => setShouldOpenInvoice(true)}
              className="px-5 py-2.5 rounded-xl font-semibold text-[#FF5A36] bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Save details and immediately generate printable fee bill"
            >
              <FileText size={16} />
              Save & Print Bill
            </button>
            <button 
              type="submit" 
              form="student-form" 
              onClick={() => setShouldOpenInvoice(false)}
              className="px-7 py-2.5 rounded-xl font-semibold text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              {student ? (
                Object.keys(admissionPaymentUpdates).length > 0 
                  ? "Save Payments & Update" 
                  : (showAddAdmissionForm ? "Update & Add Admission" : "Update Student")
              ) : "Save Student"}
            </button>
          </div>
        </div>
      </div>

      {/* Certificate Preview Modal */}
      {previewCertificate && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-neutral-200 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Award size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">
                    {previewCertificate.courseName}
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Student: <span className="font-semibold text-neutral-700">{studentInfo.name}</span> ({studentInfo.id})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={previewCertificate.fullUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
                  title="Download certificate"
                >
                  <Download size={13} />
                  <span>Download</span>
                </a>
                <a
                  href={previewCertificate.fullUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-neutral-600 hover:text-neutral-900 rounded-xl hover:bg-neutral-200/70 transition-colors"
                  title="Open in new window"
                >
                  <ExternalLink size={16} />
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewCertificate(null)}
                  className="p-2 text-neutral-400 hover:text-neutral-700 rounded-xl hover:bg-neutral-200/70 transition-colors cursor-pointer"
                  title="Close preview"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Certificate Preview Body */}
            <div className="flex-1 overflow-auto p-4 bg-neutral-900/5 flex items-center justify-center min-h-[380px]">
              {previewCertificate.isPdf ? (
                <iframe 
                  src={previewCertificate.fullUrl} 
                  className="w-full h-[540px] rounded-2xl border border-neutral-300 bg-white shadow-sm" 
                  title="Certificate PDF Preview"
                />
              ) : (
                <div className="max-w-full max-h-[600px] flex items-center justify-center">
                  <img 
                    src={previewCertificate.fullUrl} 
                    alt={previewCertificate.courseName} 
                    className="max-h-[560px] w-auto max-w-full rounded-2xl shadow-xl border border-neutral-300 object-contain"
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between text-xs text-neutral-600 shrink-0">
              <span className="font-mono text-[11px] text-neutral-500 truncate max-w-md" title={previewCertificate.fullUrl}>
                {previewCertificate.rawUrl}
              </span>
              <button
                type="button"
                onClick={() => setPreviewCertificate(null)}
                className="px-4 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-xl font-semibold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
