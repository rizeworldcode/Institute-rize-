const fs = require('fs');
const path = require('path');
const url = require('url');
const QRCode = require('qrcode');
const { execSync } = require('child_process');
const student_model = require('../models/studentModel');
const memoryCache = require('./cache');

// Resolve Chrome executable path across macOS, Windows, and Linux
function getChromePath() {
  const candidates = [
    // macOS
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    // Linux
    process.env.CHROME_BIN,
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    // Windows
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Google/Chrome/Application/chrome.exe') : null,
    process.env.PROGRAMFILES ? path.join(process.env.PROGRAMFILES, 'Google/Chrome/Application/chrome.exe') : null,
    process.env['PROGRAMFILES(X86)'] ? path.join(process.env['PROGRAMFILES(X86)'], 'Google/Chrome/Application/chrome.exe') : null,
  ].filter(Boolean);

  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }

  // Fallback to which command on POSIX
  try {
    const whichCmd = process.platform === 'win32' ? 'where chrome' : 'which google-chrome || which chromium || which chrome';
    const found = execSync(whichCmd, { stdio: 'pipe' }).toString().trim().split('\n')[0];
    if (found && fs.existsSync(found)) return found;
  } catch (e) {
    // Ignore error
  }

  return process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : (process.platform === 'win32'
        ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        : '/usr/bin/google-chrome');
}

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

  let durMonths = 2;
  if (courseObj.duration && courseObj.duration.startsWith('1')) durMonths = 1;
  else if (courseObj.duration && courseObj.duration.startsWith('3')) durMonths = 3;

  const calcEnd = new Date(start);
  calcEnd.setMonth(calcEnd.getMonth() + durMonths);

  if (end && !isNaN(end.getTime())) {
    return calcEnd < end ? calcEnd : end;
  }
  return calcEnd;
}

// Helper to strictly check if fees are 100% clear for a student and/or course
function isStudentFeeClear(student, courseObj) {
  if (!student) return false;

  // 1. If student has admissions array, check matching admission
  if (student.admissions && Array.isArray(student.admissions) && student.admissions.length > 0) {
    let matchedAdm = null;
    if (courseObj) {
      const targetSlug = (courseObj.slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const targetTitle = (courseObj.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');

      matchedAdm = student.admissions.find(adm => {
        const admCourses = (adm.courses || []).map(c => (c || '').toLowerCase().replace(/[^a-z0-9]/g, ''));
        return admCourses.some(ac => {
          const acClean = ac.replace(/[^a-z0-9]/g, '');
          return acClean === targetSlug || acClean === targetTitle || targetTitle.includes(acClean) || acClean.includes(targetTitle);
        });
      });
    }

    if (!matchedAdm && student.admissions.length === 1) {
      matchedAdm = student.admissions[0];
    }

    if (matchedAdm) {
      const admTotal = parseFloat(matchedAdm.totalFee || matchedAdm.total_fee || 0);
      const admPaid = parseFloat(matchedAdm.totalPaidFee || matchedAdm.total_paid_fee || 0);
      const admPending = parseFloat(matchedAdm.pendingFee ?? matchedAdm.pending_fee ?? (admTotal - admPaid));
      const admStatus = (matchedAdm.feesStatus || matchedAdm.status || '').toLowerCase().trim();

      if (admStatus === 'clear' || (admPending <= 0 && admPaid >= admTotal && admTotal > 0)) {
        return true;
      }
      return false;
    }
  }

  // 2. Student root-level fee check
  const total = parseFloat(student.total_fee || 0);
  const paid = parseFloat(student.total_paid_fee || 0);
  const pending = parseFloat(student.pending_fee ?? (total - paid));
  const status = (student.fees_status || '').toLowerCase().trim();

  if (status === 'clear' || (pending <= 0 && paid >= total && total > 0)) {
    return true;
  }
  return false;
}

// Render a single certificate image and save to destination folders
async function renderCertificate(student, courseObj) {
  const chromePath = getChromePath();
  const baseCertPath = path.join(__dirname, '../../../frontend-admin/public/hero/COURSE CERTIFICATE.original.png');
  const signCroppedPath = path.join(__dirname, '../../../frontend-admin/public/hero/sign_with_line.png');

  if (!fs.existsSync(baseCertPath) || !fs.existsSync(signCroppedPath)) {
    throw new Error('Base certificate or signature asset not found');
  }

  const baseCertBase64 = `data:image/png;base64,${fs.readFileSync(baseCertPath).toString('base64')}`;
  const signBase64 = `data:image/png;base64,${fs.readFileSync(signCroppedPath).toString('base64')}`;

  const dirAdmin = path.join(__dirname, '../../../frontend-admin/public/certificates');
  const dirMain = path.join(__dirname, '../../../frontend-main/public/certificates');
  const dirBackend = path.join(__dirname, '../../public/uploads/certificates');

  [dirAdmin, dirMain, dirBackend].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  const studentId = (student.student_ID || `RW-${Date.now()}`).trim();
  const studentName = (student.student_name || 'Student').trim();
  const date = getStartDate(student);
  const pronoun = getPronoun(studentName);

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
      left: 1300px;
      width: 440px;
      height: 160px;
      background: #ffffff;
      z-index: 2;
    }

    .content-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 2000px;
      height: 1414px;
      z-index: 10;
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

    /* Signature with Golden Line & Founder (bottom-right shifted left) */
    .sign-img {
      position: absolute;
      top: 970px;
      left: 1315px;
      width: 350px;
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

  const tempHtmlPath = path.join(__dirname, `../../temp_${studentId}_${courseObj.slug}.html`);
  const tempPngPath = path.join(__dirname, `../../temp_${studentId}_${courseObj.slug}.png`);

  try {
    fs.writeFileSync(tempHtmlPath, htmlContent);

    const fileUrl = url.pathToFileURL(tempHtmlPath).href;
    const cmd = `"${chromePath}" --headless --disable-gpu --screenshot="${tempPngPath}" --window-size=2000,1414 --hide-scrollbars "${fileUrl}"`;
    execSync(cmd, { stdio: 'pipe' });

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

    return {
      fileName,
      publicPath: `/certificates/${fileName}`,
      courseTitle: courseObj.title
    };
  } finally {
    if (fs.existsSync(tempHtmlPath)) fs.unlinkSync(tempHtmlPath);
    if (fs.existsSync(tempPngPath)) fs.unlinkSync(tempPngPath);
  }
}

// Helper to attach a certificate into matching admission
function syncCertificateToAdmissions(student, courseTitle, certPublicPath) {
  if (!student.admissions || !Array.isArray(student.admissions) || student.admissions.length === 0) {
    return;
  }
  const targetTitle = (courseTitle || '').toLowerCase().trim();
  const targetClean = targetTitle.replace(/[^a-z0-9]/g, '');

  for (const adm of student.admissions) {
    const admCourses = (adm.courses || []).map(c => (c || '').toLowerCase().trim());
    const matches = admCourses.some(ac => {
      const acClean = ac.replace(/[^a-z0-9]/g, '');
      return ac === targetTitle ||
        targetTitle.includes(ac) ||
        ac.includes(targetTitle) ||
        (acClean && targetClean && (acClean.includes(targetClean) || targetClean.includes(acClean)));
    }) || student.admissions.length === 1;

    if (matches) {
      if (!Array.isArray(adm.certificates)) adm.certificates = [];
      const already = adm.certificates.some(c => {
        const cName = (c.courseName || c.course_name || '').toLowerCase().trim();
        const cPath = c.certificatePath || c.certificate_path || c.url;
        return cName === targetTitle || cPath === certPublicPath;
      });
      if (!already) {
        adm.certificates.push({
          courseName: courseTitle,
          course_name: courseTitle,
          certificatePath: certPublicPath,
          certificate_path: certPublicPath,
          url: certPublicPath,
          issuedAt: new Date(),
          issued_at: new Date()
        });
      }
    }
  }
  student.markModified('admissions');
}

// Automatically check all students and generate certificates only if BOTH Fee is Clear AND Course is Complete
async function checkAndGenerateEligibleCertificates() {
  console.log('[AutoCert] Checking active students for eligible courses (Fee Clear AND Course Complete)...');
  const students = await student_model.find({ is_deleted: { $ne: true } });
  const now = new Date();
  let generatedCount = 0;

  for (const s of students) {
    const studentId = (s.student_ID || '').trim();
    const studentName = (s.student_name || '').trim();
    const courseList = getStudentCourseList(s);
    let existingCerts = s.certificates || [];
    let studentUpdated = false;

    // Safety: If student has pending fees for any course, revoke certificate for that course
    for (const courseObj of courseList) {
      const isFeeClear = isStudentFeeClear(s, courseObj);
      if (!isFeeClear) {
        const initialLen = existingCerts.length;
        existingCerts = existingCerts.filter(c => {
          const cn = (c.courseName || c.course_name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          const tn = courseObj.title.toLowerCase().replace(/[^a-z0-9]/g, '');
          const sn = courseObj.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
          return !(cn && (cn === tn || cn === sn || cn.includes(sn) || tn.includes(cn)));
        });

        if (existingCerts.length !== initialLen) {
          studentUpdated = true;
          console.log(`[AutoCert] Student ${studentName} (${studentId}) has pending fees for ${courseObj.title}. Revoking certificate from DB.`);
        }

        // Also clean up from admissions
        if (s.admissions && Array.isArray(s.admissions)) {
          s.admissions.forEach(adm => {
            if (adm.certificates && adm.certificates.length > 0) {
              const prevAdmLen = adm.certificates.length;
              adm.certificates = adm.certificates.filter(c => {
                const cn = (c.courseName || c.course_name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                const tn = courseObj.title.toLowerCase().replace(/[^a-z0-9]/g, '');
                const sn = courseObj.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
                return !(cn && (cn === tn || cn === sn || cn.includes(sn) || tn.includes(cn)));
              });
              if (adm.certificates.length !== prevAdmLen) {
                studentUpdated = true;
              }
            }
          });
        }

        // Delete any generated physical certificate files for this unpaid course
        const cleanId = studentId.replace(/[^a-zA-Z0-9-_]/g, '_');
        const safeName = studentName.replace(/[^a-zA-Z0-9-_]/g, '_');
        const fileName = `Certificate_${cleanId}_${safeName}_${courseObj.slug}.png`;
        [
          path.join(__dirname, '../../../frontend-admin/public/certificates', fileName),
          path.join(__dirname, '../../../frontend-main/public/certificates', fileName),
          path.join(__dirname, '../../public/uploads/certificates', fileName)
        ].forEach(f => {
          if (fs.existsSync(f)) {
            try { fs.unlinkSync(f); } catch (e) {}
          }
        });
      }
    }

    const feeClearForAny = courseList.some(c => isStudentFeeClear(s, c));
    if (!feeClearForAny) {
      if (s.certificate_photo) {
        s.certificate_photo = '';
        studentUpdated = true;
      }
      if (existingCerts.length > 0) {
        existingCerts = [];
        studentUpdated = true;
      }
    }

    for (const courseObj of courseList) {
      const completionDate = getCourseCompletionDate(s, courseObj);
      const isCompleted = now >= completionDate;
      const isFeeClear = isStudentFeeClear(s, courseObj);

      // BOTH CONDITIONS MUST BE STRICTLY TRUE:
      // Condition 1: Fee is 100% Clear
      // Condition 2: Course is 100% Completed
      if (!isCompleted || !isFeeClear) {
        continue;
      }

      const cleanId = studentId.replace(/[^a-zA-Z0-9-_]/g, '_');
      const safeName = studentName.replace(/[^a-zA-Z0-9-_]/g, '_');
      const expectedFileName = `Certificate_${cleanId}_${safeName}_${courseObj.slug}.png`;
      const certPublicUrl = `/certificates/${expectedFileName}`;

      const adminPath = path.join(__dirname, '../../../frontend-admin/public/certificates', expectedFileName);
      const fileExists = fs.existsSync(adminPath) && fs.statSync(adminPath).size > 1000;
      const dbHasCert = existingCerts.some(c => {
        const cn = (c.courseName || c.course_name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const tn = courseObj.title.toLowerCase().replace(/[^a-z0-9]/g, '');
        const sn = courseObj.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
        return (cn && (cn === tn || cn === sn || cn.includes(sn) || tn.includes(cn)));
      });

      if (!fileExists || !dbHasCert) {
        console.log(`[AutoCert] Auto-generating certificate for eligible course (Fee Clear & Course Complete): ${courseObj.title} (${studentName} - ${studentId})...`);
        try {
          const res = await renderCertificate(s, courseObj);
          if (!dbHasCert) {
            existingCerts.push({
              course_name: courseObj.title,
              courseName: courseObj.title,
              certificate_path: res.publicPath,
              certificatePath: res.publicPath,
              issued_at: new Date(),
              issuedAt: new Date()
            });
            studentUpdated = true;
          }
          syncCertificateToAdmissions(s, courseObj.title, res.publicPath);
          studentUpdated = true;
          generatedCount++;
        } catch (err) {
          console.error(`[AutoCert] Failed to auto-generate certificate for ${studentName}:`, err.message);
        }
      }
    }

    if (studentUpdated) {
      s.certificates = existingCerts;
      if (!s.certificate_photo && existingCerts.length > 0) {
        s.certificate_photo = existingCerts[0].certificate_path || existingCerts[0].certificatePath;
      }
      s.updated_at = new Date();
      await s.save();
      console.log(`[AutoCert] Updated DB certificates for ${studentName}`);
    }
  }

  if (generatedCount > 0) {
    memoryCache.clear();
  }

  console.log(`[AutoCert] Finished check. ${generatedCount} new certificate(s) generated.`);
  return generatedCount;
}

// Generate on-demand for a single student if eligible
async function generateSingleStudentCertificate(studentId, courseTitleOrSlug, force = false) {
  const student = await student_model.findOne({
    $or: [
      { student_ID: studentId },
      ...(studentId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: studentId }] : [])
    ]
  });

  if (!student || student.is_deleted) return null;

  const courseList = getStudentCourseList(student);
  const now = new Date();

  for (const courseObj of courseList) {
    if (courseTitleOrSlug) {
      const matchTitle = courseObj.title.toLowerCase().includes(courseTitleOrSlug.toLowerCase());
      const matchSlug = courseObj.slug.toLowerCase().includes(courseTitleOrSlug.toLowerCase());
      if (!matchTitle && !matchSlug) continue;
    }

    const completionDate = getCourseCompletionDate(student, courseObj);
    const isCompleted = now >= completionDate;
    const isFeeClear = isStudentFeeClear(student, courseObj);

    // STRICT RULE: Fees MUST be clear!
    if (!isFeeClear) {
      return { 
        eligible: false, 
        message: "Cannot issue certificate: Fees must be 100% clear. Please clear pending fees first.",
        feePending: true 
      };
    }

    // Course MUST be complete
    if (!force && !isCompleted) {
      return { 
        eligible: false, 
        message: `Cannot issue certificate: Course is currently in progress until ${completionDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`,
        completionDate 
      };
    }

    // Both conditions satisfied! Generate certificate
    const res = await renderCertificate(student, courseObj);
    
    // Save to student record if not already recorded
    const certs = student.certificates || [];
    const exists = certs.some(c => c.course_name === courseObj.title || c.courseName === courseObj.title);
    if (!exists) {
      certs.push({
        course_name: courseObj.title,
        courseName: courseObj.title,
        certificate_path: res.publicPath,
        certificatePath: res.publicPath,
        issued_at: new Date(),
        issuedAt: new Date()
      });
      student.certificates = certs;
    }

    if (!student.certificate_photo) {
      student.certificate_photo = res.publicPath;
    }

    syncCertificateToAdmissions(student, courseObj.title, res.publicPath);
    student.updated_at = new Date();
    await student.save();
    memoryCache.clear();

    return { eligible: true, cert: res };
  }

  return null;
}

module.exports = {
  checkAndGenerateEligibleCertificates,
  generateSingleStudentCertificate,
  getCourseCompletionDate,
  isStudentFeeClear,
  getChromePath,
  formatDate
};
