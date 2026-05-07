import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export default async function VolunteerStudentsPage() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== "volunteer") redirect("/login")

  const students = await prisma.student.findMany({
    orderBy: { start_date: "desc" },
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Enrolled Students</h1>
        <p className="text-gray-500 text-sm mt-1">
          {students.length} student{students.length !== 1 ? "s" : ""} currently enrolled.
        </p>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
        {students.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-10">
            No students enrolled yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#1a1a2e" }}>
                {["Student", "Education", "Courses", "Enrolled"].map((h) => (
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
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: "#dc2626" }}
                      >
                        {student.full_name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {student.full_name}
                        </p>
                        <p className="text-xs text-gray-400">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600 text-xs">
                    {student.level_of_education}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
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
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {new Date(student.start_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}