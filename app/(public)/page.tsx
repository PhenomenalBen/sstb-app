import Link from "next/link"
import Image from "next/image"
import PhotoGallery from "../components/PhotoGallery"
import CountUp from "@/components/CountUp"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAward, faBookOpen, faCalculator, faCalendarDays, faCertificate, faComments, faDesktop, faEarthAfrica, faGraduationCap, faHandHoldingDollar, faHandHoldingHeart, faLaptop, faLocationDot, faPersonDress, faSquareRootVariable, faTent, faUsers } from "@fortawesome/free-solid-svg-icons"

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
          className="object-cover object-[center_42%] animate-ken-burns"
        />
        <div className="absolute inset-0 -z-0 bg-gradient-to-r from-black/85 via-black/60 to-red-950/20" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 md:px-[5%]">
          <div className="max-w-3xl">
            <p
              className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-widest mb-6 backdrop-blur-sm"
              style={{ color: "#67e8f9" }}
            >
              Empowering African Youth
            </p>
            <h1 className="animate-fade-up text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-[1.05] mb-6" style={{ animationDelay: "0.12s" }}>
              Bridging the{" "}
              <span className="text-gradient-brand">Technological</span>{" "}
              Divide,{" "}
              <br className="hidden md:block" />
              One Student at a Time
            </h1>
            <p className="animate-fade-up text-lg md:text-2xl text-white/90 mb-4 leading-relaxed max-w-2xl" style={{ animationDelay: "0.24s" }}>
              St Stephen Tech Bridge equips displaced and underserved youth in
              South Sudan and Uganda with computer literacy, English, and
              mathematics skills at zero cost.
            </p>
            <p
              className="animate-fade-up text-base italic mb-10 text-red-100" style={{ animationDelay: "0.32s" }}
            >
              In loving memory of Stephen Riak-whose vision lives on in every
              student we serve.
            </p>

            <div className="animate-fade-up flex flex-wrap gap-4" style={{ animationDelay: "0.42s" }}>
              <Link
                href="/apply"
                className="animate-pulse-ring px-9 py-4 rounded-xl text-white font-semibold text-lg transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: "#dc2626",
                  boxShadow: "0 4px 14px rgba(220,38,38,0.5)",
                }}
              >
                Apply Now →
              </Link>
              <Link
                href="/volunteer"
                className="px-9 py-4 rounded-xl font-semibold text-lg border-2 border-white/80 text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-gray-900"
              >
                Get Involved
              </Link>
            </div>
          </div>

          <div className="animate-fade-up mt-14 max-w-3xl" style={{ animationDelay: "0.55s" }}>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
              6-Week Intensive Bootcamp
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { val: "50+", label: "Students Trained" },
                { val: "$0", label: "Full Program Cost" },
                { val: "3", label: "Core Courses" },
                { val: "100%", label: "Get Certified" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/10 bg-white/10 px-4 py-4 text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/15">
                  <div className="text-3xl font-extrabold"><CountUp value={s.val} /></div>
                  <div className="text-sm text-white/90">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section className="bg-night-gradient py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center" data-stagger>
          {[
            { val: "50+", label: "Students Trained", icon: faGraduationCap },
            { val: "6 Weeks", label: "Intensive Bootcamp", icon: faCalendarDays },
            { val: "100%", label: "Certification Rate", icon: faAward },
            { val: "$0", label: "Full Program Cost", icon: faHandHoldingDollar },
          ].map((s) => (
            <div key={s.label} className="group">
              <div className="icon-pop mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 text-2xl text-red-400 ring-1 ring-red-400/30"><FontAwesomeIcon icon={s.icon} /></div>
              <div className="text-gradient-cyan text-4xl md:text-5xl font-extrabold mb-1">
                <CountUp value={s.val} />
              </div>
              <div className="text-sm text-gray-200">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY WE EXIST ─────────────────────────────────────────────────── */}
      <section className="py-20 px-6 md:px-[5%] bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#0e7490" }}>
              The Problem
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Why We Exist
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base leading-relaxed">
              Millions of young people across Africa are locked out of opportunity,
          not because of lack of talent, but because of three interconnected barriers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-stagger>
            {[
              {
                icon: faLaptop,
                title: "The Digital Divide",
                color: "#dc2626",
                desc: "Most displaced youth have never touched a computer. In a world where digital skills are a prerequisite for almost every opportunity, this gap is devastating.",
              },
              {
                icon: faComments,
                title: "The English Barrier",
                color: "#00BCD4",
                desc: "English is the language of higher education, international employment, and global communication. Without it, doors remain firmly closed.",
              },
              {
                icon: faCalculator,
                title: "Mathematical Illiteracy",
                color: "#1a1a1a",
                desc: "Basic numeracy is essential for financial independence, academic success, and navigating everyday life. Yet many lack even foundational math skills.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="group relative overflow-hidden rounded-2xl p-8 border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                style={{ borderTop: `4px solid ${card.color}`, backgroundImage: `linear-gradient(180deg, ${card.color}12, transparent 60%)` }}
              >
                <div
                  className="icon-pop w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-lg"
                  style={{ backgroundColor: card.color }}
                >
                  <FontAwesomeIcon icon={card.icon} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {card.title}
                </h3>
                <p className="text-gray-700 leading-relaxed text-base">
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
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#0e7490" }}>
              What We Do
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Our Objectives
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-base">
              Four pillars that guide everything we do at St Stephen Tech Bridge.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-stagger>
            {[
              {
                icon: faDesktop,
                title: "Computer Literacy",
                desc: "Typing, MS Office, email, file management, and safe internet use, the essential digital toolkit.",
                color: "#dc2626",
              },
              {
                icon: faBookOpen,
                title: "English Skills",
                desc: "Grammar, writing, reading comprehension, and presentation skills for academic and professional success.",
                color: "#00BCD4",
              },
              {
                icon: faSquareRootVariable,
                title: "Math Skills",
                desc: "Arithmetic, fractions, percentages, and logical problem-solving for everyday and academic use.",
                color: "#1a1a1a",
              },
              {
                icon: faCertificate,
                title: "Certification",
                desc: "Every graduate receives a certificate recognising their achievement and boosting their opportunities.",
                color: "#dc2626",
              },
            ].map((obj) => (
              <div
                key={obj.title}
                className="group bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
              >
                <div
                  className="icon-pop w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4"
                  style={{ backgroundColor: obj.color + "15" }}
                >
                  <FontAwesomeIcon icon={obj.icon} style={{ color: obj.color }} />
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: obj.color }}
                >
                  {obj.title}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">{obj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TARGET AUDIENCE ──────────────────────────────────────────────── */}
      <section className="overflow-hidden py-20 px-6 md:px-[5%] bg-white">
        <PhotoGallery
          className="mb-16"
          images={[
            {
              src: "/p3.jpeg",
              alt: "Two students standing together in SSTB shirts.",
              width: 810,
              height: 1080,
            },
            {
              src: "/p4.jpeg",
              alt: "A student smiling among classmates.",
              width: 810,
              height: 1080,
            },
          ]}
        />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Left */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#0e7490" }}>
              Who We Serve
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Built for Those Left Behind
            </h2>
            <p className="text-gray-700 mb-8 leading-relaxed">
              Our program is specifically designed for young people who have been
              displaced, marginalised, or simply lack access to quality digital education.
            </p>
            <ul className="space-y-4" data-stagger>
              {[
                { icon: faTent, text: "Refugees and internally displaced youth in South Sudan and Uganda" },
                { icon: faGraduationCap, text: "Recent school leavers with no computer or English background" },
                { icon: faPersonDress, text: "Young women and girls facing additional barriers to education" },
                { icon: faEarthAfrica, text: "Anyone aged 16-35 seeking a pathway into digital work" },
              ].map((item) => (
                <li key={item.text} className="group flex items-start gap-4">
                  <span
                    className="icon-pop w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ backgroundColor: "#fef2f2" }}
                  >
                    <FontAwesomeIcon icon={item.icon} className="text-red-600" />
                  </span>
                  <span className="text-gray-700 text-base leading-relaxed pt-2">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right */}
          <div className="grid grid-cols-2 gap-4" data-stagger>
            {[
              { val: "South Sudan", sub: "Primary community served", icon: faLocationDot },
              { val: "Uganda", sub: "Partner community", icon: faLocationDot },
              { val: "16-35", sub: "Target age range", icon: faUsers },
              { val: "Free", sub: "Accessible pricing", icon: faHandHoldingHeart },
            ].map((card) => (
              <div
                key={card.val}
                className="group rounded-2xl p-6 text-center border border-gray-100 bg-gradient-to-b from-white to-red-50/60 shadow-sm hover:border-red-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="icon-pop text-3xl mb-2 text-red-600"><FontAwesomeIcon icon={card.icon} /></div>
                <div className="font-bold text-lg text-gray-900">{card.val}</div>
                <div className="text-sm text-gray-600 mt-1">{card.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ────────────────────────────────────────────────────── */}
      <section
        className="bg-cta-gradient py-24 px-6 text-center text-white"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5">
            Ready to Change a Life?
          </h2>
          <p className="text-red-100 text-lg mb-10 leading-relaxed">
            Whether you want to enroll, volunteer, or support our mission, there
            is a place for you at St Stephen Tech Bridge.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/apply"
              className="px-9 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              style={{ backgroundColor: "#ffffff", color: "#7f1d1d" }}
            >
              Enroll Now
            </Link>
            <Link
              href="/volunteer"
              className="px-9 py-4 rounded-xl font-semibold text-lg border-2 border-white text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-red-900"
            >
              Become a Volunteer
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}