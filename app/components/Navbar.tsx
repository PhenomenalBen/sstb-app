"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const navItems: {
  label: string
  href: string
  dropdown?: { label: string; href: string }[]
}[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    dropdown: [
      { label: "Overview", href: "/about#overview" },
      { label: "The Challenge", href: "/about#challenge" },
      { label: "The Solution", href: "/about#solution" },
      { label: "Vision & Mission", href: "/about#vision" },
    ],
  },
  {
    label: "Programs & Services",
    href: "/programs",
    dropdown: [
      { label: "Programs", href: "/programs#programs" },
      { label: "Services", href: "/programs#services" },
    ],
  },
  {
    label: "News & Updates",
    href: "/news",
    dropdown: [
      { label: "Latest News", href: "/news" },
      { label: "Announcements", href: "/news#announcements" },
      { label: "Cohort Updates", href: "/news#cohorts" },
    ],
  },
  {
    label: "People & Contact",
    href: "/people",
    dropdown: [
      { label: "Our Team", href: "/people#team" },
      { label: "Contact Us", href: "/people#contact" },
    ],
  },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <style>{`
        .nav-item {
          position: relative;
        }

        .nav-item .dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          background: white;
          min-width: 200px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          border-top: 2px solid #dc2626;
          z-index: 100;
          opacity: 0;
          transform: translateY(-8px);
          pointer-events: none;
          transition: opacity 0.22s ease, transform 0.22s ease;
        }

        .nav-item:hover .dropdown {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .nav-item .nav-label::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: #dc2626;
          transition: width 0.3s ease;
        }

        .nav-item:hover .nav-label::after {
          width: 100%;
        }

        .nav-item .nav-label {
          position: relative;
          display: block;
          padding: 8px 0;
          font-size: 0.875rem;
          font-weight: 500;
          color: #1f2937;
          text-decoration: none;
          transition: color 0.2s ease;
          white-space: nowrap;
        }

        .nav-item:hover .nav-label {
          color: #dc2626;
        }

        .dropdown a {
          display: block;
          padding: 10px 20px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          text-decoration: none;
          transition: color 0.15s ease, padding-left 0.15s ease;
        }

        .dropdown a:hover {
          color: #dc2626;
          padding-left: 28px;
        }
      `}</style>

      <nav
        className="fixed w-full top-0 z-50 bg-white transition-all duration-300"
        style={{
          boxShadow: scrolled
            ? "0 4px 20px rgba(0,0,0,0.15)"
            : "0 2px 10px rgba(0,0,0,0.08)",
          padding: scrolled ? "0.65rem 5%" : "1.1rem 5%",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src="/favicon.png"
              alt="SSTB Logo"
              width={36}
              height={36}
              className="rounded-full"
            />
            <span
              className="font-bold text-lg leading-tight hidden sm:block"
              style={{ color: "#dc2626" }}
            >
              St Stephen{" "}
              <span style={{ color: "#00BCD4" }}>Tech Bridge</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-8 list-none flex-1 justify-center m-0 p-0">
            {navItems.map((item) => (
              <li key={item.label} className="nav-item">
                <Link href={item.href} className="nav-label">
                  {item.label}
                </Link>

                {item.dropdown && (
                  <div className="dropdown">
                    {item.dropdown.map((sub) => (
                      <Link key={sub.label} href={sub.href}>
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/volunteer"
              className="text-sm font-semibold px-4 py-2 rounded-lg border-2 transition-all duration-300"
              style={{ borderColor: "#00BCD4", color: "#00BCD4" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#00BCD4"
                ;(e.currentTarget as HTMLElement).style.color = "#ffffff"
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"
                ;(e.currentTarget as HTMLElement).style.color = "#00BCD4"
              }}
            >
              Volunteer
            </Link>
            <Link
              href="/apply"
              className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-all duration-300"
              style={{ backgroundColor: "#dc2626" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#b91c1c"
                ;(e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(220,38,38,0.3)"
                ;(e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#dc2626"
                ;(e.currentTarget as HTMLElement).style.boxShadow = "none"
                ;(e.currentTarget as HTMLElement).style.transform = "translateY(0)"
              }}
            >
              Apply Now
            </Link>
            <Link
              href="/login"
              className="text-sm font-semibold px-4 py-2 rounded-lg border-2 transition-all duration-300"
              style={{ borderColor: "#dc2626", color: "#dc2626" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#dc2626"
                ;(e.currentTarget as HTMLElement).style.color = "#ffffff"
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"
                ;(e.currentTarget as HTMLElement).style.color = "#dc2626"
              }}
            >
              Login
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-gray-800 focus:outline-none p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-5 pb-5 overflow-y-auto max-h-screen">
            {navItems.map((item) => (
              <div key={item.label} className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    className="block py-3 text-sm font-medium text-gray-800 hover:text-red-600 flex-1"
                    onClick={() => !item.dropdown && setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.dropdown && (
                    <button
                      onClick={() =>
                        setMobileExpanded(
                          mobileExpanded === item.label ? null : item.label
                        )
                      }
                      className="p-2 text-gray-500"
                    >
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          mobileExpanded === item.label ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </div>
                {item.dropdown && mobileExpanded === item.label && (
                  <div
                    className="pl-4 pb-3 flex flex-col gap-1 border-l-2"
                    style={{ borderColor: "#dc2626" }}
                  >
                    {item.dropdown.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className="py-2 text-sm text-gray-600 hover:text-red-600 font-medium"
                        onClick={() => setMenuOpen(false)}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="flex flex-col gap-3 pt-4">
              <Link
                href="/volunteer"
                className="text-center text-sm font-semibold px-4 py-2 rounded-lg border-2"
                style={{ borderColor: "#00BCD4", color: "#00BCD4" }}
                onClick={() => setMenuOpen(false)}
              >
                Volunteer
              </Link>
              <Link
                href="/apply"
                className="text-center text-sm font-semibold px-4 py-2 rounded-lg text-white"
                style={{ backgroundColor: "#dc2626" }}
                onClick={() => setMenuOpen(false)}
              >
                Apply Now
              </Link>
              <Link
                href="/login"
                className="text-center text-sm font-semibold px-4 py-2 rounded-lg border-2"
                style={{ borderColor: "#dc2626", color: "#dc2626" }}
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}