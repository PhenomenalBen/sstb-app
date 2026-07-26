import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

export const dynamic = "force-dynamic"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export default async function BalancesPage() {
  const session = await auth()
  const role = (session?.user as any)?.role
  const volunteerType = (session?.user as any)?.volunteer_type
  if (!session || !(role === "admin" || volunteerType === "finance")) redirect("/login")

  const balances = await prisma.personBalance.findMany({
    include: { student: true, volunteer: true },
    orderBy: { id: "desc" },
  })

  const totalExpected = balances.reduce((s, b) => s + Number(b.total_expected), 0)
  const totalPaid = balances.reduce((s, b) => s + Number(b.total_paid), 0)
  const totalDue = balances.reduce((s, b) => s + Number(b.balance_due), 0)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Person Balances</h1>
        <p className="text-gray-500 text-sm mt-1">
          Fee tracking for all students and volunteers.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Expected", value: `$${totalExpected.toFixed(2)}`, color: "#1a1a2e", bg: "#f3f4f6" },
          { label: "Total Paid", value: `$${totalPaid.toFixed(2)}`, color: "#16a34a", bg: "#dcfce7" },
          { label: "Total Due", value: `$${totalDue.toFixed(2)}`, color: "#dc2626", bg: "#fee2e2" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border-2 border-gray-100 p-5 text-center"
          >
            <p className="text-2xl font-bold mb-1" style={{ color: s.color }}>
              {s.value}
            </p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
        {balances.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-10">
            No balances yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#1a1a2e" }}>
                  {["Person", "Type", "Expected", "Paid", "Balance Due", "Status"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {balances.map((b) => {
                  const name = b.student?.full_name || b.volunteer?.full_name || "Unknown"
                  const due = Number(b.balance_due)
                  return (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-semibold text-gray-800">{name}</td>
                      <td className="px-5 py-3">
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full capitalize"
                          style={{ backgroundColor: "#f3f4f6", color: "#374151" }}
                        >
                          {b.person_type}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-700">${Number(b.total_expected).toFixed(2)}</td>
                      <td className="px-5 py-3 font-medium" style={{ color: "#16a34a" }}>
                        ${Number(b.total_paid).toFixed(2)}
                      </td>
                      <td className="px-5 py-3 font-bold" style={{ color: due > 0 ? "#dc2626" : "#16a34a" }}>
                        ${due.toFixed(2)}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={
                            due === 0
                              ? { backgroundColor: "#dcfce7", color: "#166534" }
                              : { backgroundColor: "#fef3c7", color: "#92400e" }
                          }
                        >
                          {due === 0 ? "✓ Paid" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}