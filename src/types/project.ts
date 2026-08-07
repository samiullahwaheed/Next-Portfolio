export const PROJECT_CATEGORIES = [
  'Mobile App',
  'Web App',
  'WordPress',
  'Flutter',
  'React',
  'Next.js',
  'Frontend',
  'Full Stack',
] as const

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]

export type ProjectImage = {
  url: string
  publicId: string
}

export type ProjectDoc = {
  _id: string
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
