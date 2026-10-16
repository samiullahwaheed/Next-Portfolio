export const PROJECT_CATEGORIES = [
  'Web App',
  'Mobile App',
  'Full Stack',
  'Frontend',
  'React',
  'Node.js',
  'API Integration',
  'Real-Time Apps',
  'SaaS',
  'AI Agents',
  'Automation',
  'Next.js',
  'Flutter',
  'WordPress',
] as const

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]

// Still valid on saved projects (model + validation keep the full list above),
// but no longer offered as a filter, shown on public pages, or picked in the admin form
export const RETIRED_CATEGORIES: readonly ProjectCategory[] = ['Node.js']

export const SELECTABLE_CATEGORIES = PROJECT_CATEGORIES.filter((category) => !RETIRED_CATEGORIES.includes(category))

export const visibleCategories = (categories: ProjectCategory[]) => categories.filter((category) => !RETIRED_CATEGORIES.includes(category))

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
