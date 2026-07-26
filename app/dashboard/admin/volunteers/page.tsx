import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import VolunteerApplicationsClient from "./VolunteerApplicationsClient"

export const dynamic = "force-dynamic"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export default async function VolunteerApplicationsPage() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== "admin") redirect("/login")

  const applications = await prisma.volunteerApplication.findMany({
    orderBy: { submitted_at: "desc" },
  })

  return <VolunteerApplicationsClient applications={applications} />
}
