import Link from "next/link"

// Placeholder posts — these will come from the database once admin dashboard is built
const posts = [
  {
    id: 1,
    title: "First Cohort Completes 6-Week Bootcamp",
    date: "March 15, 2025",
    category: "Cohort Updates",
    summary:
      "We are proud to announce the successful completion of our first cohort. 12 students graduated with certificates in Computer Literacy, English, and Mathematics.",
    emoji: "🎓",
    color: "#dc2626",
  },
  {
    id: 2,
    title: "SSTB Launches Web Development Services",
    date: "April 2, 2025",
    category: "Announcements",
    summary:
      "St Stephen Tech Bridge now offers affordable web development services to NGOs, schools, and small businesses. Revenue goes directly towards subsidising student fees.",
    emoji: "🌐",
    color: "#00BCD4",
  },
  {
    id: 3,
    title: "Applications Open for Cohort 2",
    date: "April 20, 2025",
    category: "Announcements",
    summary:
      "We are now accepting applications for our second cohort. The program runs for 6 weeks and covers Computer Literacy, Functional English, and Foundational Mathematics.",
    emoji: "📢",
    color: "#1a1a1a",
  },
  {
    id: 4,
    title: "New Volunteer Joins the Team",
    date: "May 1, 2025",
    category: "Latest News",
    summary:
      "We welcome a new finance volunteer to the SSTB team. Their expertise will help us manage our growing operations and ensure financial transparency.",
    emoji: "🤝",
    color: "#dc2626",
  },
  {
    id: 5,
    title: "Partnership Discussions with Local NGO",
    date: "May 10, 2025",
    category: "Latest News",
    summary:
      "SSTB is in active discussions with a local NGO to expand our reach and provide subsidised training to more displaced youth in the region.",
    emoji: "🌍",
    color: "#00BCD4",
  },
  {
    id: 6,
    title: "Student Spotlight: From Zero to Certified",
    date: "May 20, 2025",
    category: "Cohort Updates",
    summary:
      "Meet Grace — a 22-year-old from South Sudan who had never touched a computer before joining SSTB. Six weeks later, she graduated with top marks in all three courses.",
    emoji: "⭐",
    color: "#1a1a1a",
  },
]

const categories = ["All", "Latest News", "Announcements", "Cohort Updates"]

export default function NewsPage() {
  return (
    <div className="w-full">

      {/* ── PAGE HERO ────────────────────────────────────────────────────── */}
      <section
        className="py-24 px-6 md:px-[5%] text-center"
        style={{ background: "linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)" }}
      >
        <div className="max-w-3xl mx-auto">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "#00BCD4" }}
          >
            Stay Informed
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            News &{" "}
            <span style={{ color: "#dc2626" }}>Updates</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            The latest announcements, cohort news, and stories from the
            St Stephen Tech Bridge community.
          </p>
        </div>
      </section>

      {/* ── CATEGORY TABS ────────────────────────────────────────────────── */}
      <section id="announcements" className="py-6 px-6 md:px-[5%] bg-white border-b border-gray-100 scroll-mt-20">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-3">
          {categories.map((cat, i) => (
            <span
              key={cat}
              className="px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200"
              style={
                i === 0
                  ? { backgroundColor: "#dc2626", color: "#fff" }
                  : { backgroundColor: "#f3f4f6", color: "#374151" }
              }
            >
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* ── NEWS GRID ────────────────────────────────────────────────────── */}
      <section id="cohorts" className="py-16 px-6 md:px-[5%] bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl overflow-hidden border-2 border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
              >
                {/* Image / Emoji placeholder */}
                <div
                  className="h-48 flex items-center justify-center text-6xl"
                  style={{
                    background: `linear-gradient(135deg, ${post.color}22 0%, ${post.color}44 100%)`,
                  }}
                >
                  {post.emoji}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Category + Date */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full text-white"
                      style={{ backgroundColor: post.color }}
                    >
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-400">{post.date}</span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {post.summary}
                  </p>

                  <Link
                    href={`/news/${post.id}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold transition-all duration-200 hover:gap-3"
                    style={{ color: post.color }}
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER STRIP ─────────────────────────────────────────────── */}
      <section
        className="py-16 px-6 text-center"
        style={{ backgroundColor: "#1a1a2e" }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Never Miss an Update
          </h2>
          <p className="text-gray-400 mb-8 text-sm">
            Follow us on social media or get in touch to stay connected with
            the SSTB community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: "LinkedIn", icon: "💼", href: "#" },
              { label: "Facebook", icon: "📘", href: "#" },
              { label: "Instagram", icon: "📸", href: "#" },
              { label: "X / Twitter", icon: "🐦", href: "#" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-medium text-white border-gray-600 hover:border-white transition-all duration-200"
              >
                <span>{s.icon}</span>
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}