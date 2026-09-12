const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const { Jimp, loadFont, HorizontalAlign } = require('jimp');

async function stampCertificate() {
  const originalCertPath = 'd:/desktop/Aman/rizeworld institute/rizeworld institute/rizeworld institute/frontend-admin/public/hero/White and Gold Simple Elegant Appreciation Certificate.original.jpeg';
  const outputAdminCertPath = 'd:/desktop/Aman/rizeworld institute/rizeworld institute/rizeworld institute/frontend-admin/public/hero/White and Gold Simple Elegant Appreciation Certificate.jpg.jpeg';
  const outputMainHeroCertPath = 'd:/desktop/Aman/rizeworld institute/rizeworld institute/rizeworld institute/frontend-main/public/hero/White and Gold Simple Elegant Appreciation Certificate.jpg.jpeg';
  const outputMainPublicCertPath = 'd:/desktop/Aman/rizeworld institute/rizeworld institute/rizeworld institute/frontend-main/public/certificate/RizeWorld_Certificate_Punit_Sharma.jpg';

  // Read the original certificate
  const certImage = await Jimp.read(originalCertPath);

  // Target URL: Live Render direct download endpoint (verified 200 OK & instant attachment download)
  const targetUrl = 'https://institute-rize.onrender.com/download-certificate';

  // Generate QR Code with high resolution
  const qrSize = 205;
  const qrBuffer = await QRCode.toBuffer(targetUrl, {
    errorCorrectionLevel: 'H',
    type: 'png',
    width: qrSize,
    margin: 1,
    color: {
      dark: '#1e293b', // Deep charcoal slate
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
  const cardPaddingX = 18;
  const cardPaddingTop = 16;
  const cardWidth = qrSize + (cardPaddingX * 2); // 241
  const cardHeight = 282; // Room for QR + 2 lines of clear text + bottom padding

  const card = new Jimp({ width: cardWidth, height: cardHeight, color: 0xffffffff });

  // Border: elegant double line in gold & soft border
  const goldColor = 0xc5a059ff; // Refined Certificate Gold
  const innerGold = 0xddc48aff;

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

  // Composite QR code onto card
  card.composite(qrImage, cardPaddingX, cardPaddingTop);

  // Print text below QR code
  card.print({
    font: font16,
    x: 0,
    y: cardPaddingTop + qrSize + 10,
    text: 'SCAN TO DOWNLOAD',
    alignmentX: HorizontalAlign.CENTER,
    maxWidth: cardWidth
  });

  card.print({
    font: font12,
    x: 0,
    y: cardPaddingTop + qrSize + 32,
    text: 'VERIFIED CERTIFICATE',
    alignmentX: HorizontalAlign.CENTER,
    maxWidth: cardWidth
  });

  // Card placement on certificate:
  // x = 275 (aligned nicely with the body copy)
  // y = 920 (harmonious with the signature on the right)
  const cardX = 275;
  const cardY = 920;

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
}

stampCertificate().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
