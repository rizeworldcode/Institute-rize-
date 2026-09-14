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

// Clean course display name
function getCourseName(student) {
  if (Array.isArray(student.selected_course_name) && student.selected_course_name.length > 0) {
    return student.selected_course_name.join(' + ');
  }
  if (student.selected_course_name && typeof student.selected_course_name === 'string') {
    return student.selected_course_name;
  }
  if (student.admissions && student.admissions.length > 0 && student.admissions[0].courses && student.admissions[0].courses.length > 0) {
    return student.admissions[0].courses.join(' + ');
  }
  return 'Creative Pro (Graphic + Video)';
}

function getDuration(student) {
  if (student.course_duration) return student.course_duration;
  if (student.admissions && student.admissions[0] && student.admissions[0].courseDuration) {
    return student.admissions[0].courseDuration;
  }
  return '3-month';
}

function getStartDate(student) {
  if (student.course_start_date) return formatDate(student.course_start_date);
  if (student.admissions && student.admissions[0] && student.admissions[0].startDate) {
    return formatDate(student.admissions[0].startDate);
  }
  if (student.createdAt) return formatDate(student.createdAt);
  return '17 June 2026';
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

  [dirAdmin, dirMain, dirBackend].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  const students = await student_model.find({});
  console.log(`Found ${students.length} students to generate certificates for.`);

  const tempHtmlPath = path.join(__dirname, 'temp_batch_cert.html');
  const tempPngPath = path.join(__dirname, 'temp_batch_cert.png');

  for (let i = 0; i < students.length; i++) {
    const s = students[i];
    const studentId = s.student_ID || `RW-${Date.now()}`;
    const studentName = (s.student_name || 'Student').trim();
    const course = getCourseName(s);
    const duration = getDuration(s);
    const date = getStartDate(s);
    const pronoun = getPronoun(studentName);

    console.log(`\n[${i + 1}/${students.length}] Generating certificate for: ${studentName} (${studentId})...`);

    // Generate dynamic QR code
    const qrDataUrl = await QRCode.toDataURL(`https://institute-rize.onrender.com/download-certificate?id=${encodeURIComponent(studentId)}`, {
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
      top: 960px;
      left: 1340px;
      width: 440px;
      height: 100px;
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

    /* New Signature (bottom-right) */
    .sign-img {
      position: absolute;
      top: 960px;
      left: 1400px;
      width: 320px;
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
      has successfully completed the <strong>${course}</strong> program at <strong>RizeWorld Institute of AI & Digital Marketing</strong>, a <strong>${duration}</strong> course, joined on <strong>${date}</strong>. ${pronoun} dedication and commitment to the learning process are truly commendable.
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

    const cmd = `"${chromePath}" --headless --disable-gpu --screenshot="${tempPngPath}" --window-size=2000,1414 --hide-scrollbars "file:///${tempHtmlPath.replace(/\\\\/g, '/')}"`;
    execSync(cmd);

    // Save to all target locations
    const cleanId = studentId.replace(/[^a-zA-Z0-9-_]/g, '_');
    const safeName = studentName.replace(/[^a-zA-Z0-9-_]/g, '_');
    const fileName = `Certificate_${cleanId}_${safeName}.png`;
    const simpleIdFileName = `Certificate_${cleanId}.png`;

    const outPathAdmin = path.join(dirAdmin, fileName);
    const outPathAdminSimple = path.join(dirAdmin, simpleIdFileName);
    const outPathMain = path.join(dirMain, fileName);
    const outPathMainSimple = path.join(dirMain, simpleIdFileName);
    const outPathBackend = path.join(dirBackend, fileName);
    const outPathBackendSimple = path.join(dirBackend, simpleIdFileName);

    const renderedBuffer = fs.readFileSync(tempPngPath);

    fs.writeFileSync(outPathAdmin, renderedBuffer);
    fs.writeFileSync(outPathAdminSimple, renderedBuffer);
    fs.writeFileSync(outPathMain, renderedBuffer);
    fs.writeFileSync(outPathMainSimple, renderedBuffer);
    fs.writeFileSync(outPathBackend, renderedBuffer);
    fs.writeFileSync(outPathBackendSimple, renderedBuffer);

    // Update student in database
    const certPublicUrl = `/certificates/${fileName}`;
    s.certificate_photo = certPublicUrl;
    if (!s.certificates) s.certificates = [];
    s.certificates = [{
      course_name: course,
      courseName: course,
      certificate_path: certPublicUrl,
      certificatePath: certPublicUrl,
      issued_at: new Date(),
      issuedAt: new Date()
    }];
    await s.save();

    console.log(`✓ Saved certificate to:`);
    console.log(`  - frontend-admin/public/certificates/${fileName}`);
    console.log(`  - DB record updated with certificate_photo: ${certPublicUrl}`);

    // If Punit Sharma, also update COURSE CERTIFICATE.png in hero
    if (studentId === 'RW-6678') {
      const heroAdmin = 'd:/desktop/Aman/rizeworld institute/rizeworld institute/rizeworld institute/frontend-admin/public/hero/COURSE CERTIFICATE.png';
      const heroMain = 'd:/desktop/Aman/rizeworld institute/rizeworld institute/rizeworld institute/frontend-main/public/hero/COURSE CERTIFICATE.png';
      fs.writeFileSync(heroAdmin, renderedBuffer);
      fs.writeFileSync(heroMain, renderedBuffer);
      console.log(`  - Also updated default hero/COURSE CERTIFICATE.png for Punit Sharma`);
    }
  }

  // Cleanup temp files
  if (fs.existsSync(tempHtmlPath)) fs.unlinkSync(tempHtmlPath);
  if (fs.existsSync(tempPngPath)) fs.unlinkSync(tempPngPath);

  console.log('\nAll certificates successfully generated and saved into public folders!');
  process.exit(0);
}

run().catch(err => {
  console.error('Fatal error generating certificates:', err);
  process.exit(1);
});
