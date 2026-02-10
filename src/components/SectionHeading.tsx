interface SectionHeadingProps {
  eyebrow?: string
  title: string
  subtitle?: string
  center?: boolean
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
}: SectionHeadingProps) {
  return (
    <header className={center ? 'section-heading section-heading-center' : 'section-heading'}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
    </header>
  )
}
