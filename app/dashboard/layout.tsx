"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

const adminLinks = [
  { label: "Overview", href: "/dashboard/admin", icon: "📊" },
  { label: "Applications", href: "/dashboard/admin/applications", icon: "📋" },
  { label: "Volunteers", href: "/dashboard/admin/volunteers", icon: "🙋" },
  { label: "Students", href: "/dashboard/admin/students", icon: "🎓" },
  { label: "Team & Users", href: "/dashboard/admin/team", icon: "👥" },
  { label: "News", href: "/dashboard/admin/news", icon: "📰" },
  { label: "Finance", href: "/dashboard/admin/finance", icon: "💰" },
  { label: "Settings", href: "/dashboard/settings", icon: "⚙️" },
]

const financeLinks = [
  { label: "Overview", href: "/dashboard/finance", icon: "📊" },
  { label: "Transactions", href: "/dashboard/finance/transactions", icon: "💳" },
  { label: "Balances", href: "/dashboard/finance/balances", icon: "💰" },
  { label: "Settings", href: "/dashboard/settings", icon: "⚙️" },
]

const volunteerLinks = [
  { label: "Overview", href: "/dashboard/volunteer", icon: "📊" },
  { label: "Students", href: "/dashboard/volunteer/students", icon: "🎓" },
  { label: "Settings", href: "/dashboard/settings", icon: "⚙️" },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const role = (session?.user as any)?.role
  const volunteerType = (session?.user as any)?.volunteer_type

  const links =
    role === "admin"
      ? adminLinks
      : role === "volunteer" && volunteerType === "finance"
      ? financeLinks
      : volunteerLinks

  const roleLabel =
    role === "admin"
      ? "Administrator"
      : volunteerType === "finance"
      ? "Finance Volunteer"
      : "Volunteer"

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#f9fafb" }}>

      {/* ── SIDEBAR ──────────────────────────────────────────────────── */}
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-300
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ width: "260px", backgroundColor: "#1a1a2e" }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-6 py-5 border-b"
          style={{ borderColor: "#ffffff15" }}
        >
          <img
            src="/favicon.png"
            alt="SSTB"
            width={34}
            height={34}
            className="rounded-full"
          />
          <div>
            <p className="text-white font-bold text-sm leading-tight">
              St Stephen
            </p>
            <p className="text-xs font-semibold" style={{ color: "#00BCD4" }}>
              Tech Bridge
            </p>
          </div>
        </div>

        {/* User info */}
        <div
          className="px-6 py-4 border-b"
          style={{ borderColor: "#ffffff15" }}
        >
          <p className="text-white text-sm font-semibold truncate">
            {session?.user?.name || "User"}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#00BCD4" }}>
            {roleLabel}
          </p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {links.map((link) => {
              const active =
                link.href === "/dashboard/admin" ||
                link.href === "/dashboard/finance" ||
                link.href === "/dashboard/volunteer"
                  ? pathname === link.href
                  : pathname.startsWith(link.href)
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                    style={
                      active
                        ? { backgroundColor: "#dc2626", color: "#ffffff" }
                        : { color: "#9ca3af" }
                    }
                    onMouseEnter={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "#ffffff10"
                        ;(e.currentTarget as HTMLElement).style.color = "#ffffff"
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"
                        ;(e.currentTarget as HTMLElement).style.color = "#9ca3af"
                      }
                    }}
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4 border-t" style={{ borderColor: "#ffffff15" }}>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-red-600/20 transition-all duration-200"
          >
            <span>🚪</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header
          className="flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-30"
          style={{ borderColor: "#e5e7eb" }}
        >
          {/* Mobile menu toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="hidden lg:block">
            <p className="text-sm text-gray-500">
              Welcome back,{" "}
              <span className="font-semibold text-gray-800">
                {session?.user?.name?.split(" ")[0]}
              </span>{" "}
              👋
            </p>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <Link
              href="/"
              className="text-xs text-gray-500 hover:text-red-600 transition-colors"
            >
              ← Back to site
            </Link>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: "#dc2626" }}
            >
              {session?.user?.name?.[0] || "U"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}