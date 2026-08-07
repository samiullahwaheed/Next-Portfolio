import { Schema, model, models, type InferSchemaType, type Model } from 'mongoose'

export const PROJECT_CATEGORIES = [
  'Web App',
  'Mobile App',
  'Full Stack',
  'AI Agents',
  'Automation (n8n)',
  'RAG Apps',
  'Next.js',
  'Flutter',
  'WordPress',
] as const

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

export type ProjectDocument = InferSchemaType<typeof ProjectSchema>

export const Project = (models.Project as Model<ProjectDocument>) || model<ProjectDocument>('Project', ProjectSchema)
