import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client/edge"
import { PrismaPg } from "@prisma/adapter-pg"
import FinanceClient from "./FinanceClient"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export default async function FinancePage() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== "admin") redirect("/login")

  const [transactions, balances, students, volunteers] = await Promise.all([
    prisma.transaction.findMany({
      orderBy: { payment_date: "desc" },
      include: { student: true, volunteer: true },
    }),
    prisma.personBalance.findMany({
      include: { student: true, volunteer: true },
    }),
    prisma.student.findMany({ select: { id: true, full_name: true } }),
    prisma.volunteer.findMany({ select: { id: true, full_name: true } }),
  ])

  const serializedTransactions = transactions.map((t) => ({
    ...t,
    amount: Number(t.amount),
  }))

  const serializedBalances = balances.map((b) => ({
    ...b,
    total_expected: Number(b.total_expected),
    total_paid: Number(b.total_paid),
    balance_due: Number(b.balance_due),
  }))

  return (
    <FinanceClient
      transactions={serializedTransactions}
      balances={serializedBalances}
      students={students}
      volunteers={volunteers}
    />
  )
}