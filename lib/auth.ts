import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { JWT } from "next-auth/jwt"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { getClientIp, rateLimit } from "@/lib/security"

type Token = JWT & {
  role?: string
  volunteer_type?: string | null
  token_version?: number
  checked_at?: number
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

// How often a signed-in session is re-validated against the database.
// This is what makes password changes and role changes take effect.
const SESSION_RECHECK_MS = 60 * 1000
const LOGIN_WINDOW_MS = 15 * 60 * 1000

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) return null

        const email = String(credentials.email).trim().toLowerCase()
        const ip = request ? getClientIp(request) : "unknown"

        // Brute-force protection: per account and per IP.
        if (
          !rateLimit(`login-email:${email}`, 10, LOGIN_WINDOW_MS) ||
          !rateLimit(`login-ip:${ip}`, 30, LOGIN_WINDOW_MS)
        ) {
          console.warn(`Login rate limit hit for ${email} from ${ip}`)
          return null
        }

        const user = await prisma.user.findFirst({
          where: { email: { equals: email, mode: "insensitive" } },
        })

        if (!user) return null

        const passwordMatch = await bcrypt.compare(
          String(credentials.password),
          user.password_hash
        )

        if (!passwordMatch) return null

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
          volunteer_type: user.volunteer_type,
          token_version: user.token_version,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const t = token as Token

      // Fresh sign-in
      if (user) {
        const u = user as any
        t.role = u.role
        t.volunteer_type = u.volunteer_type
        t.token_version = u.token_version ?? 0
        t.checked_at = Date.now()
        return t
      }

      // Existing session: periodically re-check the user in the database so
      // that password resets/changes revoke old sessions and role changes
      // apply without waiting for the token to expire.
      if (!t.checked_at || Date.now() - t.checked_at > SESSION_RECHECK_MS) {
        try {
          const id = Number(t.sub)
          const dbUser = Number.isInteger(id)
            ? await prisma.user.findUnique({
                where: { id },
                select: { name: true, email: true, role: true, volunteer_type: true, token_version: true },
              })
            : null

          if (!dbUser || dbUser.token_version !== (t.token_version ?? 0)) {
            return null // invalidates the session
          }

          t.name = dbUser.name
          t.email = dbUser.email
          t.role = dbUser.role
          t.volunteer_type = dbUser.volunteer_type
          t.checked_at = Date.now()
        } catch (err) {
          // Database hiccup: keep the session and try again on the next request.
          console.error("Session re-check failed:", err)
        }
      }

      return t
    },
    async session({ session, token }) {
      const typedToken = token as Token
      if (session.user) {
        ;(session.user as any).role = typedToken.role
        ;(session.user as any).volunteer_type = typedToken.volunteer_type
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
})
