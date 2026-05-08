"use client"

import { useState } from "react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    setError("")
    if (!email) {
      setError("Please enter your email address.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed")
      }
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)" }}
    >
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/favicon.png"
            alt="SSTB"
            className="w-14 h-14 rounded-full mx-auto mb-3"
          />
          <h1 className="text-xl font-bold" style={{ color: "#dc2626" }}>
            St Stephen Tech Bridge
          </h1>
        </div>

        <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm overflow-hidden">
          <div
            className="px-8 py-5 border-b"
            style={{ borderColor: "#f3f4f6", backgroundColor: "#fafafa" }}
          >
            <h2 className="text-lg font-bold text-gray-900">Forgot Password</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Enter your email and we will send you a reset link.
            </p>
          </div>

          <div className="p-8">
            {success ? (
              <div className="text-center">
                <div className="text-5xl mb-4">📬</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Check your inbox
                </h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  If an account exists for{" "}
                  <span className="font-semibold text-gray-700">{email}</span>,
                  you will receive a password reset link shortly.
                </p>
                <Link
                  href="/login"
                  className="inline-block px-6 py-2.5 rounded-lg text-white text-sm font-semibold"
                  style={{ backgroundColor: "#dc2626" }}
                >
                  Back to Login
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
                  style={{ backgroundColor: "#dc2626" }}
                >
                  {loading ? "Sending..." : "Send Reset Link →"}
                </button>

                <Link
                  href="/login"
                  className="text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ← Back to Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}