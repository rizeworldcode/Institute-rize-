import { RotateCcw, UserX } from "lucide-react";

interface DeletedReferrersTabProps {
  deletedReferrers: any[];
  handleRestoreReferrer: (referrer: any) => void;
}

export function DeletedReferrersTab({
  deletedReferrers,
  handleRestoreReferrer
}: DeletedReferrersTabProps) {
  return (
    <div className="max-w-[1520px] mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="bg-white border border-neutral-200 rounded-[26px] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between flex justify-between items-center">
          <h3 className="text-xl font-black text-neutral-900 tracking-tight flex items-center gap-2">
            <UserX className="text-red-600" /> Deleted Referrers Overview
          </h3>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60 font-bold">
            Total Deleted: {deletedReferrers?.length || 0}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 bg-neutral-50/70 text-neutral-400 text-xs uppercase tracking-wider font-bold border-b border-neutral-100">
                <th className="px-4 py-3.5 font-bold">Name</th>
                <th className="px-4 py-3.5 font-bold">Phone Number</th>
                <th className="px-4 py-3.5 font-bold">Email</th>
                <th className="px-4 py-3.5 font-bold">Total Referred</th>
                <th className="px-4 py-3.5 font-bold">Total Earnings</th>
                <th className="px-4 py-3.5 font-bold">Pending Amount</th>
                <th className="px-4 py-3.5 font-bold">Deleted Date</th>
                <th className="px-4 py-3.5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {(deletedReferrers || []).map((ref: any) => (
                <tr key={ref.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-4 py-3.5 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60 font-bold flex items-center justify-center font-bold text-xs uppercase">
                        {String(ref?.name || 'R').charAt(0).toUpperCase()}
                      </div>
                      <div className="font-bold text-neutral-900 capitalize">{ref?.name || 'Referrer'}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-neutral-700">{ref.phone}</td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-neutral-700">{ref.email}</td>
                  <td className="px-4 py-3.5 text-sm font-bold text-blue-600">{ref.studentsReferred}</td>
                  <td className="px-4 py-3.5 text-sm font-bold text-neutral-900">{ref.totalAmount}</td>
                  <td className="px-4 py-3.5 text-sm font-bold text-red-600">{ref.pendingAmount}</td>
                  <td className="px-4 py-3.5 text-sm text-neutral-500 font-medium">
                    {ref.deleted_at ? new Date(ref.deleted_at).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-right">
                    <button
                      onClick={() => handleRestoreReferrer(ref)}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-full transition-colors inline-flex items-center gap-1.5 cursor-pointer border border-emerald-200"
                      title="Restore Referrer"
                    >
                      <RotateCcw size={14} /> Restore
                    </button>
                  </td>
                </tr>
              ))}
              {(!deletedReferrers || deletedReferrers.length === 0) && (
                <tr>
                  <td colSpan={8} className="py-20 text-center text-neutral-400 italic">
                    No deleted referrers found.
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
