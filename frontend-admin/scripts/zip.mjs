import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ZipArchive } from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');
const zipFile = path.resolve(projectRoot, 'dist.zip');

if (!fs.existsSync(distDir)) {
  console.error('[Zip] Error: dist directory does not exist. Run build first.');
  process.exit(1);
}

// Remove old zip if exists
if (fs.existsSync(zipFile)) {
  try {
    fs.unlinkSync(zipFile);
  } catch (e) {}
}

console.log('[Zip] Creating deployment package dist.zip for Hostinger Admin Panel...');

const output = fs.createWriteStream(zipFile);
const archive = new ZipArchive({
  zlib: { level: 9 } // Maximum compression
});

output.on('close', () => {
  const sizeMB = (archive.pointer() / (1024 * 1024)).toFixed(2);
  console.log('\n====================================================');
  console.log(`[Zip] SUCCESS: Admin dist.zip created successfully!`);
  console.log(`[Zip] File Path: ${zipFile}`);
  console.log(`[Zip] Package Size: ${sizeMB} MB`);
  console.log('====================================================');
  console.log('HOSTINGER ADMIN DEPLOYMENT STEPS:');
  console.log('1. Open Hostinger hPanel -> File Manager.');
  console.log('2. Navigate to your admin folder / subdomain directory.');
  console.log('3. Upload "dist.zip".');
  console.log('4. Right click "dist.zip" -> Click "Extract" -> Done!');
  console.log('====================================================\n');
});

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    console.warn('[Zip] Warning:', err);
  } else {
    throw err;
  }
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);

// Add everything from dist/ at root of zip, including hidden dotfiles like .htaccess
archive.glob('**/*', {
  cwd: distDir,
  dot: true
});

archive.finalize();
