import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import Link from "next/link"

export const dynamic = "force-dynamic"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export default async function VolunteerDashboardPage() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== "volunteer") redirect("/login")

  const [totalStudents, recentStudents] = await Promise.all([
    prisma.student.count(),
    prisma.student.findMany({
      orderBy: { start_date: "desc" },
      take: 5,
    }),
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {(session.user as any)?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Here's an overview of the current cohort.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {[
          { label: "Enrolled Students", value: totalStudents, icon: "🎓", color: "#dc2626" },
          { label: "Active Courses", value: 3, icon: "📚", color: "#00BCD4" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border-2 border-gray-100 p-6 flex items-center gap-4"
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: s.color + "15" }}
            >
              {s.icon}
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: s.color }}>
                {s.value}
              </p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Link */}
      <Link
        href="/dashboard/volunteer/students"
        className="flex items-center gap-4 bg-white rounded-xl border-2 border-gray-100 p-5 mb-8 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: "#fef2f2" }}
        >
          🎓
        </div>
        <div>
          <p className="font-semibold text-gray-800">View All Students</p>
          <p className="text-xs text-gray-400">Browse the enrolled student list</p>
        </div>
        <span className="ml-auto text-gray-400">→</span>
      </Link>

      {/* Recent Students */}
      <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "#f3f4f6" }}
        >
          <h2 className="font-bold text-gray-800 text-sm">Recently Enrolled</h2>
          <Link
            href="/dashboard/volunteer/students"
            className="text-xs font-semibold hover:underline"
            style={{ color: "#dc2626" }}
          >
            View all →
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentStudents.length === 0 ? (
            <p className="text-sm text-gray-400 px-5 py-6 text-center">
              No students enrolled yet.
            </p>
          ) : (
            recentStudents.map((student) => (
              <div key={student.id} className="flex items-center gap-3 px-5 py-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: "#dc2626" }}
                >
                  {student.full_name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {student.full_name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {student.courses.join(", ")}
                  </p>
                </div>
                <span className="ml-auto text-xs text-gray-400">
                  {new Date(student.start_date).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}