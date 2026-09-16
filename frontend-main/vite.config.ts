import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, Plugin } from "vite";
import { posts } from "./src/data/posts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function viteSeoPrerenderPlugin(): Plugin {
  return {
    name: "vite-seo-prerender-plugin",
    apply: "serve",
    transformIndexHtml(html, ctx) {
      const rawUrl = ctx.originalUrl || (ctx as any).url || ctx.path || "/";
      const cleanPath = rawUrl.split("?")[0].replace(/\/$/, "") || "/";

      // Handle Blog Post Pages
      if (cleanPath.startsWith("/blog/")) {
        const slug = cleanPath.replace("/blog/", "");
        const post = posts.find((p) => p.slug === slug);

        if (post) {
          const canonicalUrl = `https://rizeworldinstitute.in/blog/${post.slug}`;
          const postTitle = `${post.title} | RizeWorld Blog`;
          const postDescription = post.excerpt;
          const postImage = post.img.startsWith("http")
            ? post.img
            : `https://rizeworldinstitute.in${post.img}`;

          const blogSchema = JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.title,
              description: post.excerpt,
              datePublished: post.date,
              author: {
                "@type": "Organization",
                name: "RizeWorld Institute",
                url: "https://rizeworldinstitute.in",
              },
              publisher: {
                "@type": "Organization",
                name: "RizeWorld Institute",
              },
              keywords: post.keywords.join(", "),
            },
          ]);

          const metaTags = `
  <title>${postTitle}</title>
  <meta name="description" content="${postDescription.replace(/"/g, "&quot;")}" />
  <meta id="meta-robots" name="robots" content="index, follow" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${postTitle.replace(/"/g, "&quot;")}" />
  <meta property="og:description" content="${postDescription.replace(/"/g, "&quot;")}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:type" content="article" />
  <meta property="og:image" content="${postImage}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${postTitle.replace(/"/g, "&quot;")}" />
  <meta name="twitter:description" content="${postDescription.replace(/"/g, "&quot;")}" />
  <meta name="twitter:image" content="${postImage}" />
  <script id="dynamic-jsonld-schemas" type="application/ld+json">${blogSchema}</script>
`;

          // Replace title
          html = html.replace(/<title>[\s\S]*?<\/title>/, "");
          if (html.includes('<meta name="description"')) {
            html = html.replace(/<meta name="description"[^>]*>/, "");
          }
          html = html.replace("</head>", `${metaTags}\n</head>`);

          // Inject Blog Content inside #root for instant View Page Source visibility
          const innerContent = `
  <main class="pt-28 min-h-screen bg-white">
    <section class="py-12 bg-white min-h-screen">
      <div class="max-w-4xl mx-auto px-6">
        <article class="prose prose-neutral max-w-none">
          <div class="flex flex-wrap items-center gap-3 mb-4">
            <span class="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">${post.category}</span>
            <span class="text-xs text-neutral-500 font-medium">${post.readTime}</span>
            <span class="text-xs text-neutral-500 font-medium">${post.date}</span>
          </div>
          <h1 class="font-display text-3xl md:text-5xl font-extrabold text-neutral-900 leading-tight mb-6">${post.title}</h1>
          <div class="rounded-3xl overflow-hidden mb-10 shadow-sm bg-neutral-100">
            <img src="${post.img}" alt="${post.title}" class="w-full h-auto object-cover" />
          </div>
          <div class="blog-content text-neutral-700 leading-relaxed text-base space-y-6">
            ${post.content}
          </div>
        </article>
      </div>
    </section>
  </main>
`;
          html = html.replace('<div id="root"></div>', `<div id="root">${innerContent}</div>`);
          return html;
        }
      }

      // Handle other static routes if prerendered HTML exists in dist
      if (cleanPath !== "/") {
        const cleanRoute = cleanPath.startsWith("/") ? cleanPath.slice(1) : cleanPath;
        const distHtmlFile = path.resolve(__dirname, `dist/${cleanRoute}.html`);
        const distIndexFile = path.resolve(__dirname, `dist/${cleanRoute}/index.html`);
        let distHtml = "";
        if (fs.existsSync(distHtmlFile)) {
          distHtml = fs.readFileSync(distHtmlFile, "utf-8");
        } else if (fs.existsSync(distIndexFile)) {
          distHtml = fs.readFileSync(distIndexFile, "utf-8");
        }

        if (distHtml) {
          const titleMatch = distHtml.match(/<title>([\s\S]*?)<\/title>/);
          if (titleMatch && titleMatch[1]) {
            html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${titleMatch[1]}</title>`);
          }
          const canonicalMatch = distHtml.match(/<link rel="canonical"[^>]*>/);
          if (canonicalMatch && canonicalMatch[0]) {
            html = html.replace("</head>", `  ${canonicalMatch[0]}\n</head>`);
          }
        }
      }

      return html;
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSeoPrerenderPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
          if (id.includes("src/pages/")) {
            return "pages";
          }
        },
      },
    },
  },
});



