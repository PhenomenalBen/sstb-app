import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import NewsClient from "./NewsClient"

export const dynamic = "force-dynamic"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export default async function NewsAdminPage() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== "admin") redirect("/login")

  const posts = await prisma.newsPost.findMany({
    orderBy: { published_at: "desc" },
  })

  return <NewsClient posts={posts} />
}