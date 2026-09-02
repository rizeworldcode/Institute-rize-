import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import sirv from 'sirv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

// 1. Static routes
const staticRoutes = [
  '/',
  '/courses',
  '/master-course',
  '/hire-from-us',
  '/about',
  '/blog',
  '/contact',
  '/location',
  '/location/alwar',
  '/seo',
  '/social-media-marketing',
  '/performance-marketing',
  '/website-development',
  '/graphic-design',
  '/video-editing',
  '/ai-digital-marketing',
  '/privacy',
  '/terms',
  '/certificate',
  '/trainers'
];

// 2. Extract blog slugs dynamically from src/data/posts.ts
const postsFilePath = path.resolve(__dirname, '../src/data/posts.ts');
const postsContent = fs.readFileSync(postsFilePath, 'utf8');
const slugMatches = [...postsContent.matchAll(/slug:\s*["']([^"']+)["']/g)];
const blogRoutes = slugMatches.map(m => `/blog/${m[1]}`);

const allRoutes = [...new Set([...staticRoutes, ...blogRoutes])];

console.log(`[Prerender] Total ${allRoutes.length} routes to prerender:`, allRoutes);

function getSystemBrowserPath() {
  const possiblePaths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium'
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

// 3. Start local server serving dist/
const PORT = 4173;
const cleanIndexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
const serve = sirv(distDir, { single: false, dev: false });
const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  if (!path.extname(urlPath)) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.end(cleanIndexHtml);
  }
  serve(req, res);
});

server.listen(PORT, async () => {
  console.log(`[Prerender] Preview server running on http://localhost:${PORT}`);
  
  let browser;
  try {
    const launchOptions = {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    };

    try {
      browser = await puppeteer.launch(launchOptions);
    } catch (launchErr) {
      console.warn('[Prerender] Standard launch failed, trying system Chrome/Edge...', launchErr.message);
      const systemPath = getSystemBrowserPath();
      if (systemPath) {
        console.log(`[Prerender] Using system browser executable at: ${systemPath}`);
        browser = await puppeteer.launch({ ...launchOptions, executablePath: systemPath });
      } else {
        throw launchErr;
      }
    }

    const page = await browser.newPage();
    page.on('console', msg => console.log('[Browser Console]', msg.type(), msg.text()));
    page.on('pageerror', err => console.error('[Browser Error]', err));
    
    for (const route of allRoutes) {
      const url = `http://localhost:${PORT}${route}`;
      console.log(`[Prerender] Rendering ${route}...`);
      
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        // Wait for React app to render inside #root
        try {
          await page.waitForSelector('#root > *', { timeout: 10000 });
        } catch (e) {
          console.warn(`[Prerender] Warning: #root > * selector timed out for ${route}`);
        }
        
        // Give animations and React suspense extra time to stabilize
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1500)));
        
        const html = await page.content();
        
        const routePath = route === '/' ? 'index.html' : `${route.startsWith('/') ? route.slice(1) : route}/index.html`;
        const targetFile = path.join(distDir, routePath);
        
        fs.mkdirSync(path.dirname(targetFile), { recursive: true });
        fs.writeFileSync(targetFile, html, 'utf8');
        console.log(`[Prerender] Saved ${targetFile}`);
      } catch (err) {
        console.error(`[Prerender] Error rendering ${route}:`, err.message);
      }
    }

    console.log('[Prerender] Successfully prerendered all routes!');
  } catch (err) {
    console.error('[Prerender] Fatal error during prerendering:', err);
  } finally {
    if (browser) await browser.close();
    server.close();
    process.exit(0);
  }
});
