import { PROJECT_CATEGORIES } from '@/types/project'

type ProjectImageInput = { url?: unknown; publicId?: unknown }

export function validateProjectPayload(body: Record<string, unknown>): string | null {
  if (typeof body.title !== 'string' || !body.title.trim()) return 'Title is required'
  if (typeof body.description !== 'string' || !body.description.trim()) return 'Description is required'
  if (!Array.isArray(body.images) || body.images.length === 0) return 'At least one image is required'
  const invalidImage = (body.images as ProjectImageInput[]).some(
    (image) => typeof image.url !== 'string' || typeof image.publicId !== 'string',
  )
  if (invalidImage) return 'Each image requires a url and publicId'
  if (!Array.isArray(body.category) || body.category.length === 0) return 'At least one category is required'
  const invalidCategory = (body.category as unknown[]).some(
    (category) => !(PROJECT_CATEGORIES as readonly string[]).includes(category as string),
  )
  if (invalidCategory) return 'Invalid category value'
  return null
}
