import { ArrowLeft, UserCircle, Edit2, Eye, Trash2 } from "lucide-react";

interface ReferredByTabProps {
  selectedReferrer: any;
  setSelectedReferrer: (referrer: any) => void;
  referrerStatusFilter: string;
  setReferrerStatusFilter: (filter: string) => void;
  referrerStudents: any[];
  referrers: any[];
  handleReferrerClick: (referrer: any) => void;
  setEditingReferrer: (referrer: any) => void;
  setIsReferrerModalOpen: (isOpen: boolean) => void;
  handleClearReferrerAmount: (referrer: any) => void;
  handleDeleteReferrer: (referrer: any) => void;
}

export function ReferredByTab({
  selectedReferrer,
  setSelectedReferrer,
  referrerStatusFilter,
  setReferrerStatusFilter,
  referrerStudents = [],
  referrers = [],
  handleReferrerClick,
  setEditingReferrer,
  setIsReferrerModalOpen,
  handleClearReferrerAmount,
  handleDeleteReferrer
}: ReferredByTabProps) {
  const safeReferrerStudents = Array.isArray(referrerStudents) ? referrerStudents : [];
  const safeReferrers = Array.isArray(referrers) ? referrers : [];

  const filteredStudents = safeReferrerStudents.filter((student: any) => {
    if (referrerStatusFilter === "All") return true;
    const isPending = Number(student?.pending_fee || 0) > 0;
    const status = isPending ? "Pending" : "Clear";
    return status === referrerStatusFilter;
  });

  return (
    <div className="max-w-[1520px] mx-auto space-y-6 animate-in fade-in duration-300">
      {selectedReferrer ? (
        <div className="bg-white border border-neutral-200/80 rounded-[26px] overflow-hidden shadow-xs">
          <div className="p-6 border-b border-neutral-100 flex flex-wrap gap-4 justify-between items-center">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedReferrer(null)} 
                className="p-2 bg-white border border-neutral-200/80 rounded-full hover:bg-neutral-50 transition-colors cursor-pointer shadow-xs"
              >
                <ArrowLeft size={16} className="text-neutral-600" />
              </button>
              <div>
                <h3 className="text-xl font-black text-neutral-900 tracking-tight">
                  {selectedReferrer?.name || "Referrer"}'s Referred Students
                </h3>
                <p className="text-xs text-neutral-400 font-medium mt-0.5">
                  Total Students: {safeReferrerStudents.length}
                </p>
              </div>
            </div>
            <select 
              value={referrerStatusFilter} 
              onChange={(e: any) => setReferrerStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-full bg-white border border-neutral-200/80 text-xs font-semibold text-neutral-700 focus:border-blue-500 focus:outline-none w-full md:w-44 appearance-none cursor-pointer shadow-xs"
            >
              <option value="All">All Status</option>
              <option value="Clear">Clear Fees</option>
              <option value="Pending">Pending Fees</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-neutral-50/70 border-b border-neutral-100 text-neutral-400 text-xs uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Student ID</th>
                  <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Student Name</th>
                  <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Student Number</th>
                  <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Course</th>
                  <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Amount</th>
                  <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Paid Amount</th>
                  <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Pending Amount</th>
                  <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredStudents.map((student: any, idx: number) => {
                  const studentName = String(student?.student_name || "Student");
                  const initial = studentName.charAt(0).toUpperCase() || "S";
                  const isPending = Number(student?.pending_fee || 0) > 0;
                  return (
                    <tr key={idx} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="px-3 py-3 font-mono text-sm font-semibold text-blue-600">{student?.student_ID || "N/A"}</td>
                      <td className="px-3 py-3 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase">
                            {initial}
                          </div>
                          <div className="font-bold text-neutral-900 capitalize">{studentName}</div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm font-semibold text-neutral-700">{student?.student_phone || "N/A"}</td>
                      <td className="px-3 py-3 text-sm font-semibold text-neutral-700">{student?.selected_course_name || "N/A"}</td>
                      <td className="px-3 py-3 text-sm font-bold text-neutral-900">₹{student?.total_fee || 0}</td>
                      <td className="px-3 py-3 text-sm font-bold text-emerald-600">₹{student?.total_paid_fee || 0}</td>
                      <td className="px-3 py-3 text-sm font-bold text-red-600">₹{student?.pending_fee || 0}</td>
                      <td className="px-3 py-3 text-sm">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isPending ? 'bg-amber-50 text-amber-700 border border-amber-200/60' : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        }`}>
                          {isPending ? 'Pending' : 'Clear'}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-sm text-neutral-600">
                        {student?.created_at ? new Date(student.created_at).toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  );
                })}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-20 text-center text-neutral-400 italic">No students found for this status.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200/80 rounded-[26px] overflow-hidden shadow-xs">
          <div className="p-6 border-b border-neutral-100 bg-neutral-50/70 flex justify-between items-center">
            <h3 className="text-xl font-black text-neutral-900 tracking-tight flex items-center gap-2">
              <UserCircle className="text-blue-600" /> Referrers Overview
            </h3>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
              Total Referrers: {safeReferrers.length}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/70 text-neutral-400 text-xs uppercase tracking-wider font-bold border-b border-neutral-100">
                  <th className="px-4 py-3.5 font-bold">Name</th>
                  <th className="px-4 py-3.5 font-bold">Phone Number</th>
                  <th className="px-4 py-3.5 font-bold">Email</th>
                  <th className="px-4 py-3.5 font-bold">Total Referred</th>
                  <th className="px-4 py-3.5 font-bold">Total Earnings</th>
                  <th className="px-4 py-3.5 font-bold">Pending Amount</th>
                  <th className="px-4 py-3.5 font-bold">Status</th>
                  <th className="px-4 py-3.5 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {safeReferrers.map((ref: any) => {
                  const refName = String(ref?.name || "Referrer");
                  const initial = refName.charAt(0).toUpperCase() || "R";
                  return (
                    <tr key={ref?.id || ref?._id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="px-4 py-3.5 text-sm">
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleReferrerClick(ref)}>
                          <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center font-bold text-xs uppercase group-hover:bg-orange-200 transition-colors">
                            {initial}
                          </div>
                          <div className="font-bold text-neutral-900 capitalize group-hover:text-blue-600 transition-colors">
                            {refName}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-neutral-700">{ref?.phone || "N/A"}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-neutral-700">{ref?.email || "N/A"}</td>
                      <td className="px-4 py-3.5 text-sm font-bold text-blue-600">{ref?.studentsReferred ?? 0}</td>
                      <td className="px-4 py-3.5 text-sm font-bold text-neutral-900">{ref?.totalAmount || "₹0"}</td>
                      <td className="px-4 py-3.5 text-sm font-bold text-red-600">{ref?.pendingAmount || "₹0"}</td>
                      <td className="px-4 py-3.5 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          ref?.status === 'Clear' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        }`}>
                          {ref?.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-right">
                        <div className="flex justify-end gap-2 items-center">
                          <button 
                            onClick={() => handleReferrerClick(ref)} 
                            className="p-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors cursor-pointer" 
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => { setEditingReferrer(ref); setIsReferrerModalOpen(true); }} 
                            className="p-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors cursor-pointer" 
                            title="Edit Amount"
                          >
                            <Edit2 size={16} />
                          </button>
                          {ref?.status === 'Pending' && (
                            <button 
                              onClick={() => handleClearReferrerAmount(ref)} 
                              className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg transition-colors shadow-sm cursor-pointer"
                            >
                              Clear
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteReferrer(ref)} 
                            className="p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors cursor-pointer" 
                            title="Delete Referrer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {safeReferrers.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-20 text-center text-neutral-400 italic">No referrers found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
