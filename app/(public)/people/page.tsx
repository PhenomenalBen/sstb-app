import Link from "next/link"

const team = [
  {
    name: "Ben Riak Changdar",
    role: "Founder & Project Lead",
    bio: "Ben founded St Stephen Tech Bridge with a vision of bridging the digital divide for displaced youth in South Sudan and Uganda. He leads the organisation's strategy, partnerships, and technology development.",
    emoji: "👨‍💻",
    color: "#dc2626",
    social: {
      linkedin: "#",
      facebook: "#",
      instagram: "#",
      twitter: "#",
    },
  },
  {
    name: "Volunteer Name",
    role: "Computer Literacy Instructor",
    bio: "Passionate about technology education and empowering youth with practical digital skills. Leads the computer literacy module across all cohorts.",
    emoji: "👩‍🏫",
    color: "#00BCD4",
    social: {
      linkedin: "#",
      facebook: "#",
    },
  },
  {
    name: "Volunteer Name",
    role: "English Instructor",
    bio: "An experienced English language educator committed to helping students communicate confidently in academic and professional environments.",
    emoji: "📖",
    color: "#1a1a1a",
    social: {
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    name: "Volunteer Name",
    role: "Finance Volunteer",
    bio: "Manages the organisation's financial records, student fee tracking, and ensures transparent and accountable use of all funds.",
    emoji: "📊",
    color: "#dc2626",
    social: {
      linkedin: "#",
    },
  },
]

export default function PeoplePage() {
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
            The People Behind SSTB
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            People &{" "}
            <span style={{ color: "#dc2626" }}>Contact</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Meet the volunteers and staff who make St Stephen Tech Bridge
            possible — and get in touch with us.
          </p>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────────────────────────────── */}
      <section id="team" className="py-20 px-6 md:px-[5%] bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-14">
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#00BCD4" }}
            >
              Our Team
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The People Who Make It Happen
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Every member of our team is a volunteer driven by a shared belief
              that education changes lives.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl border-2 border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden text-center"
              >
                {/* Photo / Avatar */}
                <div
                  className="h-40 flex items-center justify-center text-6xl"
                  style={{
                    background: `linear-gradient(135deg, ${member.color}22 0%, ${member.color}44 100%)`,
                  }}
                >
                  {member.emoji}
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p
                    className="text-sm font-semibold mb-3"
                    style={{ color: member.color }}
                  >
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">
                    {member.bio}
                  </p>

                  {/* Social Links */}
                  <div className="flex justify-center gap-2 flex-wrap">
                    {member.social.linkedin && (
                      <a
                        href={member.social.linkedin}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all duration-200 hover:-translate-y-0.5"
                        style={{ backgroundColor: "#fef2f2", color: member.color }}
                        title="LinkedIn"
                      >
                        💼
                      </a>
                    )}
                    {member.social.facebook && (
                      <a
                        href={member.social.facebook}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all duration-200 hover:-translate-y-0.5"
                        style={{ backgroundColor: "#fef2f2", color: member.color }}
                        title="Facebook"
                      >
                        📘
                      </a>
                    )}
                    {member.social.instagram && (
                      <a
                        href={member.social.instagram}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all duration-200 hover:-translate-y-0.5"
                        style={{ backgroundColor: "#fef2f2", color: member.color }}
                        title="Instagram"
                      >
                        📸
                      </a>
                    )}
                    {member.social.twitter && (
                      <a
                        href={member.social.twitter}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all duration-200 hover:-translate-y-0.5"
                        style={{ backgroundColor: "#fef2f2", color: member.color }}
                        title="X / Twitter"
                      >
                        🐦
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Join the team CTA */}
          <div
            className="mt-14 rounded-2xl p-8 text-center"
            style={{ backgroundColor: "#f9fafb", border: "2px dashed #e5e7eb" }}
          >
            <div className="text-4xl mb-3">🙌</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Want to Join the Team?
            </h3>
            <p className="text-gray-500 text-sm mb-5 max-w-md mx-auto">
              We are always looking for passionate volunteers — whether you want
              to teach, support operations, or help with finances.
            </p>
            <Link
              href="/volunteer"
              className="inline-block px-6 py-2.5 rounded-lg text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-1"
              style={{ backgroundColor: "#dc2626" }}
            >
              Apply to Volunteer →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <section
        id="contact"
        className="py-20 px-6 md:px-[5%] scroll-mt-20"
        style={{ backgroundColor: "#f9fafb" }}
      >
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-14">
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#00BCD4" }}
            >
              Get in Touch
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Have a question, want to partner with us, or need a service quote?
              We would love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Left — Contact Info */}
            <div className="flex flex-col gap-6">

              {/* Contact items */}
              {[
                {
                  icon: "📞",
                  label: "Phone",
                  value: "+233-538-002-351",
                  href: "tel:+233538002351",
                  color: "#dc2626",
                },
                {
                  icon: "✉️",
                  label: "Email",
                  value: "ststephentechbridge@gmail.com",
                  href: "mailto:ststephentechbridge@gmail.com",
                  color: "#00BCD4",
                },
                {
                  icon: "📍",
                  label: "Location",
                  value: "South Sudan & Uganda (Remote operations)",
                  href: null,
                  color: "#1a1a1a",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-4 bg-white rounded-xl p-5 border-2 border-gray-100 hover:shadow-md transition-all duration-200"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: item.color + "15" }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-gray-800 font-medium text-sm hover:underline"
                        style={{ color: item.color }}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-gray-700 font-medium text-sm">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Social Links */}
              <div className="bg-white rounded-xl p-5 border-2 border-gray-100">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                  Follow Us
                </p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "LinkedIn", icon: "💼", href: "#" },
                    { label: "Facebook", icon: "📘", href: "#" },
                    { label: "Instagram", icon: "📸", href: "#" },
                    { label: "X / Twitter", icon: "🐦", href: "#" },
                    { label: "YouTube", icon: "▶️", href: "#" },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:border-red-300 hover:text-red-600 transition-all duration-200"
                    >
                      <span>{s.icon}</span>
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Contact Form */}
            <div
              className="bg-white rounded-2xl p-8 border-2 border-gray-100 shadow-sm"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Send Us a Message
              </h3>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="What is this about?"
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors resize-none"
                  />
                </div>

                <button
                  className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ backgroundColor: "#dc2626" }}
                >
                  Send Message →
                </button>

                <p className="text-xs text-gray-400 text-center">
                  We typically respond within 24–48 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MEMORIAL FOOTER STRIP ────────────────────────────────────────── */}
      <section
        className="py-12 px-6 text-center"
        style={{ backgroundColor: "#1a1a2e" }}
      >
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-400 italic text-sm">
            "In loving memory of{" "}
            <span className="text-white font-semibold">Stephen Riak</span>
            {" "}— whose vision of a better-educated, digitally empowered
            community is the foundation of everything we do."
          </p>
        </div>
      </section>

    </div>
  )
}