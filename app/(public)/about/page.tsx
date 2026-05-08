import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLinkedinIn, faFacebook, faInstagram, faXTwitter } from "@fortawesome/free-brands-svg-icons"

export default function AboutPage() {
  return (
    <div className="w-full">

      {/* ── PAGE HERO ────────────────────────────────────────────────────── */}
      <section
        className="py-24 px-6 md:px-[5%] text-center"
        style={{ background: "linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)" }}
      >
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#00BCD4" }}>
            Who We Are
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About St Stephen <span style={{ color: "#dc2626" }}>Tech Bridge</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            A grassroots educational initiative built on the belief that every
            young person, regardless of displacement, poverty, or background,
            deserves access to the skills of the modern world.
          </p>
        </div>
      </section>

      {/* ── OVERVIEW ─────────────────────────────────────────────────────── */}
      <section id="overview" className="py-20 px-6 md:px-[5%] bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#00BCD4" }}>
              Overview
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What is St Stephen Tech Bridge?
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              St Stephen Tech Bridge (SSTB) is a community-driven organisation
              founded to close the digital, linguistic, and mathematical literacy
              gap among displaced and underserved youth, primarily in South Sudan
              and Uganda.
            </p>
            <p className="text-gray-600 leading-relaxed mb-5">
              Through a focused 6-week bootcamp, we train students in computer
              literacy, functional English, and foundational mathematics. Every
              graduate earns a certificate that opens doors to higher education
              and employment.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Beyond training, we offer affordable digital services to schools,
              NGOs, and small businesses, generating revenue that funds
              subsidised tuition for those who cannot afford even the modest
              program fee.
            </p>
          </div>

          {/* Stats side */}
          <div className="grid grid-cols-2 gap-5">
            {[
              { val: "2025", label: "Year Founded", icon: "📅", color: "#dc2626" },
              { val: "50+", label: "Students Trained", icon: "🎓", color: "#00BCD4" },
              { val: "3", label: "Core Courses", icon: "📚", color: "#1a1a1a" },
              { val: "$0", label: "Full Program Cost", icon: "💡", color: "#dc2626" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-6 text-center border-2 border-gray-100 hover:shadow-md transition-all duration-300"
              >
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-3xl font-bold mb-1" style={{ color: s.color }}>
                  {s.val}
                </div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE CHALLENGE ─────────────────────────────────────────────────── */}
      <section
        id="challenge"
        className="py-20 px-6 md:px-[5%] scroll-mt-20"
        style={{ backgroundColor: "#f9fafb" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#00BCD4" }}>
              The Challenge
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Problems We Are Solving
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Three interconnected barriers trap millions of young Africans in a
              cycle of missed opportunity. SSTB was built to break all three.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "💻",
                title: "The Digital Divide",
                color: "#dc2626",
                bg: "#fef2f2",
                points: [
                  "Most displaced youth have never used a computer",
                  "Digital skills are now required for most jobs",
                  "Without access, the gap widens every year",
                  "Infrastructure alone is not enough — training is critical",
                ],
              },
              {
                icon: "🗣️",
                title: "The English Barrier",
                color: "#00BCD4",
                bg: "#e0f7fa",
                points: [
                  "English is the language of higher education in East Africa",
                  "Most international employment requires English proficiency",
                  "Oral and written skills are both critical",
                  "Many students have zero formal English instruction",
                ],
              },
              {
                icon: "🔢",
                title: "Mathematical Illiteracy",
                color: "#1a1a1a",
                bg: "#f3f4f6",
                points: [
                  "Basic numeracy is required for financial independence",
                  "Math underpins every STEM and business field",
                  "Displacement interrupts years of schooling",
                  "Many arrive with primary-level or no math foundation",
                ],
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-xl p-8 border-2 border-transparent hover:shadow-lg transition-all duration-300"
                style={{ backgroundColor: card.bg }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5"
                  style={{ backgroundColor: card.color }}
                >
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {card.title}
                </h3>
                <ul className="space-y-2">
                  {card.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-sm text-gray-600">
                      <span style={{ color: card.color }} className="mt-0.5 flex-shrink-0">▸</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE SOLUTION ──────────────────────────────────────────────────── */}
      <section id="solution" className="py-20 px-6 md:px-[5%] bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#00BCD4" }}>
              The Solution
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How we Respond
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Our model is simple, affordable, and designed specifically for the
              communities we serve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "6-Week Bootcamp",
                desc: "An intensive, structured program covering computer literacy, English, and math, designed to deliver maximum impact in minimum time.",
                color: "#dc2626",
              },
              {
                step: "02",
                title: "Affordable Access",
                desc: "At just $0 for the full program, scholarships available, cost is never a reason to miss out. We believe education is a right, not a privilege.",
                color: "#00BCD4",
              },
              {
                step: "03",
                title: "Certified Graduates",
                desc: "Every student who completes the program receives a certificate of completion, giving them a credential they can use in job applications and further study.",
                color: "#1a1a1a",
              },
              {
                step: "04",
                title: "Community-Led",
                desc: "Our volunteers come from the same communities they serve - bringing cultural understanding, language skills, and genuine commitment to every class.",
                color: "#dc2626",
              },
              {
                step: "05",
                title: "Digital Services",
                desc: "Our commercial services arm - web development, graphics, printing - generates income that directly subsidises student fees.",
                color: "#00BCD4",
              },
              {
                step: "06",
                title: "Ongoing Support",
                desc: "Graduates don't disappear after 6 weeks. We maintain a network of alumni and continue to connect them with further opportunities.",
                color: "#1a1a1a",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="text-4xl font-bold mb-3 opacity-15"
                  style={{ color: s.color }}
                >
                  {s.step}
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: s.color }}
                >
                  {s.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VISION & MISSION ──────────────────────────────────────────────── */}
      <section
        id="vision"
        className="py-20 px-6 md:px-[5%] scroll-mt-20"
        style={{ backgroundColor: "#1a1a2e" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#00BCD4" }}>
              Our Foundation
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Vision & Mission
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision */}
            <div
              className="rounded-2xl p-8 border-2"
              style={{ borderColor: "#dc2626", backgroundColor: "#ffffff08" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-5"
                style={{ backgroundColor: "#dc2626" }}
              >
                🔭
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-gray-300 leading-relaxed">
                A generation of African youth, regardless of displacement,
                poverty, or circumstance - who are digitally literate, confident
                communicators, and active participants in the global economy.
              </p>
            </div>

            {/* Mission */}
            <div
              className="rounded-2xl p-8 border-2"
              style={{ borderColor: "#00BCD4", backgroundColor: "#ffffff08" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-5"
                style={{ backgroundColor: "#00BCD4" }}
              >
                🎯
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-300 leading-relaxed">
                To provide accessible, high-quality digital literacy, English, and
                mathematics education to displaced and underserved youth in South
                Sudan and Uganda - equipping them with the skills and
                certification to pursue higher education and meaningful employment.
              </p>
            </div>
          </div>

          {/* Memorial */}
          <div
            className="mt-10 rounded-xl p-6 text-center border"
            style={{ borderColor: "#dc262640", backgroundColor: "#ffffff08" }}
          >
            <p className="text-gray-400 italic text-sm">
              "In loving memory of{" "}
              <span className="text-white font-semibold">Stephen Riak</span>
              {" "}- whose dream of a better-educated, digitally empowered community
              is the foundation of everything we do."
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section
        className="py-16 px-6 text-center"
        style={{ backgroundColor: "#fef2f2" }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Be Part of the Story
          </h2>
          <p className="text-gray-600 mb-8">
            Apply as a student, join as a volunteer, or support our work.
            Every contribution moves us closer to the vision.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/apply"
              className="px-8 py-3 rounded-lg text-white font-semibold transition-all duration-300 hover:-translate-y-1"
              style={{ backgroundColor: "#dc2626" }}
            >
              Apply Now
            </Link>
            <Link
              href="/volunteer"
              className="px-8 py-3 rounded-lg font-semibold border-2 transition-all duration-300 hover:bg-gray-900 hover:text-white"
              style={{ borderColor: "#1a1a1a", color: "#1a1a1a" }}
            >
              Volunteer
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <section className="py-12 px-6 text-center" style={{ backgroundColor: "#f9fafb", borderTop: "1px solid #e5e7eb" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Contact Info */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Contact</p>
              <div className="space-y-2">
                <p className="text-xs text-gray-600"><a href="tel:+233538002351" className="hover:text-red-600 transition-colors">+233-538-002-351</a></p>
                <p className="text-xs text-gray-600"><a href="mailto:ststephentechbridge@gmail.com" className="hover:text-cyan-600 transition-colors">ststephentechbridge@gmail.com</a></p>
                <p className="text-xs text-gray-600">South Sudan & Uganda</p>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Quick Links</p>
              <div className="space-y-1">
                <p><Link href="/" className="text-xs text-gray-600 hover:text-red-600 transition-colors">Home</Link></p>
                <p><Link href="/about" className="text-xs text-gray-600 hover:text-red-600 transition-colors">About</Link></p>
                <p><Link href="/people" className="text-xs text-gray-600 hover:text-red-600 transition-colors">Our Team</Link></p>
                <p><Link href="/volunteer" className="text-xs text-gray-600 hover:text-red-600 transition-colors">Volunteer</Link></p>
              </div>
            </div>
            
            {/* Social Media */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Follow Us</p>
              <div className="flex justify-center gap-2 flex-wrap">
                {[
                  { label: "LinkedIn", icon: faLinkedinIn, href: "#" },
                  { label: "Facebook", icon: faFacebook, href: "#" },
                  { label: "Instagram", icon: faInstagram, href: "#" },
                  { label: "X / Twitter", icon: faXTwitter, href: "#" },
                ].map((s) => (
                  <a key={s.label} href={s.href}
                    className="w-7 h-7 rounded flex items-center justify-center transition-all hover:-translate-y-0.5"
                    style={{ backgroundColor: "transparent", color: "#1a1a2e", border: "1px solid #1a1a2e" }}
                    title={s.label}>
                    <FontAwesomeIcon icon={s.icon} className="text-xs" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <p className="text-gray-400 italic text-xs">
              "In loving memory of{" "}
              <span className="text-gray-600 font-semibold">Stephen Riak</span>
              {" "}- whose vision of a better-educated community is the foundation of everything we do."
            </p>
            <p className="text-gray-400 text-xs mt-3">&copy; 2026 St Stephen Tech Bridge. All rights reserved.</p>
          </div>
        </div>
      </section>

    </div>
  )
}