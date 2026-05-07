"use client"

import { useState } from "react"

type User = {
  id: number
  name: string
  email: string
  phone: string | null
  role: string
  volunteer_type: string | null
  created_at: Date
}

type Volunteer = {
  id: number
  full_name: string
  level_of_education: string
  courses: string[]
  availability: string
  position: string
  start_date: Date
  user_id: number | null
}

export default function TeamClient({
  users,
  volunteers,
}: {
  users: User[]
  volunteers: Volunteer[]
}) {
  const [tab, setTab] = useState<"users" | "volunteers">("users")
  const [showAddUser, setShowAddUser] = useState(false)
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "volunteer",
    volunteer_type: "other",
  })
  const [loading, setLoading] = useState(false)
  const [userList, setUserList] = useState(users)
  const [error, setError] = useState("")

  const handleAddUser = async () => {
    setError("")
    if (!addForm.name || !addForm.email || !addForm.password) {
      setError("Please fill in all fields.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed")
      }
      const data = await res.json()
      setUserList((prev) => [data.user, ...prev])
      setShowAddUser(false)
      setAddForm({ name: "", email: "", password: "", role: "volunteer", volunteer_type: "other" })
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  const roleColor = (role: string, type: string | null) => {
    if (role === "admin") return { bg: "#fef2f2", text: "#dc2626" }
    if (type === "finance") return { bg: "#e0f7fa", text: "#00838f" }
    return { bg: "#f3f4f6", text: "#374151" }
  }

  const roleLabel = (role: string, type: string | null) => {
    if (role === "admin") return "Admin"
    if (type === "finance") return "Finance Vol."
    return "Volunteer"
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team & Users</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage dashboard users and accepted volunteers.
          </p>
        </div>
        <button
          onClick={() => setShowAddUser(true)}
          className="px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all hover:-translate-y-0.5"
          style={{ backgroundColor: "#dc2626" }}
        >
          + Add User
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["users", "volunteers"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all"
            style={
              tab === t
                ? { backgroundColor: "#dc2626", color: "#fff" }
                : { backgroundColor: "#f3f4f6", color: "#374151" }
            }
          >
            {t === "users" ? `👤 Dashboard Users (${userList.length})` : `🙋 Volunteers (${volunteers.length})`}
          </button>
        ))}
      </div>

      {/* Users Table */}
      {tab === "users" && (
        <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
          {userList.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">No users found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#1a1a2e" }}>
                  {["Name", "Email", "Role", "Added"].map((h) => (
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
                {userList.map((user) => {
                  const rc = roleColor(user.role, user.volunteer_type)
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ backgroundColor: "#dc2626" }}
                          >
                            {user.name[0]}
                          </div>
                          <span className="font-semibold text-gray-800">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{user.email}</td>
                      <td className="px-5 py-3">
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: rc.bg, color: rc.text }}
                        >
                          {roleLabel(user.role, user.volunteer_type)}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-xs">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Volunteers Table */}
      {tab === "volunteers" && (
        <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
          {volunteers.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">
              No volunteers yet. Accept volunteer applications to add them here.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#1a1a2e" }}>
                  {["Name", "Position", "Courses", "Availability", "Account"].map((h) => (
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
                {volunteers.map((vol) => (
                  <tr key={vol.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: "#00BCD4" }}
                        >
                          {vol.full_name[0]}
                        </div>
                        <span className="font-semibold text-gray-800">
                          {vol.full_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{vol.position}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {vol.courses.map((c) => (
                          <span
                            key={c}
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ backgroundColor: "#e0f7fa", color: "#00838f" }}
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-semibold capitalize"
                        style={{ backgroundColor: "#f3f4f6", color: "#374151" }}
                      >
                        {vol.availability}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {vol.user_id ? (
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: "#dcfce7", color: "#166534" }}
                        >
                          ✓ Has login
                        </span>
                      ) : (
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: "#f3f4f6", color: "#9ca3af" }}
                        >
                          No account
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Add New User</h3>
            <p className="text-sm text-gray-500 mb-5">
              Create a dashboard login account for an admin or volunteer.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm mb-4">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Temporary Password
                </label>
                <input
                  type="password"
                  placeholder="Min 8 characters"
                  value={addForm.password}
                  onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Role
                </label>
                <div className="flex gap-3">
                  {[
                    { val: "admin", label: "🔑 Admin" },
                    { val: "volunteer", label: "🙋 Volunteer" },
                  ].map((r) => (
                    <button
                      key={r.val}
                      onClick={() => setAddForm({ ...addForm, role: r.val })}
                      className="flex-1 py-2 rounded-lg text-sm font-semibold border-2 transition-all"
                      style={
                        addForm.role === r.val
                          ? { backgroundColor: "#dc2626", borderColor: "#dc2626", color: "#fff" }
                          : { borderColor: "#e5e7eb", color: "#374151" }
                      }
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {addForm.role === "volunteer" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Volunteer Type
                  </label>
                  <div className="flex gap-3">
                    {[
                      { val: "finance", label: "💰 Finance" },
                      { val: "other", label: "🙋 Other" },
                    ].map((t) => (
                      <button
                        key={t.val}
                        onClick={() => setAddForm({ ...addForm, volunteer_type: t.val })}
                        className="flex-1 py-2 rounded-lg text-sm font-semibold border-2 transition-all"
                        style={
                          addForm.volunteer_type === t.val
                            ? { backgroundColor: "#00BCD4", borderColor: "#00BCD4", color: "#fff" }
                            : { borderColor: "#e5e7eb", color: "#374151" }
                        }
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowAddUser(false); setError("") }}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold border-2 border-gray-200 text-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-50"
                  style={{ backgroundColor: "#dc2626" }}
                >
                  {loading ? "Creating..." : "Create User"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}