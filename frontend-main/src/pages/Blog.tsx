import { useState } from "react";
import { Search, Tag, TrendingUp } from "lucide-react";
import Reveal from "../components/Reveal";

const categories = ["All", "AI & Tools", "Marketing", "Design", "SEO", "Career Tips"];

const posts = [
  {
    title: "10 AI Tools Every Marketer Must Master in 2026",
    excerpt: "From ChatGPT to Midjourney, discover the AI tools transforming digital marketing workflows.",
    category: "AI & Tools",
    readTime: "7 min read",
    date: "May 28, 2026",
    featured: true,
    img: "/images/10 AI Tools Every Marketer Must Master in 2026.jpg",
    gridImg: "/images/aii.jpg",
  },
  {
    title: "The Ultimate Guide to Meta Ads ROAS Optimization",
    excerpt: "Learn the proven strategies that top agencies use to scale profitable ad campaigns.",
    category: "Marketing",
    readTime: "10 min read",
    date: "May 22, 2026",
    featured: false,
    img: "/images/The Ultimate Guide to Meta Ads ROAS Optimization.jpg",
  },
  {
    title: "SEO in 2026: What Actually Works Now",
    excerpt: "Google's algorithm has evolved. Here's what still moves the needle for organic growth.",
    category: "SEO",
    readTime: "8 min read",
    date: "May 15, 2026",
    featured: false,
    img: "/images/SEO in 2026.jpg",
  },
  {
    title: "Breaking into Digital Marketing: A Beginner's Roadmap",
    excerpt: "No experience? No problem. Here's exactly how to start your digital marketing career.",
    category: "Career Tips",
    readTime: "6 min read",
    date: "May 10, 2026",
    featured: false,
    img: "/images/roadmap.jpg",
  },
  {
    title: "Design Principles Every Content Creator Should Know",
    excerpt: "Master the fundamentals of visual communication that make content stand out.",
    category: "Design",
    readTime: "5 min read",
    date: "May 05, 2026",
    featured: false,
    img: "/images/principle.jpg",
  },
  {
    title: "Reels vs Shorts: Which Platform Wins in 2026?",
    excerpt: "A data-backed comparison of Instagram Reels and YouTube Shorts for brand growth.",
    category: "Marketing",
    readTime: "9 min read",
    date: "Apr 28, 2026",
    featured: false,
    img: "/images/igvsyt.jpg",
  },
];

export default function Blog() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = posts.filter((p) => {
    const matchCat = filter === "All" || p.category === filter;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = posts.find((p) => p.featured);

  return (
    <main className="pt-28">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 relative">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-600 mb-5">
                <TrendingUp size={12} /> INSIGHTS & GUIDES
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-extrabold text-neutral-900 leading-none tracking-tight">
                The <span className="text-blue-600">RizeWorld</span> Blog.
              </h1>
              <p className="mt-6 text-lg text-neutral-500">
                Fresh insights on AI, marketing, design, and career growth — from our expert trainers.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Featured Post */}
      {featured && (
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal>
              <div className="relative rounded-3xl overflow-hidden shadow-luxury group cursor-pointer hover:shadow-orange transition-all duration-500">
                <div className="grid lg:grid-cols-2">
                  <div className="aspect-4/3 lg:aspect-auto overflow-hidden">
                    <img src={featured.img} alt={featured.title} className="w-full h-full object-contain object-center bg-[#121212]/40 group-hover:scale-103 transition-transform duration-700" />
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 md:p-14 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full gradient-orange text-white text-xs font-bold">FEATURED</span>
                    </div>
                    <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4 group-hover:text-[#ff6b1a] transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-neutral-400 mb-6">{featured.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-neutral-400">
                        <span className="flex items-center gap-1"><Tag size={12} /> {featured.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Search & Filter */}
      <section className="pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/60 border border-white/10 focus:border-[#ff6b1a] focus:outline-none transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    filter === c ? "gradient-orange text-white shadow-orange" : "bg-[#0a0a0a] text-neutral-300 hover:bg-white/5"
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
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <article className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:shadow-luxury hover:-translate-y-2 transition-all duration-500 cursor-pointer h-full flex flex-col">
                  <div className="aspect-16/10 overflow-hidden">
                    <img src={p.gridImg || p.img} alt={p.title} className="w-full h-full object-contain object-center bg-[#121212]/40 group-hover:scale-103 transition-transform duration-700" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest ${
                        i % 2 === 0 ? "bg-[#ff6b1a]/10 text-[#ff6b1a]" : "bg-[#10b981]/10 text-[#10b981]"
                      }`}>
                        {p.category.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-white leading-tight mb-2 group-hover:text-[#ff6b1a] transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed flex-1">{p.excerpt}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-neutral-400">No articles found matching your criteria.</div>
          )}
        </div>
      </section>
    </main>
  );
}
