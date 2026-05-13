import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { auth } from "@/lib/auth"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export async function GET() {
  const posts = await prisma.newsPost.findMany({
    orderBy: { published_at: "desc" },
  })
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { title, summary, content, category, emoji } = await req.json()

  if (!title || !summary || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    const post = await prisma.newsPost.create({
      data: { title, summary, content, category, emoji },
    })
    return NextResponse.json({ success: true, post }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}