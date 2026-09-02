import { Link } from "react-router-dom";

interface LinkItem {
  label: string;
  path: string;
}

const links: LinkItem[] = [
  { label: "Home", path: "/" },
  { label: "Digital Marketing Course", path: "/courses" },
  { label: "SEO", path: "/seo" },
  { label: "Social Media Marketing", path: "/social-media-marketing" },
  { label: "Performance Marketing", path: "/performance-marketing" },
  { label: "Website Development", path: "/website-development" },
  { label: "Graphic Design", path: "/graphic-design" },
  { label: "Video Editing", path: "/video-editing" },
  { label: "AI Digital Marketing", path: "/ai-digital-marketing" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "Hire From Us", path: "/hire-from-us" },
  { label: "Alwar Location", path: "/location/alwar" }
];

interface ExploreLinksProps {
  activePath: string;
}

export default function ExploreLinks({ activePath }: ExploreLinksProps) {
  return (
    <section className="py-16 bg-neutral-950 text-white border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h4 className="font-display font-bold mb-8 text-neutral-400 text-xs tracking-widest uppercase">
          Explore Additional Programs at RizeWorld Institute
        </h4>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2.5 max-w-5xl mx-auto">
          {links.map((link, idx) => {
            const isActive = activePath === link.path;
            const isLast = idx === links.length - 1;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2.5 rounded-xl sm:rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-300 border text-center flex items-center justify-center ${
                  isLast ? "col-span-2" : ""
                } ${
                  isActive
                    ? "bg-blue-600 border-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)] scale-102"
                    : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:border-neutral-700 hover:text-white hover:scale-102"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
