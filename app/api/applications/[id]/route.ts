import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
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
  const id = parseInt(rawId, 10)
  const { status } = await req.json()

  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid application id" }, { status: 400 })
  }

  if (!["accepted", "rejected", "pending"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  try {
    const application = await prisma.application.update({
      where: { id },
      data: { status },
    })

    // If accepted, create a student record
    if (status === "accepted") {
      const existing = await prisma.student.findUnique({
        where: { application_id: id },
      })
      if (!existing) {
        const student = await prisma.student.create({
          data: {
            full_name: application.full_name,
            age: application.age,
            email: application.email,
            phone: application.phone,
            level_of_education: application.level_of_education,
            courses: application.courses_applied,
            start_date: new Date(),
            application_id: id,
          },
        })
        // Create balance record
        await prisma.personBalance.create({
          data: {
            person_type: "student",
            total_expected: 90.00,
            total_paid: 0.00,
            balance_due: 90.00,
            student_id: student.id,
          },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("PATCH error:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}