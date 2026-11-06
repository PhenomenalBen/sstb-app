import type { Metadata } from "next"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core"
import "./globals.css"
import Providers from "./providers"

// Styles are imported above, so stop FontAwesome injecting them at runtime
// (prevents huge icons flashing before CSS loads).
config.autoAddCss = false

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

