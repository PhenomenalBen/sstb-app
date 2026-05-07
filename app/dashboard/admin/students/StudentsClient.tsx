"use client"

import { useState } from "react"

type Balance = {
  id: number
  total_expected: any
  total_paid: any
  balance_due: any
} | null

type Student = {
  id: number
  full_name: string
  age: number
  email: string
  phone: string | null
  level_of_education: string
  courses: string[]
  start_date: Date
  balance: Balance
}

export default function StudentsClient({
  students,
}: {
  students: Student[]
}) {
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Student | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Student>>({})
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState(students)

  const filtered = list.filter(
    (s) =>
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (student: Student) => {
    setSelected(student)
    setEditForm({
      full_name: student.full_name,
      age: student.age,
      email: student.email,
      phone: student.phone || "",
      level_of_education: student.level_of_education,
      courses: student.courses,
    })
    setEditMode(true)
  }

  const handleSave = async () => {
    if (!selected) return
    setLoading(true)
    try {
      const res = await fetch(`/api/students/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })
      if (!res.ok) throw new Error("Failed")
      const updated = { ...selected, ...editForm }
      setList((prev) =>
        prev.map((s) => (s.id === selected.id ? (updated as Student) : s))
      )
      setSelected(updated as Student)
      setEditMode(false)
    } catch {
      alert("Something went wrong.")
    }
    setLoading(false)
  }

  const courseOptions = ["Computer Literacy", "Functional English", "Foundational Math"]

  const toggleCourse = (course: string) => {
    const current = (editForm.courses as string[]) || []
    setEditForm({
      ...editForm,
      courses: current.includes(course)
        ? current.filter((c) => c !== course)
        : [...current, course],
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Enrolled Students</h1>
        <p className="text-gray-500 text-sm mt-1">
          {list.length} student{list.length !== 1 ? "s" : ""} enrolled.
        </p>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Students List */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-gray-100 p-8 text-center text-gray-400 text-sm">
              No students found.
            </div>
          ) : (
            filtered.map((student) => (
              <div
                key={student.id}
                onClick={() => { setSelected(student); setEditMode(false) }}
                className="bg-white rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md p-4"
                style={{
                  borderColor: selected?.id === student.id ? "#dc2626" : "#e5e7eb",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: "#dc2626" }}
                      >
                        {student.full_name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {student.full_name}
                        </p>
                        <p className="text-xs text-gray-400">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2 ml-10">
                      {student.courses.map((c) => (
                        <span
                          key={c}
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-xs text-gray-400">
                      Age {student.age}
                    </span>
                    {student.balance && (
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={
                          Number(student.balance.balance_due) === 0
                            ? { backgroundColor: "#dcfce7", color: "#166534" }
                            : { backgroundColor: "#fef3c7", color: "#92400e" }
                        }
                      >
                        ${Number(student.balance.balance_due).toFixed(2)} due
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail / Edit Panel */}
        <div className="sticky top-6">
          {!selected ? (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center text-gray-400">
              <div className="text-4xl mb-3">🎓</div>
              <p className="text-sm">Click a student to view details</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
              {/* Header */}
              <div
                className="px-6 py-4 border-b flex items-center justify-between"
                style={{ borderColor: "#f3f4f6" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: "#dc2626" }}
                  >
                    {selected.full_name[0]}
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 text-sm">
                      {selected.full_name}
                    </h2>
                    <p className="text-xs text-gray-400">
                      Enrolled{" "}
                      {new Date(selected.start_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleEdit(selected)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border-2 transition-all"
                  style={{ borderColor: "#dc2626", color: "#dc2626" }}
                >
                  ✏️ Edit
                </button>
              </div>

              <div className="p-6 flex flex-col gap-4">
                {!editMode ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Age", value: selected.age },
                        { label: "Education", value: selected.level_of_education },
                        { label: "Email", value: selected.email },
                        { label: "Phone", value: selected.phone || "—" },
                      ].map((f) => (
                        <div key={f.label}>
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                            {f.label}
                          </p>
                          <p className="text-sm text-gray-800 font-medium">
                            {f.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                        Courses
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selected.courses.map((c) => (
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

                    {/* Balance */}
                    {selected.balance && (
                      <div
                        className="rounded-xl p-4 grid grid-cols-3 gap-3 text-center"
                        style={{ backgroundColor: "#f9fafb" }}
                      >
                        {[
                          { label: "Expected", value: `$${Number(selected.balance.total_expected).toFixed(2)}` },
                          { label: "Paid", value: `$${Number(selected.balance.total_paid).toFixed(2)}`, color: "#16a34a" },
                          { label: "Balance Due", value: `$${Number(selected.balance.balance_due).toFixed(2)}`, color: Number(selected.balance.balance_due) > 0 ? "#dc2626" : "#16a34a" },
                        ].map((b) => (
                          <div key={b.label}>
                            <p className="text-xs text-gray-400 mb-0.5">{b.label}</p>
                            <p className="font-bold text-sm" style={{ color: b.color || "#1a1a1a" }}>
                              {b.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={editForm.full_name as string}
                          onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                          Age
                        </label>
                        <input
                          type="number"
                          value={editForm.age as number}
                          onChange={(e) => setEditForm({ ...editForm, age: parseInt(e.target.value) })}
                          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={editForm.email as string}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                          Phone
                        </label>
                        <input
                          type="text"
                          value={editForm.phone as string}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                        Courses
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {courseOptions.map((c) => {
                          const selected2 = (editForm.courses as string[])?.includes(c)
                          return (
                            <button
                              key={c}
                              onClick={() => toggleCourse(c)}
                              className="text-xs px-3 py-1.5 rounded-full font-semibold border-2 transition-all"
                              style={
                                selected2
                                  ? { backgroundColor: "#dc2626", borderColor: "#dc2626", color: "#fff" }
                                  : { borderColor: "#e5e7eb", color: "#374151" }
                              }
                            >
                              {c}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setEditMode(false)}
                        className="flex-1 py-2.5 rounded-lg text-sm font-semibold border-2 border-gray-200 text-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-50"
                        style={{ backgroundColor: "#dc2626" }}
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}