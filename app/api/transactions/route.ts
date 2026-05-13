import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { auth } from "@/lib/auth"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const {
    person_type, person_id, direction,
    amount, description, payment_method,
    receipt_id, notes,
  } = await req.json()

  try {
    const data: any = {
      person_type,
      direction,
      amount,
      description,
      payment_method,
      receipt_id: receipt_id || null,
      notes: notes || null,
    }

    if (person_type === "student") data.student_id = person_id
    else data.volunteer_id = person_id

    const transaction = await prisma.transaction.create({
      data,
      include: { student: true, volunteer: true },
    })

    // Update balance if direction is "in"
    if (direction === "in") {
      const balanceWhere =
        person_type === "student"
          ? { student_id: person_id }
          : { volunteer_id: person_id }

      const balance = await prisma.personBalance.findFirst({ where: balanceWhere })
      if (balance) {
        const newPaid = Number(balance.total_paid) + Number(amount)
        const newDue = Math.max(0, Number(balance.total_expected) - newPaid)
        await prisma.personBalance.update({
          where: { id: balance.id },
          data: { total_paid: newPaid, balance_due: newDue },
        })
      }
    }

    return NextResponse.json({ success: true, transaction }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}