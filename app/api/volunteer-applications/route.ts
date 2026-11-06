import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { limitByIp } from "@/lib/security"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export async function POST(req: NextRequest) {
  // 5 submissions per IP per hour
  const limited = limitByIp(req, "volunteer-apply", 5, 60 * 60 * 1000)
  if (limited) return limited

  try {
    const body = await req.json()
    const { full_name, email, phone, level_of_education, skills, preferred_courses, availability, motivation_text } = body

    if (!full_name || !email || !level_of_education || !skills || !preferred_courses || !availability || !motivation_text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const application = await prisma.volunteerApplication.create({
      data: {
        full_name,
        email,
        phone: phone || null,
        level_of_education,
        skills,
        preferred_courses,
        availability,
        motivation_text,
        status: "pending",
      },
    })

    return NextResponse.json({ success: true, id: application.id }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}