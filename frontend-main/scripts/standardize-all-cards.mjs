import fs from 'fs';

const CARD_HTML = `      <div class="blog-admission-card my-8 p-6 bg-neutral-900 text-white rounded-2xl shadow-xl border border-neutral-800">
        <h4 class="text-xl font-extrabold text-white mt-0 mb-2">Connect with RizeWorld Institute Admissions</h4>
        <p class="text-blue-400 font-bold text-sm mb-1">RizeWorld Institute of AI and Digital Marketing</p>
        <p class="text-neutral-300 text-sm mb-2">
          📍 C197, Near Telco Circle, UIT Colony, Shalimar Nagar, Alwar, Rajasthan 301001
        </p>
        <p class="text-neutral-300 text-sm mb-4">
          Phone / WhatsApp: <a href="tel:+918302277092" class="text-blue-400 font-bold hover:underline">+91 8302277092</a> | Email: <a href="mailto:rizeworldinstitute@gmail.com" class="text-blue-400 hover:underline">rizeworldinstitute@gmail.com</a>
        </p>
        <a href="/contact" class="inline-block px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide transition-all shadow-md hover:scale-105">
          Book Free Demo Class &amp; Career Counseling →
        </a>
      </div>\n`;

const rawContent = fs.readFileSync('src/data/posts.ts', 'utf8');
const isCrlf = rawContent.includes('\r\n');
const content = rawContent.replace(/\r\n/g, '\n');

const slugs = [...content.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1]);

let updatedChunks = [];

for (let i = 0; i < slugs.length; i++) {
  const slug = slugs[i];
  const start = content.indexOf(`slug: "${slug}"`);
  const end = i < slugs.length - 1 ? content.indexOf(`slug: "${slugs[i+1]}"`) : content.length;
  let chunk = content.slice(start, end);

  // Check for existing cards
  // Patterns:
  // 1. <div class="my-8 p-6 bg-neutral-900 text-white rounded-2xl...</div>
  // 2. <div class="my-8 p-6 bg-linear-to-r from-blue-600...</div>
  // 3. <div class="my-6 p-5 bg-neutral-100 rounded-xl">...</div>
  const existingCardPattern = /<div class="[^"]*(?:bg-neutral-900|bg-linear-to-r from-blue-600|bg-neutral-100 rounded-xl|blog-admission-card)[^"]*"[\s\S]*?<\/div>\n?/;
  
  if (existingCardPattern.test(chunk)) {
    chunk = chunk.replace(existingCardPattern, CARD_HTML);
    console.log(`[${i+1}] ${slug}: REPLACED existing card`);
  } else {
    // Need to insert card. Check FAQ first
    const faqPattern = /(<h3>(?:Frequently Asked Questions|Quick FAQs|Questions Students Ask)[\s\S]*?<\/h3>)/i;
    if (faqPattern.test(chunk)) {
      chunk = chunk.replace(faqPattern, `${CARD_HTML}\n      $1`);
      console.log(`[${i+1}] ${slug}: INSERTED card before FAQ`);
    } else {
      // Insert at the end before closing `
      const endPattern = /(\s*`\s*\n\s*\},?)/;
      chunk = chunk.replace(endPattern, `\n\n${CARD_HTML}    \`\n  }${i < slugs.length - 1 ? ',' : ''}`);
      console.log(`[${i+1}] ${slug}: INSERTED card at end of content`);
    }
  }

  updatedChunks.push(chunk);
}

// Rebuild full file
const header = content.slice(0, content.indexOf(`slug: "${slugs[0]}"`));
let finalResult = header + updatedChunks.join('');

if (isCrlf) {
  finalResult = finalResult.replace(/\n/g, '\r\n');
}

// Verify every single post has the card exactly once
let allGood = true;
slugs.forEach((slug, i) => {
  const start = finalResult.indexOf(`slug: "${slug}"`);
  const end = i < slugs.length - 1 ? finalResult.indexOf(`slug: "${slugs[i+1]}"`) : finalResult.length;
  const chunk = finalResult.slice(start, end);
  const count = (chunk.match(/Connect with RizeWorld Institute Admissions/g) || []).length;
  if (count !== 1) {
    console.error(`ERROR: [${i+1}] ${slug} has ${count} card(s)!`);
    allGood = false;
  }
});

if (allGood) {
  fs.writeFileSync('src/data/posts.ts', finalResult, 'utf8');
  console.log('SUCCESS! All 18 posts updated with standardized card.');
} else {
  console.error('Aborting write due to validation errors.');
}
