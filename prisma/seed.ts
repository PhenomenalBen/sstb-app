import { PrismaClient } from "@prisma/client/edge"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"
import "dotenv/config"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const password = await bcrypt.hash("Admin@1234", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@sstb.org" },
    update: {},
    create: {
      name: "Ben Riak Changdar",
      email: "admin@sstb.org",
      password_hash: password,
      role: "admin",
      volunteer_type: null,
    },
  })

  console.log("Admin created:", admin.email)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())