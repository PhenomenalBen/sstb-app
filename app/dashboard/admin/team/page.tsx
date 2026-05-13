import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import TeamClient from "./TeamClient"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export default async function TeamPage() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== "admin") redirect("/login")

  const [users, volunteers] = await Promise.all([
    prisma.user.findMany({ orderBy: { created_at: "desc" } }),
    prisma.volunteer.findMany({ orderBy: { start_date: "desc" } }),
  ])

  return <TeamClient users={users} volunteers={volunteers} />
}