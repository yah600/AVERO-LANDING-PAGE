import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface RouteMetaDefinition {
  title: string
  description: string
}

const routeMeta: Record<string, RouteMetaDefinition> = {
  '/': {
    title: 'Avero | All-In-One Marketing Platform',
    description:
      'Avero is the all-in-one marketing command center that replaces fragmented tools with one unified platform.',
  },
  '/features': {
    title: 'Avero Features | Built-In Marketing Modules',
    description:
      'Explore Avero modules for campaign command, lead quality, lifecycle execution, analytics, and compliance control.',
  },
  '/integrations': {
    title: 'Avero Integrations | Replace + Connect',
    description:
      'Connect your full marketing ecosystem in Avero and operate from one shared execution and decision layer.',
  },
  '/about': {
    title: 'About Avero | Marketing Command Center',
    description:
      'Avero centralizes marketing execution, visibility, and control so teams move faster with lower operational friction.',
  },
  '/login': {
    title: 'Log In | Avero',
    description: 'Log in to access your Avero marketing workspace.',
  },
  '/signup': {
    title: 'Get Access | Avero',
    description:
      'Create your Avero account and start running your full marketing operation from one platform.',
  },
  '/privacy': {
    title: 'Privacy Policy | Avero',
    description: 'Read how Avero handles and protects account and operational data.',
  },
  '/terms': {
    title: 'Terms of Service | Avero',
    description: 'Review Avero terms, access rules, and platform usage conditions.',
  },
  '/cookies': {
    title: 'Cookie Policy | Avero',
    description: 'Review how Avero uses cookies for platform functionality and experience quality.',
  },
}

function setMeta(name: string, content: string) {
  let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setMetaProperty(property: string, content: string) {
  let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('property', property)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

export default function RouteMeta() {
  const location = useLocation()

  useEffect(() => {
    const meta = routeMeta[location.pathname] ?? routeMeta['/']
    document.title = meta.title
    setMeta('description', meta.description)
    setMetaProperty('og:title', meta.title)
    setMetaProperty('og:description', meta.description)
    setMeta('twitter:title', meta.title)
    setMeta('twitter:description', meta.description)
  }, [location.pathname])

  return null
}

