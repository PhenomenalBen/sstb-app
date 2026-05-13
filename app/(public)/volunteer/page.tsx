"use client"

import { useState } from "react"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHandsClapping } from "@fortawesome/free-solid-svg-icons"

const courseOptions = ["Computer Literacy", "Functional English", "Foundational Math", "None / General Support"]

export default function VolunteerPage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    level_of_education: "",
    skills: "",
    preferred_courses: [] as string[],
    availability: "",
    motivation_text: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleCourseToggle = (course: string) => {
    setForm((prev) => ({
      ...prev,
      preferred_courses: prev.preferred_courses.includes(course)
        ? prev.preferred_courses.filter((c) => c !== course)
        : [...prev.preferred_courses, course],
    }))
  }

  const handleSubmit = async () => {
    setError("")

    if (!form.full_name || !form.email || !form.level_of_education || !form.skills || !form.availability || !form.motivation_text) {
      setError("Please fill in all required fields.")
      return
    }
    if (form.preferred_courses.length === 0) {
      setError("Please select at least one preferred course or area.")
      return
    }
    if (form.motivation_text.trim().split(/\s+/).length < 50) {
      setError("Please write at least 50 words in your motivation text (approximately 300 words recommended).")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/volunteer-applications", {
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
          <div className="mb-4">
            <FontAwesomeIcon icon={faHandsClapping} className="text-6xl text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Application Received!
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Thank you for your interest in volunteering with St Stephen Tech
            Bridge. We will review your application and reach out within 48 hours.
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
        style={{ background: "linear-gradient(135deg, #ffffff 0%, #e0f7fa 100%)" }}
      >
        <div className="max-w-2xl mx-auto">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "#00BCD4" }}
          >
            Join the Team
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Volunteer <span style={{ color: "#00BCD4" }}>Application</span>
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Share your skills and time with students who need it most.
            Fill in the form below and we will get back to you within 48 hours.
          </p>
        </div>
      </section>

      {/* ── FORM ───────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 md:px-[5%]" style={{ backgroundColor: "#f9fafb" }}>
        <div className="max-w-2xl mx-auto">

          {/* Why volunteer info bar */}
          <div
            className="rounded-xl p-5 mb-8 grid grid-cols-3 gap-4 text-center"
            style={{ backgroundColor: "#1a1a2e" }}
          >
            {[
              { icon: "🌍", val: "Remote / Onsite", label: "Flexible Work" },
              { icon: "❤️", val: "Community", label: "Driven Purpose" },
              { icon: "📜", val: "Recognition", label: "Volunteer Cert" },
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

              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Full Name <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                />
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
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Phone{" "}
                    <span className="text-gray-400 normal-case font-normal">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+256 ..."
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
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
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400 transition-colors bg-white"
                >
                  <option value="">Select your education level</option>
                  <option>Senior High School</option>
                  <option>SHS Graduate</option>
                  <option>Vocational / Technical</option>
                  <option>Some University</option>
                  <option>University Graduate</option>
                  <option>Postgraduate</option>
                </select>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Skills & Background <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your relevant skills e.g. teaching experience, computer skills, finance background..."
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                />
              </div>

              {/* Preferred Courses */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Preferred Course / Area <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {courseOptions.map((course) => {
                    const selected = form.preferred_courses.includes(course)
                    return (
                      <button
                        key={course}
                        type="button"
                        onClick={() => handleCourseToggle(course)}
                        className="px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all duration-200"
                        style={
                          selected
                            ? { backgroundColor: "#00BCD4", borderColor: "#00BCD4", color: "#fff" }
                            : { backgroundColor: "#fff", borderColor: "#e5e7eb", color: "#374151" }
                        }
                      >
                        {selected ? "✓ " : ""}{course}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Availability <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <div className="flex gap-4">
                  {["Remote", "Onsite"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setForm({ ...form, availability: option.toLowerCase() })}
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold border-2 transition-all duration-200"
                      style={
                        form.availability === option.toLowerCase()
                          ? { backgroundColor: "#00BCD4", borderColor: "#00BCD4", color: "#fff" }
                          : { backgroundColor: "#fff", borderColor: "#e5e7eb", color: "#374151" }
                      }
                    >
                      {option === "Remote" ? "🌐 " : "📍 "}{option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Motivation */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Why Do You Want to Volunteer? <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="Tell us why you want to volunteer with SSTB and what you hope to contribute..."
                  value={form.motivation_text}
                  onChange={(e) => setForm({ ...form, motivation_text: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Minimum 50 words. Around 300 words recommended.
                </p>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#00BCD4" }}
              >
                {loading ? "Submitting..." : "Submit Volunteer Application →"}
              </button>

              <p className="text-xs text-gray-400 text-center">
                Want to enroll as a student instead?{" "}
                <Link href="/apply" style={{ color: "#dc2626" }} className="font-semibold hover:underline">
                  Apply here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}