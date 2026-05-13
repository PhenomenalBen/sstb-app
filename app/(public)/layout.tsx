import Link from "next/link"
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
      <footer className="bg-[#f9fafb] border-t border-[#e5e7eb] text-center text-gray-600 text-xs py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-left">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500 mb-3">Contact</p>
              <div className="space-y-2">
                <p className="text-xs text-gray-600">
                  <a href="tel:+233538002351" className="hover:text-red-600 transition-colors">+233-538-002-351</a>
                </p>
                <p className="text-xs text-gray-600">
                  <a href="mailto:ststephentechbridge@gmail.com" className="hover:text-cyan-600 transition-colors">ststephentechbridge@gmail.com</a>
                </p>
                <p className="text-xs text-gray-600">South Sudan & Uganda</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500 mb-3">Quick Links</p>
              <div className="space-y-1">
                <p><Link href="/" className="text-xs text-gray-600 hover:text-red-600 transition-colors">Home</Link></p>
                <p><Link href="/about" className="text-xs text-gray-600 hover:text-red-600 transition-colors">About</Link></p>
                <p><Link href="/people" className="text-xs text-gray-600 hover:text-red-600 transition-colors">Our Team</Link></p>
                <p><Link href="/volunteer" className="text-xs text-gray-600 hover:text-red-600 transition-colors">Volunteer</Link></p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500 mb-3">Follow Us</p>
              <div className="space-y-2">
                <p className="text-xs text-gray-600">LinkedIn / Facebook / Instagram / X</p>
                <p className="text-xs text-gray-500">Stay connected with SSTB updates and volunteer opportunities.</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6">
            <p className="text-gray-500 italic text-[11px] mb-3">
              "In loving memory of <span className="text-gray-700 font-semibold">Stephen Riak</span> — whose vision of a better-educated community is the foundation of everything we do."
            </p>
            <p className="text-gray-400 text-[11px]">© {new Date().getFullYear()} St Stephen Tech Bridge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
