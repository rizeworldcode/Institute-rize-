const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const { Jimp, loadFont, HorizontalAlign } = require('jimp');

async function stampCertificate() {
  const originalCertPath = 'd:/desktop/Aman/rizeworld institute/rizeworld institute/rizeworld institute/frontend-admin/public/hero/White and Gold Simple Elegant Appreciation Certificate.original.jpeg';
  const outputAdminCertPath = 'd:/desktop/Aman/rizeworld institute/rizeworld institute/rizeworld institute/frontend-admin/public/hero/White and Gold Simple Elegant Appreciation Certificate.jpg.jpeg';
  const outputMainHeroCertPath = 'd:/desktop/Aman/rizeworld institute/rizeworld institute/rizeworld institute/frontend-main/public/hero/White and Gold Simple Elegant Appreciation Certificate.jpg.jpeg';
  const outputMainPublicCertPath = 'd:/desktop/Aman/rizeworld institute/rizeworld institute/rizeworld institute/frontend-main/public/certificate/RizeWorld_Certificate_Punit_Sharma.jpg';
  const outputBackendUploadPath = 'd:/desktop/Aman/rizeworld institute/rizeworld institute/rizeworld institute/backend/public/uploads/RizeWorld_Certificate_Punit_Sharma.jpg';

  // Read the original certificate
  const certImage = await Jimp.read(originalCertPath);

  // Target URL: Live Render verification & download endpoint
  const targetUrl = 'https://institute-rize.onrender.com/download-certificate';

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
  const font16Path = path.join(__dirname, 'node_modules/@jimp/plugin-print/fonts/open-sans/open-sans-16-black/open-sans-16-black.fnt');
  const font12Path = path.join(__dirname, 'node_modules/@jimp/plugin-print/fonts/open-sans/open-sans-12-black/open-sans-12-black.fnt');
  const font16 = await loadFont(font16Path);
  const font12 = await loadFont(font12Path);

  // Card dimensions
  const cardPaddingX = 20;
  const cardPaddingTop = 18;
  const cardWidth = qrSize + (cardPaddingX * 2); // 264
  const cardHeight = 296;

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

  // Print text below QR code
  card.print({
    font: font16,
    x: 0,
    y: cardPaddingTop + qrSize + 8,
    text: 'SCAN TO VERIFY',
    alignmentX: HorizontalAlign.CENTER,
    maxWidth: cardWidth
  });

  card.print({
    font: font12,
    x: 0,
    y: cardPaddingTop + qrSize + 28,
    text: 'DOWNLOAD CERTIFICATE',
    alignmentX: HorizontalAlign.CENTER,
    maxWidth: cardWidth
  });

  // Card placement on certificate:
  const cardX = 275;
  const cardY = 915;

  certImage.composite(card, cardX, cardY);

  // Save to frontend-admin
  await certImage.write(outputAdminCertPath);
  console.log('Saved to frontend-admin:', outputAdminCertPath);

  // Save copy to frontend-main hero
  const dirMainHero = path.dirname(outputMainHeroCertPath);
  if (!fs.existsSync(dirMainHero)) fs.mkdirSync(dirMainHero, { recursive: true });
  await certImage.write(outputMainHeroCertPath);
  console.log('Saved to frontend-main hero:', outputMainHeroCertPath);

  // Save clean copy to frontend-main certificate download folder
  const dirMainCert = path.dirname(outputMainPublicCertPath);
  if (!fs.existsSync(dirMainCert)) fs.mkdirSync(dirMainCert, { recursive: true });
  await certImage.write(outputMainPublicCertPath);
  console.log('Saved to frontend-main certificate folder:', outputMainPublicCertPath);

  // Save copy to backend uploads
  const dirBackendUpload = path.dirname(outputBackendUploadPath);
  if (!fs.existsSync(dirBackendUpload)) fs.mkdirSync(dirBackendUpload, { recursive: true });
  await certImage.write(outputBackendUploadPath);
  console.log('Saved to backend uploads folder:', outputBackendUploadPath);
}

stampCertificate().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
