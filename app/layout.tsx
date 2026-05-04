import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "St Stephen Tech Bridge",
  description: "Bridging the technological divide, one student at a time.",
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-black">
        <Navbar />
        <main className="flex-1 pt-20">
          {children}
        </main>
        <footer style={{ backgroundColor: "#1A1A2E" }} className="text-center text-gray-400 text-sm py-4">
          © {new Date().getFullYear()} St Stephen Tech Bridge. All rights reserved.
        </footer>
      </body>
    </html>
  )
}
