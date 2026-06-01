const fs = require('fs');
const file = 'src/pages/admin/AdminDashboard.tsx';
let lines = fs.readFileSync(file, 'utf-8').split(/\r?\n/);

// 1. Change grid-cols-5 to grid-cols-6 and add the 6th box
const gridIndex = lines.findIndex(l => l.includes('grid-cols-5 gap-4'));
if (gridIndex !== -1) {
  lines[gridIndex] = lines[gridIndex].replace('lg:grid-cols-5', 'lg:grid-cols-3 xl:grid-cols-6'); // Because 6 columns on lg might be too squished, let's just use grid-cols-3 or 6. Actually just changing to grid-cols-3 is safer for wrapping, but let's do grid-cols-6
  lines[gridIndex] = lines[gridIndex].replace('grid-cols-5 gap-4', 'grid-cols-6 gap-4');
  
  const boxInsertIndex = lines.findIndex((l, i) => i > gridIndex && l.includes('title="Total Clear Fees"'));
  if (boxInsertIndex !== -1) {
    // Add Pending Fees box after Clear Fees box
    lines.splice(boxInsertIndex + 1, 0, `                <StatCard title="Pending Fees" value={graphData.length > 0 ? \`₹\${graphData.reduce((acc, curr) => acc + (Number(curr.pendingAmount) || 0), 0).toLocaleString()}\` : "0"} icon={AlertCircle} color="red" onClick={() => navigate("/admin/dashboard/dashboard/total-pending-fees")} />`);
  }
}

// 2. Add the table rendering logic
// Find the exact line where `if (expandedStat === "total-clear-fees") {` starts to render its table
const tableIndex = lines.findIndex(l => l.includes('if (expandedStat === "total-clear-fees") {'));
if (tableIndex !== -1) {
  lines.splice(tableIndex, 0, `                         if (expandedStat === "total-pending-fees") {
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

fs.writeFileSync(file, lines.join('\n'));
console.log('Fixed Box insertion!');
