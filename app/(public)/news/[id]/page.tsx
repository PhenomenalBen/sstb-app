import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { notFound } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  let post = null as Awaited<ReturnType<typeof prisma.newsPost.findUnique>> | null

  try {
    post = await prisma.newsPost.findUnique({
      where: { id: parseInt(id) },
    })
  } catch (error) {
    console.error("Failed to load news post:", error)
  }

  if (!post) notFound()

  const categoryColor =
    post.category === "Announcements"
      ? "#00BCD4"
      : post.category === "Cohort Updates"
      ? "#f59e0b"
      : "#dc2626"

  return (
    <div className="w-full py-16 px-6 md:px-[5%]">
      <div className="max-w-3xl mx-auto">

        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm font-semibold mb-8 hover:underline"
          style={{ color: "#dc2626" }}
        >
          ← Back to News
        </Link>

        <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
          <div
            className="h-56 flex items-center justify-center text-8xl"
            style={{ background: `linear-gradient(135deg, ${categoryColor}22 0%, ${categoryColor}44 100%)` }}
          >
            {post.emoji}
          </div>

          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: categoryColor }}
              >
                {post.category}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(post.published_at).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            <p
              className="text-base text-gray-600 leading-relaxed mb-6 p-4 rounded-xl italic border-l-4"
              style={{ borderColor: categoryColor, backgroundColor: "#f9fafb" }}
            >
              {post.summary}
            </p>

            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
              {post.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}