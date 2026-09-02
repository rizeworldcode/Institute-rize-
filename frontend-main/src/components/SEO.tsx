import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string; // e.g., "/location/alwar"
  ogType?: string;
  ogImage?: string;
  ogImageAlt?: string;
  keywords?: string;
  schemas?: any[];
  noIndex?: boolean; // When true, adds noindex,nofollow robots meta tag
}

export default function SEO({
  title,
  description,
  canonicalPath = "",
  ogType = "website",
  ogImage = "https://rizeworldinstitute.in/images/rize.png",
  ogImageAlt = "RizeWorld Institute of AI & Digital Marketing",
  keywords = "",
  schemas = [],
  noIndex = false
}: SEOProps) {
  useEffect(() => {
    // 1. Title
    document.title = title;

    // 2. Robots meta (index,follow or noindex,follow)
    const ROBOTS_ID = "meta-robots";
    let robotsMeta = document.getElementById(ROBOTS_ID) as HTMLMetaElement | null;
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.id = ROBOTS_ID;
      robotsMeta.setAttribute("name", "robots");
      document.head.appendChild(robotsMeta);
    }
    if (noIndex) {
      robotsMeta.setAttribute("content", "noindex, follow");
    } else {
      robotsMeta.setAttribute("content", "index, follow");
    }

    // 3. Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", description);

    // 3. Keywords (only set if provided)
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", keywords);
    }

    // 4. Canonical Link
    const siteUrl = "https://rizeworldinstitute.in";
    const fullCanonical = `${siteUrl}${canonicalPath}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", fullCanonical);

    // 5. Open Graph Meta Tags
    const ogTags: Record<string, string> = {
      "og:title": title,
      "og:description": description,
      "og:url": fullCanonical,
      "og:type": ogType,
      "og:image": ogImage,
      "og:image:alt": ogImageAlt,
      "og:image:width": "1280",
      "og:image:height": "720",
      "og:image:type": "image/png",
      "og:locale": "en_IN",
      "og:site_name": "RizeWorld Institute",
    };

    Object.entries(ogTags).forEach(([property, value]) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (!metaTag) {
        metaTag = document.createElement("meta");
        metaTag.setAttribute("property", property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute("content", value);
    });

    // 6. Twitter / X Meta Tags
    const twitterTags: Record<string, string> = {
      "twitter:card": "summary_large_image",
      "twitter:site": "@rizeworldinst",
      "twitter:creator": "@rizeworldinst",
      "twitter:title": title,
      "twitter:description": description,
      "twitter:image": ogImage,
      "twitter:image:alt": ogImageAlt,
      "twitter:url": fullCanonical,
    };

    Object.entries(twitterTags).forEach(([name, value]) => {
      let metaTag = document.querySelector(`meta[name="${name}"]`);
      if (!metaTag) {
        metaTag = document.createElement("meta");
        metaTag.setAttribute("name", name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute("content", value);
    });

    // 7. JSON-LD Schemas
    const scriptId = "dynamic-jsonld-schemas";
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (schemas.length > 0) {
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.id = scriptId;
        scriptTag.type = "application/ld+json";
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(schemas);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Cleanup schemas on unmount/re-render
      const scriptTagToClean = document.getElementById(scriptId);
      if (scriptTagToClean) {
        scriptTagToClean.remove();
      }
      // Cleanup noindex tag on unmount
      const robotsTagToClean = document.getElementById(ROBOTS_ID);
      if (robotsTagToClean) {
        robotsTagToClean.remove();
      }
    };
  }, [title, description, canonicalPath, ogType, ogImage, ogImageAlt, keywords, schemas, noIndex]);

  return null;
}
