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

// 3. QR Code Scanner Landing & Verification Page (Pure clean HTML - NO auto-redirects/iframes that blank mobile WebViews)
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
  <title>Verified Certificate | RizeWorld Institute</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #090d16;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 14px;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 520px;
      width: 100%;
    }
    .card {
      background: #131b2e;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 26px;
      padding: 28px 20px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
      text-align: center;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .badge svg { width: 14px; height: 14px; fill: currentColor; }
    .institute-title {
      font-size: 12px;
      color: #94a3b8;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .cert-heading {
      font-size: 24px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 18px;
      letter-spacing: -0.02em;
    }
    .info-box {
      background: rgba(9, 13, 22, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 18px;
      padding: 16px;
      margin-bottom: 20px;
      text-align: left;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 7px 0;
      font-size: 13px;
    }
    .info-row:not(:last-child) {
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }
    .info-label { color: #94a3b8; font-weight: 500; }
    .info-val { color: #ffffff; font-weight: 700; }
    .preview-wrap {
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 22px;
      background: #000;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);
    }
    .preview-img {
      width: 100%;
      height: auto;
      display: block;
    }
    .btn-download {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      background: linear-gradient(135deg, #2563eb, #4f46e5);
      color: #ffffff;
      font-size: 15px;
      font-weight: 800;
      padding: 16px 20px;
      border-radius: 16px;
      text-decoration: none;
      box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4);
      margin-bottom: 12px;
      cursor: pointer;
      border: none;
      transition: transform 0.15s, opacity 0.15s;
    }
    .btn-download:active { transform: scale(0.98); }
    .btn-view {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      background: rgba(255, 255, 255, 0.05);
      color: #cbd5e1;
      font-size: 13px;
      font-weight: 700;
      padding: 12px 18px;
      border-radius: 14px;
      text-decoration: none;
      border: 1px solid rgba(255, 255, 255, 0.08);
      margin-bottom: 14px;
      transition: background 0.15s;
    }
    .btn-view:hover { background: rgba(255, 255, 255, 0.09); }
    .toast {
      font-size: 12px;
      color: #94a3b8;
      margin-top: 8px;
    }
    .footer-link {
      font-size: 12px;
      color: #64748b;
      text-decoration: none;
      margin-top: 14px;
      display: inline-block;
    }
    .footer-link:hover { color: #94a3b8; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="badge">
        <svg viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
        Official Credential Verified
      </div>

      <div class="institute-title">RizeWorld Institute of AI & Digital Marketing</div>
      <h1 class="cert-heading">Certificate of Completion</h1>

      <div class="info-box">
        <div class="info-row">
          <span class="info-label">Student Name:</span>
          <span class="info-val">Punit Sharma</span>
        </div>
        <div class="info-row">
          <span class="info-label">Program:</span>
          <span class="info-val" style="color: #60a5fa;">Creative Pro (Graphic + Video)</span>
        </div>
        <div class="info-row">
          <span class="info-label">Verification:</span>
          <span class="info-val" style="color: #34d399;">100% Authentic & Verified</span>
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

      <p class="toast">Tap button above to save certificate to your gallery/downloads.</p>
      
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