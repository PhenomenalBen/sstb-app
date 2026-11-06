import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Resend } from "resend"
import crypto from "crypto"
import { auth } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { escapeHtml, serverError } from "@/lib/security"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const sendFromName = process.env.RESEND_FROM_NAME ?? "SSTB"
const sendFromAddress = process.env.RESEND_FROM_EMAIL ?? "no-reply@ststephentechbridge.site"
const baseUrl = process.env.NEXTAUTH_URL ?? "https://ststephentechbridge.site"

// New volunteers get 3 days to set their password.
const SETUP_LINK_TTL_MS = 72 * 60 * 60 * 1000

async function sendSetupEmail(to: string, name: string, setupUrl: string): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("Volunteer invite: RESEND_API_KEY is not configured; returning link to admin instead.")
    return false
  }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: `${sendFromName} <${sendFromAddress}>`,
      to,
      subject: "Welcome to SSTB — set up your dashboard account",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #dc2626; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 20px;">St Stephen Tech Bridge</h1>
          </div>
          <div style="background: #f9fafb; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <h2 style="font-size: 18px; color: #111827; margin-top: 0;">Welcome aboard!</h2>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              Hi ${escapeHtml(name)}, your volunteer application has been accepted and a dashboard
              account has been created for you. Click below to choose your password.
              This link expires in <strong>3 days</strong>.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${setupUrl}"
                style="background: #dc2626; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block;">
                Set My Password →
              </a>
            </div>
            <p style="color: #9ca3af; font-size: 12px;">
              Or copy this link into your browser:<br/>
              <a href="${setupUrl}" style="color: #dc2626; word-break: break-all;">${setupUrl}</a>
            </p>
          </div>
        </div>
      `,
    })
    if (error) {
      console.error("Volunteer invite email failed:", error)
      return false
    }
    return true
  } catch (err) {
    console.error("Volunteer invite email failed:", err)
    return false
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id: rawId } = await params
  const id = parseInt(rawId, 10)

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }
  const { status, position, createAccount, volunteerType } = body

  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid application id" }, { status: 400 })
  }

  if (!["accepted", "rejected", "pending"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  try {
    const application = await prisma.volunteerApplication.findUnique({ where: { id } })
    if (!application) {
      return NextResponse.json({ error: "Application not found." }, { status: 404 })
    }

    let setupUrl: string | null = null
    let emailSent = false

    if (status === "accepted") {
      const existing = await prisma.volunteer.findUnique({
        where: { application_id: id },
      })

      if (!existing) {
        if (createAccount) {
          const emailTaken = await prisma.user.findUnique({ where: { email: application.email } })
          if (emailTaken) {
            return NextResponse.json(
              { error: "A dashboard account with this email already exists." },
              { status: 409 }
            )
          }
        }

        const token = createAccount ? crypto.randomBytes(32).toString("hex") : null
        // Random, never-shared password. The volunteer sets their own via the link.
        const placeholderHash = createAccount
          ? await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 12)
          : null

        await prisma.$transaction(async (tx) => {
          await tx.volunteerApplication.update({ where: { id }, data: { status } })

          let userId: number | null = null
          if (createAccount && placeholderHash && token) {
            const user = await tx.user.create({
              data: {
                name: application.full_name,
                email: application.email,
                password_hash: placeholderHash,
                role: "volunteer",
                volunteer_type: volunteerType === "finance" ? "finance" : "other",
              },
            })
            userId = user.id

            await tx.passwordResetToken.create({
              data: {
                email: application.email,
                token,
                expires_at: new Date(Date.now() + SETUP_LINK_TTL_MS),
              },
            })
          }

          await tx.volunteer.create({
            data: {
              full_name: application.full_name,
              level_of_education: application.level_of_education,
              courses: application.preferred_courses,
              availability: application.availability,
              position: typeof position === "string" && position.trim() ? position.trim() : "Volunteer",
              start_date: new Date(),
              application_id: id,
              user_id: userId,
            },
          })
        })

        if (token) {
          setupUrl = `${baseUrl}/reset-password?token=${token}`
          emailSent = await sendSetupEmail(application.email, application.full_name, setupUrl)
        }
      } else {
        await prisma.volunteerApplication.update({ where: { id }, data: { status } })
      }
    } else {
      await prisma.volunteerApplication.update({ where: { id }, data: { status } })
    }

    return NextResponse.json({
      success: true,
      accountCreated: Boolean(setupUrl),
      emailSent,
      // Only returned when the email could not be sent, so the admin can share it manually.
      setupUrl: setupUrl && !emailSent ? setupUrl : null,
    })
  } catch (err) {
    return serverError("Volunteer PATCH error", err)
  }
}
