const fs = require('fs');
const file = 'src/pages/admin/AdminDashboard.tsx';
let lines = fs.readFileSync(file, 'utf-8').split(/\r?\n/);

// 1. Add pendingFees to state
const stateIdx = lines.findIndex(l => l.includes('totalClearFees: 0'));
if (stateIdx !== -1) {
  lines[stateIdx] = lines[stateIdx].replace('totalClearFees: 0', 'totalClearFees: 0,\n    pendingFees: 0');
}

// 2. Add to fetchDashboardData
const setStatsIdx = lines.findIndex(l => l.includes('totalClearFees: data.stats.clear_fee_students'));
if (setStatsIdx !== -1) {
  lines[setStatsIdx] = lines[setStatsIdx].replace('totalClearFees: data.stats.clear_fee_students', 'totalClearFees: data.stats.clear_fee_students,\n          pendingFees: data.stats.unclear_fee_students');
}

// 3. Fix the StatCard value
const cardIdx = lines.findIndex(l => l.includes('title="Pending Fees"'));
if (cardIdx !== -1) {
  lines[cardIdx] = lines[cardIdx].replace(/value=\{.*?\}/, 'value={stats.pendingFees}');
}

fs.writeFileSync(file, lines.join('\n'));
console.log('Fixed Stats');
