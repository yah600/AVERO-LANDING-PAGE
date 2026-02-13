import { useEffect, useRef, useState } from 'react'

interface VideoPlayerProps {
  src: string
  poster?: string
  className?: string
  loading?: 'eager' | 'lazy'
}

export default function VideoPlayer({
  src,
  poster,
  className = '',
  loading = 'lazy',
}: VideoPlayerProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(loading === 'eager')
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (loading === 'eager') return
    const el = wrapRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [loading])

  if (hasError) {
    return (
      <div className={`video-player-fallback ${className}`} data-reveal>
        <span>Video Unavailable</span>
      </div>
    )
  }

  return (
    <div ref={wrapRef} className={`video-player ${className}`} data-reveal>
      <video
        src={isInView ? src : undefined}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload={loading === 'eager' ? 'auto' : 'none'}
        onError={() => setHasError(true)}
      />
    </div>
  )
}
