import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLinkedinIn, faFacebook, faInstagram, faXTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { faUser, faPhone, faEnvelope, faMapPin, faHandsClapping } from "@fortawesome/free-solid-svg-icons"
import { teamMembers } from "@/lib/team"
import ContactForm from "./ContactForm"

export default function PeoplePage() {
  return (
    <div className="w-full">

      {/* Hero */}
      <section
        className="py-24 px-6 md:px-[5%] text-center"
        style={{ background: "linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)" }}
      >
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#00BCD4" }}>
            The People Behind SSTB
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            People & <span style={{ color: "#dc2626" }}>Contact</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Meet the volunteers and staff who make St Stephen Tech Bridge possible.
          </p>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-20 px-6 md:px-[5%] bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#00BCD4" }}>
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
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl border-2 border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden text-center"
              >
                {/* Photo */}
                <div className="h-48 overflow-hidden">
                  {member.photo ? (
                    <img
                      src={`/team/${member.photo}`}
                      alt={member.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)" }}
                    >
                      <FontAwesomeIcon icon={faUser} className="text-6xl text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-sm font-semibold mb-3" style={{ color: "#dc2626" }}>
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">{member.bio}</p>

                  {/* Socials */}
                  <div className="flex justify-center gap-2 flex-wrap">
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noreferrer"
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all hover:-translate-y-0.5"
                        style={{ backgroundColor: "#f0f0f0", color: "#1a1a2e" }}
                        title="LinkedIn">
                        <FontAwesomeIcon icon={faLinkedinIn} />
                      </a>
                    )}
                    {member.facebook && (
                      <a href={member.facebook} target="_blank" rel="noreferrer"
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all hover:-translate-y-0.5"
                        style={{ backgroundColor: "#f0f0f0", color: "#1a1a2e" }}
                        title="Facebook">
                        <FontAwesomeIcon icon={faFacebook} />
                      </a>
                    )}
                    {member.instagram && (
                      <a href={member.instagram} target="_blank" rel="noreferrer"
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all hover:-translate-y-0.5"
                        style={{ backgroundColor: "#f0f0f0", color: "#1a1a2e" }}
                        title="Instagram">
                        <FontAwesomeIcon icon={faInstagram} />
                      </a>
                    )}
                    {member.twitter && (
                      <a href={member.twitter} target="_blank" rel="noreferrer"
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all hover:-translate-y-0.5"
                        style={{ backgroundColor: "#f0f0f0", color: "#1a1a2e" }}
                        title="X / Twitter">
                        <FontAwesomeIcon icon={faXTwitter} />
                      </a>
                    )}
                    {member.youtube && (
                      <a href={member.youtube} target="_blank" rel="noreferrer"
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all hover:-translate-y-0.5"
                        style={{ backgroundColor: "#f0f0f0", color: "#1a1a2e" }}
                        title="YouTube">
                        <FontAwesomeIcon icon={faYoutube} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Join CTA */}
          <div
            className="mt-14 rounded-2xl p-8 text-center"
            style={{ backgroundColor: "#f9fafb", border: "2px dashed #e5e7eb" }}
          >
            <div className="mb-3">
              <FontAwesomeIcon icon={faHandsClapping} className="text-xs text-gray-600" style={{ fontSize: "0.85rem" }} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Want to Join the Team?</h3>
            <p className="text-gray-500 text-sm mb-5 max-w-md mx-auto">
              We are always looking for passionate volunteers.
            </p>
            <Link
              href="/volunteer"
              className="inline-block px-6 py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:-translate-y-1"
              style={{ backgroundColor: "#dc2626" }}
            >
              Apply to Volunteer →
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-6 md:px-[5%] scroll-mt-20" style={{ backgroundColor: "#f9fafb" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#00BCD4" }}>
              Get in Touch
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Have a question, want to partner with us, or need a service quote?
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="flex flex-col gap-6">
              {[
                { icon: faPhone, label: "Phone", value: "+233-538-002-351", href: "tel:+233538002351", color: "#dc2626" },
                { icon: faEnvelope, label: "Email", value: "ststephentechbridge@gmail.com", href: "mailto:ststephentechbridge@gmail.com", color: "#00BCD4" },
                { icon: faMapPin, label: "Location", value: "South Sudan & Uganda (Remote operations)", href: null, color: "#1a1a1a" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 bg-white rounded-xl p-5 border-2 border-gray-100 hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: item.color + "15" }}>
                    <FontAwesomeIcon icon={item.icon} style={{ color: item.color }} className="text-lg" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm font-medium hover:underline" style={{ color: item.color }}>
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-gray-700">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}

              <div className="bg-white rounded-xl p-5 border-2 border-gray-100">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Follow Us</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "LinkedIn", icon: faLinkedinIn, href: "#" },
                    { label: "Facebook", icon: faFacebook, href: "#" },
                    { label: "Instagram", icon: faInstagram, href: "#" },
                    { label: "X / Twitter", icon: faXTwitter, href: "#" },
                    { label: "YouTube", icon: faYoutube, href: "#" },
                  ].map((s) => (
                    <a key={s.label} href={s.href}
                      className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:-translate-y-0.5"
                      style={{ backgroundColor: "transparent", color: "#1a1a2e", border: "2px solid #1a1a2e" }}
                      title={s.label}>
                      <FontAwesomeIcon icon={s.icon} className="text-sm" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>


    </div>
  )
}
