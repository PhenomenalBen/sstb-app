import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json()

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 })
  }

  try {
    await resend.emails.send({
      from: "SSTB Contact Form <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL!,
      subject: `[SSTB Contact] ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #dc2626; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">
              New Message — St Stephen Tech Bridge
            </h1>
          </div>
          <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #6b7280; width: 80px;">Name</td>
                <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #111827;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #6b7280;">Email</td>
                <td style="padding: 8px 0; font-size: 14px; color: #111827;">
                  <a href="mailto:${email}" style="color: #dc2626;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #6b7280;">Subject</td>
                <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #111827;">${subject}</td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
            <p style="font-size: 13px; color: #6b7280; margin-bottom: 8px;">Message</p>
            <p style="font-size: 14px; color: #111827; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
              Sent via the SSTB website contact form.
              Reply directly to <a href="mailto:${email}" style="color: #dc2626;">${email}</a>.
            </p>
          </div>
        </div>
      `,
      replyTo: email,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Email error:", err)
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 })
  }
}