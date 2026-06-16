import { Plus, Edit2, Trash2 } from "lucide-react";
import { Teacher } from "../types";

interface CourseTeachersTabProps {
  teachers: Teacher[];
  setEditingTeacher: (teacher: Teacher | null) => void;
  setIsTeacherModalOpen: (isOpen: boolean) => void;
  handleDeleteTeacher: (id: string) => void;
}

export function CourseTeachersTab({
  teachers,
  setEditingTeacher,
  setIsTeacherModalOpen,
  handleDeleteTeacher
}: CourseTeachersTabProps) {
  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-neutral-900">Teacher Directory</h3>
          <button 
            onClick={() => { setEditingTeacher(null); setIsTeacherModalOpen(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-sm hover:-translate-y-0.5 transition-transform cursor-pointer"
          >
            <Plus size={18} /> Add Teacher
          </button>
      </div>
      
      <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-widest border-b border-neutral-100">
                      <th className="px-3 py-3 text-sm font-bold text-sm">Teacher Name</th>
                      <th className="px-3 py-3 text-sm font-bold text-sm">Course Taught</th>
                      <th className="px-3 py-3 text-sm font-bold text-sm">Phone Number</th>
                      <th className="px-3 py-3 text-sm font-bold text-sm">Email ID</th>
                      <th className="px-3 py-3 text-sm font-bold text-right text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {teachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-neutral-50/50 transition-colors group">
                        <td className="px-3 py-3 text-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold border border-purple-200 uppercase">
                                  {teacher.name.charAt(0)}
                              </div>
                              <div>
                                  <div className="font-bold text-neutral-900">{teacher.name}</div>
                                  <div className="text-xs text-neutral-500">{teacher.id}</div>
                              </div>
                            </div>
                        </td>
                        <td className="px-3 py-3 text-sm">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold">
                              {teacher.subject}
                            </span>
                        </td>
                        <td className="px-3 py-3 text-sm text-sm font-semibold text-neutral-700">
                            {teacher.phone}
                        </td>
                        <td className="px-3 py-3 text-sm text-sm text-neutral-600">
                            {teacher.email}
                        </td>
                        <td className="px-3 py-3 text-sm text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingTeacher(teacher); setIsTeacherModalOpen(true); }} className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"><Edit2 size={16} /></button>
                              <button onClick={() => handleDeleteTeacher(teacher.id)} className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"><Trash2 size={16} /></button>
                            </div>
                        </td>
                      </tr>
                  ))}
                </tbody>
            </table>
          </div>
      </div>
    </div>
  );
}
