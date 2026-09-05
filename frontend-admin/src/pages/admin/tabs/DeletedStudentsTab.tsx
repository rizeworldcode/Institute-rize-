import { UserMinus, RotateCcw } from "lucide-react";

interface DeletedStudentsTabProps {
  deletedStudents: any[];
  handleRestoreStudent: (student: any) => void;
}

export function DeletedStudentsTab({
  deletedStudents,
  handleRestoreStudent
}: DeletedStudentsTabProps) {
  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-neutral-200 bg-neutral-50/50 flex justify-between items-center">
          <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
            <UserMinus className="text-red-600" /> Deleted Students Overview
          </h3>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-red-100 text-red-700">
            Total Deleted: {deletedStudents.length}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-widest border-b border-neutral-100">
                <th className="px-4 py-3.5 font-bold">Student ID</th>
                <th className="px-4 py-3.5 font-bold">Student Name</th>
                <th className="px-4 py-3.5 font-bold">Phone Number</th>
                <th className="px-4 py-3.5 font-bold">Course</th>
                <th className="px-4 py-3.5 font-bold">Total Fee</th>
                <th className="px-4 py-3.5 font-bold">Paid Fee</th>
                <th className="px-4 py-3.5 font-bold">Pending Fee</th>
                <th className="px-4 py-3.5 font-bold">Status</th>
                <th className="px-4 py-3.5 font-bold">Deleted Date</th>
                <th className="px-4 py-3.5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {deletedStudents.map((st: any) => {
                const courses = Array.isArray(st.selected_course_name) 
                  ? st.selected_course_name.join(", ") 
                  : (st.selected_course_name || "N/A");
                
                return (
                  <tr key={st.student_ID} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-4 py-3.5 text-sm font-mono font-bold text-blue-600">{st.student_ID}</td>
                    <td className="px-4 py-3.5 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs uppercase">
                          {st.student_name ? st.student_name.charAt(0) : "S"}
                        </div>
                        <div className="font-bold text-neutral-900 capitalize">{st.student_name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-neutral-700">{st.phone}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-neutral-700">{courses}</td>
                    <td className="px-4 py-3.5 text-sm font-bold text-neutral-900">₹{st.total_fee}</td>
                    <td className="px-4 py-3.5 text-sm font-bold text-emerald-600">₹{st.total_paid_fee}</td>
                    <td className="px-4 py-3.5 text-sm font-bold text-red-600">₹{st.pending_fee}</td>
                    <td className="px-4 py-3.5 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        st.status === 'Clear' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {st.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-neutral-500 font-medium">
                      {st.deleted_at ? new Date(st.deleted_at).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-right">
                      <button
                        onClick={() => handleRestoreStudent(st)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer border border-emerald-200"
                        title="Restore Student"
                      >
                        <RotateCcw size={14} /> Restore
                      </button>
                    </td>
                  </tr>
                );
              })}
              {deletedStudents.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-20 text-center text-neutral-400 italic">
                    No deleted students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
