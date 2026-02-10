import { useState } from 'react'

interface ImageAnchorProps {
  src: string
  alt: string
  className?: string
  fallbackLabel?: string
  loading?: 'lazy' | 'eager'
}

export default function ImageAnchor({
  src,
  alt,
  className = '',
  fallbackLabel = 'Image Placeholder',
  loading = 'lazy',
}: ImageAnchorProps) {
  const [errored, setErrored] = useState(false)

  return (
    <figure className={`image-anchor ${className}`} data-reveal>
      {!errored ? (
        <img
          src={src}
          alt={alt}
          className="image-anchor-img"
          loading={loading}
          fetchPriority={loading === 'eager' ? 'high' : 'auto'}
          onError={() => setErrored(true)}
        />
      ) : (
        <div className="image-anchor-fallback">
          <span>{fallbackLabel}</span>
        </div>
      )}
    </figure>
  )
}
