import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client/edge"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export async function POST(req: NextRequest) {
  const { token, password } = await req.json()

  if (!token || !password) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    )
  }

  try {
    const record = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    if (!record || record.used || record.expires_at < new Date()) {
      return NextResponse.json(
        { error: "This reset link is invalid or has expired." },
        { status: 400 }
      )
    }

    const hash = await bcrypt.hash(password, 12)

    await prisma.user.update({
      where: { email: record.email },
      data: { password_hash: hash },
    })

    // Mark token as used
    await prisma.passwordResetToken.update({
      where: { token },
      data: { used: true },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Reset password error:", err)
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
  }
}
