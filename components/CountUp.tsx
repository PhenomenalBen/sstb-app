"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Animates the number inside a stat like "50+", "100%", "$0" or "6 Weeks"
 * from 0 up to its value when it scrolls into view. The rendered HTML holds
 * the final value, so it reads correctly before JS runs.
 */
export default function CountUp({ value, duration = 1600 }: { value: string; duration?: number }) {
  const match = value.match(/^(\D*)(\d+)(.*)$/)
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const el = ref.current
    if (!match || !el) return
    const [, prefix, digits, suffix] = match
    const target = Number(digits)
    if (target === 0) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let frame = 0
    let done: ReturnType<typeof setTimeout> | undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - t, 3)
        setDisplay(`${prefix}${Math.round(target * eased)}${suffix}`)
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      setDisplay(`${prefix}0${suffix}`)
      frame = requestAnimationFrame(tick)
      // Safety net: always land on the real value, even if frames are throttled
      done = setTimeout(() => {
        cancelAnimationFrame(frame)
        setDisplay(value)
      }, duration + 400)
    })
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      clearTimeout(done)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration])

  return <span ref={ref}>{display}</span>
}
