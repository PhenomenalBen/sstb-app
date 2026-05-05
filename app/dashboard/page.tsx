import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) redirect("/login")

  const role = (session.user as any)?.role
  const volunteerType = (session.user as any)?.volunteer_type

  if (role === "admin") redirect("/dashboard/admin")
  if (role === "volunteer" && volunteerType === "finance") redirect("/dashboard/finance")
  if (role === "volunteer") redirect("/dashboard/volunteer")

  redirect("/login")
}