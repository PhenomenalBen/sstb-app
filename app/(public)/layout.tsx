import Link from "next/link"
import { socialLinks } from "@/lib/socials"
import Navbar from "../components/Navbar"
import ScrollReveal from "@/components/ScrollReveal"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="public-site min-h-screen flex flex-col">
      <Navbar />
      <ScrollReveal />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <footer className="bg-[#f9fafb] border-t border-[#e5e7eb] text-center text-gray-700 text-sm py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-left">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-600 mb-4">Contact</p>
              <div className="space-y-2">
                <p className="text-base text-gray-700">
                  <a href="tel:+233538002351" className="hover:text-red-600 transition-colors">+233-538-002-351</a>
                </p>
                <p className="text-base text-gray-700">
                  <a href="mailto:ststephentechbridge@gmail.com" className="hover:text-cyan-600 transition-colors">ststephentechbridge@gmail.com</a>
                </p>
                <p className="text-base text-gray-700">South Sudan & Uganda</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-600 mb-4">Quick Links</p>
              <div className="space-y-2">
                <p><Link href="/" className="text-base text-gray-700 hover:text-red-600 transition-colors">Home</Link></p>
                <p><Link href="/about" className="text-base text-gray-700 hover:text-red-600 transition-colors">About</Link></p>
                <p><Link href="/people" className="text-base text-gray-700 hover:text-red-600 transition-colors">Our Team</Link></p>
                <p><Link href="/volunteer" className="text-base text-gray-700 hover:text-red-600 transition-colors">Volunteer</Link></p>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-600 mb-4">Follow Us</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-base text-gray-700 hover:text-red-600 transition-colors"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
              <div className="space-y-2 mt-2">
                <p className="text-sm text-gray-600">Stay connected with SSTB updates and volunteer opportunities.</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6">
            <p className="text-gray-600 italic text-sm mb-3">
              "In loving memory of <span className="text-gray-700 font-semibold">Stephen Riak</span> — whose vision of a better-educated community is the foundation of everything we do."
            </p>
            <p className="text-gray-600 text-sm">© {new Date().getFullYear()} St Stephen Tech Bridge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
