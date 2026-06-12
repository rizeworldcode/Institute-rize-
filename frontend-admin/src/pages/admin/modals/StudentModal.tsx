import { useState } from "react";
import { X } from "lucide-react";
import { Student, Admission } from "../types";

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
  onSave: (updatedStudent: Student) => void;
}) {
  // Student personal info
  const [studentInfo, setStudentInfo] = useState({
    id: student ? student.id : `RW-${Math.floor(1000 + Math.random() * 9000)}`,
    name: student ? student.name : "",
    password: "",
    email: student ? student.email || "" : "",
    phone: student ? student.phone || "" : "",
    address: student ? student.address || "" : "",
    referredByName: student?.referredByName || "",
    referredByPhone: student?.referredByPhone || "",
    referredByEmail: student?.referredByEmail || "",
    referredAmount: student?.referredAmount || "",
  });

  // Process student admissions to ensure they have all required fields
  const processedStudentAdmissions = student?.admissions?.map(adm => ({
    ...adm,
    admissionId: adm.admissionId || `ADM-${Date.now()}-${student.id}`,
  })) || [];

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

  // Validate student info
  const validateStudentInfo = () => {
    if (!studentInfo.name.trim()) return "Student name is required";
    if (!studentInfo.phone.trim()) return "Student phone is required";
    if (!/^\d+$/.test(studentInfo.phone.trim())) return "Phone number should contain only numbers";
    if (studentInfo.password && studentInfo.password.length < 6) return "Password must contain minimum 6 characters";
    if (!student) { // Only require password for new students
      if (!studentInfo.password) return "Password is required";
    }
    return null;
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
          referredAmount: studentInfo.referredAmount
        };

        const res = await fetch("http://localhost:3001/add_student", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        
        if (data.success) {
          onSave(newStudent);
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
        const url = `http://localhost:3001/updateStudentdetails/${student.id}`;
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
          
          res = await fetch(`http://localhost:3001/updateStudentdetails/${student.id}`, {
            method: "POST",
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
            admissions: [...processedStudentAdmissions]
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

            // Clear certificate state after successful update
            setSelectedAdmissionForCertificate(null);
            setCertificateFile(null);
            setCertificateCourse("");
          }

          onSave(updatedStudent);
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
  const totalFeesAcrossAdmissions = processedStudentAdmissions.reduce((sum, adm) => sum + adm.totalFee, 0);
  const totalPaidFeesAcrossAdmissions = processedStudentAdmissions.reduce((sum, adm) => sum + adm.totalPaidFee, 0);
  const totalPendingFeesAcrossAdmissions = processedStudentAdmissions.reduce((sum, adm) => sum + adm.pendingFee, 0);

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
                  <input required={!student} type="text" value={studentInfo.name} onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all text-neutral-900 shadow-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-600 block mb-1.5">
                    Student Password {student ? "(Optional)" : "*"}
                  </label>
                  <input
                    required={!student}
                    type="password"
                    minLength={6}
                    value={studentInfo.password}
                    onChange={(e) => setStudentInfo({ ...studentInfo, password: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all text-neutral-900 shadow-sm"
                  />
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
                    <input type="text" value={studentInfo.referredByName} onChange={(e) => setStudentInfo({ ...studentInfo, referredByName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-all text-neutral-900 shadow-sm" />
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
                    <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Referred Amount (₹)</label>
                    <input type="number" value={studentInfo.referredAmount} onChange={(e) => setStudentInfo({ ...studentInfo, referredAmount: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-all text-neutral-900 shadow-sm" />
                  </div>
                </div>
              </div>
            )}

            {/* Existing Admissions (only for existing students) */}
            {student && processedStudentAdmissions.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-purple-600 uppercase tracking-widest">Student Admissions ({processedStudentAdmissions.length})</h4>
                  <div className="text-sm text-neutral-600">
                    Total Fees: <span className="font-bold text-neutral-900">₹{totalFeesAcrossAdmissions}</span> |
                    Total Paid: <span className="font-bold text-green-600">₹{totalPaidFeesAcrossAdmissions}</span> |
                    Total Pending: <span className="font-bold text-red-600">₹{totalPendingFeesAcrossAdmissions}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {processedStudentAdmissions.map((admission, idx) => (
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
                            From {new Date(admission.startDate).toLocaleDateString()} to {new Date(admission.endDate).toLocaleDateString()}
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
                          <span className="font-medium text-neutral-600">Duration:</span> {admission.courseDuration}
                        </div>
                        <div>
                          <span className="font-medium text-neutral-600">Total Fee:</span> ₹{admission.totalFee}
                        </div>
                        <div>
                          <span className="font-medium text-neutral-600">Paid:</span> ₹{admission.totalPaidFee}
                        </div>
                        <div>
                          <span className="font-medium text-neutral-600">Pending:</span> ₹{admission.pendingFee}
                        </div>
                        <div>
                          <span className="font-medium text-neutral-600">Installments:</span> {admission.feesInstallment}
                        </div>
                      </div>

                      {/* Certificates for this admission */}
                      {admission.certificates.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-neutral-100">
                          <h6 className="text-xs font-semibold text-green-700 mb-2">Issued Certificates:</h6>
                          <div className="flex flex-wrap gap-2">
                            {admission.certificates.map((cert) => (
                              <div key={cert.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
                                <span className="text-xs font-semibold text-green-800">{cert.courseName}</span>
                                <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                                  View
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

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
                                    onChange={(e) => setPaymentUtr(e.target.value)}
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
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedAdmissionForPayment(admission.admissionId);
                                setPaymentAmount("");
                                setPaymentUtr("");
                              }}
                              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold hover:bg-purple-200"
                            >
                              + Record Payment
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Certificate upload button - only if fees clear */}
                      {admission.feesStatus === "Clear" && (
                        <div className="mt-3 pt-3 border-t border-neutral-100">
                          {selectedAdmissionForCertificate === admission.admissionId ? (
                            <div className="space-y-3">
                              <div className="flex gap-2 flex-wrap">
                                <select value={certificateCourse} onChange={(e) => setCertificateCourse(e.target.value)} className="px-3 py-2 rounded-lg border border-neutral-200 text-sm">
                                  <option value="">Select course for certificate</option>
                                  {admission.courses.map((course) => (
                                    <option key={course} value={course}>{course}</option>
                                  ))}
                                </select>
                                <input type="file" accept="application/pdf, image/*" onChange={(e) => setCertificateFile(e.target.files?.[0] || null)} className="text-sm" />
                                <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
                                  Upload
                                </button>
                                <button type="button" onClick={() => {
                                  setSelectedAdmissionForCertificate(null);
                                  setCertificateFile(null);
                                  setCertificateCourse("");
                                }} className="px-3 py-2 bg-neutral-200 text-neutral-700 rounded-lg text-sm font-semibold hover:bg-neutral-300">
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button type="button" onClick={() => setSelectedAdmissionForCertificate(admission.admissionId)} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-200">
                              + Upload Certificate
                            </button>
                          )}
                        </div>
                      )}
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
                    <select required={!student || showAddAdmissionForm} value={currentAdmission.courseDuration} onChange={(e) => setCurrentAdmission({ ...currentAdmission, courseDuration: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-purple-500 focus:outline-none transition-all text-neutral-900 shadow-sm">
                      <option value="">Select duration</option>
                      <option value="1 Month">1 Month</option>
                      <option value="2 Months">2 Months</option>
                      <option value="3 Months">3 Months</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Total Fee (₹) *</label>
                    <input type="number" required={!student || showAddAdmissionForm} min={0} value={currentAdmission.totalFee} onChange={(e) => setCurrentAdmission({ ...currentAdmission, totalFee: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-purple-500 focus:outline-none transition-all text-neutral-900 shadow-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Paid Fee (₹)</label>
                    <input type="number" min={0} value={currentAdmission.paidFee} onChange={(e) => setCurrentAdmission({ ...currentAdmission, paidFee: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-purple-500 focus:outline-none transition-all text-green-600 font-bold shadow-sm" />
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
                      <input type="text" value={currentAdmission.utrNumber} onChange={(e) => setCurrentAdmission({ ...currentAdmission, utrNumber: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-purple-500 focus:outline-none transition-all text-neutral-900 shadow-sm" />
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Installments Paid</label>
                    <input type="number" min={0} value={currentAdmission.feesInstallment} onChange={(e) => setCurrentAdmission({ ...currentAdmission, feesInstallment: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-purple-500 focus:outline-none transition-all text-neutral-900 shadow-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-600 block mb-1.5">Start Date *</label>
                    <input type="date" required={!student || showAddAdmissionForm} value={currentAdmission.startDate} onChange={(e) => setCurrentAdmission({ ...currentAdmission, startDate: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-purple-500 focus:outline-none transition-all text-neutral-900 shadow-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-600 block mb-1.5">End Date *</label>
                    <input type="date" required={!student || showAddAdmissionForm} value={currentAdmission.endDate} onChange={(e) => setCurrentAdmission({ ...currentAdmission, endDate: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-purple-500 focus:outline-none transition-all text-neutral-900 shadow-sm" />
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
          <div className="flex gap-3 ml-auto">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-all cursor-pointer">
              Cancel
            </button>
            <button type="submit" form="student-form" className="px-8 py-2.5 rounded-xl font-semibold text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:-translate-y-0.5 transition-all cursor-pointer">
              {student ? (
                Object.keys(admissionPaymentUpdates).length > 0 
                  ? "Save Payments & Update" 
                  : (showAddAdmissionForm ? "Update & Add Admission" : "Update Student")
              ) : "Save Student"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
