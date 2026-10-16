import type { MetadataRoute } from 'next'
import { getAllProjects } from '@/lib/projects'

export const revalidate = 3600

const siteUrl = 'https://samiullahwaheed.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const home: MetadataRoute.Sitemap[number] = {
    url: siteUrl,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1,
  }

  try {
    const projects = await getAllProjects()
    return [
      home,
      ...projects.map((project) => ({
        url: `${siteUrl}/projects/${project.slug}`,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
    ]
  } catch {
    // Keep the sitemap available even if the database is unreachable
    return [home]
  }
}
