import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import FinanceClient from "../../admin/finance/FinanceClient"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export default async function FinanceTransactionsPage() {
  const session = await auth()
  const role = (session?.user as any)?.role
  const volunteerType = (session?.user as any)?.volunteer_type
  if (!session || !(role === "admin" || volunteerType === "finance")) redirect("/login")

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

  return (
    <FinanceClient
      transactions={transactions}
      balances={balances}
      students={students}
      volunteers={volunteers}
    />
  )
}