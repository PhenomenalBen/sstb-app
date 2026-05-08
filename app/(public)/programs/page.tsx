import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLinkedinIn, faFacebook, faInstagram, faXTwitter } from "@fortawesome/free-brands-svg-icons"

export default function ProgramsPage() {
  return (
    <div className="w-full">

      {/* ── PAGE HERO ────────────────────────────────────────────────────── */}
      <section
        className="py-24 px-6 md:px-[5%] text-center"
        style={{ background: "linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)" }}
      >
        <div className="max-w-3xl mx-auto">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "#00BCD4" }}
          >
            What We Offer
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Programs &{" "}
            <span style={{ color: "#dc2626" }}>Services</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            We train students through our 6-week bootcamp and offer affordable
            digital services to organisations and individuals in our community.
          </p>
        </div>
      </section>

      {/* ── PROGRAMS ─────────────────────────────────────────────────────── */}
      <section id="programs" className="py-20 px-6 md:px-[5%] bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-14">
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#00BCD4" }}
            >
              Training
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Programs
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              A focused 6-week bootcamp covering three essential disciplines.
              Every student who completes the program earns a certificate.
            </p>
          </div>

          {/* Program Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                id: "computer",
                icon: "💻",
                title: "Computer Literacy",
                color: "#dc2626",
                bg: "#fef2f2",
                duration: "6 Weeks",
                modules: [
                  "Introduction to computers and operating systems",
                  "Typing skills and keyboard shortcuts",
                  "Microsoft Word - documents and formatting",
                  "Microsoft Excel - spreadsheets and basic formulas",
                  "Microsoft PowerPoint - presentations",
                  "Email etiquette and communication",
                  "File organisation and management",
                  "Safe and responsible internet use",
                ],
              },
              {
                id: "english",
                icon: "📖",
                title: "Functional English",
                color: "#00BCD4",
                bg: "#e0f7fa",
                duration: "6 Weeks",
                modules: [
                  "English grammar - tenses, sentence structure",
                  "Reading comprehension exercises",
                  "Academic and professional writing",
                  "Vocabulary building and word usage",
                  "Oral communication and presentations",
                  "Letter and email writing",
                  "CV and cover letter writing",
                  "Group discussion and listening skills",
                ],
              },
              {
                id: "math",
                icon: "➗",
                title: "Foundational Math",
                color: "#1a1a1a",
                bg: "#f3f4f6",
                duration: "6 Weeks",
                modules: [
                  "Number systems and place value",
                  "Addition, subtraction, multiplication, division",
                  "Fractions, decimals, and percentages",
                  "Ratios and proportions",
                  "Basic algebra and equations",
                  "Measurements and unit conversions",
                  "Data interpretation and simple statistics",
                  "Logical problem-solving techniques",
                ],
              },
            ].map((prog) => (
              <div
                key={prog.id}
                id={prog.id}
                className="rounded-2xl overflow-hidden border-2 border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 scroll-mt-24"
              >
                {/* Card Header */}
                <div
                  className="p-8"
                  style={{ backgroundColor: prog.bg }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4"
                    style={{ backgroundColor: prog.color }}
                  >
                    {prog.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {prog.title}
                  </h3>
                  <span
                    className="inline-block text-xs font-bold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: prog.color }}
                  >
                    {prog.duration}
                  </span>
                </div>

                {/* Modules */}
                <div className="p-8 bg-white">
                  <p
                    className="text-xs font-bold uppercase tracking-wider mb-4"
                    style={{ color: prog.color }}
                  >
                    What You Will Learn
                  </p>
                  <ul className="space-y-2">
                    {prog.modules.map((mod) => (
                      <li
                        key={mod}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <span style={{ color: prog.color }} className="flex-shrink-0 mt-0.5">▸</span>
                        {mod}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Program Info Bar */}
          <div
            className="rounded-2xl p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center"
            style={{ backgroundColor: "#1a1a2e" }}
          >
            {[
              { icon: "📅", val: "6 Weeks", label: "Total Duration" },
              { icon: "🏅", val: "100%", label: "Certification Rate" },
              { icon: "💰", val: "$0", label: "Full Program Fee" },
            ].map((info) => (
              <div key={info.label}>
                <div className="text-3xl mb-2">{info.icon}</div>
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ color: "#00BCD4" }}
                >
                  {info.val}
                </div>
                <div className="text-sm text-gray-400">{info.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section
        id="services"
        className="py-20 px-6 md:px-[5%] scroll-mt-20"
        style={{ backgroundColor: "#f9fafb" }}
      >
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-14">
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#00BCD4" }}
            >
              Commercial Services
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We offer affordable digital services to schools, NGOs, and
              businesses. Revenue from these services directly funds subsidised
              student fees, so every project you give us helps train a student.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                id: "web",
                icon: "🌐",
                title: "Web Development",
                color: "#dc2626",
                bg: "#fef2f2",
                desc: "Custom websites and web applications for schools, NGOs, churches, and small businesses. Clean, mobile-friendly, and affordable.",
                items: [
                  "Informational websites",
                  "Web application design",
                  "Landing pages",
                  "Maintenance & updates",
                ],
              },
              {
                id: "graphics",
                icon: "🎨",
                title: "Graphics Design",
                color: "#00BCD4",
                bg: "#e0f7fa",
                desc: "Professional branding and visual materials for organisations that want to make a strong impression.",
                items: [
                  "Logo design",
                  "Flyers & posters",
                  "Social media graphics",
                  "Presentation design",
                ],
              },
              {
                id: "cv",
                icon: "📄",
                title: "CV & Cover Letter",
                color: "#1a1a1a",
                bg: "#f3f4f6",
                desc: "Professional document preparation to help job seekers and students present themselves with confidence.",
                items: [
                  "CV writing & formatting",
                  "Cover letter writing",
                  "LinkedIn profile writing",
                  "Application proofreading",
                ],
              },
              {
                id: "printing",
                icon: "🖨️",
                title: "Printing & Scanning",
                color: "#dc2626",
                bg: "#fef2f2",
                desc: "Document printing, scanning, and typing services for individuals and organisations in our community.",
                items: [
                  "Document printing",
                  "Scanning to PDF",
                  "Typing services",
                  "Photocopying",
                ],
              },
            ].map((svc) => (
              <div
                key={svc.id}
                id={svc.id}
                className="rounded-2xl overflow-hidden border-2 border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white scroll-mt-24"
              >
                {/* Header */}
                <div className="p-6" style={{ backgroundColor: svc.bg }}>
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-3"
                    style={{ backgroundColor: svc.color }}
                  >
                    {svc.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {svc.title}
                  </h3>
                </div>

                {/* Body */}
                <div className="p-6">
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {svc.desc}
                  </p>
                  <ul className="space-y-1">
                    {svc.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm text-gray-500"
                      >
                        <span style={{ color: svc.color }}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Services CTA */}
          <div
            className="rounded-2xl p-10 text-center"
            style={{ backgroundColor: "#1a1a2e" }}
          >
            <h3 className="text-2xl font-bold text-white mb-3">
              Need Any of These Services?
            </h3>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto text-sm">
              Get in touch and we will provide a free quote. Every service you
              purchase helps fund a student's education.
            </p>
            <Link
              href="/people#contact"
              className="inline-block px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:-translate-y-1"
              style={{ backgroundColor: "#dc2626" }}
            >
              Contact Us →
            </Link>
          </div>
        </div>
      </section>

      {/* ── APPLY CTA ────────────────────────────────────────────────────── */}
      <section
        className="py-16 px-6 text-center"
        style={{ backgroundColor: "#fef2f2" }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Ready to Join the Bootcamp?
          </h2>
          <p className="text-gray-600 mb-8">
            Applications are open. Fill in a short form and our team will
            get back to you within 48 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/apply"
              className="px-8 py-3 rounded-lg text-white font-semibold transition-all duration-300 hover:-translate-y-1"
              style={{ backgroundColor: "#dc2626" }}
            >
              Apply as a Student
            </Link>
            <Link
              href="/volunteer"
              className="px-8 py-3 rounded-lg font-semibold border-2 transition-all duration-300 hover:bg-gray-900 hover:text-white"
              style={{ borderColor: "#1a1a1a", color: "#1a1a1a" }}
            >
              Volunteer to Teach
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}