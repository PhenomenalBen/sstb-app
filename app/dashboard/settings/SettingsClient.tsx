"use client"

import { useState } from "react"

type Props = {
  user: {
    name: string
    email: string
    role: string
    volunteer_type: string | null
  }
}

export default function SettingsClient({ user }: Props) {
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    email: user.email,
  })
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  })
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const roleLabel =
    user.role === "admin"
      ? "Administrator"
      : user.volunteer_type === "finance"
      ? "Finance Volunteer"
      : "Volunteer"

  const roleColor =
    user.role === "admin"
      ? { bg: "#fef2f2", text: "#dc2626" }
      : user.volunteer_type === "finance"
      ? { bg: "#e0f7fa", text: "#00838f" }
      : { bg: "#f3f4f6", text: "#374151" }

  const handleProfileSave = async () => {
    setProfileMsg(null)
    if (!profileForm.name || !profileForm.email) {
      setProfileMsg({ type: "error", text: "Name and email are required." })
      return
    }
    setProfileLoading(true)
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed")
      }
      setProfileMsg({ type: "success", text: "Profile updated successfully." })
    } catch (err: any) {
      setProfileMsg({ type: "error", text: err.message })
    }
    setProfileLoading(false)
  }

  const handlePasswordSave = async () => {
    setPasswordMsg(null)
    if (!passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_password) {
      setPasswordMsg({ type: "error", text: "All password fields are required." })
      return
    }
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." })
      return
    }
    if (passwordForm.new_password.length < 8) {
      setPasswordMsg({ type: "error", text: "New password must be at least 8 characters." })
      return
    }
    setPasswordLoading(true)
    try {
      const res = await fetch("/api/settings/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordForm),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed")
      }
      setPasswordMsg({ type: "success", text: "Password changed successfully." })
      setPasswordForm({ current_password: "", new_password: "", confirm_password: "" })
    } catch (err: any) {
      setPasswordMsg({ type: "error", text: err.message })
    }
    setPasswordLoading(false)
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your account credentials.
        </p>
      </div>

      {/* Account Badge */}
      <div className="bg-white rounded-xl border-2 border-gray-100 p-5 mb-6 flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
          style={{ backgroundColor: "#dc2626" }}
        >
          {user.name[0]}
        </div>
        <div>
          <p className="font-bold text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
          <span
            className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mt-1"
            style={{ backgroundColor: roleColor.bg, color: roleColor.text }}
          >
            {roleLabel}
          </span>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden mb-6">
        <div
          className="px-6 py-4 border-b"
          style={{ borderColor: "#f3f4f6" }}
        >
          <h2 className="font-bold text-gray-900">Profile Information</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Update your name and email address.
          </p>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {profileMsg && (
            <div
              className="px-4 py-3 rounded-lg text-sm font-medium"
              style={
                profileMsg.type === "success"
                  ? { backgroundColor: "#dcfce7", color: "#166534" }
                  : { backgroundColor: "#fee2e2", color: "#991b1b" }
              }
            >
              {profileMsg.text}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors"
            />
          </div>

          <button
            onClick={handleProfileSave}
            disabled={profileLoading}
            className="w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:-translate-y-0.5 disabled:opacity-50"
            style={{ backgroundColor: "#dc2626" }}
          >
            {profileLoading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>

      {/* Password Form */}
      <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
        <div
          className="px-6 py-4 border-b"
          style={{ borderColor: "#f3f4f6" }}
        >
          <h2 className="font-bold text-gray-900">Change Password</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Use a strong password of at least 8 characters.
          </p>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {passwordMsg && (
            <div
              className="px-4 py-3 rounded-lg text-sm font-medium"
              style={
                passwordMsg.type === "success"
                  ? { backgroundColor: "#dcfce7", color: "#166534" }
                  : { backgroundColor: "#fee2e2", color: "#991b1b" }
              }
            >
              {passwordMsg.text}
            </div>
          )}

          {[
            { label: "Current Password", key: "current_password", show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
            { label: "New Password", key: "new_password", show: showNew, toggle: () => setShowNew(!showNew) },
            { label: "Confirm New Password", key: "confirm_password", show: showConfirm, toggle: () => setShowConfirm(!showConfirm) },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                {field.label}
              </label>
              <div className="relative">
                <input
                  type={field.show ? "text" : "password"}
                  value={(passwordForm as any)[field.key]}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, [field.key]: e.target.value })
                  }
                  placeholder="••••••••"
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
            onClick={handlePasswordSave}
            disabled={passwordLoading}
            className="w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:-translate-y-0.5 disabled:opacity-50"
            style={{ backgroundColor: "#1a1a2e" }}
          >
            {passwordLoading ? "Updating..." : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  )
}