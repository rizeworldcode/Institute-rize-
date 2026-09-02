import "./globals.css";

const siteUrl = "https://www.aetheris.studio"; // Update to the actual deployed domain

// ============================================================
// NEXT.JS METADATA API — COMPLETE ENTERPRISE IMPLEMENTATION
// ============================================================
export const metadata = {
  metadataBase: new URL(siteUrl),

  // ── Core Identity ──────────────────────────────────────────
  applicationName: "Aetheris Studio",
  title: {
    default: "Aetheris // Next-Generation Autonomous AI Marketing Agency",
    template: "%s | Aetheris Studio",
  },
  description:
    "Aetheris is an ultra-premium futuristic digital marketing agency powered by specialized autonomous systems. The infinite loop of smarter growth.",
  keywords: [
    "AI Marketing Agency",
    "Autonomous Digital Marketing",
    "WebGL 3D Agency",
    "Futuristic Agency",
    "Premium Design Studio",
    "Growth Hacking",
    "AI Advertising",
    "Next-Gen Marketing",
  ],

  // ── Authorship & Publisher ──────────────────────────────────
  authors: [{ name: "Aetheris Studio", url: siteUrl }],
  creator: "Aetheris Studio",
  publisher: "Aetheris Studio",
  generator: "Next.js",

  // ── Crawl Policy ───────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  referrer: "strict-origin-when-cross-origin",
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },

  // ── Canonical & Alternates ──────────────────────────────────
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-US": siteUrl,
    },
  },

  // ── Open Graph ─────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Aetheris Studio",
    title: "Aetheris // Next-Generation Autonomous AI Marketing Agency",
    description:
      "Aetheris is an ultra-premium futuristic digital marketing agency powered by specialized autonomous systems. The infinite loop of smarter growth.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aetheris — AI Marketing Agency",
        type: "image/png",
      },
    ],
  },

  // ── Twitter / X ─────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    site: "@aetheris_studio",
    creator: "@aetheris_studio",
    title: "Aetheris // Next-Generation Autonomous AI Marketing Agency",
    description:
      "Ultra-premium digital marketing agency powered by specialized autonomous AI systems.",
    images: {
      url: "/og-image.png",
      alt: "Aetheris — AI Marketing Agency",
    },
  },

  // ── Icons & PWA ────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",

  // ── Theme ──────────────────────────────────────────────────
  category: "technology",
};

// Separate viewport export (required in Next.js 14+)
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#000000" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

// ============================================================
// ROOT LAYOUT
// ============================================================
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <head>
        {/* Organization JSON-LD for Knowledge Graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": `${siteUrl}/#organization`,
              name: "Aetheris Studio",
              url: siteUrl,
              description:
                "Ultra-premium futuristic digital marketing agency powered by specialized autonomous AI systems.",
              logo: {
                "@type": "ImageObject",
                url: `${siteUrl}/og-image.png`,
              },
              sameAs: [],
            }),
          }}
        />
        {/* WebSite JSON-LD with SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${siteUrl}/#website`,
              name: "Aetheris Studio",
              url: siteUrl,
              inLanguage: "en-US",
              description:
                "Next-Generation Autonomous AI Marketing Agency. The infinite loop of smarter growth.",
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-black text-white">
        {children}
      </body>
    </html>
  );
}
