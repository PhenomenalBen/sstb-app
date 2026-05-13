import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client/edge"
import { PrismaPg } from "@prisma/adapter-pg"
import { auth } from "@/lib/auth"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { name, email } = await req.json()
  const userEmail = (session.user as any)?.email

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing && existing.email !== userEmail) {
      return NextResponse.json({ error: "Email already in use." }, { status: 400 })
    }

    await prisma.user.update({
      where: { email: userEmail },
      data: { name, email },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}