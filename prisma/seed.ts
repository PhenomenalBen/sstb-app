import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"
import "dotenv/config"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Credentials come from the environment — never hardcode them in the repo.
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@sstb.org"
  const name = process.env.SEED_ADMIN_NAME ?? "Ben Riak Changdar"
  const plainPassword = process.env.SEED_ADMIN_PASSWORD

  if (!plainPassword || plainPassword.length < 12) {
    throw new Error(
      "Set SEED_ADMIN_PASSWORD (at least 12 characters) in your environment before running the seed."
    )
  }

  const password = await bcrypt.hash(plainPassword, 12)

  // Only creates the admin if missing — never overwrites an existing password.
  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name,
      email,
      password_hash: password,
      role: "admin",
      volunteer_type: null,
    },
  })

  console.log("Admin ready:", admin.email)
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
