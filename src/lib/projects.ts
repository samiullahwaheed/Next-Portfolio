import { revalidatePath } from 'next/cache'
import { cache } from 'react'
import { isValidObjectId } from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import { Project } from '@/models/Project'
import type { ProjectDoc } from '@/types/project'

type ProjectRecord = InstanceType<typeof Project>

// Projects created before slugs existed get one the first time they're read
export async function ensureSlugs(projects: ProjectRecord[]) {
  for (const project of projects) {
    if (!project.slug) await project.save()
  }
  return projects
}

const toPlain = (project: ProjectRecord) => JSON.parse(JSON.stringify(project)) as ProjectDoc

export const getAllProjects = cache(async (): Promise<ProjectDoc[]> => {
  await connectDB()
  const projects = await Project.find().sort({ order: 1, createdAt: -1 })
  return (await ensureSlugs(projects)).map(toPlain)
})

export type ProjectLookup =
  | { status: 'found'; project: ProjectDoc }
  | { status: 'moved'; slug: string }
  | { status: 'missing' }

export const getProjectBySlug = cache(async (slug: string): Promise<ProjectLookup> => {
  const projects = await getAllProjects()
  const project = projects.find((item) => item.slug === slug)
  if (project) return { status: 'found', project }
  // Old /projects/<id> links redirect to the slug URL
  if (isValidObjectId(slug)) {
    const byId = projects.find((project) => project._id === slug)
    if (byId) return { status: 'moved', slug: byId.slug }
  }
  return { status: 'missing' }
})

// Called after admin writes so cached project pages and the sitemap pick up changes
export function revalidateProjectPages() {
  revalidatePath('/projects/[slug]', 'page')
  revalidatePath('/sitemap.xml')
}
