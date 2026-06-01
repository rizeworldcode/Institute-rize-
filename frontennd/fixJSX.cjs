const fs = require('fs');
const file = 'src/pages/admin/AdminDashboard.tsx';
let lines = fs.readFileSync(file, 'utf-8').split(/\r?\n/);

const jsxStart = lines.findIndex((l, i) => i > 410 && i < 430 && l.includes('if (expandedStat === "total-pending-fees") {'));
if (jsxStart !== -1) {
    const jsxEnd = lines.findIndex((l, i) => i > jsxStart && i < 460 && l.trim() === '}');
    if (jsxEnd !== -1) {
        // Cut the JSX block from here
        const jsxBlock = lines.splice(jsxStart, jsxEnd - jsxStart + 1);
        
        // Find the right place to paste it
        const targetIdx = lines.findIndex((l, i) => i > 1000 && l.includes('if (expandedStat === "total-clear-fees") {'));
        if (targetIdx !== -1) {
            lines.splice(targetIdx, 0, ...jsxBlock);
        }
    }
}

fs.writeFileSync(file, lines.join('\n'));
console.log('Fixed JSX Placement');
