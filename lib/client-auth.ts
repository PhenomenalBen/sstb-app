"use client"

import { signOut } from "next-auth/react"

export async function signOutAndRedirectToLogin() {
  await signOut({ redirect: false, redirectTo: "/login" })
  window.location.replace("/login")
}
