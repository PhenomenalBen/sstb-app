import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { auth } from "@/lib/auth"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { current_password, new_password } = await req.json()
  const userEmail = (session.user as any)?.email

  try {
    const user = await prisma.user.findUnique({ where: { email: userEmail } })
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 })

    const valid = await bcrypt.compare(current_password, user.password_hash)
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 })
    }

    const hash = await bcrypt.hash(new_password, 12)
    await prisma.user.update({
      where: { email: userEmail },
      data: { password_hash: hash },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}