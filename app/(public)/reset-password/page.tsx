"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [form, setForm] = useState({
    password: "",
    confirm: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [validating, setValidating] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)

  useEffect(() => {
    if (!token) {
      setValidating(false)
      return
    }
    fetch(`/api/auth/verify-reset-token?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        setTokenValid(data.valid)
        setValidating(false)
      })
      .catch(() => {
        setTokenValid(false)
        setValidating(false)
      })
  }, [token])

  const handleSubmit = async () => {
    setError("")
    if (!form.password || !form.confirm) {
      setError("Please fill in both fields.")
      return
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.")
      return
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: form.password }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed")
      }
      setSuccess(true)
      setTimeout(() => router.push("/login"), 3000)
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  if (validating) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-gray-500 text-sm">Validating your reset link...</p>
      </div>
    )
  }

  if (!token || !tokenValid) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">❌</div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Invalid or Expired Link
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          This reset link is invalid or has already been used.
          Please request a new one.
        </p>
        <Link
          href="/forgot-password"
          className="inline-block px-6 py-2.5 rounded-lg text-white text-sm font-semibold"
          style={{ backgroundColor: "#dc2626" }}
        >
          Request New Link
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <FontAwesomeIcon icon={faCircleCheck} className="text-5xl text-green-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Password Reset!
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          Your password has been updated successfully.
        </p>
        <p className="text-xs text-gray-400">
          Redirecting to login in 3 seconds...
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {[
        { label: "New Password", key: "password", show: showPassword, toggle: () => setShowPassword(!showPassword) },
        { label: "Confirm Password", key: "confirm", show: showConfirm, toggle: () => setShowConfirm(!showConfirm) },
      ].map((field) => (
        <div key={field.key}>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
            {field.label}
          </label>
          <div className="relative">
            <input
              type={field.show ? "text" : "password"}
              placeholder="••••••••"
              value={(form as any)[field.key]}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 pr-16 text-sm focus:outline-none focus:border-red-400 transition-colors"
            />
            <button
              type="button"
              onClick={field.toggle}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600"
            >
              {field.show ? "HIDE" : "SHOW"}
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
        style={{ backgroundColor: "#dc2626" }}
      >
        {loading ? "Updating..." : "Reset Password →"}
      </button>

      <Link
        href="/login"
        className="text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        ← Back to Login
      </Link>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)" }}
    >
      <div className="w-full max-w-md">
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
            <h2 className="text-lg font-bold text-gray-900">Reset Password</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Enter your new password below.
            </p>
          </div>

          <div className="p-8">
            <Suspense fallback={
              <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>
            }>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}