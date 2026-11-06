import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { auth } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { rateLimit, serverError, tooManyRequests, validatePassword } from "@/lib/security"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userEmail = (session.user as any)?.email

  // Stop someone with a stolen session from guessing the current password.
  if (!rateLimit(`settings-password:${userEmail}`, 5, 15 * 60 * 1000)) {
    return tooManyRequests()
  }

  let current_password: unknown, new_password: unknown
  try {
    ;({ current_password, new_password } = await req.json())
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  if (!current_password || typeof current_password !== "string") {
    return NextResponse.json({ error: "Current password is required." }, { status: 400 })
  }

  const passwordError = validatePassword(new_password)
  if (passwordError) {
    return NextResponse.json({ error: passwordError }, { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: userEmail } })
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 })

    const valid = await bcrypt.compare(current_password, user.password_hash)
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 })
    }

    const hash = await bcrypt.hash(new_password as string, 12)
    await prisma.user.update({
      where: { id: user.id },
      // Bump token_version so all sessions (including other devices) are signed out.
      data: { password_hash: hash, token_version: { increment: 1 } },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return serverError("Change password error", err)
  }
}
