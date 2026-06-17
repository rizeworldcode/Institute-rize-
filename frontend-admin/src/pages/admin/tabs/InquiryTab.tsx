import { useState, useEffect } from "react";
import { Inquiry } from "../types";
import { Eye, X, MessageSquare, Calendar, User, Phone, BookOpen } from "lucide-react";
import { getApiUrl } from "../../../utils/api";

export function InquiryTab() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const token = localStorage.getItem("adminAuthToken");
        const response = await fetch(getApiUrl("/getAllInquiries"), {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          // Map backend data to Inquiry type if necessary
          const mappedInquiries = data.data.map((inq: any) => ({
            id: inq._id,
            name: inq.name,
            phone: inq.phone,
            course: inq.course,
            message: inq.message,
            date: new Date(inq.created_at).toLocaleDateString(),
            status: inq.status
          }));
          setInquiries(mappedInquiries);
        }
      } catch (err) {
        console.error("Error fetching inquiries:", err);
      }
    };
    fetchInquiries();
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-neutral-200 bg-neutral-50/50">
            <h3 className="text-xl font-bold text-neutral-900">Recent Inquiries</h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 text-xs uppercase tracking-wider font-semibold">
                <th className="py-5 px-6">Name</th>
                <th className="py-5 px-6">Phone Number</th>
                <th className="py-5 px-6">Interested Course</th>
                <th className="py-5 px-6">Message</th>
                <th className="py-5 px-6">Date</th>
                <th className="py-5 px-6">Status</th>
                <th className="py-5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-sm">
                {inquiries.map(inq => (
                  <tr key={inq.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-4 px-6 font-semibold text-neutral-900">{inq.name}</td>
                      <td className="py-4 px-6 text-neutral-600">{inq.phone}</td>
                      <td className="py-4 px-6 text-neutral-700">{inq.course}</td>
                      <td className="py-4 px-6 text-neutral-600 max-w-xs truncate cursor-pointer hover:text-blue-600" title="Click to view full message" onClick={() => setSelectedInquiry(inq)}>{inq.message || "-"}</td>
                      <td className="py-4 px-6 text-neutral-500">{inq.date}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            inq.status === "New" ? "bg-blue-100 text-blue-700 border-blue-200" :
                            "bg-emerald-100 text-emerald-700 border-emerald-200"
                        }`}>
                            {inq.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setSelectedInquiry(inq)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors cursor-pointer" 
                            title="View Message"
                          >
                            <Eye size={18} />
                          </button>
                          <a 
                            href={`tel:${inq.phone}`}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors cursor-pointer" 
                            title="Call Student"
                          >
                            <Phone size={18} />
                          </a>
                        </div>
                      </td>
                  </tr>
                ))}
            </tbody>
          </table>
      </div>

      {/* Message Preview Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={() => setSelectedInquiry(null)}></div>
          <div className="relative bg-white border border-neutral-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">Inquiry Details</h3>
                  <p className="text-xs text-neutral-500 font-medium">Full message preview</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedInquiry(null)}
                className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Student Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User size={12} /> Student Name
                  </div>
                  <div className="text-sm font-bold text-neutral-900">{selectedInquiry.name}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone size={12} /> Phone Number
                  </div>
                  <div className="text-sm font-bold text-neutral-900">{selectedInquiry.phone}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen size={12} /> Interested Course
                  </div>
                  <div className="text-sm font-bold text-neutral-900">{selectedInquiry.course}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar size={12} /> Inquiry Date
                  </div>
                  <div className="text-sm font-bold text-neutral-900">{selectedInquiry.date}</div>
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare size={12} /> Message
                </div>
                <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap max-h-[250px] overflow-y-auto custom-scrollbar">
                  {selectedInquiry.message || "No message provided."}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-neutral-50/50 border-t border-neutral-100 flex gap-3">
              <button 
                onClick={() => setSelectedInquiry(null)}
                className="flex-1 py-3 bg-white hover:bg-neutral-50 text-neutral-700 rounded-xl font-bold transition-all border border-neutral-200 shadow-sm text-sm"
              >
                Close Preview
              </button>
              <a 
                href={`tel:${selectedInquiry.phone}`}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 text-sm flex items-center justify-center gap-2"
              >
                <Phone size={16} />
                Call Now
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
