import type { Metadata } from "next"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core"
import "./globals.css"
import Providers from "./providers"

// Styles are imported above, so stop FontAwesome injecting them at runtime
// (prevents huge icons flashing before CSS loads).
config.autoAddCss = false

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
})

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
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="min-h-screen bg-white text-black">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

