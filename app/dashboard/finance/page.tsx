import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import Link from "next/link"

export const dynamic = "force-dynamic"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export default async function FinanceDashboardPage() {
  const session = await auth()
  const role = (session?.user as any)?.role
  const volunteerType = (session?.user as any)?.volunteer_type
  if (!session || !(role === "admin" || volunteerType === "finance")) redirect("/login")

  const [totalIn, totalOut, totalDue, recentTx] = await Promise.all([
    prisma.transaction.aggregate({
      where: { direction: "in" },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { direction: "out" },
      _sum: { amount: true },
    }),
    prisma.personBalance.aggregate({
      _sum: { balance_due: true },
    }),
    prisma.transaction.findMany({
      orderBy: { payment_date: "desc" },
      take: 6,
      include: { student: true, volunteer: true },
    }),
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Finance Overview</h1>
        <p className="text-gray-500 text-sm mt-1">
          Track transactions and balances.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          {
            label: "Total Received",
            value: `$${Number(totalIn._sum.amount || 0).toFixed(2)}`,
            icon: "💚",
            color: "#16a34a",
            bg: "#dcfce7",
          },
          {
            label: "Total Spent",
            value: `$${Number(totalOut._sum.amount || 0).toFixed(2)}`,
            icon: "🔴",
            color: "#dc2626",
            bg: "#fee2e2",
          },
          {
            label: "Total Balance Due",
            value: `$${Number(totalDue._sum.balance_due || 0).toFixed(2)}`,
            icon: "⏳",
            color: "#92400e",
            bg: "#fef3c7",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border-2 border-gray-100 p-5 flex items-center gap-4"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: s.bg }}
            >
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: s.color }}>
                {s.value}
              </p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[
          { label: "Manage Transactions", href: "/dashboard/finance/transactions", icon: "💳", color: "#dc2626" },
          { label: "View Balances", href: "/dashboard/finance/balances", icon: "💰", color: "#00BCD4" },
        ].map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="bg-white rounded-xl border-2 border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: link.color + "15" }}
            >
              {link.icon}
            </div>
            <span className="font-semibold text-gray-800">{link.label}</span>
            <span className="ml-auto text-gray-400">→</span>
          </Link>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "#f3f4f6" }}
        >
          <h2 className="font-bold text-gray-800 text-sm">Recent Transactions</h2>
          <Link
            href="/dashboard/finance/transactions"
            className="text-xs font-semibold hover:underline"
            style={{ color: "#dc2626" }}
          >
            View all →
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentTx.length === 0 ? (
            <p className="text-sm text-gray-400 px-5 py-6 text-center">
              No transactions yet.
            </p>
          ) : (
            recentTx.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {tx.student?.full_name || tx.volunteer?.full_name || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-400">{tx.description}</p>
                </div>
                <div className="text-right">
                  <p
                    className="text-sm font-bold"
                    style={{ color: tx.direction === "in" ? "#16a34a" : "#dc2626" }}
                  >
                    {tx.direction === "in" ? "+" : "-"}${Number(tx.amount).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(tx.payment_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}