import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { full_name, age, email, phone, level_of_education, courses_applied, motivation_text } = body

    if (!full_name || !age || !email || !level_of_education || !courses_applied || !motivation_text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const application = await prisma.application.create({
      data: {
        full_name,
        age: parseInt(age),
        email,
        phone: phone || null,
        level_of_education,
        courses_applied,
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