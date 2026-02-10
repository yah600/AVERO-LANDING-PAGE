import { LiquidMetal } from '@paper-design/shaders-react'

interface LiquidIconLogoProps {
  size?: number
  className?: string
}

export default function LiquidIconLogo({ size = 42, className = '' }: LiquidIconLogoProps) {
  return (
    <div className={`liquid-logo-icon ${className}`} style={{ width: size, height: size }}>
      <LiquidMetal
        speed={0.65}
        softness={0.1}
        repetition={1.98}
        shiftRed={0}
        shiftBlue={0}
        distortion={0.07}
        contour={0.17}
        scale={1}
        rotation={0}
        shape="diamond"
        angle={70}
        image="https://workers.paper.design/file-assets/01KGQXJ25ND6Y619141KX9S5FS/01KGR8TBDSP02AM3A7A0K1KBAT.png"
        frame={1886.1699999847451}
        colorBack="#00000000"
        colorTint="#FFFFFF"
        style={{
          backgroundColor: '#AAAAAC00',
          height: '100%',
          width: '100%',
        }}
      />
    </div>
  )
}
