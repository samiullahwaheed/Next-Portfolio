import { NextResponse, type NextRequest } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Project } from '@/models/Project'
import { requireAdmin } from '@/lib/auth'
import { validateProjectPayload } from '@/lib/projectValidation'

export async function GET(request: NextRequest) {
  await connectDB()

  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')

  const query: Record<string, unknown> = {}
  if (category && category !== 'All') query.category = category
  if (search) {
    const regex = new RegExp(search, 'i')
    query.$or = [{ title: regex }, { techStack: regex }]
  }

  const projects = await Project.find(query).sort({ order: 1, createdAt: -1 })
  return NextResponse.json(projects)
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

  return NextResponse.json(project, { status: 201 })
}
