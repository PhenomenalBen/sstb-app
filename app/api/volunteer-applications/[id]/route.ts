import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { auth } from "@/lib/auth"
import bcrypt from "bcryptjs"

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
  const id = parseInt(rawId, 10)
  const { status, position, createAccount, volunteerType } = await req.json()

  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid application id" }, { status: 400 })
  }

  if (!["accepted", "rejected", "pending"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  try {
    const application = await prisma.volunteerApplication.update({
      where: { id },
      data: { status },
    })

    if (status === "accepted") {
      const existing = await prisma.volunteer.findUnique({
        where: { application_id: id },
      })

      if (!existing) {
        let userId: number | null = null

        if (createAccount) {
          const tempPassword = await bcrypt.hash("Volunteer@1234", 12)
          const user = await prisma.user.create({
            data: {
              name: application.full_name,
              email: application.email,
              password_hash: tempPassword,
              role: "volunteer",
              volunteer_type: volunteerType || "other",
            },
          })
          userId = user.id
        }

        await prisma.volunteer.create({
          data: {
            full_name: application.full_name,
            level_of_education: application.level_of_education,
            courses: application.preferred_courses,
            availability: application.availability,
            position: position || "Volunteer",
            start_date: new Date(),
            application_id: id,
            user_id: userId,
          },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Volunteer PATCH error:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
