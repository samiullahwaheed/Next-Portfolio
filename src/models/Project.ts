import { Schema, model, models, type InferSchemaType, type Model } from 'mongoose'
import { PROJECT_CATEGORIES } from '@/types/project'
import { slugify } from '@/lib/slug'

const ProjectImageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false },
)

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true, trim: true },
    description: { type: String, required: true },
    images: {
      type: [ProjectImageSchema],
      required: true,
      validate: {
        validator: (value: unknown[]) => value.length > 0,
        message: 'At least one image is required',
      },
    },
    category: {
      type: [{ type: String, enum: PROJECT_CATEGORIES }],
      required: true,
      validate: {
        validator: (value: unknown[]) => value.length > 0,
        message: 'At least one category is required',
      },
    },
    techStack: { type: [String], default: [] },
    liveLink: { type: String },
    githubLink: { type: String },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

// Assign a URL slug once (from the title) and keep it stable so shared links don't break on rename
ProjectSchema.pre('validate', async function () {
  if (this.slug) return
  const ProjectModel = this.constructor as Model<ProjectDocument>
  const base = slugify(this.title)
  let candidate = base
  for (let suffix = 2; await ProjectModel.exists({ slug: candidate, _id: { $ne: this._id } }); suffix += 1) {
    candidate = `${base}-${suffix}`
  }
  this.slug = candidate
})

export type ProjectDocument = InferSchemaType<typeof ProjectSchema>

export const Project = (models.Project as Model<ProjectDocument>) || model<ProjectDocument>('Project', ProjectSchema)
