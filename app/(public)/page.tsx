import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="w-full">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        className="relative isolate flex min-h-[680px] items-center overflow-hidden bg-gray-900"
        style={{ minHeight: "min(900px, calc(100svh - 5rem))" }}
      >
        <Image
          src="/hero.jpeg"
          alt="A student attending a class at St Stephen Tech Bridge."
          fill
          preload
          sizes="100vw"
          className="object-cover object-[center_42%]"
        />
        <div className="absolute inset-0 -z-0 bg-gradient-to-r from-black/80 via-black/55 to-black/10" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 md:px-[5%]">
          <div className="max-w-3xl">
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-4"
              style={{ color: "#67e8f9" }}
            >
              Empowering African Youth
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
              Bridging the{" "}
              <span style={{ color: "#f87171" }}>Technological</span>{" "}
              Divide,{" "}
              <br className="hidden md:block" />
              One Student at a Time
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-4 leading-relaxed">
              St Stephen Tech Bridge equips displaced and underserved youth in
              South Sudan and Uganda with computer literacy, English, and
              mathematics skills at zero cost.
            </p>
            <p
              className="text-sm italic mb-8 text-red-200"
            >
              In loving memory of Stephen Riak-whose vision lives on in every
              student we serve.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/apply"
                className="px-8 py-3 rounded-lg text-white font-semibold text-base transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: "#dc2626",
                  boxShadow: "0 4px 14px rgba(220,38,38,0.5)",
                }}
              >
                Apply Now →
              </Link>
              <Link
                href="/volunteer"
                className="px-8 py-3 rounded-lg font-semibold text-base border-2 border-white text-white transition-all duration-300 hover:bg-white hover:text-gray-900"
              >
                Get Involved
              </Link>
            </div>
          </div>

          <div className="mt-14 max-w-3xl">
            <h2 className="text-xl font-bold text-white mb-4">
              6-Week Intensive Bootcamp
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { val: "50+", label: "Students Trained" },
                { val: "$0", label: "Full Program Cost" },
                { val: "3", label: "Core Courses" },
                { val: "100%", label: "Get Certified" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg bg-black/35 px-4 py-3 text-white backdrop-blur-sm">
                  <div className="text-2xl font-bold">{s.val}</div>
                  <div className="text-xs text-white/80">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section className="py-12 px-6" style={{ backgroundColor: "#1a1a1a" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: "50+", label: "Students Trained", icon: "🎓" },
            { val: "6 Weeks", label: "Intensive Bootcamp", icon: "📅" },
            { val: "100%", label: "Certification Rate", icon: "🏅" },
            { val: "$0", label: "Full Program Cost", icon: "💡" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl mb-1">{s.icon}</div>
              <div
                className="text-3xl font-bold mb-1"
                style={{ color: "#00BCD4" }}
              >
                {s.val}
              </div>
              <div className="text-sm text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY WE EXIST ─────────────────────────────────────────────────── */}
      <section className="py-20 px-6 md:px-[5%] bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#00BCD4" }}>
              The Problem
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why We Exist
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-base leading-relaxed">
              Millions of young people across Africa are locked out of opportunity,
          not because of lack of talent, but because of three interconnected barriers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "💻",
                title: "The Digital Divide",
                color: "#dc2626",
                desc: "Most displaced youth have never touched a computer. In a world where digital skills are a prerequisite for almost every opportunity, this gap is devastating.",
              },
              {
                icon: "🗣️",
                title: "The English Barrier",
                color: "#00BCD4",
                desc: "English is the language of higher education, international employment, and global communication. Without it, doors remain firmly closed.",
              },
              {
                icon: "🔢",
                title: "Mathematical Illiteracy",
                color: "#1a1a1a",
                desc: "Basic numeracy is essential for financial independence, academic success, and navigating everyday life. Yet many lack even foundational math skills.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-xl p-8 border-2 border-gray-100 hover:border-red-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ backgroundColor: "#fef2f2" }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5"
                  style={{ backgroundColor: card.color }}
                >
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {card.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR OBJECTIVES ───────────────────────────────────────────────── */}
      <section className="py-20 px-6 md:px-[5%]" style={{ backgroundColor: "#f9fafb" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#00BCD4" }}>
              What We Do
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Objectives
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-base">
              Four pillars that guide everything we do at St Stephen Tech Bridge.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🖥️",
                title: "Computer Literacy",
                desc: "Typing, MS Office, email, file management, and safe internet use, the essential digital toolkit.",
                color: "#dc2626",
              },
              {
                icon: "📖",
                title: "English Skills",
                desc: "Grammar, writing, reading comprehension, and presentation skills for academic and professional success.",
                color: "#00BCD4",
              },
              {
                icon: "➗",
                title: "Math Skills",
                desc: "Arithmetic, fractions, percentages, and logical problem-solving for everyday and academic use.",
                color: "#1a1a1a",
              },
              {
                icon: "🏆",
                title: "Certification",
                desc: "Every graduate receives a certificate recognising their achievement and boosting their opportunities.",
                color: "#dc2626",
              },
            ].map((obj) => (
              <div
                key={obj.title}
                className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4"
                  style={{ backgroundColor: obj.color + "15" }}
                >
                  {obj.icon}
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: obj.color }}
                >
                  {obj.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{obj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TARGET AUDIENCE ──────────────────────────────────────────────── */}
      <section className="overflow-hidden py-20 px-6 md:px-[5%] bg-white">
        <div className="relative -mx-6 mb-16 h-[min(65vh,700px)] min-h-[360px] md:-mx-[5vw]">
          <Image
            src="/p3.jpg"
            alt="Two young men greeting each other with a handshake."
            fill
            sizes="100vw"
            className="object-cover object-[center_38%]"
          />
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Left */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#00BCD4" }}>
              Who We Serve
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Built for Those Left Behind
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Our program is specifically designed for young people who have been
              displaced, marginalised, or simply lack access to quality digital education.
            </p>
            <ul className="space-y-4">
              {[
                { icon: "🏕️", text: "Refugees and internally displaced youth in South Sudan and Uganda" },
                { icon: "🎓", text: "Recent school leavers with no computer or English background" },
                { icon: "👩", text: "Young women and girls facing additional barriers to education" },
                { icon: "🌍", text: "Anyone aged 16-35 seeking a pathway into digital work" },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-4">
                  <span
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                    style={{ backgroundColor: "#fef2f2" }}
                  >
                    {item.icon}
                  </span>
                  <span className="text-gray-700 text-sm leading-relaxed pt-2">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { val: "South Sudan", sub: "Primary community served", icon: "🇸🇸" },
              { val: "Uganda", sub: "Partner community", icon: "🇺🇬" },
              { val: "16-35", sub: "Target age range", icon: "👥" },
              { val: "Free", sub: "Accessible pricing", icon: "💚" },
            ].map((card) => (
              <div
                key={card.val}
                className="rounded-xl p-6 text-center border-2 border-gray-100 hover:border-red-200 transition-all duration-300"
              >
                <div className="text-3xl mb-2">{card.icon}</div>
                <div className="font-bold text-lg text-gray-900">{card.val}</div>
                <div className="text-xs text-gray-500 mt-1">{card.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ────────────────────────────────────────────────────── */}
      <section
        className="py-20 px-6 text-center text-white"
        style={{ backgroundColor: "#7f1d1d" }}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Change a Life?
          </h2>
          <p className="text-red-200 text-lg mb-10 leading-relaxed">
            Whether you want to enroll, volunteer, or support our mission, there
            is a place for you at St Stephen Tech Bridge.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/apply"
              className="px-8 py-3 rounded-lg font-semibold text-base transition-all duration-300 hover:-translate-y-1"
              style={{ backgroundColor: "#ffffff", color: "#7f1d1d" }}
            >
              Enroll Now
            </Link>
            <Link
              href="/volunteer"
              className="px-8 py-3 rounded-lg font-semibold text-base border-2 border-white text-white transition-all duration-300 hover:bg-white hover:text-red-900"
            >
              Become a Volunteer
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}