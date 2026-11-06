import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"
import { limitByIp, serverError, validatePassword } from "@/lib/security"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export async function POST(req: NextRequest) {
  // 10 attempts per IP per 15 minutes
  const limited = limitByIp(req, "reset-password", 10, 15 * 60 * 1000)
  if (limited) return limited

  let token: unknown, password: unknown
  try {
    ;({ token, password } = await req.json())
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  if (!token || typeof token !== "string" || !password) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 })
  }

  const passwordError = validatePassword(password)
  if (passwordError) {
    return NextResponse.json({ error: passwordError }, { status: 400 })
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

    const hash = await bcrypt.hash(password as string, 12)

    await prisma.$transaction([
      // New password + bump token_version so every existing session is signed out.
      prisma.user.update({
        where: { email: record.email },
        data: { password_hash: hash, token_version: { increment: 1 } },
      }),
      // Mark token as used
      prisma.passwordResetToken.update({
        where: { token },
        data: { used: true },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    return serverError("Reset password error", err)
  }
}
