import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")

  if (!token) {
    return NextResponse.json({ valid: false })
  }

  try {
    const record = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    if (!record || record.used || record.expires_at < new Date()) {
      return NextResponse.json({ valid: false })
    }

    return NextResponse.json({ valid: true })
  } catch {
    return NextResponse.json({ valid: false })
  }
}
