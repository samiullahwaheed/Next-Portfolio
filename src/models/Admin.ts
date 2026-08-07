import { Schema, model, models, type InferSchemaType, type Model } from 'mongoose'

const AdminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
)

export type AdminDocument = InferSchemaType<typeof AdminSchema>

export const Admin = (models.Admin as Model<AdminDocument>) || model<AdminDocument>('Admin', AdminSchema)
