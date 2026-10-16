export const PROJECT_CATEGORIES = [
  'Web App',
  'Mobile App',
  'Full Stack',
  'Frontend',
  'Backend',
  'React',
  'Node.js',
  'API Integration',
  'Real-Time Apps',
  'SaaS',
  'AI Agents',
  'Automation',
  'RAG Apps',
  'Next.js',
  'Flutter',
  'WordPress',
] as const

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]

export type ProjectImage = {
  url: string
  publicId: string
}

export type ProjectDoc = {
  _id: string
  slug: string
  title: string
  description: string
  images: ProjectImage[]
  category: ProjectCategory[]
  techStack: string[]
  liveLink?: string
  githubLink?: string
  featured?: boolean
  order?: number
}
