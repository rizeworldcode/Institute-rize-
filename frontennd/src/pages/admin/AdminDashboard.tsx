import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Search, Plus, Upload, Trash2, Edit2, LogOut, CheckCircle2, Shield, Eye, FileBox, AlertCircle, Download } from "lucide-react";
import { PasswordRequirements, checkPasswordValidity } from "./AdminLogin";

// Types
type Student = {
  id: string;
  name: string;
  password?: string;
  feesStatus: "Clear" | "Pending" | "Partial";
  certificates: Certificate[];
};

type Certificate = {
  id: string;
  url: string;
  date: string;
  name: string;
};

type StudentDataSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
};


export default function AdminDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [dataSearch, setDataSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"students" | "certificates">("students");
  const [studentDataList, setStudentDataList] = useState<StudentDataSubmission[]>([
    {
      id: "SD-1001",
      name: "Anjali Verma",
      email: "anjali.v@example.com",
      phone: "9876543210",
      subject: "Master Course Program",
      message: "I am interested in joining the upcoming batch. Please share details.",
      date: "2026-05-29",
    },
    {
      id: "SD-1002",
      name: "Rohan Gupta",
      email: "rohan.g@example.com",
      phone: "8765432109",
      subject: "SEO",
      message: "Do you offer weekend classes for SEO?",
      date: "2026-05-28",
    }
  ]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    unissuedCertificates: 0,
    certificatesIssued: 0
  });

  // Modals state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("http://localhost:3001/admin_dashboardGet");
      const data = await res.json();
      if (data.success) {
        const mappedStudents: Student[] = data.tcData.map((item: any) => ({
          id: item.student_ID,
          name: item.student_name,
          feesStatus: item.status,
          certificates: item.certificate_photo ? [{
            id: "backend-cert",
            name: "Uploaded Certificate",
            url: `http://localhost:3001/${item.certificate_photo}`,
            date: item.created_at ? new Date(item.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
          }] : []
        }));
        setStudents(mappedStudents);
        setStats({
          totalStudents: data.total_tc_uploaded,
          unissuedCertificates: data.unverifiedTc,
          certificatesIssued: data.verifiedTc
        });
        localStorage.setItem("rw_students", JSON.stringify(mappedStudents));
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  useEffect(() => {
    // Check Secure Session Auth
    const token = localStorage.getItem("adminAuthToken");
    const authTime = localStorage.getItem("adminAuthTime");
    
    if (!token) {
      navigate("/admin/login");
      return;
    }

    // Session Timeout (1 Hour)
    if (authTime && Date.now() - parseInt(authTime) > 3600000) {
      localStorage.removeItem("adminAuthToken");
      localStorage.removeItem("adminAuthTime");
      navigate("/admin/login");
      return;
    }

    fetchDashboardData();
  }, [navigate]);

  const saveStudents = (updated: Student[]) => {
    setStudents(updated);
    localStorage.setItem("rw_students", JSON.stringify(updated));
    fetchDashboardData(); // Refresh stats after save
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("adminAuthToken");
      if (token) {
        await fetch("http://localhost:3001/admin_logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("adminAuthToken");
      localStorage.removeItem("adminAuthTime");
      navigate("/");
    }
  };

  // Filtered Students
  const filteredStudents = students.filter(
    (s) =>
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex relative overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 hidden md:flex flex-col relative z-20">
        <div className="p-6 border-b border-neutral-200">
          <div className="h-10 w-32 relative flex items-center mb-1">
            <img src="/logo/RIZE LOGO HORI PNG.png" alt="RizeWorld Logo" className="h-full w-full object-contain object-left drop-shadow-md scale-[5.5] origin-left" />
          </div>
          <div className="mt-2 text-xs font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-2">
            <Shield size={12} className="text-green-500" /> Secure Admin
          </div>
        </div>

        <div className="flex-1 py-6 px-4 space-y-2">
          <SidebarItem icon={Users} label="Students" active={activeTab === "students"} onClick={() => setActiveTab("students")} />
          <SidebarItem icon={FileBox} label="Student Data" active={activeTab === "certificates"} onClick={() => setActiveTab("certificates")} />
        </div>

        <div className="p-6 border-t border-neutral-200">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 font-semibold hover:bg-red-50 rounded-xl transition-colors">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-neutral-200 flex items-center justify-between px-8 sticky top-0 z-30">
          <h2 className="font-display text-2xl font-bold text-neutral-900">
            {activeTab === "students" && "Student Management"}
            {activeTab === "certificates" && "Student Data Manager"}
          </h2>
          
          {/* Mobile Header elements */}
          <div className="md:hidden flex items-center gap-4">
             <button onClick={handleLogout} className="text-red-500"><LogOut size={20} /></button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Total Students" value={stats.totalStudents} icon={Users} color="blue" />
              <StatCard title="Unissued Certificates" value={stats.unissuedCertificates} icon={AlertCircle} color="orange" />
              <StatCard title="Certificates Issued" value={stats.certificatesIssued} icon={CheckCircle2} color="green" />
            </div>

            {/* Students Tab */}
            {activeTab === "students" && (
              <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative max-w-sm w-full">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search by ID or Name..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-500 focus:ring-1 focus:outline-none transition-all text-sm"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      setEditingStudent(null);
                      setIsStudentModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm text-sm"
                  >
                    <Plus size={18} /> Add Student
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 text-xs uppercase tracking-wider font-semibold">
                        <th className="py-4 px-6">Student ID</th>
                        <th className="py-4 px-6">Name</th>
                        <th className="py-4 px-6">Fees Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((s) => (
                          <tr key={s.id} className="border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors">
                            <td className="py-4 px-6 font-semibold text-neutral-900">{s.id}</td>
                            <td className="py-4 px-6 text-neutral-700">{s.name}</td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                s.feesStatus === "Clear" ? "bg-green-100 text-green-700" :
                                s.feesStatus === "Pending" ? "bg-red-100 text-red-700" :
                                "bg-yellow-100 text-yellow-700"
                              }`}>
                                {s.feesStatus}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center justify-end gap-3">

                                <button 
                                  onClick={() => { setEditingStudent(s); setIsStudentModalOpen(true); }}
                                  title="Edit Student"
                                  className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button 
                                  onClick={async () => {
                                    if (confirm("Are you sure you want to delete this student?")) {
                                      try {
                                        const res = await fetch("http://localhost:3001/certificate_delete", {
                                          method: "POST",
                                          headers: { "Content-Type": "application/json" },
                                          body: JSON.stringify({ student_ID: s.id })
                                        });
                                        const data = await res.json();
                                        if (data.success) {
                                          saveStudents(students.filter(st => st.id !== s.id));
                                        } else {
                                          alert(data.message);
                                        }
                                      } catch (err) {
                                        alert("An error occurred while deleting.");
                                      }
                                    }
                                  }}
                                  title="Delete Student"
                                  className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-neutral-500">
                            No students found matching your criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Student Data Tab */}
            {activeTab === "certificates" && (
              <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative max-w-sm w-full">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search submissions by Name or Email..."
                      value={dataSearch}
                      onChange={(e) => setDataSearch(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-500 focus:ring-1 focus:outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 text-xs uppercase tracking-wider font-semibold">
                        <th className="py-4 px-6 whitespace-nowrap">S.No</th>
                        <th className="py-4 px-6 whitespace-nowrap">Name Student</th>
                        <th className="py-4 px-6 whitespace-nowrap">Phone Number</th>
                        <th className="py-4 px-6 whitespace-nowrap">Email Student</th>
                        <th className="py-4 px-6 whitespace-nowrap">Subject</th>
                        <th className="py-4 px-6">Message</th>
                        <th className="py-4 px-6 whitespace-nowrap">Date</th>
                        <th className="py-4 px-6 text-right whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentDataList.filter(s => s.name.toLowerCase().includes(dataSearch.toLowerCase()) || s.email.toLowerCase().includes(dataSearch.toLowerCase())).length > 0 ? (
                        studentDataList.filter(s => s.name.toLowerCase().includes(dataSearch.toLowerCase()) || s.email.toLowerCase().includes(dataSearch.toLowerCase())).map((data, index) => (
                          <tr key={data.id} className="border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors">
                            <td className="py-4 px-6 text-sm text-neutral-500 whitespace-nowrap">{index + 1}</td>
                            <td className="py-4 px-6 font-semibold text-neutral-900 whitespace-nowrap">{data.name}</td>
                            <td className="py-4 px-6 text-sm text-neutral-700 whitespace-nowrap">{data.phone}</td>
                            <td className="py-4 px-6 text-sm text-neutral-500 whitespace-nowrap">{data.email}</td>
                            <td className="py-4 px-6 text-sm text-neutral-700 whitespace-nowrap">{data.subject}</td>
                            <td className="py-4 px-6 text-sm text-neutral-600 whitespace-normal min-w-[200px]" title={data.message}>{data.message}</td>
                            <td className="py-4 px-6 text-sm text-neutral-500 whitespace-nowrap">{data.date}</td>
                            <td className="py-4 px-6">
                              <div className="flex items-center justify-end gap-3">
                                <button 
                                  onClick={() => alert(`Full Message from ${data.name}:\n\n${data.message}`)}
                                  title="View Message"
                                  className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                >
                                  <Eye size={18} />
                                </button>
                                <button 
                                  onClick={() => setStudentDataList(studentDataList.filter(d => d.id !== data.id))}
                                  title="Delete Record"
                                  className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-neutral-500">
                            No student data submissions found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}


          </div>
        </div>
      </main>

      {/* Modals */}
      {isStudentModalOpen && (
        <StudentModal 
          student={editingStudent} 
          onClose={() => setIsStudentModalOpen(false)} 
          onSave={(updated: Student) => {
            if (editingStudent) {
              saveStudents(students.map(s => s.id === editingStudent.id ? updated : s));
            } else {
              saveStudents([updated, ...students]);
            }
            setIsStudentModalOpen(false);
            setEditingStudent(null);
          }} 
        />
      )}


    </div>
  );
}

// Subcomponents

function SidebarItem({ icon: Icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${
        active ? "bg-blue-50 text-blue-600" : "text-neutral-600 hover:bg-neutral-100"
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  const colorMap: any = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-500",
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
      <div>
        <div className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-1">{title}</div>
        <div className="font-display text-4xl font-black text-neutral-900">{value}</div>
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorMap[color]}`}>
        <Icon size={28} />
      </div>
    </div>
  );
}

function StudentModal({ student, onClose, onSave }: any) {
  const [form, setForm] = useState<Student>(
    student || {
      id: `RW-${Math.floor(1000 + Math.random() * 9000)}`,
      name: "",
      password: "",
      feesStatus: "Pending",
      certificates: []
    }
  );

  const [fileUrl, setFileUrl] = useState("");
  const [certName, setCertName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (student?.id) {
      fetch(`http://localhost:3001/certificate_view/${student.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.certificate_data) {
            setForm(prev => ({
              ...prev,
              feesStatus: data.certificate_data.status as any,
              certificates: data.certificate_photo ? [{
                id: "backend-cert",
                name: "Uploaded Certificate",
                url: `http://localhost:3001/${data.certificate_photo}`,
                date: data.certificate_data.created_at ? new Date(data.certificate_data.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
              }] : []
            }));
          }
        })
        .catch(console.error);
    }
  }, [student?.id]);

  const isPasswordValid = !form.password || checkPasswordValidity(form.password);

  const submit = async (e: any) => {
    e.preventDefault();
    if (!isPasswordValid) return;

    try {
      const isNew = !student;

      if (isNew) {
        const formData = new FormData();
        formData.append("student_ID", form.id);
        formData.append("student_name", form.name);
        formData.append("status", form.feesStatus);
        formData.append("student_password", form.password || "Password@123");
        
        if (selectedFile) {
          formData.append("certificate_photo", selectedFile);
        }

        const res = await fetch("http://localhost:3001/certificate_uplode", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        
        if (data.success) {
          onSave(form);
        } else {
          alert(data.message || "Failed to create student");
        }
      } else {
        const formData = new FormData();
        formData.append("student_ID", form.id);
        formData.append("student_name", form.name);
        formData.append("status", form.feesStatus);
        if (form.password) {
          formData.append("student_password", form.password);
        }
        if (selectedFile) {
          formData.append("certificate_photo", selectedFile);
        }

        const res = await fetch(`http://localhost:3001/update-certificate/${student.id}`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        
        if (data.success) {
          onSave(form);
        } else if (data.message === "certificate not found") {
          // Fallback to create if student is in local state but not backend
          const createFormData = new FormData();
          createFormData.append("student_ID", form.id);
          createFormData.append("student_name", form.name);
          createFormData.append("status", form.feesStatus);
          createFormData.append("student_password", form.password || "Password@123");
          if (selectedFile) {
            createFormData.append("certificate_photo", selectedFile);
          }
          const createRes = await fetch("http://localhost:3001/certificate_uplode", {
            method: "POST",
            body: createFormData,
          });
          const createData = await createRes.json();
          if (createData.success) {
            onSave(form);
          } else {
            alert(createData.message || "Failed to sync student to backend");
          }
        } else {
          alert(data.message || "Failed to update student");
        }
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving.");
    }
  };

  const handleAddCert = () => {
    if (!fileUrl || !certName) return;
    const newCert: Certificate = {
      id: Date.now().toString(),
      name: certName,
      url: fileUrl,
      date: new Date().toISOString().split('T')[0]
    };
    setForm({ ...form, certificates: [...form.certificates, newCert] });
    setFileUrl("");
    setCertName("");
    // Note: The file remains in `selectedFile` to be sent on form submit.
  };

  const removeCert = (id: string) => {
    setForm({ ...form, certificates: form.certificates.filter((c: any) => c.id !== id) });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-neutral-200 flex justify-between items-center bg-neutral-50 shrink-0">
          <h3 className="font-display text-xl font-bold text-neutral-900">{student ? "Edit Student & Certificates" : "Add New Student"}</h3>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-neutral-900"><span className="text-3xl leading-none">&times;</span></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left Side: Student Details */}
            <form id="student-form" onSubmit={submit} className="p-6 lg:border-r border-neutral-200 space-y-4">
              <h4 className="text-sm font-bold text-neutral-900 mb-4 flex items-center gap-2"><Users size={16}/> Student Details</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Student ID *</label>
                  <input required value={form.id} onChange={e => setForm({...form, id: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Student Name *</label>
                  <input required placeholder="E.g. Rahul Sharma" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Fees Status *</label>
                  <select value={form.feesStatus} onChange={e => setForm({...form, feesStatus: e.target.value as any})} className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-blue-500 focus:outline-none">
                    <option value="Clear">Clear (Green)</option>
                    <option value="Pending">Pending (Red)</option>
                    <option value="Partial">Partial (Yellow)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Student Password</label>
                  <input type="text" value={form.password || ""} onChange={e => setForm({...form, password: e.target.value})} placeholder="Leave blank for none" className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-blue-500 focus:outline-none" />
                  {form.password && (
                    <div className="mt-2">
                      <PasswordRequirements password={form.password} />
                    </div>
                  )}
                  {!isPasswordValid && form.password && (
                    <div className="mt-3 flex items-start gap-2 text-[11px] text-red-500 font-semibold bg-red-50 p-2 rounded-lg">
                      <AlertCircle size={14} className="shrink-0 mt-0.5" />
                      Student password must meet all strict security requirements to save.
                    </div>
                  )}
                </div>
              </div>
            </form>

            {/* Right Side: Certificates */}
            <div className="p-6 bg-neutral-50/50">
              <h4 className="text-sm font-bold text-neutral-900 mb-4 flex items-center gap-2"><FileBox size={16}/> Certificate Management</h4>
              
              {/* Upload Form */}
              <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm mb-6 space-y-3">
                 <div>
                   <label className="text-xs font-semibold text-neutral-700 block mb-1">Certificate Name</label>
                   <input value={certName} onChange={e=>setCertName(e.target.value)} placeholder="E.g. Digital Marketing Mastery" className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-orange-500 focus:outline-none text-sm" />
                 </div>
                 <div>
                   <label className="text-xs font-semibold text-neutral-700 block mb-1">Upload File (PDF/Image)</label>
                   <input type="file" accept="image/*,.pdf" onChange={(e) => {
                     if (e.target.files && e.target.files[0]) {
                       const file = e.target.files[0];
                       const objUrl = URL.createObjectURL(file);
                       setFileUrl(objUrl);
                       setSelectedFile(file);
                     }
                   }} className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 cursor-pointer border border-neutral-200 rounded-lg" />
                 </div>
                 <button type="button" onClick={handleAddCert} disabled={!fileUrl || !certName} className="w-full px-4 py-2 bg-orange-500 text-white font-bold rounded-lg shadow-orange hover:bg-orange-600 disabled:opacity-50 text-sm flex items-center justify-center gap-2 mt-2">
                   <Upload size={14} /> Add Certificate
                 </button>
              </div>

              {/* List */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {form.certificates.length === 0 ? (
                  <div className="text-center py-6 text-neutral-400 text-xs bg-white rounded-2xl border border-neutral-200 border-dashed">No certificates uploaded yet.</div>
                ) : (
                  form.certificates.map((c: any) => (
                    <div key={c.id} className="bg-white p-3 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                          <Shield size={16} />
                        </div>
                        <div>
                          <div className="font-bold text-neutral-900 text-xs">{c.name}</div>
                          <div className="text-[10px] text-neutral-500">Uploaded: {c.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <a href={c.url} target="_blank" rel="noreferrer" className="p-1.5 text-neutral-400 hover:text-blue-600 bg-neutral-50 hover:bg-blue-50 rounded-lg transition-colors" title="Preview">
                          <Eye size={14} />
                        </a>
                        <a href={c.url} download={`${c.name}.pdf`} className="p-1.5 text-neutral-400 hover:text-green-600 bg-neutral-50 hover:bg-green-50 rounded-lg transition-colors" title="Download">
                          <Download size={14} />
                        </a>
                        <button type="button" onClick={() => removeCert(c.id)} className="p-1.5 text-neutral-400 hover:text-red-600 bg-neutral-50 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
        <div className="p-6 border-t border-neutral-100 flex justify-end gap-3 shrink-0 bg-white">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-semibold text-neutral-600 hover:bg-neutral-100">Cancel</button>
          <button type="submit" form="student-form" disabled={!isPasswordValid} className="px-6 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all">Save All Changes</button>
        </div>
      </div>
    </div>
  );
}
