import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import SettingsClient from "./SettingsClient"

export default async function SettingsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <SettingsClient
      user={{
        name: (session.user as any)?.name || "",
        email: (session.user as any)?.email || "",
        role: (session.user as any)?.role || "",
        volunteer_type: (session.user as any)?.volunteer_type || null,
      }}
    />
  )
}