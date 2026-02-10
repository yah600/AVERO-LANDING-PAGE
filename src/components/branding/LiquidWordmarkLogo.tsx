import { LiquidMetal } from '@paper-design/shaders-react'

interface LiquidWordmarkLogoProps {
  width?: number
  height?: number
  zoom?: number
  offsetX?: number
  offsetY?: number
  className?: string
}

export default function LiquidWordmarkLogo({
  width = 220,
  height = 56,
  zoom = 0.17,
  offsetX = 0,
  offsetY = 0,
  className = '',
}: LiquidWordmarkLogoProps) {
  return (
    <div
      className={`liquid-logo-wordmark ${className}`}
      style={{ width, height, position: 'relative', overflow: 'hidden' }}
    >
      <img
        src="/avero-wordmark-paper.png"
        alt=""
        aria-hidden
        className="liquid-wordmark-fallback"
      />
      <div
        className="liquid-wordmark-canvas"
        style={{
          transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        <LiquidMetal
          speed={0.65}
          softness={0.1}
          repetition={2}
          shiftRed={0}
          shiftBlue={0}
          distortion={0.07}
          contour={0.04}
          scale={3.13}
          rotation={0}
          shape="diamond"
          angle={70}
          image="/avero-wordmark-paper.png"
          frame={1886.1699999847451}
          colorBack="#00000000"
          colorTint="#FFFFFF"
          style={{
            backgroundColor: '#AAAAAC00',
            borderRadius: '0px',
            height: '543px',
            width: '1726px',
          }}
        />
      </div>
    </div>
  )
}
