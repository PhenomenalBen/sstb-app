"use client"

import { useState } from "react"

type Application = {
  id: number
  full_name: string
  age: number
  email: string
  phone: string | null
  level_of_education: string
  courses_applied: string[]
  motivation_text: string
  status: string
  submitted_at: Date
}

export default function ApplicationsClient({
  applications,
}: {
  applications: Application[]
}) {
  const [filter, setFilter] = useState("all")
  const [selected, setSelected] = useState<Application | null>(null)
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [list, setList] = useState(applications)

  const filtered =
    filter === "all" ? list : list.filter((a) => a.status === filter)

  const handleAction = async (id: number, action: "accepted" | "rejected") => {
    setLoadingId(id)
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed")
      }
      setList((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: action } : a))
      )
      if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status: action } : null)
    } catch (err) {
      alert(`Something went wrong: ${err instanceof Error ? err.message : String(err)}`)
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
        <h1 className="text-2xl font-bold text-gray-900">Student Applications</h1>
        <p className="text-gray-500 text-sm mt-1">
          Review, accept, or reject incoming student applications.
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
                ? { backgroundColor: "#dc2626", color: "#fff" }
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

        {/* Applications List */}
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
                  borderColor: selected?.id === app.id ? "#dc2626" : "#e5e7eb",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {app.full_name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{app.email}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {app.courses_applied.map((c) => (
                        <span
                          key={c}
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: "#f3f4f6", color: "#374151" }}
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
                    <span className="text-xs text-gray-400">
                      {new Date(app.submitted_at).toLocaleDateString()}
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
              {/* Header */}
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

              {/* Details */}
              <div className="p-6 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Age", value: selected.age },
                    { label: "Education", value: selected.level_of_education },
                    { label: "Email", value: selected.email },
                    { label: "Phone", value: selected.phone || "—" },
                  ].map((field) => (
                    <div key={field.label}>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                        {field.label}
                      </p>
                      <p className="text-sm text-gray-800 font-medium">
                        {field.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Courses Applied
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selected.courses_applied.map((c) => (
                      <span
                        key={c}
                        className="text-xs px-3 py-1 rounded-full font-semibold text-white"
                        style={{ backgroundColor: "#dc2626" }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Motivation
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4">
                    {selected.motivation_text}
                  </p>
                </div>

                {/* Actions */}
                {selected.status === "pending" && (
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleAction(selected.id, "accepted")}
                      disabled={loadingId === selected.id}
                      className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
                      style={{ backgroundColor: "#16a34a" }}
                    >
                      {loadingId === selected.id ? "Processing..." : "✓ Accept"}
                    </button>
                    <button
                      onClick={() => handleAction(selected.id, "rejected")}
                      disabled={loadingId === selected.id}
                      className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
                      style={{ backgroundColor: "#dc2626" }}
                    >
                      {loadingId === selected.id ? "Processing..." : "✗ Reject"}
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
    </div>
  )
}