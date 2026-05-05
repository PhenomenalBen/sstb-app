"use client"

import { useState } from "react"

type VolunteerApp = {
  id: number
  full_name: string
  email: string
  phone: string | null
  level_of_education: string
  skills: string
  preferred_courses: string[]
  availability: string
  motivation_text: string
  status: string
  submitted_at: Date
}

export default function VolunteerApplicationsClient({
  applications,
}: {
  applications: VolunteerApp[]
}) {
  const [filter, setFilter] = useState("all")
  const [selected, setSelected] = useState<VolunteerApp | null>(null)
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [list, setList] = useState(applications)
  const [showAcceptModal, setShowAcceptModal] = useState(false)
  const [acceptForm, setAcceptForm] = useState({
    position: "",
    createAccount: false,
    volunteerType: "other",
  })

  const filtered =
    filter === "all" ? list : list.filter((a) => a.status === filter)

  const handleAction = async (id: number, action: "accepted" | "rejected") => {
    if (action === "accepted") {
      setShowAcceptModal(true)
      return
    }
    await processAction(id, action)
  }

  const processAction = async (
    id: number,
    action: "accepted" | "rejected",
    extra?: { position: string; createAccount: boolean; volunteerType: string }
  ) => {
    setLoadingId(id)
    try {
      const res = await fetch(`/api/volunteer-applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action, ...extra }),
      })
      if (!res.ok) throw new Error("Failed")
      setList((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: action } : a))
      )
      if (selected?.id === id)
        setSelected((prev) => (prev ? { ...prev, status: action } : null))
      setShowAcceptModal(false)
    } catch {
      alert("Something went wrong. Please try again.")
    }
    setLoadingId(null)
  }

  const statusStyle = (status: string) => {
    if (status === "pending") return { backgroundColor: "#fef3c7", color: "#92400e" }
    if (status === "accepted") return { backgroundColor: "#dcfce7", color: "#166534" }
    return { backgroundColor: "#fee2e2", color: "#991b1b" }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Volunteer Applications</h1>
        <p className="text-gray-500 text-sm mt-1">
          Review and accept incoming volunteer applications.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "pending", "accepted", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-all duration-200"
            style={
              filter === f
                ? { backgroundColor: "#00BCD4", color: "#fff" }
                : { backgroundColor: "#f3f4f6", color: "#374151" }
            }
          >
            {f}{" "}
            <span className="ml-1 opacity-70">
              ({f === "all" ? list.length : list.filter((a) => a.status === f).length})
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* List */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-gray-100 p-8 text-center text-gray-400 text-sm">
              No {filter} applications found.
            </div>
          ) : (
            filtered.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelected(app)}
                className="bg-white rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md p-4"
                style={{
                  borderColor: selected?.id === app.id ? "#00BCD4" : "#e5e7eb",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {app.full_name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{app.email}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {app.preferred_courses.map((c) => (
                        <span
                          key={c}
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: "#e0f7fa", color: "#00838f" }}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full capitalize"
                      style={statusStyle(app.status)}
                    >
                      {app.status}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: "#f3f4f6", color: "#374151" }}
                    >
                      {app.availability}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail Panel */}
        <div className="sticky top-6">
          {!selected ? (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center text-gray-400">
              <div className="text-4xl mb-3">👆</div>
              <p className="text-sm">Click an application to review it</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
              <div
                className="px-6 py-4 border-b flex items-center justify-between"
                style={{ borderColor: "#f3f4f6" }}
              >
                <div>
                  <h2 className="font-bold text-gray-900">{selected.full_name}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Submitted {new Date(selected.submitted_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full capitalize"
                  style={statusStyle(selected.status)}
                >
                  {selected.status}
                </span>
              </div>

              <div className="p-6 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Email", value: selected.email },
                    { label: "Phone", value: selected.phone || "—" },
                    { label: "Education", value: selected.level_of_education },
                    { label: "Availability", value: selected.availability },
                  ].map((field) => (
                    <div key={field.label}>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                        {field.label}
                      </p>
                      <p className="text-sm text-gray-800 font-medium capitalize">
                        {field.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Preferred Courses
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selected.preferred_courses.map((c) => (
                      <span
                        key={c}
                        className="text-xs px-3 py-1 rounded-full font-semibold text-white"
                        style={{ backgroundColor: "#00BCD4" }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Skills & Background
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4">
                    {selected.skills}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Motivation
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4">
                    {selected.motivation_text}
                  </p>
                </div>

                {selected.status === "pending" && (
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleAction(selected.id, "accepted")}
                      disabled={loadingId === selected.id}
                      className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
                      style={{ backgroundColor: "#16a34a" }}
                    >
                      ✓ Accept
                    </button>
                    <button
                      onClick={() => handleAction(selected.id, "rejected")}
                      disabled={loadingId === selected.id}
                      className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
                      style={{ backgroundColor: "#dc2626" }}
                    >
                      ✗ Reject
                    </button>
                  </div>
                )}

                {selected.status !== "pending" && (
                  <div
                    className="text-center text-sm py-3 rounded-lg font-medium"
                    style={statusStyle(selected.status)}
                  >
                    This application has been {selected.status}.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Accept Modal */}
      {showAcceptModal && selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Accept Volunteer
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Fill in the details before accepting {selected.full_name}.
            </p>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Position / Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Computer Literacy Instructor"
                  value={acceptForm.position}
                  onChange={(e) =>
                    setAcceptForm({ ...acceptForm, position: e.target.value })
                  }
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Volunteer Type
                </label>
                <div className="flex gap-3">
                  {["finance", "other"].map((type) => (
                    <button
                      key={type}
                      onClick={() =>
                        setAcceptForm({ ...acceptForm, volunteerType: type })
                      }
                      className="flex-1 py-2 rounded-lg text-sm font-semibold border-2 capitalize transition-all"
                      style={
                        acceptForm.volunteerType === type
                          ? { backgroundColor: "#00BCD4", borderColor: "#00BCD4", color: "#fff" }
                          : { borderColor: "#e5e7eb", color: "#374151" }
                      }
                    >
                      {type === "finance" ? "💰 Finance" : "🙋 Other"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <input
                  type="checkbox"
                  id="createAccount"
                  checked={acceptForm.createAccount}
                  onChange={(e) =>
                    setAcceptForm({
                      ...acceptForm,
                      createAccount: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-cyan-500"
                />
                <label htmlFor="createAccount" className="text-sm text-gray-700">
                  Create dashboard login account for this volunteer
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAcceptModal(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold border-2 border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    processAction(selected.id, "accepted", {
                      position: acceptForm.position || selected.preferred_courses[0] + " Instructor",
                      createAccount: acceptForm.createAccount,
                      volunteerType: acceptForm.volunteerType,
                    })
                  }
                  disabled={loadingId === selected.id}
                  className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-50"
                  style={{ backgroundColor: "#16a34a" }}
                >
                  {loadingId === selected.id ? "Processing..." : "✓ Confirm Accept"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
