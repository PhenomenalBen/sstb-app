import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client/edge"
import { PrismaPg } from "@prisma/adapter-pg"
import { Resend } from "resend"
import crypto from "crypto"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })
const resend = new Resend(process.env.RESEND_API_KEY)
const sendFromName = process.env.RESEND_FROM_NAME ?? "SSTB"
const sendFromAddress = process.env.RESEND_FROM_EMAIL ?? "no-reply@ststephentechbridge.site"
const resetBaseUrl = process.env.NEXTAUTH_URL ?? "https://ststephentechbridge.site"

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    // Always return success even if user not found — security best practice
    if (!user) {
      return NextResponse.json({ success: true })
    }

    // Delete any existing tokens for this email
    await prisma.passwordResetToken.deleteMany({ where: { email } })

    // Create new token — expires in 1 hour
    const token = crypto.randomBytes(32).toString("hex")
    const expires_at = new Date(Date.now() + 60 * 60 * 1000)

    await prisma.passwordResetToken.create({
      data: { email, token, expires_at },
    })

    const resetUrl = `${resetBaseUrl}/reset-password?token=${token}`
    const from = `${sendFromName} <${sendFromAddress}>`

    await resend.emails.send({
      from,
      to: email,
      subject: "Reset your SSTB password",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #dc2626; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 20px;">
              St Stephen Tech Bridge
            </h1>
          </div>
          <div style="background: #f9fafb; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <h2 style="font-size: 18px; color: #111827; margin-top: 0;">
              Reset Your Password
            </h2>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              Hi ${user.name}, we received a request to reset your password.
              Click the button below to set a new password. This link expires in
              <strong>1 hour</strong>.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetUrl}"
                style="background: #dc2626; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block;">
                Reset Password →
              </a>
            </div>
            <p style="color: #9ca3af; font-size: 12px; line-height: 1.6;">
              If you did not request a password reset, you can safely ignore this email.
              Your password will not be changed.
            </p>
            <p style="color: #9ca3af; font-size: 12px;">
              Or copy this link into your browser:<br/>
              <a href="${resetUrl}" style="color: #dc2626; word-break: break-all;">${resetUrl}</a>
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Forgot password error:", err)
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
  }
}
