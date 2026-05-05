import Navbar from "../components/Navbar"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <footer
        style={{ backgroundColor: "#1a1a2e" }}
        className="text-center text-gray-400 text-sm py-4"
      >
        © {new Date().getFullYear()} St Stephen Tech Bridge. All rights reserved.
      </footer>
    </div>
  )
}
