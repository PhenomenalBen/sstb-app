import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client/edge"
import { PrismaPg } from "@prisma/adapter-pg"
import StudentsClient from "./StudentsClient"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export default async function StudentsPage() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== "admin") redirect("/login")

  const students = await prisma.student.findMany({
    orderBy: { start_date: "desc" },
    include: { balance: true },
  })

  const serialized = students.map((s) => ({
    ...s,
    balance: s.balance
      ? {
          ...s.balance,
          total_expected: Number(s.balance.total_expected),
          total_paid: Number(s.balance.total_paid),
          balance_due: Number(s.balance.balance_due),
        }
      : null,
  }))

  return <StudentsClient students={serialized} />
}