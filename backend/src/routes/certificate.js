const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const student_model = require("../models/studentModel");

const {
    certificateData
} = require("../controllers/certificate");

const user_auth = require("../../middleware/student_auth");

router.post(
    "/certificateData",
    user_auth,
    certificateData
);

function getCertificateFilePath(studentId) {
    if (studentId) {
        const cleanId = studentId.replace(/[^a-zA-Z0-9-_]/g, '_');
        const certDirs = [
            path.join(__dirname, "../../../frontend-admin/public/certificates"),
            path.join(__dirname, "../../../frontend-main/public/certificates"),
            path.join(__dirname, "../../public/uploads/certificates")
        ];

        for (const dir of certDirs) {
            if (fs.existsSync(dir)) {
                const files = fs.readdirSync(dir);
                const matched = files.find(f => f.startsWith(`Certificate_${cleanId}`));
                if (matched) return path.join(dir, matched);
            }
        }
    }

    const candidates = [
        path.join(__dirname, "../../../frontend-admin/public/hero/COURSE CERTIFICATE.png"),
        path.join(__dirname, "../../../frontend-main/public/hero/COURSE CERTIFICATE.png"),
        path.join(__dirname, "../../public/uploads/RizeWorld_Certificate_Punit_Sharma.jpg"),
        path.join(__dirname, "../../../frontend-admin/public/hero/White and Gold Simple Elegant Appreciation Certificate.jpg.jpeg"),
        path.join(__dirname, "../../../frontend-main/public/hero/White and Gold Simple Elegant Appreciation Certificate.jpg.jpeg"),
        path.join(__dirname, "../../../frontend-main/public/certificate/RizeWorld_Certificate_Punit_Sharma.jpg")
    ];
    for (const p of candidates) {
        if (fs.existsSync(p)) return p;
    }
    return null;
}

function getCourseCompletionDate(student, specificCourse) {
    let start = null;
    let end = null;
    if (student.admissions && student.admissions.length > 0) {
        for (const adm of student.admissions) {
            if (specificCourse && Array.isArray(adm.courses) && adm.courses.some(c => c.toLowerCase().includes(specificCourse.toLowerCase()) || specificCourse.toLowerCase().includes(c.toLowerCase()))) {
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
    const clc = (specificCourse || (Array.isArray(student.selected_course_name) ? student.selected_course_name.join(' ') : student.selected_course_name) || '').toLowerCase();
    if (clc.includes('seo') && !clc.includes('marketing') && !clc.includes('smo')) durMonths = 1;
    else if (clc.includes('master') || clc.includes('web development')) durMonths = 3;

    const calcEnd = new Date(start);
    calcEnd.setMonth(calcEnd.getMonth() + durMonths);
    if (end && !isNaN(end.getTime())) {
        return calcEnd < end ? calcEnd : end;
    }
    return calcEnd;
}

const { generateSingleStudentCertificate } = require('../utils/certificateGenerator');

// 1. Direct raw binary download endpoint
router.get("/api/certificate/download", async (req, res) => {
    const studentId = req.query.id;
    if (studentId) {
        try {
            const student = await student_model.findOne({ student_ID: studentId.trim() }).lean();
            if (student) {
                const compDate = getCourseCompletionDate(student, req.query.course);
                if (new Date() < compDate) {
                    return res.status(403).json({
                        success: false,
                        message: `Course is currently in progress. Certificate will be available after ${compDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.`
                    });
                }
            }
        } catch (e) {
            console.error("Error checking completion date:", e);
        }
    }
    let certPath = getCertificateFilePath(studentId);
    if (!certPath && studentId) {
        try {
            const genRes = await generateSingleStudentCertificate(studentId, req.query.course);
            if (genRes && genRes.eligible) {
                certPath = getCertificateFilePath(studentId);
            }
        } catch (err) {
            console.error("On-demand certificate generation error:", err);
        }
    }
    if (certPath) {
        return res.download(certPath, `RizeWorld_Certificate_${studentId || 'Official'}.png`);
    }
    return res.status(404).json({ success: false, message: "Certificate file not found or course not completed yet" });
});

// 2. Direct inline image view endpoint
router.get("/api/certificate/file", async (req, res) => {
    const studentId = req.query.id;
    let certPath = getCertificateFilePath(studentId);
    if (!certPath && studentId) {
        try {
            const genRes = await generateSingleStudentCertificate(studentId, req.query.course);
            if (genRes && genRes.eligible) {
                certPath = getCertificateFilePath(studentId);
            }
        } catch (err) {
            console.error("On-demand certificate generation error:", err);
        }
    }
    if (certPath) {
        res.setHeader("Content-Type", certPath.endsWith(".png") ? "image/png" : "image/jpeg");
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.sendFile(certPath);
    }
    return res.status(404).send("Certificate image not found");
});


// 3. Official Logo Endpoint
router.get("/api/certificate/logo", (req, res) => {
    const logoCandidates = [
        path.join(__dirname, "../../public/uploads/RIZE_LOGO_CROPPED.png"),
        path.join(__dirname, "../../../frontend-admin/public/logo/RIZE_LOGO_CROPPED.png"),
        path.join(__dirname, "../../../frontend-main/public/logo/RIZE_LOGO_CROPPED.png")
    ];
    for (const p of logoCandidates) {
        if (fs.existsSync(p)) {
            res.setHeader("Content-Type", "image/png");
            res.setHeader("Cache-Control", "public, max-age=86400");
            return res.sendFile(p);
        }
    }
    return res.status(404).send("Logo not found");
});

// 4. Dynamic QR Code Scanner Landing & Verification Page (Supports every individual student)
router.get("/download-certificate", async (req, res) => {
    let studentId = "RW-6678";
    let studentName = "Punit Sharma";
    let courseName = "Creative Pro (Graphic + Video)";
    let certImageUrl = "/api/certificate/file";
    let downloadUrl = "/api/certificate/download";
    let isCourseOngoing = false;
    let completionDateFormatted = "";

    // Dynamic lookup by Student ID or query parameters
    if (req.query.id) {
        try {
            const queryId = req.query.id.trim();
            studentId = queryId;
            const student = await student_model.findOne({
                $or: [
                    { student_ID: queryId },
                    ...(queryId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: queryId }] : [])
                ]
            }).lean();

            if (student) {
                studentId = student.student_ID || studentId;
                studentName = student.student_name || studentName;
                if (Array.isArray(student.selected_course_name) && student.selected_course_name.length > 0) {
                    courseName = student.selected_course_name.join(", ");
                } else if (student.selected_course_name) {
                    courseName = student.selected_course_name;
                } else if (student.admissions && student.admissions.length > 0 && student.admissions[0].courses) {
                    courseName = student.admissions[0].courses.join(", ");
                }

                // Check completion date
                const targetCourse = req.query.course || courseName;
                const compDate = getCourseCompletionDate(student, targetCourse);
                const now = new Date();
                if (now < compDate) {
                    isCourseOngoing = true;
                    completionDateFormatted = compDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
                } else {
                    let certPath = getCertificateFilePath(studentId);
                    if (!certPath) {
                        try {
                            await generateSingleStudentCertificate(studentId, targetCourse);
                        } catch (err) {
                            console.error("On-demand generation error in download-certificate:", err);
                        }
                    }
                }

                if (student.certificate_photo && student.certificate_photo.startsWith("http")) {
                    certImageUrl = student.certificate_photo;
                    downloadUrl = certImageUrl;
                } else {
                    certImageUrl = `/api/certificate/file?id=${encodeURIComponent(studentId)}`;
                    downloadUrl = `/api/certificate/download?id=${encodeURIComponent(studentId)}`;
                }
            }
        } catch (err) {
            console.error("Error fetching dynamic student certificate:", err);
        }

    } else {
        certImageUrl = `/api/certificate/file?id=${encodeURIComponent(studentId)}`;
        downloadUrl = `/api/certificate/download?id=${encodeURIComponent(studentId)}`;
    }

    if (req.query.name) studentName = req.query.name;
    if (req.query.course) courseName = req.query.course;

    if (req.query.raw === "1" || req.query.download === "1") {
        if (isCourseOngoing) {
            return res.status(403).send(`Course is currently in progress. Certificate will be available after ${completionDateFormatted}.`);
        }
        const certPath = getCertificateFilePath(studentId);
        if (certPath) {
            return res.download(certPath, `RizeWorld_Certificate_${studentId}.png`);
        }
    }


    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Certificate | RizeWorld Institute</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f8fafc;
      background-image: 
        radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.08) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(99, 102, 241, 0.06) 0px, transparent 50%);
      color: #0f172a;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 16px;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 540px;
      width: 100%;
    }
    .brand-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 22px;
    }
    .brand-logo {
      height: 64px;
      width: auto;
      max-width: 240px;
      object-fit: contain;
      filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.06));
    }
    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 28px;
      padding: 32px 22px;
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.03);
      text-align: center;
    }
    .institute-title {
      font-size: 12px;
      color: #2563eb;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 6px;
      margin-top: 4px;
    }
    .cert-heading {
      font-size: 26px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 20px;
      letter-spacing: -0.02em;
    }
    .info-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      padding: 16px 20px;
      margin-bottom: 22px;
      text-align: left;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 9px 0;
      font-size: 13px;
    }
    .info-row:not(:last-child) {
      border-bottom: 1px solid #edf2f7;
    }
    .info-label { color: #64748b; font-weight: 600; }
    .info-val { color: #0f172a; font-weight: 800; }
    .preview-wrap {
      border-radius: 18px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      margin-bottom: 24px;
      background: #ffffff;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
      padding: 6px;
    }
    .preview-img {
      width: 100%;
      height: auto;
      display: block;
      border-radius: 14px;
      border: 1px solid #f1f5f9;
    }
    .btn-download {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
      color: #ffffff;
      font-size: 15px;
      font-weight: 800;
      padding: 16px 24px;
      border-radius: 16px;
      text-decoration: none;
      box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.35);
      margin-bottom: 12px;
      cursor: pointer;
      border: none;
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .btn-download:active { transform: scale(0.98); }
    .btn-download:hover { box-shadow: 0 12px 28px -5px rgba(37, 99, 235, 0.45); }
    .btn-view {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      background: #ffffff;
      color: #334155;
      font-size: 14px;
      font-weight: 700;
      padding: 14px 20px;
      border-radius: 16px;
      text-decoration: none;
      border: 1.5px solid #e2e8f0;
      margin-bottom: 12px;
      transition: background 0.15s, border-color 0.15s;
    }
    .btn-view:hover { background: #f8fafc; border-color: #cbd5e1; }
    .footer-link {
      font-size: 12px;
      color: #64748b;
      font-weight: 600;
      text-decoration: none;
      margin-top: 14px;
      display: inline-block;
      transition: color 0.15s;
    }
    .footer-link:hover { color: #2563eb; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="brand-header">
      <img src="/api/certificate/logo" alt="RizeWorld Institute" class="brand-logo" onerror="this.style.display='none'" />
    </div>
    
    <div class="card">
      <div class="institute-title">RizeWorld Institute of AI & Digital Marketing</div>
      <h1 class="cert-heading">${isCourseOngoing ? 'Credential In Progress' : 'Certificate of Completion'}</h1>

      <div class="info-box">
        <div class="info-row">
          <span class="info-label">Student ID</span>
          <span class="info-val" style="color: #2563eb;">${studentId}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Student Name</span>
          <span class="info-val">${studentName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Program</span>
          <span class="info-val">${courseName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Status</span>
          <span class="info-val" style="color: ${isCourseOngoing ? '#d97706' : '#16a34a'};">
            ${isCourseOngoing ? `In Progress (Ends ${completionDateFormatted})` : 'Verified & Completed'}
          </span>
        </div>
      </div>

      ${isCourseOngoing ? `
      <div style="padding: 28px 20px; background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 18px; margin-bottom: 22px; text-align: center;">
        <div style="font-size: 34px; margin-bottom: 10px;">⏳</div>
        <div style="font-weight: 800; font-size: 16px; color: #92400e; margin-bottom: 6px;">Course Currently In Progress</div>
        <div style="font-size: 13.5px; color: #b45309; line-height: 1.55;">This student is currently enrolled in the <strong>${courseName}</strong> training program. The official verifiable certificate will be issued after <strong>${completionDateFormatted}</strong>.</div>
      </div>

      <div style="width: 100%; background: #f1f5f9; color: #94a3b8; font-size: 13.5px; font-weight: 700; padding: 14px; border-radius: 16px; margin-bottom: 12px; text-align: center; border: 1px dashed #cbd5e1;">
        🔒 Certificate Download Unlocks On ${completionDateFormatted}
      </div>
      ` : `
      <div class="preview-wrap">
        <img src="${certImageUrl}" alt="${studentName} Certificate Preview" class="preview-img" />
      </div>

      <a href="${downloadUrl}" class="btn-download" id="downloadBtn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        Download Certificate (HD)
      </a>

      <a href="${certImageUrl}" target="_blank" class="btn-view">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
        View Full Certificate
      </a>
      `}
      
      <a href="https://rizeworldinstitute.in" target="_blank" class="footer-link">
        © RizeWorld Institute • rizeworldinstitute.in
      </a>
    </div>
  </div>

</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.send(html);
});

module.exports = router;