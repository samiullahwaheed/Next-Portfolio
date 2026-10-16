import { NextResponse, type NextRequest } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Project } from '@/models/Project'
import { requireAdmin } from '@/lib/auth'
import { validateProjectPayload } from '@/lib/projectValidation'
import { ensureSlugs, escapeRegex, getProjectStats, queryProjects, revalidateProjectPages } from '@/lib/projects'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') ?? undefined
  const search = searchParams.get('search') ?? undefined

  // Paginated mode (homepage + /projects): ?limit=12&skip=0 → { projects, total }
  const limitParam = searchParams.get('limit')
  if (limitParam) {
    const limit = Math.min(Math.max(Number(limitParam) || 12, 1), 48)
    const skip = Math.max(Number(searchParams.get('skip')) || 0, 0)
    const featuredFirst = searchParams.get('featuredFirst') === '1'
    const [page, stats] = await Promise.all([
      queryProjects({ category, search, skip, limit, featuredFirst }),
      // Admin dashboard: overall counts for its stat cards
      searchParams.get('withStats') === '1' ? getProjectStats() : undefined,
    ])
    return NextResponse.json(stats ? { ...page, stats } : page)
  }

  // Full list (admin dashboard)
  await connectDB()
  const query: Record<string, unknown> = {}
  if (category && category !== 'All') query.category = category
  if (search) {
    const regex = new RegExp(escapeRegex(search), 'i')
    query.$or = [{ title: regex }, { techStack: regex }]
  }

  const projects = await Project.find(query).sort({ order: 1, createdAt: -1 })
  return NextResponse.json(await ensureSlugs(projects))
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const validationError = validateProjectPayload(body)
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 })

  await connectDB()
  const project = await Project.create({
    title: (body.title as string).trim(),
    description: (body.description as string).trim(),
    images: body.images,
    category: body.category,
    techStack: Array.isArray(body.techStack) ? body.techStack : [],
    liveLink: body.liveLink || undefined,
    githubLink: body.githubLink || undefined,
    featured: !!body.featured,
    order: Number(body.order) || 0,
  })

  revalidateProjectPages()
  return NextResponse.json(project, { status: 201 })
}
