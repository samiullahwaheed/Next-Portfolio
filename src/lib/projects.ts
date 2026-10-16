import { revalidatePath } from 'next/cache'
import { cache } from 'react'
import { isValidObjectId } from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import { Project } from '@/models/Project'
import { SELECTABLE_CATEGORIES, type ProjectCategory, type ProjectDoc } from '@/types/project'

type ProjectRecord = InstanceType<typeof Project>

// Projects created before slugs existed get one the first time they're read
export async function ensureSlugs(projects: ProjectRecord[]) {
  for (const project of projects) {
    // validateModifiedOnly: only the new slug is validated, so legacy fields can't block the save
    if (!project.slug) await project.save({ validateModifiedOnly: true })
  }
  return projects
}

const toPlain = (project: ProjectRecord) => JSON.parse(JSON.stringify(project)) as ProjectDoc

export const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const getAllProjects = cache(async (): Promise<ProjectDoc[]> => {
  await connectDB()
  const projects = await Project.find().sort({ order: 1, createdAt: -1 })
  return (await ensureSlugs(projects)).map(toPlain)
})

export type ProjectQuery = {
  category?: string
  search?: string
  skip?: number
  limit?: number
  // Homepage showcase: featured projects first, then the rest
  featuredFirst?: boolean
}

export async function queryProjects({ category, search, skip = 0, limit = 12, featuredFirst = false }: ProjectQuery) {
  await connectDB()
  const filter: Record<string, unknown> = {}
  if (category && category !== 'All') filter.category = category
  if (search?.trim()) {
    const regex = new RegExp(escapeRegex(search.trim()), 'i')
    filter.$or = [{ title: regex }, { techStack: regex }]
  }
  const sort: Record<string, 1 | -1> = featuredFirst ? { featured: -1, order: 1, createdAt: -1 } : { order: 1, createdAt: -1 }

  const [projects, total] = await Promise.all([
    Project.find(filter).sort(sort).skip(skip).limit(limit),
    Project.countDocuments(filter),
  ])
  return { projects: (await ensureSlugs(projects)).map(toPlain), total }
}

export async function getProjectStats() {
  await connectDB()
  const [total, featured, used] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ featured: true }),
    Project.distinct('category') as Promise<string[]>,
  ])
  // Filters: every selectable category (retired ones excluded), even before it has projects
  const categories: ProjectCategory[] = [...SELECTABLE_CATEGORIES]
  // How many visible categories actually have projects (for stat tiles)
  const categoryCount = SELECTABLE_CATEGORIES.filter((category) => used.includes(category)).length
  return { total, featured, categories, categoryCount }
}

export type ProjectLookup =
  | { status: 'found'; project: ProjectDoc }
  | { status: 'moved'; slug: string }
  | { status: 'missing' }

export const getProjectBySlug = cache(async (slug: string): Promise<ProjectLookup> => {
  await connectDB()
  const project = await Project.findOne({ slug })
  if (project) return { status: 'found', project: toPlain(project) }
  // Old /projects/<id> links redirect to the slug URL
  if (isValidObjectId(slug)) {
    const byId = await Project.findById(slug)
    if (byId) {
      await ensureSlugs([byId])
      return { status: 'moved', slug: byId.slug as string }
    }
  }
  return { status: 'missing' }
})

// Called after admin writes so cached project pages and the sitemap pick up changes
export function revalidateProjectPages() {
  revalidatePath('/projects/[slug]', 'page')
  revalidatePath('/sitemap.xml')
}
