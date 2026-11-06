import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { auth } from "@/lib/auth"
import { serverError } from "@/lib/security"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const PERSON_TYPES = ["student", "volunteer"]
const DIRECTIONS = ["in", "out"]
const PAYMENT_METHODS = ["cash", "bank transfer", "card"]
const MAX_AMOUNT = 1_000_000

function optionalText(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim().slice(0, max)
  return trimmed || null
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Only admins and finance volunteers may record transactions.
  const role = (session.user as any)?.role
  const volunteerType = (session.user as any)?.volunteer_type
  if (!(role === "admin" || (role === "volunteer" && volunteerType === "finance"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const { person_type, direction, payment_method } = body
  const person_id = Number(body.person_id)
  const amount = Number(body.amount)
  const description = optionalText(body.description, 500)

  if (!PERSON_TYPES.includes(person_type)) {
    return NextResponse.json({ error: "Invalid person type." }, { status: 400 })
  }
  if (!DIRECTIONS.includes(direction)) {
    return NextResponse.json({ error: "Invalid direction." }, { status: 400 })
  }
  if (!PAYMENT_METHODS.includes(payment_method)) {
    return NextResponse.json({ error: "Invalid payment method." }, { status: 400 })
  }
  if (!Number.isInteger(person_id) || person_id <= 0) {
    return NextResponse.json({ error: "Invalid person." }, { status: 400 })
  }
  if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) {
    return NextResponse.json({ error: "Amount must be a positive number." }, { status: 400 })
  }
  if (!description) {
    return NextResponse.json({ error: "Description is required." }, { status: 400 })
  }

  // Round to cents to match the Decimal(10, 2) column.
  const roundedAmount = Math.round(amount * 100) / 100

  try {
    // Make sure the person actually exists.
    const person =
      person_type === "student"
        ? await prisma.student.findUnique({ where: { id: person_id }, select: { id: true } })
        : await prisma.volunteer.findUnique({ where: { id: person_id }, select: { id: true } })
    if (!person) {
      return NextResponse.json({ error: "Person not found." }, { status: 404 })
    }

    const data: any = {
      person_type,
      direction,
      amount: roundedAmount,
      description,
      payment_method,
      receipt_id: optionalText(body.receipt_id, 100),
      notes: optionalText(body.notes, 1000),
    }

    if (person_type === "student") data.student_id = person_id
    else data.volunteer_id = person_id

    const transaction = await prisma.$transaction(async (tx) => {
      const created = await tx.transaction.create({
        data,
        include: { student: true, volunteer: true },
      })

      // Update balance if direction is "in". Done as a single atomic SQL
      // UPDATE so simultaneous payments can't overwrite each other.
      if (direction === "in") {
        if (person_type === "student") {
          await tx.$executeRaw`
            UPDATE "PersonBalance"
            SET total_paid  = total_paid + ${roundedAmount}::numeric,
                balance_due = GREATEST(0, total_expected - (total_paid + ${roundedAmount}::numeric))
            WHERE student_id = ${person_id}`
        } else {
          await tx.$executeRaw`
            UPDATE "PersonBalance"
            SET total_paid  = total_paid + ${roundedAmount}::numeric,
                balance_due = GREATEST(0, total_expected - (total_paid + ${roundedAmount}::numeric))
            WHERE volunteer_id = ${person_id}`
        }
      }

      return created
    })

    return NextResponse.json({ success: true, transaction }, { status: 201 })
  } catch (err) {
    return serverError("Create transaction error", err)
  }
}
