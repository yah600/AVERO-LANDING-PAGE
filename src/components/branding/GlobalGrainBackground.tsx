import { GrainGradient } from '@paper-design/shaders-react'

export default function GlobalGrainBackground() {
  return (
    <div className="global-grain-bg" aria-hidden>
      <GrainGradient
        speed={0.4}
        scale={1.63}
        rotation={-182}
        offsetX={0.05}
        offsetY={0}
        softness={1}
        intensity={0}
        noise={0.07}
        shape="corners"
        colors={['#9CA8AE', '#37444A', '#232C31']}
        colorBack="#00000000"
        style={{
          backgroundColor: '#0F0E18',
          height: '100%',
          width: '100%',
        }}
      />
    </div>
  )
}

