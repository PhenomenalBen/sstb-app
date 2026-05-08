
"use client"

import { useState } from "react"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLinkedinIn, faFacebook, faInstagram, faXTwitter } from "@fortawesome/free-brands-svg-icons"

const courses = ["Computer Literacy", "Functional English", "Foundational Math"]

export default function ApplyPage() {
  const [form, setForm] = useState({
    full_name: "",
    age: "",
    email: "",
    phone: "",
    level_of_education: "",
    courses_applied: [] as string[],
    motivation_text: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleCourseToggle = (course: string) => {
    setForm((prev) => ({
      ...prev,
      courses_applied: prev.courses_applied.includes(course)
        ? prev.courses_applied.filter((c) => c !== course)
        : [...prev.courses_applied, course],
    }))
  }

  const handleSubmit = async () => {
    setError("")

    // Basic validation
    if (!form.full_name || !form.age || !form.email || !form.level_of_education || !form.motivation_text) {
      setError("Please fill in all required fields.")
      return
    }
    if (form.courses_applied.length === 0) {
      setError("Please select at least one course.")
      return
    }
    if (form.motivation_text.trim().split(/\s+/).length < 50) {
      setError("Please write at least 50 words in your motivation text (approximately 300 words recommended).")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Submission failed")
      setSuccess(true)
    } catch {
      setError("Something went wrong. Please try again.")
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#f9fafb" }}>
        <div className="bg-white rounded-2xl p-12 text-center max-w-md w-full border-2 border-gray-100 shadow-lg">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Application Submitted!
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Thank you for applying to St Stephen Tech Bridge. We have received
            your application and will get back to you within 48 hours.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 rounded-lg text-white text-sm font-semibold"
            style={{ backgroundColor: "#dc2626" }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">

      {/* ── PAGE HERO ──────────────────────────────────────────────────── */}
      <section
        className="py-20 px-6 md:px-[5%] text-center"
        style={{ background: "linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)" }}
      >
        <div className="max-w-2xl mx-auto">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "#00BCD4" }}
          >
            Join the Bootcamp
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Student <span style={{ color: "#dc2626" }}>Application</span>
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Fill in the form below to apply for the 6-week bootcamp. We will
            review your application and get back to you within 48 hours.
          </p>
        </div>
      </section>

      {/* ── FORM ───────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 md:px-[5%]" style={{ backgroundColor: "#f9fafb" }}>
        <div className="max-w-2xl mx-auto">

          {/* Info bar */}
          <div
            className="rounded-xl p-5 mb-8 grid grid-cols-3 gap-4 text-center"
            style={{ backgroundColor: "#1a1a2e" }}
          >
            {[
              { icon: "📅", val: "6 Weeks", label: "Duration" },
              { icon: "💰", val: "$90", label: "Program Fee" },
              { icon: "🏅", val: "Certificate", label: "On Completion" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-xl mb-0.5">{s.icon}</div>
                <div className="text-sm font-bold" style={{ color: "#00BCD4" }}>{s.val}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 shadow-sm">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm mb-6">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-5">

              {/* Name + Age */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Full Name <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Age <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Your age"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors"
                  />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Email Address <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Phone Number{" "}
                    <span className="text-gray-400 normal-case font-normal">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+256 ..."
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors"
                  />
                </div>
              </div>

              {/* Education */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Level of Education <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <select
                  value={form.level_of_education}
                  onChange={(e) => setForm({ ...form, level_of_education: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors bg-white"
                >
                  <option value="">Select your education level</option>
                  <option>Primary School</option>
                  <option>Junior High / Middle School</option>
                  <option>Senior High School</option>
                  <option>SHS Graduate</option>
                  <option>Vocational / Technical</option>
                  <option>Some University</option>
                  <option>University Graduate</option>
                </select>
              </div>

              {/* Courses */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Courses Applied For <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {courses.map((course) => {
                    const selected = form.courses_applied.includes(course)
                    return (
                      <button
                        key={course}
                        type="button"
                        onClick={() => handleCourseToggle(course)}
                        className="px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all duration-200"
                        style={
                          selected
                            ? { backgroundColor: "#dc2626", borderColor: "#dc2626", color: "#fff" }
                            : { backgroundColor: "#fff", borderColor: "#e5e7eb", color: "#374151" }
                        }
                      >
                        {selected ? "✓ " : ""}{course}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Motivation */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Why Do You Want to Join? <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="Tell us about yourself and why you want to join the program..."
                  value={form.motivation_text}
                  onChange={(e) => setForm({ ...form, motivation_text: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Minimum 50 words. Around 300 words recommended — be as specific as possible.

                </p>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#dc2626" }}
              >
                {loading ? "Submitting..." : "Submit Application →"}
              </button>

              <p className="text-xs text-gray-400 text-center">
                Already a volunteer?{" "}
                <Link href="/login" style={{ color: "#dc2626" }} className="font-semibold hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <section className="py-12 px-6 text-center" style={{ backgroundColor: "#f9fafb", borderTop: "1px solid #e5e7eb" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Contact Info */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Contact</p>
              <div className="space-y-2">
                <p className="text-xs text-gray-600"><a href="tel:+233538002351" className="hover:text-red-600 transition-colors">+233-538-002-351</a></p>
                <p className="text-xs text-gray-600"><a href="mailto:ststephentechbridge@gmail.com" className="hover:text-cyan-600 transition-colors">ststephentechbridge@gmail.com</a></p>
                <p className="text-xs text-gray-600">South Sudan & Uganda</p>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Quick Links</p>
              <div className="space-y-1">
                <p><Link href="/" className="text-xs text-gray-600 hover:text-red-600 transition-colors">Home</Link></p>
                <p><Link href="/about" className="text-xs text-gray-600 hover:text-red-600 transition-colors">About</Link></p>
                <p><Link href="/people" className="text-xs text-gray-600 hover:text-red-600 transition-colors">Our Team</Link></p>
                <p><Link href="/volunteer" className="text-xs text-gray-600 hover:text-red-600 transition-colors">Volunteer</Link></p>
              </div>
            </div>
            
            {/* Social Media */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Follow Us</p>
              <div className="flex justify-center gap-2 flex-wrap">
                {[
                  { label: "LinkedIn", icon: faLinkedinIn, href: "#" },
                  { label: "Facebook", icon: faFacebook, href: "#" },
                  { label: "Instagram", icon: faInstagram, href: "#" },
                  { label: "X / Twitter", icon: faXTwitter, href: "#" },
                ].map((s) => (
                  <a key={s.label} href={s.href}
                    className="w-7 h-7 rounded flex items-center justify-center transition-all hover:-translate-y-0.5"
                    style={{ backgroundColor: "transparent", color: "#1a1a2e", border: "1px solid #1a1a2e" }}
                    title={s.label}>
                    <FontAwesomeIcon icon={s.icon} className="text-xs" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <p className="text-gray-400 italic text-xs">
              "In loving memory of{" "}
              <span className="text-gray-600 font-semibold">Stephen Riak</span>
              {" "}- whose vision of a better-educated community is the foundation of everything we do."
            </p>
            <p className="text-gray-400 text-xs mt-3">&copy; 2026 St Stephen Tech Bridge. All rights reserved.</p>
          </div>
        </div>
      </section>

    </div>
  )
}