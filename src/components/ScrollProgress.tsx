import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

function getScrollProgress() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
  if (scrollHeight <= 0) return 0
  return Math.min(1, Math.max(0, scrollTop / scrollHeight))
}

export default function ScrollProgress() {
  const location = useLocation()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

    const update = () => {
      setProgress(getScrollProgress())
    }

    const rafId = window.requestAnimationFrame(update)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [location.pathname])

  return <div className="scroll-progress" aria-hidden style={{ transform: `scaleX(${progress})` }} />
}
