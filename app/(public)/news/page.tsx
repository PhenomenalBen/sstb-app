import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLinkedinIn, faFacebook, faInstagram, faXTwitter } from "@fortawesome/free-brands-svg-icons"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const categoryColor = (cat: string) => {
  if (cat === "Announcements") return { bg: "#e0f7fa", text: "#00838f", hex: "#00BCD4" }
  if (cat === "Cohort Updates") return { bg: "#fef3c7", text: "#92400e", hex: "#f59e0b" }
  return { bg: "#fef2f2", text: "#dc2626", hex: "#dc2626" }
}

export default async function NewsPage() {
  const posts = await prisma.newsPost.findMany({
    orderBy: { published_at: "desc" },
  })

  return (
    <div className="w-full">

      {/* Hero */}
      <section
        className="py-24 px-6 md:px-[5%] text-center"
        style={{ background: "linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)" }}
      >
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#00BCD4" }}>
            Stay Informed
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            News & <span style={{ color: "#dc2626" }}>Updates</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            The latest announcements, cohort news, and stories from the
            St Stephen Tech Bridge community.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16 px-6 md:px-[5%] bg-white">
        <div className="max-w-7xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">📰</div>
              <p className="text-lg font-medium">No posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => {
                const cc = categoryColor(post.category)
                return (
                  <article
                    key={post.id}
                    className="rounded-2xl overflow-hidden border-2 border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
                  >
                    <div
                      className="h-48 flex items-center justify-center text-6xl"
                      style={{ background: `linear-gradient(135deg, ${cc.hex}22 0%, ${cc.hex}44 100%)` }}
                    >
                      {post.emoji}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className="text-xs font-bold px-3 py-1 rounded-full text-white"
                          style={{ backgroundColor: cc.hex }}
                        >
                          {post.category}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(post.published_at).toLocaleDateString()}
                        </span>
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
                        style={{ color: cc.hex }}
                      >
                        Read more →
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Social Strip */}
      <section className="py-16 px-6 text-center" style={{ backgroundColor: "#1a1a2e" }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Never Miss an Update
          </h2>
          <p className="text-gray-400 mb-8 text-sm">
            Follow us on social media to stay connected with the SSTB community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: "LinkedIn", icon: faLinkedinIn, href: "#" },
              { label: "Facebook", icon: faFacebook, href: "#" },
              { label: "Instagram", icon: faInstagram, href: "#" },
              { label: "X / Twitter", icon: faXTwitter, href: "#" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: "transparent", color: "#1a1a2e", border: "2px solid #1a1a2e" }}
                title={s.label}
              >
                <FontAwesomeIcon icon={s.icon} className="text-lg" />
              </a>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}