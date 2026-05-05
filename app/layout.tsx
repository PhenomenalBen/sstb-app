import type { Metadata } from "next"
import "./globals.css"
import Providers from "./providers"

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
      <body className="min-h-screen bg-white text-black">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

