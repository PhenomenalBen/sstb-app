import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import Link from "next/link"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export default async function AdminOverviewPage() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== "admin") redirect("/login")

  const [
    totalStudents,
    totalVolunteers,
    pendingApplications,
    pendingVolunteerApps,
    recentApplications,
  ] = await Promise.all([
    prisma.student.count(),
    prisma.volunteer.count(),
    prisma.application.count({ where: { status: "pending" } }),
    prisma.volunteerApplication.count({ where: { status: "pending" } }),
    prisma.application.findMany({
      orderBy: { submitted_at: "desc" },
      take: 5,
    }),
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome to the St Stephen Tech Bridge admin panel.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          {
            label: "Enrolled Students",
            value: totalStudents,
            icon: "🎓",
            color: "#dc2626",
            href: "/dashboard/admin/students",
          },
          {
            label: "Active Volunteers",
            value: totalVolunteers,
            icon: "🙋",
            color: "#00BCD4",
            href: "/dashboard/admin/volunteers",
          },
          {
            label: "Pending Student Apps",
            value: pendingApplications,
            icon: "📋",
            color: "#f59e0b",
            href: "/dashboard/admin/applications",
          },
          {
            label: "Pending Volunteer Apps",
            value: pendingVolunteerApps,
            icon: "📝",
            color: "#8b5cf6",
            href: "/dashboard/admin/volunteers",
          },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl p-5 border-2 border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 block"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: stat.color }}
              >
                View →
              </span>
            </div>
            <p
              className="text-3xl font-bold mb-1"
              style={{ color: stat.color }}
            >
              {stat.value}
            </p>
            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* Recent Applications */}
        <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: "#f3f4f6" }}
          >
            <h2 className="font-bold text-gray-800 text-sm">
              Recent Student Applications
            </h2>
            <Link
              href="/dashboard/admin/applications"
              className="text-xs font-semibold hover:underline"
              style={{ color: "#dc2626" }}
            >
              View all →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentApplications.length === 0 ? (
              <p className="text-sm text-gray-400 px-5 py-6 text-center">
                No applications yet.
              </p>
            ) : (
              recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {app.full_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {app.courses_applied.join(", ")}
                    </p>
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={
                      app.status === "pending"
                        ? { backgroundColor: "#fef3c7", color: "#92400e" }
                        : app.status === "accepted"
                        ? { backgroundColor: "#dcfce7", color: "#166534" }
                        : { backgroundColor: "#fee2e2", color: "#991b1b" }
                    }
                  >
                    {app.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
          <div
            className="px-5 py-4 border-b"
            style={{ borderColor: "#f3f4f6" }}
          >
            <h2 className="font-bold text-gray-800 text-sm">Quick Actions</h2>
          </div>
          <div className="p-5 grid grid-cols-2 gap-3">
            {[
              { label: "Review Applications", href: "/dashboard/admin/applications", icon: "📋", color: "#dc2626" },
              { label: "Manage Students", href: "/dashboard/admin/students", icon: "🎓", color: "#00BCD4" },
              { label: "Add News Post", href: "/dashboard/admin/news", icon: "📰", color: "#8b5cf6" },
              { label: "Manage Team", href: "/dashboard/admin/team", icon: "👥", color: "#f59e0b" },
              { label: "View Finances", href: "/dashboard/admin/finance", icon: "💰", color: "#10b981" },
              { label: "Settings", href: "/dashboard/settings", icon: "⚙️", color: "#6b7280" },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-100 hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5"
              >
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                  style={{ backgroundColor: action.color + "20" }}
                >
                  {action.icon}
                </span>
                <span className="text-xs font-semibold text-gray-700">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}