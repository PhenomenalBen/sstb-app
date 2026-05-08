"use client"

import { useState } from "react"

function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    setError("")
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError("Please fill in all fields.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed")
      setSuccess(true)
      setForm({ name: "", email: "", subject: "", message: "" })
    } catch {
      setError("Something went wrong. Please try again or email us directly.")
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 shadow-sm flex flex-col items-center justify-center text-center min-h-64">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
        <p className="text-gray-500 text-sm mb-6">
          Thank you for reaching out. We will get back to you within 24–48 hours.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="px-6 py-2.5 rounded-lg text-white text-sm font-semibold"
          style={{ backgroundColor: "#dc2626" }}
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
            Subject
          </label>
          <input
            type="text"
            placeholder="What is this about?"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
            Message
          </label>
          <textarea
            rows={5}
            placeholder="Tell us how we can help..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
          style={{ backgroundColor: "#dc2626" }}
        >
          {loading ? "Sending..." : "Send Message →"}
        </button>

        <p className="text-xs text-gray-400 text-center">
          We typically respond within 24–48 hours.
        </p>
      </div>
    </div>
  )
}

export default ContactForm