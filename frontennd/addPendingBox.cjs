const fs = require('fs');
const file = 'src/pages/admin/AdminDashboard.tsx';
let lines = fs.readFileSync(file, 'utf-8').split(/\r?\n/);

// 1. Add state variable for pendingFeeStudentsData
const stateIndex = lines.findIndex(l => l.includes('const [clearFeeStudentsData'));
if (stateIndex !== -1) {
  lines.splice(stateIndex + 1, 0, '  const [pendingFeeStudentsData, setPendingFeeStudentsData] = useState<any[]>([]);');
}

// 2. Add fetch function
const fetchIndex = lines.findIndex(l => l.includes('const fetchClearFeeStudents = async () => {'));
if (fetchIndex !== -1) {
  lines.splice(fetchIndex, 0, `  const fetchPendingFeeStudents = async () => {
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
          course: item.selected_course_name || "N/A",
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
`);
}

// 3. Add to useEffect for expanding
const effectIndex = lines.findIndex(l => l.includes('} else if (expandedStat === "total-clear-fees") {'));
if (effectIndex !== -1) {
  lines.splice(effectIndex, 0, '} else if (expandedStat === "total-pending-fees") {\n      fetchPendingFeeStudents();\n    ');
}

// 4. Add the 6th box in the UI
const clearBoxIndex = lines.findIndex(l => l.includes('label="Total Clear Fees"') && l.includes('expandedStat === "total-clear-fees"'));
if (clearBoxIndex !== -1) {
  lines.splice(clearBoxIndex + 1, 0, `                       <StatCard
                          icon={AlertCircle}
                          label="Pending Fees"
                          value={graphData.length > 0 ? \`₹\${graphData.reduce((acc, curr) => acc + (Number(curr.pendingAmount) || 0), 0).toLocaleString()}\` : "0"}
                          color="bg-red-50 text-red-600"
                          isExpanded={expandedStat === "total-pending-fees"}
                          onClick={() => setExpandedStat(expandedStat === "total-pending-fees" ? null : "total-pending-fees")}
                       />`);
}

// 5. Add the table rendering for expandedStat === "total-pending-fees"
// Search for `if (expandedStat === "total-clear-fees") {` which has the return table
const tableBlockEnd = lines.findIndex((l, i) => i > fetchIndex && l.includes('if (expandedStat === "total-clear-fees") {'));
if (tableBlockEnd !== -1) {
  // Find where this `if` block ends
  let currentBlockEnd = lines.findIndex((l, i) => i > tableBlockEnd && l.trim() === 'return null;');
  
  if (currentBlockEnd !== -1) {
    lines.splice(currentBlockEnd, 0, `                         if (expandedStat === "total-pending-fees") {
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
                                           <td className="px-6 py-4 text-sm font-semibold text-neutral-700">{row.course}</td>
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

`);
  }
}

fs.writeFileSync(file, lines.join('\n'));
console.log('Added pending box successfully');
