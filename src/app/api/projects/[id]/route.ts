import { NextResponse, type NextRequest } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Project } from '@/models/Project'
import { requireAdmin } from '@/lib/auth'
import { validateProjectPayload } from '@/lib/projectValidation'
import cloudinary from '@/lib/cloudinary'

type RouteParams = { params: Promise<{ id: string }> }

async function deleteCloudinaryAssets(publicIds: string[]) {
  await Promise.all(publicIds.map((publicId) => cloudinary.uploader.destroy(publicId).catch(() => null)))
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  await connectDB()

  const project = await Project.findById(id)
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  return NextResponse.json(project)
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const validationError = validateProjectPayload(body)
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 })

  await connectDB()
  const existing = await Project.findById(id)
  if (!existing) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  const nextImages = body.images as { url: string; publicId: string }[]
  const nextPublicIds = new Set(nextImages.map((image) => image.publicId))
  const removedPublicIds = existing.images
    .filter((image: { publicId: string }) => !nextPublicIds.has(image.publicId))
    .map((image: { publicId: string }) => image.publicId)

  existing.title = (body.title as string).trim()
  existing.description = (body.description as string).trim()
  existing.images = nextImages as unknown as typeof existing.images
  existing.category = body.category
  existing.techStack = Array.isArray(body.techStack) ? body.techStack : []
  existing.liveLink = body.liveLink || undefined
  existing.githubLink = body.githubLink || undefined
  existing.featured = !!body.featured
  existing.order = Number(body.order) || 0
  await existing.save()

  if (removedPublicIds.length > 0) await deleteCloudinaryAssets(removedPublicIds)

  return NextResponse.json(existing)
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await connectDB()

  const project = await Project.findByIdAndDelete(id)
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  await deleteCloudinaryAssets(project.images.map((image: { publicId: string }) => image.publicId))

  return NextResponse.json({ success: true })
}
