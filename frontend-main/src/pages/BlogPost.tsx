import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Tag, Clock, Calendar, ArrowRight, Award, ArrowLeft, CornerDownRight } from "lucide-react";
import SEO from "../components/SEO";
import { posts } from "../data/posts";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const post = posts.find((p) => p.slug === slug);

  useEffect(() => {
    if (!post) {
      navigate("/blog", { replace: true });
    }
  }, [post, navigate]);

  if (!post) return null;

  const blogSchema = [
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
  ];

  return (
    <main className="pt-28 min-h-screen bg-white">
      <SEO
        title={`${post.title} | RizeWorld Blog`}
        description={post.excerpt}
        canonicalPath={`/blog/${post.slug}`}
        schemas={blogSchema}
      />

      <section className="py-12 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back button */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-all font-bold text-xs mb-8"
          >
            <ArrowLeft size={14} /> Back to Blog List
          </Link>

          <article className="prose prose-neutral max-w-none">
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Tag size={10} /> {post.category}
              </span>
              <span className="text-xs text-neutral-500 font-medium flex items-center gap-1">
                <Clock size={12} /> {post.readTime}
              </span>
              <span className="text-xs text-neutral-500 font-medium flex items-center gap-1">
                <Calendar size={12} /> {post.date}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl md:text-5xl font-extrabold text-neutral-900 leading-tight mb-6">
              {post.title}
            </h1>

            {/* Hero image */}
            <div className="rounded-3xl overflow-hidden mb-10 shadow-sm bg-neutral-100">
              <img
                src={post.img}
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Blog content */}
            <div
              className="blog-content text-neutral-700 leading-relaxed text-base space-y-6"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* CTA */}
          <div className="mt-16 bg-neutral-900 text-white rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-lg border border-white/5">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-xs font-bold text-blue-300 mb-4">
                  <Award size={12} /> RIZEWORLD ACADEMY
                </span>
                <h3 className="font-display text-2xl font-extrabold mb-2 text-white">
                  Master In-Demand Digital Skills
                </h3>
                <p className="text-sm text-neutral-400 max-w-lg">
                  Ready to build real expertise? Enroll in our live project training programs with complete placement support in Alwar, Rajasthan.
                </p>
              </div>
              <Link
                to="/contact"
                className="px-6 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all flex items-center gap-2 shrink-0 shadow-md hover:scale-105"
              >
                Book Free Demo Class <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Internal links */}
          <div className="mt-12 border-t border-neutral-200 pt-8 text-center">
            <h4 className="font-display font-bold text-neutral-900 mb-4">Explore More Training Programs</h4>
            <div className="flex flex-wrap justify-center gap-3 text-xs font-semibold text-neutral-500">
              <Link to="/seo" className="hover:text-blue-600">SEO Course</Link>
              <span>•</span>
              <Link to="/social-media-marketing" className="hover:text-blue-600">Social Media Marketing</Link>
              <span>•</span>
              <Link to="/performance-marketing" className="hover:text-blue-600">Performance Marketing</Link>
              <span>•</span>
              <Link to="/website-development" className="hover:text-blue-600">Website Development</Link>
              <span>•</span>
              <Link to="/graphic-design" className="hover:text-blue-600">Graphic Design</Link>
              <span>•</span>
              <Link to="/video-editing" className="hover:text-blue-600">Video Editing</Link>
              <span>•</span>
              <Link to="/ai-digital-marketing" className="hover:text-blue-600">AI Digital Marketing</Link>
            </div>
          </div>

          {/* Related posts */}
          <div className="mt-14">
            <h4 className="font-display font-bold text-neutral-900 mb-6 text-xl">More Articles</h4>
            <div className="grid md:grid-cols-2 gap-6">
              {[...posts]
                .reverse()
                .filter((p) => p.slug !== post.slug)
                .slice(0, 4)
                .map((p) => (
                  <Link
                    key={p.slug}
                    to={`/blog/${p.slug}`}
                    className="group flex gap-4 items-start p-4 rounded-2xl border border-neutral-200 hover:border-blue-200 hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-100">
                      <img
                        src={p.gridImg || p.img}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{p.category}</span>
                      <p className="text-sm font-semibold text-neutral-800 leading-snug mt-0.5 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {p.title}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[10px] text-neutral-400 mt-1">
                        <Clock size={9} /> {p.readTime}
                      </span>
                    </div>
                    <CornerDownRight size={14} className="text-neutral-300 group-hover:text-blue-500 transition-colors mt-1 flex-shrink-0" />
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
