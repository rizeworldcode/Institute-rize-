const fs = require('fs'); 
const lines = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8').split(/\r?\n/);
lines.forEach((l, i) => {
  if (l.includes('referred-students')) {
    console.log(i + ': ' + l);
  }
});
