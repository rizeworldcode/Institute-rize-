const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const {
    certificateData
} = require("../controllers/certificate");

const user_auth = require("../../middleware/student_auth");

router.post(
    "/certificateData",
    user_auth,
    certificateData
);

function getCertificateFilePath() {
    const candidates = [
        path.join(__dirname, "../../../frontend-admin/public/hero/White and Gold Simple Elegant Appreciation Certificate.jpg.jpeg"),
        path.join(__dirname, "../../public/uploads/RizeWorld_Certificate_Punit_Sharma.jpg"),
        path.join(__dirname, "../../../frontend-main/public/hero/White and Gold Simple Elegant Appreciation Certificate.jpg.jpeg"),
        path.join(__dirname, "../../../frontend-main/public/certificate/RizeWorld_Certificate_Punit_Sharma.jpg")
    ];
    for (const p of candidates) {
        if (fs.existsSync(p)) return p;
    }
    return null;
}

// 1. Direct raw binary download endpoint
router.get("/api/certificate/download", (req, res) => {
    const certPath = getCertificateFilePath();
    if (certPath) {
        return res.download(certPath, "RizeWorld_Certificate_Punit_Sharma.jpg");
    }
    return res.status(404).json({ success: false, message: "Certificate file not found" });
});

// 2. Direct inline image view endpoint
router.get("/api/certificate/file", (req, res) => {
    const certPath = getCertificateFilePath();
    if (certPath) {
        res.setHeader("Content-Type", "image/jpeg");
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.sendFile(certPath);
    }
    return res.status(404).send("Certificate image not found");
});

// 3. QR Code Scanner Landing & Verification Page
router.get("/download-certificate", (req, res) => {
    if (req.query.raw === "1" || req.query.download === "1") {
        const certPath = getCertificateFilePath();
        if (certPath) {
            return res.download(certPath, "RizeWorld_Certificate_Punit_Sharma.jpg");
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
      margin-bottom: 20px;
    }
    .brand-logo {
      height: 48px;
      max-width: 220px;
      object-fit: contain;
      margin-bottom: 4px;
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
      <img src="https://rizeworldinstitute.in/logo/RIZE%20LOGO%20HORI%20PNG.png" alt="RizeWorld Institute" class="brand-logo" onerror="this.style.display='none'" />
    </div>
    
    <div class="card">
      <div class="institute-title">RizeWorld Institute of AI & Digital Marketing</div>
      <h1 class="cert-heading">Certificate of Completion</h1>

      <div class="info-box">
        <div class="info-row">
          <span class="info-label">Student Name</span>
          <span class="info-val">Punit Sharma</span>
        </div>
        <div class="info-row">
          <span class="info-label">Program</span>
          <span class="info-val" style="color: #2563eb;">Creative Pro (Graphic + Video)</span>
        </div>
      </div>

      <div class="preview-wrap">
        <img src="/api/certificate/file" alt="Punit Sharma Certificate Preview" class="preview-img" />
      </div>

      <a href="/api/certificate/download" class="btn-download" id="downloadBtn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        Download Certificate (HD)
      </a>

      <a href="/api/certificate/file" target="_blank" class="btn-view">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
        View Full Certificate
      </a>
      
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