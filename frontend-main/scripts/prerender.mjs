import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import esbuild from 'esbuild';
import sirv from 'sirv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('[Prerender] Error: dist/index.html not found! Run vite build first.');
  process.exit(1);
}

const cleanIndexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Helper to escape HTML attributes
function escapeAttr(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// 1. Load blog posts from src/data/posts.ts using esbuild
const postsFilePath = path.resolve(__dirname, '../src/data/posts.ts');
let posts = [];
try {
  const res = esbuild.buildSync({
    entryPoints: [postsFilePath],
    write: false,
    format: 'cjs',
    target: 'es2020'
  });
  const m = { exports: {} };
  const runModule = new Function('module', 'exports', res.outputFiles[0].text);
  runModule(m, m.exports);
  posts = m.exports.posts || [];
  console.log(`[Prerender] Successfully extracted ${posts.length} blog posts from posts.ts`);
} catch (err) {
  console.error('[Prerender] Failed to parse posts.ts with esbuild:', err);
}

// 2. Prerender all blog posts statically (SSR / View Page Source ready)
let blogCount = 0;
for (const post of posts) {
  const canonicalUrl = `https://rizeworldinstitute.in/blog/${post.slug}`;
  const postTitle = `${post.title} | RizeWorld Blog`;
  const postDescription = post.excerpt;
  const postImage = post.img.startsWith('http')
    ? post.img
    : `https://rizeworldinstitute.in${post.img}`;

  const blogSchema = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.date,
      "author": {
        "@type": "Organization",
        "name": "RizeWorld Institute",
        "url": "https://rizeworldinstitute.in"
      },
      "publisher": {
        "@type": "Organization",
        "name": "RizeWorld Institute"
      },
      "keywords": post.keywords ? post.keywords.join(", ") : ""
    }
  ]);

  const metaTags = `
  <title>${escapeAttr(postTitle)}</title>
  <meta name="description" content="${escapeAttr(postDescription)}" />
  <meta id="meta-robots" name="robots" content="index, follow" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${escapeAttr(postTitle)}" />
  <meta property="og:description" content="${escapeAttr(postDescription)}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:type" content="article" />
  <meta property="og:image" content="${postImage}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeAttr(postTitle)}" />
  <meta name="twitter:description" content="${escapeAttr(postDescription)}" />
  <meta name="twitter:image" content="${postImage}" />
  <script id="dynamic-jsonld-schemas" type="application/ld+json">${blogSchema}</script>
`;

  let postHtml = cleanIndexHtml;
  postHtml = postHtml.replace(/<title>[\s\S]*?<\/title>/, '');
  if (postHtml.includes('<meta name="description"')) {
    postHtml = postHtml.replace(/<meta name="description"[^>]*>/, '');
  }
  postHtml = postHtml.replace('</head>', `${metaTags}\n</head>`);

  const innerContent = `
  <main class="pt-28 min-h-screen bg-white">
    <section class="py-12 bg-white min-h-screen">
      <div class="max-w-4xl mx-auto px-6">
        <article class="prose prose-neutral max-w-none">
          <div class="flex flex-wrap items-center gap-3 mb-4">
            <span class="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">${escapeAttr(post.category)}</span>
            <span class="text-xs text-neutral-500 font-medium">${escapeAttr(post.readTime)}</span>
            <span class="text-xs text-neutral-500 font-medium">${escapeAttr(post.date)}</span>
          </div>
          <h1 class="font-display text-3xl md:text-5xl font-extrabold text-neutral-900 leading-tight mb-6">${escapeAttr(post.title)}</h1>
          <div class="rounded-3xl overflow-hidden mb-10 shadow-sm bg-neutral-100">
            <img src="${post.img}" alt="${escapeAttr(post.title)}" class="w-full h-auto object-cover" />
          </div>
          <div class="blog-content text-neutral-700 leading-relaxed text-base space-y-6">
            ${post.content}
          </div>
        </article>
      </div>
    </section>
  </main>
`;

  postHtml = postHtml.replace('<div id="root"></div>', `<div id="root">${innerContent}</div>`);

  // Write flat file: dist/blog/<slug>.html
  const flatFile = path.join(distDir, 'blog', `${post.slug}.html`);
  fs.mkdirSync(path.dirname(flatFile), { recursive: true });
  fs.writeFileSync(flatFile, postHtml, 'utf8');

  // Write directory index file: dist/blog/<slug>/index.html
  const dirIndexFile = path.join(distDir, 'blog', post.slug, 'index.html');
  fs.mkdirSync(path.dirname(dirIndexFile), { recursive: true });
  fs.writeFileSync(dirIndexFile, postHtml, 'utf8');

  blogCount++;
}
console.log(`[Prerender] Statically generated ${blogCount} blog HTML files with full SEO content!`);

// 3. Known static pages metadata for SSR static shells
const staticPagesMeta = [
  {
    route: '/courses',
    title: 'Best Digital Marketing Course in Alwar & Rajasthan | RizeWorld Institute',
    desc: 'Explore career-ready digital marketing courses in Alwar. 100% practical training in SEO, Social Media, Performance Marketing, Graphic Design, Web Development & AI tools.'
  },
  {
    route: '/master-course',
    title: 'AI & Digital Marketing Master Course in Alwar | 4 Months + 2 Months Internship - RizeWorld',
    desc: 'Join the most advanced AI & Digital Marketing Master Course in Alwar, Rajasthan. 16 weeks practical course + 2 months free agency internship with placement support.'
  },
  {
    route: '/about',
    title: 'About RizeWorld Institute | Our Story, Mission, & Vision',
    desc: 'Learn about RizeWorld Institute of AI & Digital Marketing in Alwar, Rajasthan. Discover our mission, practical training philosophy, expert trainers, and career support.'
  },
  {
    route: '/contact',
    title: 'Course Admission Enquiry | Contact RizeWorld Institute',
    desc: 'Contact RizeWorld Institute in Alwar, Rajasthan. Get in touch for course admissions, free counselling, campus visits, or general queries.'
  },
  {
    route: '/blog',
    title: 'Latest AI, Marketing & Design Blogs | RizeWorld Institute',
    desc: 'Stay ahead of the curve with expert insights, growth hacks, performance marketing tips, and AI tools tutorials from RizeWorld.'
  },
  {
    route: '/hire-from-us',
    title: 'Hire Certified Digital Marketing Talent | RizeWorld Institute',
    desc: 'Hire skilled, job-ready digital marketers trained on live projects and modern AI workflows in Alwar, Rajasthan.'
  },
  {
    route: '/location/alwar',
    title: 'Best Digital Marketing Institute in Alwar | Digital Marketing Coaching',
    desc: 'Join the premier digital marketing institute in Alwar. Practical training in SEO, ads, website design, and AI marketing tools.'
  },
  {
    route: '/seo',
    title: 'Best SEO Course in Alwar | SEO Training Institute in Rajasthan',
    desc: 'Master search engine optimization with hands-on live project training in Alwar. Learn technical SEO, keyword research, link building, and rank on Google.'
  },
  {
    route: '/social-media-marketing',
    title: 'Social Media Marketing Course in Alwar | SMO Institute',
    desc: 'Learn Instagram marketing, content creation, organic reach, paid ads, and brand management with hands-on projects.'
  },
  {
    route: '/performance-marketing',
    title: 'Best Performance Marketing Course in Alwar | Google & Meta Ads',
    desc: 'Learn high-ROI paid ads on Google Ads, Meta Ads, and PPC funnels with live ad budget management.'
  },
  {
    route: '/website-development',
    title: 'Website Development Course in Alwar | Web Designing Institute',
    desc: 'Learn responsive web design, WordPress, landing pages, and modern frontend development with zero coding required.'
  },
  {
    route: '/graphic-design',
    title: 'Best Graphic Design Course in Alwar | Graphic Design Institute in Rajasthan',
    desc: 'Learn Photoshop, Illustrator, visual branding, and professional creative design in Alwar.'
  },
  {
    route: '/video-editing',
    title: 'Best Video Editing Course in Alwar | Video Editing Institute',
    desc: 'Master Premiere Pro, After Effects, Reels editing, and video content production.'
  },
  {
    route: '/ai-digital-marketing',
    title: 'AI Digital Marketing Agency in Alwar & Rajasthan | AI Marketing Services - RizeWorld',
    desc: 'Harness cutting-edge AI tools like ChatGPT, Gemini, and Claude for digital marketing, SEO, and content creation.'
  },
  {
    route: '/privacy',
    title: 'Privacy Policy | RizeWorld Institute',
    desc: 'Read the privacy policy of RizeWorld Institute of AI & Digital Marketing.'
  },
  {
    route: '/terms',
    title: 'Terms of Service | RizeWorld Institute',
    desc: 'Read the terms and conditions for RizeWorld Institute.'
  },
  {
    route: '/certificate',
    title: 'Verify & Download Certificate | RizeWorld Institute',
    desc: 'Verify authentic digital marketing and course certificates issued by RizeWorld Institute.'
  },
  {
    route: '/trainers',
    title: 'Our Expert Trainers | RizeWorld Institute',
    desc: 'Meet industry mentors and experienced instructors at RizeWorld Institute of AI & Digital Marketing.'
  }
];

for (const page of staticPagesMeta) {
  const cleanRoute = page.route.slice(1);
  const canonicalUrl = `https://rizeworldinstitute.in${page.route}`;
  const metaTags = `
  <title>${escapeAttr(page.title)}</title>
  <meta name="description" content="${escapeAttr(page.desc)}" />
  <meta id="meta-robots" name="robots" content="index, follow" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${escapeAttr(page.title)}" />
  <meta property="og:description" content="${escapeAttr(page.desc)}" />
  <meta property="og:url" content="${canonicalUrl}" />
`;

  let pageHtml = cleanIndexHtml;
  pageHtml = pageHtml.replace(/<title>[\s\S]*?<\/title>/, '');
  if (pageHtml.includes('<meta name="description"')) {
    pageHtml = pageHtml.replace(/<meta name="description"[^>]*>/, '');
  }
  pageHtml = pageHtml.replace('</head>', `${metaTags}\n</head>`);

  // Flat file
  const flatFile = path.join(distDir, `${cleanRoute}.html`);
  fs.mkdirSync(path.dirname(flatFile), { recursive: true });
  fs.writeFileSync(flatFile, pageHtml, 'utf8');

  // Dir index file
  const dirIndexFile = path.join(distDir, cleanRoute, 'index.html');
  fs.mkdirSync(path.dirname(dirIndexFile), { recursive: true });
  fs.writeFileSync(dirIndexFile, pageHtml, 'utf8');
}
console.log(`[Prerender] Statically generated ${staticPagesMeta.length} static page HTML shells!`);

// 4. Try optional Puppeteer rendering if available
try {
  const puppeteerMod = await import('puppeteer');
  const puppeteer = puppeteerMod.default;
  // If puppeteer is available and can launch, run preview server
  const PORT = 4173;
  const serve = sirv(distDir, { single: false, dev: false });
  const server = http.createServer((req, res) => {
    serve(req, res);
  });

  server.listen(PORT, async () => {
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      console.log('[Prerender] Puppeteer browser launched for full hydration capture');
      // Prerender root index.html
      const p = await browser.newPage();
      await p.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await p.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
      const rootHtml = await p.content();
      fs.writeFileSync(path.join(distDir, 'index.html'), rootHtml, 'utf8');
      console.log('[Prerender] Root index.html fully rendered with Puppeteer');
      await browser.close();
    } catch (e) {
      console.log('[Prerender] Puppeteer runtime skipped (using static SSG fallbacks):', e.message);
    } finally {
      server.close();
      console.log('[Prerender] Finished all prerendering successfully!');
      process.exit(0);
    }
  });
} catch (e) {
  console.log('[Prerender] Puppeteer not invoked, SSG complete.');
  process.exit(0);
}
