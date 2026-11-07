"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

/**
 * Fades sections in as they scroll into view.
 *
 * Every content block inside <main> (each `section > div` except the first
 * section, which is the page hero) is tagged automatically, so pages don't need
 * to opt in. Anything marked `data-reveal` by hand is picked up too.
 */
export default function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    const targets = new Set<Element>([
      ...document.querySelectorAll("main section:not(:first-of-type) > div"),
      ...document.querySelectorAll("main [data-reveal]"),
    ])

    if (!("IntersectionObserver" in window)) return

    targets.forEach((el) => el.setAttribute("data-reveal", ""))
    root.classList.add("reveal-ready")

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 }
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [pathname])

  return null
}
