import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const REVEAL_SELECTOR = '[data-reveal]'
const STAGGER_STEP_MS = 16
const MAX_DELAY_MS = 100

export default function RevealOnScroll() {
  const location = useLocation()

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR))
    if (nodes.length === 0) return

    nodes.forEach((node, index) => {
      const delay = Math.min(index * STAGGER_STEP_MS, MAX_DELAY_MS)
      node.style.setProperty('--reveal-delay', `${delay}ms`)
    })

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      nodes.forEach((node) => node.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -1% 0px',
      },
    )

    const rafId = window.requestAnimationFrame(() => {
      nodes.forEach((node) => observer.observe(node))
    })

    return () => {
      window.cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [location.pathname])

  return null
}
