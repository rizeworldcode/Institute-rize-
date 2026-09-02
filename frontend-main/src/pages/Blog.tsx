import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Tag, TrendingUp, Clock, CornerDownRight } from "lucide-react";
import Reveal from "../components/Reveal";
import SEO from "../components/SEO";
import { posts } from "../data/posts";

const categories = ["All", "AI & Tools", "Marketing", "Design", "SEO", "Career Tips"];

export default function Blog() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const orderedPosts = [...posts].reverse();

  const filtered = orderedPosts.filter((p) => {
    const matchCat = filter === "All" || p.category === filter;
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = orderedPosts.find((p) => p.featured);

  const blogSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "RizeWorld Institute Blog",
      description:
        "Expert insights, tutorials, and tips on SEO, AI tools, marketing, and web development.",
      publisher: {
        "@type": "Organization",
        name: "RizeWorld Institute",
      },
    },
  ];

  return (
    <main className="pt-28 min-h-screen bg-neutral-50">
      <SEO
        title="Latest AI, Marketing & Design Blogs | RizeWorld Institute"
        description="Stay ahead of the curve with expert insights, growth hacks, performance marketing tips, and AI tools tutorials from RizeWorld."
        canonicalPath="/blog"
        schemas={blogSchema}
      />

      {/* Hero */}
      <section className="relative py-16 overflow-hidden bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 relative">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-600 mb-5">
                <TrendingUp size={12} /> INSIGHTS &amp; GUIDES
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-extrabold text-neutral-900 leading-tight">
                The <span className="text-blue-600 font-extrabold">RizeWorld</span> Blog
              </h1>
              <p className="mt-6 text-lg text-neutral-600 font-medium">
                High-quality guides on SEO, AI tools, performance marketing, and digital education.
                Crafting career-ready skills in India.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Featured Post */}
      {featured && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal>
              <Link
                to={`/blog/${featured.slug}`}
                className="relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-neutral-200 group cursor-pointer transition-all duration-500 block"
              >
                <div className="grid lg:grid-cols-2">
                  <div className="aspect-[3/2] lg:aspect-auto overflow-hidden bg-neutral-100 relative">
                    <img
                      src={featured.img}
                      alt={featured.title}
                      className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="bg-neutral-900 p-8 md:p-12 flex flex-col justify-center text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-bold">
                        FEATURED ARTICLE
                      </span>
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl font-extrabold leading-tight mb-4 group-hover:text-orange-400 transition-colors">
                      {featured.title}
                    </h2>
                    <p className="mb-6 text-neutral-300 text-sm leading-relaxed">{featured.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-neutral-400">
                        <span className="flex items-center gap-1 font-semibold">
                          <Tag size={12} /> {featured.category}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {featured.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* Search & Filter */}
      <section className="py-8 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white border border-neutral-200 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center shadow-xs">
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search educational guides..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-850 focus:border-blue-600 focus:outline-none transition-colors text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    filter === c
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="pb-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <Link
                  to={`/blog/${p.slug}`}
                  className="group bg-white border border-neutral-200 rounded-4xl p-6 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-550 h-full flex flex-col block"
                >
                  <div className="w-full aspect-[3/2] rounded-4xl overflow-hidden mb-5">
                    <img src={p.gridImg || p.img} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200/60 text-[10px] font-bold text-neutral-600 mb-4 self-start">
                      <Tag size={10} className="text-neutral-500" /> {p.category}
                    </span>
                    <h3 className="font-display text-lg font-bold text-neutral-900 leading-snug mb-3 group-hover:text-blue-600 transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed mb-6">{p.excerpt}</p>
                    <div className="mt-auto pt-5 border-t border-neutral-100 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[11px] text-neutral-450 font-bold">
                        <Clock size={11} /> {p.readTime}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-neutral-200 text-[11px] font-bold text-neutral-700 group-hover:bg-neutral-900 group-hover:text-white group-hover:border-neutral-900 transition-all duration-300">
                        <CornerDownRight size={11} className="text-neutral-500 group-hover:text-white" /> Analyse Guide
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-neutral-500 font-medium">
              No articles found matching your criteria.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
