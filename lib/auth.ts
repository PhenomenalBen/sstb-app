import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { JWT } from "next-auth/jwt"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client/edge"
import { PrismaPg } from "@prisma/adapter-pg"

type Token = JWT & {
  role?: string
  volunteer_type?: string
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user) return null

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password_hash
        )

        if (!passwordMatch) return null

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
          volunteer_type: user.volunteer_type,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const typedToken = token as Token
      if (user) {
        typedToken.role = (user as any).role
        typedToken.volunteer_type = (user as any).volunteer_type
      }
      return typedToken
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