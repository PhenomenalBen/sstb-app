import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client/edge"
import { PrismaPg } from "@prisma/adapter-pg"
import { auth } from "@/lib/auth"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id: rawId } = await params
  const id = parseInt(rawId)
  const { title, summary, content, category, emoji } = await req.json()

  try {
    const post = await prisma.newsPost.update({
      where: { id },
      data: { title, summary, content, category, emoji },
    })
    return NextResponse.json({ success: true, post })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id: rawId } = await params
  const id = parseInt(rawId)

  try {
    await prisma.newsPost.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}