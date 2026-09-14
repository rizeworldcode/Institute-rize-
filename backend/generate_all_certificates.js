require('dotenv').config();
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const mongoose = require('mongoose');
const { execSync } = require('child_process');

const student_model = require('./src/models/studentModel');

// Helper to format date
function formatDate(d) {
  if (!d) return '17 June 2026';
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return '17 June 2026';
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${dt.getDate()} ${months[dt.getMonth()]} ${dt.getFullYear()}`;
  } catch (e) {
    return '17 June 2026';
  }
}

// Helper to determine pronoun
function getPronoun(name) {
  const femaleNames = ['sneha', 'komal', 'pitanshi', 'vandana', 'lovely', 'priya', 'pooja', 'neha', 'divya'];
  const lower = (name || '').toLowerCase();
  for (const fn of femaleNames) {
    if (lower.includes(fn)) return 'Her';
  }
  return 'His';
}

// Extract distinct course list for student
function getStudentCourseList(student) {
  const rawList = [];
  if (Array.isArray(student.selected_course_name)) {
    rawList.push(...student.selected_course_name);
  } else if (student.selected_course_name) {
    rawList.push(student.selected_course_name);
  }

  if (student.admissions && student.admissions.length > 0) {
    for (const adm of student.admissions) {
      if (Array.isArray(adm.courses)) {
        rawList.push(...adm.courses);
      }
    }
  }

  // Deduplicate and normalize
  const courses = [];
  for (const item of rawList) {
    if (!item) continue;
    const trimmed = item.trim();
    if (!courses.includes(trimmed)) courses.push(trimmed);
  }

  if (courses.length === 0) {
    courses.push('Creative Pro (Graphic + Video)');
  }

  return courses.map(c => {
    const lc = c.toLowerCase();
    let title = c;
    let slug = 'Course';
    let duration = '2-month';

    if (lc.includes('seo') && !lc.includes('marketing') && !lc.includes('smo')) {
      title = 'SEO (Search Engine Optimization)';
      slug = 'SEO';
      duration = '1-month';
    } else if (lc.includes('creative pro')) {
      title = 'Creative Pro (Graphic + Video)';
      slug = 'Creative_Pro';
      duration = '2-month';
    } else if (lc.includes('marketing pro')) {
      title = 'Marketing Pro (SEO + SMO + Performance)';
      slug = 'Marketing_Pro';
      duration = '2-month';
    } else if (lc.includes('master course')) {
      title = 'Master Course Program in AI & Digital Marketing';
      slug = 'Master_Course';
      duration = '3-month';
    } else if (lc.includes('web development')) {
      title = 'Web Development';
      slug = 'Web_Development';
      duration = '3-month';
    } else {
      title = c;
      slug = c.replace(/[^a-zA-Z0-9]/g, '_');
      duration = '2-month';
    }

    return { title, slug, duration };
  });
}

function getStartDate(student) {
  if (student.course_start_date) return formatDate(student.course_start_date);
  if (student.admissions && student.admissions[0] && student.admissions[0].startDate) {
    return formatDate(student.admissions[0].startDate);
  }
  if (student.createdAt) return formatDate(student.createdAt);
  return '17 June 2026';
}

function getCourseCompletionDate(student, courseObj) {
  let start = null;
  let end = null;
  if (student.admissions && student.admissions.length > 0) {
    for (const adm of student.admissions) {
      if (Array.isArray(adm.courses) && adm.courses.some(c => c.toLowerCase().includes(courseObj.slug.toLowerCase().replace(/_/g, '')) || courseObj.title.toLowerCase().includes(c.toLowerCase()))) {
        if (adm.startDate) start = new Date(adm.startDate);
        if (adm.endDate) end = new Date(adm.endDate);
      }
    }
    if (!start && student.admissions[0].startDate) start = new Date(student.admissions[0].startDate);
    if (!end && student.admissions[0].endDate) end = new Date(student.admissions[0].endDate);
  }
  if (!start && student.course_start_date) start = new Date(student.course_start_date);
  if (!end && student.course_end_date) end = new Date(student.course_end_date);
  if (!start && student.createdAt) start = new Date(student.createdAt);
  if (!start) start = new Date();

  // Duration in months
  let durMonths = 2;
  if (courseObj.duration && courseObj.duration.startsWith('1')) durMonths = 1;
  else if (courseObj.duration && courseObj.duration.startsWith('3')) durMonths = 3;

  // Course completion date
  const calcEnd = new Date(start);
  calcEnd.setMonth(calcEnd.getMonth() + durMonths);

  if (end && !isNaN(end.getTime())) {
    return calcEnd < end ? calcEnd : end;
  }
  return calcEnd;
}

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.mongo_URI);
  console.log('Connected to MongoDB.');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const baseCertPath = 'd:/desktop/Aman/rizeworld institute/rizeworld institute/rizeworld institute/frontend-admin/public/hero/COURSE CERTIFICATE.original.png';
  const signCroppedPath = 'd:/desktop/Aman/rizeworld institute/rizeworld institute/rizeworld institute/frontend-admin/public/hero/sign_cropped.png';

  const baseCertBase64 = `data:image/png;base64,${fs.readFileSync(baseCertPath).toString('base64')}`;
  const signBase64 = `data:image/png;base64,${fs.readFileSync(signCroppedPath).toString('base64')}`;

  const dirAdmin = 'd:/desktop/Aman/rizeworld institute/rizeworld institute/rizeworld institute/frontend-admin/public/certificates';
  const dirMain = 'd:/desktop/Aman/rizeworld institute/rizeworld institute/rizeworld institute/frontend-main/public/certificates';
  const dirBackend = 'd:/desktop/Aman/rizeworld institute/rizeworld institute/rizeworld institute/backend/public/uploads/certificates';

  // Clean old/duplicate certificate files
  [dirAdmin, dirMain, dirBackend].forEach(d => {
    if (fs.existsSync(d)) {
      const existing = fs.readdirSync(d);
      for (const f of existing) {
        if (f.startsWith('Certificate_') && f.endsWith('.png')) {
          fs.unlinkSync(path.join(d, f));
        }
      }
    } else {
      fs.mkdirSync(d, { recursive: true });
    }
  });
  console.log('Cleaned old and duplicate certificates.');

  const students = await student_model.find({ is_deleted: { $ne: true } });
  console.log(`Found ${students.length} active students to check certificates for.`);

  const tempHtmlPath = path.join(__dirname, 'temp_batch_cert.html');
  const tempPngPath = path.join(__dirname, 'temp_batch_cert.png');

  let totalGeneratedCount = 0;

  for (let i = 0; i < students.length; i++) {
    const s = students[i];
    const studentId = (s.student_ID || `RW-${Date.now()}`).trim();
    const studentName = (s.student_name || 'Student').trim();
    const courseList = getStudentCourseList(s);
    const date = getStartDate(s);
    const pronoun = getPronoun(studentName);

    console.log(`\n[${i + 1}/${students.length}] ${studentName} (${studentId}) has ${courseList.length} course(s):`);

    const studentGeneratedCerts = [];

    for (let cIdx = 0; cIdx < courseList.length; cIdx++) {
      const courseObj = courseList[cIdx];
      const completionDate = getCourseCompletionDate(s, courseObj);
      const now = new Date();
      const isCompleted = now >= completionDate;

      if (!isCompleted) {
        console.log(`   ⏳ Skipping: ${courseObj.title} - Course is currently IN PROGRESS until ${formatDate(completionDate)}.`);
        continue;
      }

      console.log(`   -> Generating certificate for COMPLETED course: ${courseObj.title} (${courseObj.duration})...`);

      // Dynamic QR code with id and course query
      const targetUrl = `https://institute-rize.onrender.com/download-certificate?id=${encodeURIComponent(studentId)}&course=${encodeURIComponent(courseObj.title)}`;
      const qrDataUrl = await QRCode.toDataURL(targetUrl, {
        errorCorrectionLevel: 'M',
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' }
      });

      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 2000px;
      height: 1414px;
      margin: 0;
      padding: 0;
      position: relative;
      background: #ffffff;
      overflow: hidden;
      font-family: 'Plus Jakarta Sans', sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .base-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 2000px;
      height: 1414px;
      z-index: 1;
    }
    
    /* Whiteout masks for dynamic fields */
    .mask-name {
      position: absolute;
      top: 660px;
      left: 200px;
      width: 1600px;
      height: 100px;
      background: #ffffff;
      z-index: 2;
    }
    .mask-desc {
      position: absolute;
      top: 780px;
      left: 200px;
      width: 1600px;
      height: 135px;
      background: #ffffff;
      z-index: 2;
    }
    .mask-sign {
      position: absolute;
      top: 920px;
      left: 1280px;
      width: 540px;
      height: 143px;
      background: #ffffff;
      z-index: 2;
    }

    /* Dynamic Content Layer */
    .content-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 2000px;
      height: 1414px;
      z-index: 3;
      pointer-events: none;
    }
    
    .student-name {
      position: absolute;
      top: 668px;
      left: 0;
      width: 2000px;
      text-align: center;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 78px;
      font-weight: 700;
      color: #1e293b;
      letter-spacing: -0.01em;
      line-height: 1;
    }
    .description-text {
      position: absolute;
      top: 800px;
      left: 200px;
      width: 1600px;
      font-size: 25.5px;
      line-height: 1.58;
      color: #334155;
      text-align: center;
      font-weight: 400;
      padding: 0 40px;
    }
    .description-text strong {
      color: #0f172a;
      font-weight: 700;
    }

    /* QR Scanner Box (bottom-left) */
    .qr-card {
      position: absolute;
      top: 915px;
      left: 275px;
      width: 264px;
      height: 280px;
      background: #ffffff;
      border: 2px solid #c5a059;
      padding: 18px 16px 12px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .qr-img {
      width: 224px;
      height: 224px;
      display: block;
    }
    .qr-id {
      margin-top: 10px;
      font-size: 14px;
      font-weight: 700;
      color: #000000;
      letter-spacing: 0.04em;
    }

    /* New Signature (bottom-right shifted left) */
    .sign-img {
      position: absolute;
      top: 952px;
      left: 1330px;
      width: 315px;
      height: auto;
      object-fit: contain;
    }
  </style>
</head>
<body>
  <img src="${baseCertBase64}" class="base-bg" alt="Base Certificate" />
  <div class="mask-name"></div>
  <div class="mask-desc"></div>
  <div class="mask-sign"></div>

  <div class="content-layer">
    <div class="student-name">${studentName}</div>
    <p class="description-text">
      has successfully completed the <strong>${courseObj.title}</strong> program at <strong>RizeWorld Institute of AI & Digital Marketing</strong>, a <strong>${courseObj.duration}</strong> course, joined on <strong>${date}</strong>. ${pronoun} dedication and commitment to the learning process are truly commendable.
    </p>

    <div class="qr-card">
      <img src="${qrDataUrl}" class="qr-img" alt="QR Code" />
      <div class="qr-id">STUDENT ID: ${studentId}</div>
    </div>

    <img src="${signBase64}" class="sign-img" alt="Founder Signature" />
  </div>
</body>
</html>`;

      fs.writeFileSync(tempHtmlPath, htmlContent);

      const cmd = `"${chromePath}" --headless --disable-gpu --screenshot="${tempPngPath}" --window-size=2000,1414 --hide-scrollbars "file:///${tempHtmlPath.replace(/\\/g, '/')}"`;
      execSync(cmd);

      // Unique file name per course
      const cleanId = studentId.replace(/[^a-zA-Z0-9-_]/g, '_');
      const safeName = studentName.replace(/[^a-zA-Z0-9-_]/g, '_');
      const fileName = `Certificate_${cleanId}_${safeName}_${courseObj.slug}.png`;

      const outPathAdmin = path.join(dirAdmin, fileName);
      const outPathMain = path.join(dirMain, fileName);
      const outPathBackend = path.join(dirBackend, fileName);

      const renderedBuffer = fs.readFileSync(tempPngPath);

      fs.writeFileSync(outPathAdmin, renderedBuffer);
      fs.writeFileSync(outPathMain, renderedBuffer);
      fs.writeFileSync(outPathBackend, renderedBuffer);

      const certPublicUrl = `/certificates/${fileName}`;
      studentGeneratedCerts.push({
        course_name: courseObj.title,
        courseName: courseObj.title,
        certificate_path: certPublicUrl,
        certificatePath: certPublicUrl,
        issued_at: new Date(),
        issuedAt: new Date()
      });

      console.log(`      ✓ Saved: frontend-admin/public/certificates/${fileName}`);
      totalGeneratedCount++;

      // If Punit Sharma and Creative Pro, also update hero/COURSE CERTIFICATE.png
      if (studentId === 'RW-6678' && courseObj.slug === 'Creative_Pro') {
        const heroAdmin = 'd:/desktop/Aman/rizeworld institute/rizeworld institute/rizeworld institute/frontend-admin/public/hero/COURSE CERTIFICATE.png';
        const heroMain = 'd:/desktop/Aman/rizeworld institute/rizeworld institute/rizeworld institute/frontend-main/public/hero/COURSE CERTIFICATE.png';
        fs.writeFileSync(heroAdmin, renderedBuffer);
        fs.writeFileSync(heroMain, renderedBuffer);
        console.log(`      ✓ Updated hero/COURSE CERTIFICATE.png for Punit Sharma`);
      }
    }

    // Update student in MongoDB
    s.certificates = studentGeneratedCerts;
    s.certificate_photo = studentGeneratedCerts.length > 0 ? studentGeneratedCerts[0].certificate_path : "";
    await s.save();
    console.log(`   ✓ DB updated with ${studentGeneratedCerts.length} issued certificate(s) for ${studentName}`);
  }

  // Cleanup temp files
  if (fs.existsSync(tempHtmlPath)) fs.unlinkSync(tempHtmlPath);
  if (fs.existsSync(tempPngPath)) fs.unlinkSync(tempPngPath);

  console.log(`\nComplete! Total ${totalGeneratedCount} individual course certificates generated and saved without duplicates!`);
  process.exit(0);
}

run().catch(err => {
  console.error('Fatal error generating certificates:', err);
  process.exit(1);
});
