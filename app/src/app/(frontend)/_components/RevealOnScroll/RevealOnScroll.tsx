'use client'

import { useEffect } from 'react'

export function RevealOnScroll() {
  useEffect(() => {
    const items = document.querySelectorAll('.reveal')
    if (items.length === 0) return
    if (typeof IntersectionObserver === 'undefined') {
      items.forEach((el) => el.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            io.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    )
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return null
}
