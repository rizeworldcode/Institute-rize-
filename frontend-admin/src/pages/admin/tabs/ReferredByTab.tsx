import { ArrowLeft, UserCircle, Edit2, Eye } from "lucide-react";

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
}

export function ReferredByTab({
  selectedReferrer,
  setSelectedReferrer,
  referrerStatusFilter,
  setReferrerStatusFilter,
  referrerStudents,
  referrers,
  handleReferrerClick,
  setEditingReferrer,
  setIsReferrerModalOpen,
  handleClearReferrerAmount
}: ReferredByTabProps) {
  return (
             <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
              {selectedReferrer ? (
                 <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-neutral-200 bg-neutral-50/50 flex flex-wrap gap-4 justify-between items-center">
                       <div className="flex items-center gap-4">
                          <button onClick={() => setSelectedReferrer(null)} className="p-2 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer shadow-sm">
                             <ArrowLeft size={18} className="text-neutral-600" />
                          </button>
                          <div>
                             <h3 className="text-xl font-bold text-neutral-900">{selectedReferrer.name}'s Referred Students</h3>
                             <p className="text-sm text-neutral-500">Total Students: {referrerStudents.length}</p>
                          </div>
                       </div>
                       <select 
                         value={referrerStatusFilter} 
                         onChange={(e: any) => setReferrerStatusFilter(e.target.value)}
                         className="px-4 py-2.5 rounded-xl bg-white border border-neutral-200 text-sm text-neutral-700 focus:border-blue-500 focus:outline-none w-full md:w-48 appearance-none cursor-pointer"
                       >
                         <option value="All">All Status</option>
                         <option value="Clear">Clear Fees</option>
                         <option value="Pending">Pending Fees</option>
                       </select>
                    </div>
                    <div className="overflow-x-auto">
                       <table className="w-full text-left border-collapse ">
                          <thead className="bg-neutral-50 border-b border-neutral-200">
                             <tr>
                                <th className="px-3 py-3 text-sm text-xs font-bold text-neutral-500 uppercase tracking-wider">Student ID</th>
                                <th className="px-3 py-3 text-sm text-xs font-bold text-neutral-500 uppercase tracking-wider">Student Name</th>
                                <th className="px-3 py-3 text-sm text-xs font-bold text-neutral-500 uppercase tracking-wider">Student Number</th>
                                <th className="px-3 py-3 text-sm text-xs font-bold text-neutral-500 uppercase tracking-wider">Course</th>
                                <th className="px-3 py-3 text-sm text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Amount</th>
                                <th className="px-3 py-3 text-sm text-xs font-bold text-neutral-500 uppercase tracking-wider">Paid Amount</th>
                                <th className="px-3 py-3 text-sm text-xs font-bold text-neutral-500 uppercase tracking-wider">Pending Amount</th>
                                <th className="px-3 py-3 text-sm text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                                <th className="px-3 py-3 text-sm text-xs font-bold text-neutral-500 uppercase tracking-wider">Date</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-100">
                             {referrerStudents
                               .filter((student: any) => {
                                  if (referrerStatusFilter === "All") return true;
                                  const isPending = Number(student.pending_fee) > 0;
                                  const status = isPending ? "Pending" : "Clear";
                                  return status === referrerStatusFilter;
                               })
                               .map((student: any, idx: number) => (
                               <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                                  <td className="px-3 py-3 text-sm font-mono text-sm font-semibold text-blue-600">{student.student_ID}</td>
                                  <td className="px-3 py-3 text-sm">
                                     <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase">{student.student_name.charAt(0)}</div>
                                        <div className="font-bold text-neutral-900 capitalize">{student.student_name}</div>
                                     </div>
                                  </td>
                                  <td className="px-3 py-3 text-sm text-sm font-semibold text-neutral-700">{student.student_phone}</td>
                                  <td className="px-3 py-3 text-sm text-sm font-semibold text-neutral-700">{student.selected_course_name}</td>
                                  <td className="px-3 py-3 text-sm text-sm font-bold text-neutral-900">₹{student.total_fee}</td>
                                  <td className="px-3 py-3 text-sm text-sm font-bold text-emerald-600">₹{student.total_paid_fee}</td>
                                  <td className="px-3 py-3 text-sm text-sm font-bold text-red-600">₹{student.pending_fee}</td>
                                  <td className="px-3 py-3 text-sm text-sm">
                                     <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                       Number(student.pending_fee) > 0 ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'
                                     }`}>
                                        {Number(student.pending_fee) > 0 ? 'Pending' : 'Clear'}
                                     </span>
                                  </td>
                                  <td className="px-3 py-3 text-sm text-sm text-neutral-600">{new Date(student.created_at).toLocaleDateString()}</td>
                               </tr>
                             ))}
                             {referrerStudents.filter((student: any) => {
                                  if (referrerStatusFilter === "All") return true;
                                  const isPending = Number(student.pending_fee) > 0;
                                  return (isPending ? "Pending" : "Clear") === referrerStatusFilter;
                               }).length === 0 && (
                                <tr>
                                   <td colSpan={8} className="py-20 text-center text-neutral-400 italic">No students found for this status.</td>
                                </tr>
                             )}
                          </tbody>
                       </table>
                    </div>
                 </div>
              ) : (
                 <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-neutral-200 bg-neutral-50/50 flex justify-between items-center">
                       <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                          <UserCircle className="text-orange-600" /> Referrers Overview
                       </h3>
                    </div>
                    <div className="overflow-x-auto">
                       <table className="w-full text-left border-collapse ">
                          <thead>
                             <tr className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-widest border-b border-neutral-100">
                                <th className="px-3 py-3 text-sm font-bold">Name</th>
                                <th className="px-3 py-3 text-sm font-bold">Phone Number</th>
                                <th className="px-3 py-3 text-sm font-bold">Email</th>
                                <th className="px-3 py-3 text-sm font-bold">Total Referred</th>
                                <th className="px-3 py-3 text-sm font-bold">Total Earnings</th>
                                <th className="px-3 py-3 text-sm font-bold">Pending Amount</th>
                                <th className="px-3 py-3 text-sm font-bold">Status</th>
                                <th className="px-3 py-3 text-sm font-bold text-right">Action</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-100">
                             {referrers.map((ref: any) => (
                                <tr key={ref.id} className="hover:bg-neutral-50/50 transition-colors">
                                   <td className="px-3 py-3 text-sm">
                                      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleReferrerClick(ref)}>
                                         <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs uppercase group-hover:bg-orange-200 transition-colors">{ref.name.charAt(0)}</div>
                                         <div className="font-bold text-neutral-900 capitalize group-hover:text-orange-600 transition-colors">{ref.name}</div>
                                      </div>
                                   </td>
                                   <td className="px-3 py-3 text-sm text-sm font-semibold text-neutral-700">{ref.phone}</td>
                                   <td className="px-3 py-3 text-sm text-sm font-semibold text-neutral-700">{ref.email}</td>
                                   <td className="px-3 py-3 text-sm text-sm font-bold text-blue-600">{ref.studentsReferred}</td>
                                   <td className="px-3 py-3 text-sm text-sm font-bold text-neutral-900">{ref.totalAmount}</td>
                                   <td className="px-3 py-3 text-sm text-sm font-bold text-red-600">{ref.pendingAmount}</td>
                                   <td className="px-3 py-3 text-sm">
                                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${ref.status === 'Clear' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                                         {ref.status}
                                      </span>
                                   </td>
                                   <td className="px-3 py-3 text-sm text-right">
                                      <div className="flex justify-end gap-2">
                                         <button onClick={() => handleReferrerClick(ref)} className="p-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors cursor-pointer" title="View Details">
                                            <Eye size={16} />
                                         </button>
                                         <button onClick={() => { setEditingReferrer(ref); setIsReferrerModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors cursor-pointer" title="Edit Amount">
                                            <Edit2 size={16} />
                                         </button>
                                         {ref.status === 'Pending' && (
                                            <button onClick={() => handleClearReferrerAmount(ref)} className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg transition-colors shadow-sm cursor-pointer">Clear</button>
                                         )}
                                      </div>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
              )}
             </div>
  );
}
