import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { escapeHtml, limitByIp, serverError } from "@/lib/security"

const resend = new Resend(process.env.RESEND_API_KEY)
const sendFromName = process.env.RESEND_FROM_NAME ?? "SSTB Contact Form"
const sendFromAddress = process.env.RESEND_FROM_EMAIL ?? "contact@ststephentechbridge.site"
const contactRecipient = process.env.CONTACT_EMAIL ?? "ststephentechbridge@gmail.com"

const LIMITS = { name: 100, email: 200, subject: 200, message: 5000 }

export async function POST(request: NextRequest) {
  // 5 messages per IP per 10 minutes
  const limited = limitByIp(request, "contact", 5, 10 * 60 * 1000)
  if (limited) return limited

  try {
    const body = await request.json()
    const name = typeof body.name === "string" ? body.name.trim() : ""
    const email = typeof body.email === "string" ? body.email.trim() : ""
    const subject = typeof body.subject === "string" ? body.subject.trim() : ""
    const message = typeof body.message === "string" ? body.message.trim() : ""

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (
      name.length > LIMITS.name ||
      email.length > LIMITS.email ||
      subject.length > LIMITS.subject ||
      message.length > LIMITS.message
    ) {
      return NextResponse.json({ error: "One or more fields are too long" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const from = `${sendFromName} <${sendFromAddress}>`

    // Strip line breaks from the subject header.
    const safeSubjectHeader = subject.replace(/[\r\n]+/g, " ")

    // Send email — every user-supplied value is HTML-escaped.
    const { data, error } = await resend.emails.send({
      from,
      to: [contactRecipient],
      replyTo: email,
      subject: `SSTB Contact: ${safeSubjectHeader}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">New Contact Form Submission</h2>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #dc2626;">
              ${escapeHtml(message).replace(/\n/g, "<br>")}
            </div>
          </div>
          <p style="color: #666; font-size: 14px;">
            This message was sent from the SSTB website contact form.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (error) {
    return serverError("Contact API error", error)
  }
}
