const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const { Jimp, loadFont, HorizontalAlign } = require('jimp');

async function stampCertificate(options = {}) {
  const originalBackupPath = 'd:/desktop/Aman/rizeworld institute/rizeworld institute/rizeworld institute/frontend-admin/public/hero/COURSE CERTIFICATE.original.png';
  const defaultInputPath = 'd:/desktop/Aman/rizeworld institute/rizeworld institute/rizeworld institute/frontend-admin/public/hero/COURSE CERTIFICATE.png';
  
  // Choose input: prefer clean original backup, then defaultInput, then old template
  let inputCertPath = options.inputPath;
  if (!inputCertPath) {
    if (fs.existsSync(originalBackupPath)) {
      inputCertPath = originalBackupPath;
    } else if (fs.existsSync(defaultInputPath)) {
      inputCertPath = defaultInputPath;
    } else {
      inputCertPath = 'd:/desktop/Aman/rizeworld institute/rizeworld institute/rizeworld institute/frontend-admin/public/hero/White and Gold Simple Elegant Appreciation Certificate.original.jpeg';
    }
  }

  const outputCourseCertAdminPath = 'd:/desktop/Aman/rizeworld institute/rizeworld institute/rizeworld institute/frontend-admin/public/hero/COURSE CERTIFICATE.png';
  const outputCourseCertMainPath = 'd:/desktop/Aman/rizeworld institute/rizeworld institute/rizeworld institute/frontend-main/public/hero/COURSE CERTIFICATE.png';
  const outputAdminCertPath = 'd:/desktop/Aman/rizeworld institute/rizeworld institute/rizeworld institute/frontend-admin/public/hero/White and Gold Simple Elegant Appreciation Certificate.jpg.jpeg';
  const outputMainHeroCertPath = 'd:/desktop/Aman/rizeworld institute/rizeworld institute/rizeworld institute/frontend-main/public/hero/White and Gold Simple Elegant Appreciation Certificate.jpg.jpeg';
  const outputMainPublicCertPath = 'd:/desktop/Aman/rizeworld institute/rizeworld institute/rizeworld institute/frontend-main/public/certificate/RizeWorld_Certificate_Punit_Sharma.jpg';
  const outputBackendUploadPath = 'd:/desktop/Aman/rizeworld institute/rizeworld institute/rizeworld institute/backend/public/uploads/RizeWorld_Certificate_Punit_Sharma.jpg';

  // Read certificate base image
  const certImage = await Jimp.read(inputCertPath);

  // Target URL: If a studentId is given, attach it dynamically, else default
  const studentId = options.studentId;
  const targetUrl = studentId 
    ? `https://institute-rize.onrender.com/download-certificate?id=${encodeURIComponent(studentId)}`
    : 'https://institute-rize.onrender.com/download-certificate';

  // Generate QR Code with standard 'M' error correction, clean margin and true black
  const qrSize = 224;
  const qrBuffer = await QRCode.toBuffer(targetUrl, {
    errorCorrectionLevel: 'M',
    type: 'png',
    width: qrSize,
    margin: 2,
    color: {
      dark: '#000000', // Pure black for 100% optical readability on all phones
      light: '#ffffff'
    }
  });

  const qrImage = await Jimp.read(qrBuffer);

  // Load fonts
  const font14Path = path.join(__dirname, 'node_modules/@jimp/plugin-print/fonts/open-sans/open-sans-14-black/open-sans-14-black.fnt');
  const font12Path = path.join(__dirname, 'node_modules/@jimp/plugin-print/fonts/open-sans/open-sans-12-black/open-sans-12-black.fnt');
  const font14 = await loadFont(font14Path);
  const font12 = await loadFont(font12Path);

  // Card dimensions
  const cardPaddingX = 20;
  const cardPaddingTop = 18;
  const cardWidth = qrSize + (cardPaddingX * 2); // 264
  const cardHeight = 280;

  const card = new Jimp({ width: cardWidth, height: cardHeight, color: 0xffffffff });

  // Border: elegant gold
  const goldColor = 0xc5a059ff; // Refined Certificate Gold

  // Outer border (2px gold)
  for (let x = 0; x < cardWidth; x++) {
    card.setPixelColor(goldColor, x, 0);
    card.setPixelColor(goldColor, x, 1);
    card.setPixelColor(goldColor, x, cardHeight - 1);
    card.setPixelColor(goldColor, x, cardHeight - 2);
  }
  for (let y = 0; y < cardHeight; y++) {
    card.setPixelColor(goldColor, 0, y);
    card.setPixelColor(goldColor, 1, y);
    card.setPixelColor(goldColor, cardWidth - 1, y);
    card.setPixelColor(goldColor, cardWidth - 2, y);
  }

  // Composite QR code onto card with clear white quiet zone
  card.composite(qrImage, cardPaddingX, cardPaddingTop);

  // Print Student ID below QR code (replacing SCAN TO VERIFY & DOWNLOAD CERTIFICATE)
  const rawId = (options.studentId || 'RW-6678').trim();
  let idText = rawId;
  if (!rawId.toUpperCase().startsWith('STUDENT ID') && !rawId.toUpperCase().startsWith('ID:')) {
    idText = `STUDENT ID: ${rawId}`;
  }

  const { measureText } = require('jimp');
  let selectedFont = font14;
  let textWidth = measureText(selectedFont, idText);
  if (textWidth > cardWidth - 16) {
    selectedFont = font12;
    textWidth = measureText(selectedFont, idText);
  }
  const textX = Math.round((cardWidth - textWidth) / 2);
  const textY = cardPaddingTop + qrSize + 12;

  card.print({
    font: selectedFont,
    x: textX,
    y: textY,
    text: idText
  });

  // Card placement on certificate (bottom-left area matching layout)
  const cardX = 275;
  const cardY = 915;

  certImage.composite(card, cardX, cardY);

  if (options.outputPath) {
    await certImage.write(options.outputPath);
    console.log('Saved custom student certificate to:', options.outputPath);
    return options.outputPath;
  }

  // 1. Save directly to COURSE CERTIFICATE.png in frontend-admin
  await certImage.write(outputCourseCertAdminPath);
  console.log('Saved directly to COURSE CERTIFICATE.png in frontend-admin:', outputCourseCertAdminPath);

  // 2. Save directly to COURSE CERTIFICATE.png in frontend-main
  const dirMainHero = path.dirname(outputCourseCertMainPath);
  if (!fs.existsSync(dirMainHero)) fs.mkdirSync(dirMainHero, { recursive: true });
  await certImage.write(outputCourseCertMainPath);
  console.log('Saved directly to COURSE CERTIFICATE.png in frontend-main:', outputCourseCertMainPath);

  // 3. Save to all existing paths for backward compatibility
  await certImage.write(outputAdminCertPath);
  await certImage.write(outputMainHeroCertPath);

  const dirMainCert = path.dirname(outputMainPublicCertPath);
  if (!fs.existsSync(dirMainCert)) fs.mkdirSync(dirMainCert, { recursive: true });
  await certImage.write(outputMainPublicCertPath);

  const dirBackendUpload = path.dirname(outputBackendUploadPath);
  if (!fs.existsSync(dirBackendUpload)) fs.mkdirSync(dirBackendUpload, { recursive: true });
  await certImage.write(outputBackendUploadPath);

  console.log('All certificate files updated successfully with QR scanner!');
}

module.exports = { stampCertificate };

if (require.main === module) {
  stampCertificate().catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}
