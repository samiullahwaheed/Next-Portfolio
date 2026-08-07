// One-time migration script: uploads the images that used to live in
// public/portfolio/projects/** to Cloudinary and seeds MongoDB with the
// projects that used to be hardcoded in src/data/portfolio.tsx, plus the
// single Admin account used to sign in to /admin/dashboard.
//
// Usage:
//   npm run seed
//
// Requires .env.local to contain MONGODB_URI, CLOUDINARY_CLOUD_NAME,
// CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD.
// Safe to re-run: projects/admin are upserted by title/email, and Cloudinary
// uploads reuse the same public_id (folder + filename) so assets aren't duplicated.

import path from 'node:path'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { v2 as cloudinary } from 'cloudinary'

const required = ['MONGODB_URI', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD']
const missing = required.filter((key) => !process.env[key])
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`)
  console.error('Run this script with: node --env-file=.env.local scripts/seed.mjs')
  process.exit(1)
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

const CLOUDINARY_FOLDER = 'portfolio/projects'

const ProjectImageSchema = new mongoose.Schema({ url: String, publicId: String }, { _id: false })
const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    images: { type: [ProjectImageSchema], required: true },
    category: { type: [String], required: true },
    techStack: { type: [String], default: [] },
    liveLink: String,
    githubLink: String,
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)
const AdminSchema = new mongoose.Schema(
  { email: { type: String, required: true, unique: true, lowercase: true, trim: true }, passwordHash: { type: String, required: true } },
  { timestamps: true },
)

const Project = mongoose.models.Project ?? mongoose.model('Project', ProjectSchema)
const Admin = mongoose.models.Admin ?? mongoose.model('Admin', AdminSchema)

// Best-guess category assignment from tech stack — adjust any of these later from /admin/dashboard.
function categorizeProject(tech) {
  const categories = new Set(['Web App'])
  const hasBackend = tech.some((item) => ['Node.js', 'Express.js', 'Laravel'].includes(item))
  const hasReact = tech.includes('React.js')
  if (hasReact) categories.add('React')
  if (hasReact && hasBackend) categories.add('Full Stack')
  if (hasReact && !hasBackend) categories.add('Frontend')
  return Array.from(categories)
}

// Snapshot of the projects that used to be hardcoded in src/data/portfolio.tsx.
const sourceProjects = [
  {
    title: 'CryptoVerse',
    description:
      'Developed a React-based cryptocurrency web application that provides real-time data, detailed statistics, and insights for global cryptocurrencies. Integrated APIs for live market updates, designed a responsive interface, and implemented user-friendly navigation for exploring coins and trends.',
    tech: ['React.js', 'Tailwind CSS', 'Cloudinary', 'Redux', 'RESTful APIs'],
    liveLink: 'https://cryptoverse786.netlify.app/',
    imageFolder: 'CryptoVerse',
    imageCount: 3,
  },
  {
    title: 'Movieo',
    description:
      'Developed a dynamic web application that allows users to search, browse, and explore detailed information about movies and TV shows. Integrated the TMDB API for real-time ratings, genres, and descriptions, with a responsive interface across devices.',
    tech: ['React.js', 'Node.js', 'Cloudinary', 'TMDB API', 'Tailwind CSS'],
    liveLink: 'https://movieo786.vercel.app/',
    imageFolder: 'Movieo',
    imageCount: 4,
  },
  {
    title: 'QuickChat',
    description:
      'Built a real-time MERN chat app with JWT authentication and Socket.io. Designed a responsive React UI, managed state with Redux and Context APIs, developed RESTful APIs with Express and MongoDB, and added friend requests, group chat, and Meta AI.',
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Cloudinary', 'Redux', 'WebSockets', 'Meta AI', 'JWT', 'Socket.io'],
    liveLink: 'https://mern-chatapp-786.onrender.com/',
    imageFolder: 'QuickChat',
    imageCount: 10,
  },
  {
    title: 'Skill Exchange',
    description:
      'Developed a platform for exchanging skills and services through AI-powered matching. It includes secure authentication, chat, scheduling, feedback, barter and monetary transactions, agreements, ratings, and Stripe payments.',
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Cloudinary', 'Socket.io', 'JWT', 'Stripe'],
    liveLink: 'https://www.linkedin.com/posts/samiullah-waheed_fullstackdeveloper-mernstack-socketio-activity-7415096227408642048-Wwqm',
    imageFolder: 'Skill_Exchange',
    imageCount: 10,
  },
]

async function uploadProjectImages(source) {
  const images = []
  for (let index = 1; index <= source.imageCount; index += 1) {
    const filePath = path.join(process.cwd(), 'public', 'portfolio', 'projects', source.imageFolder, `${index}.png`)
    const publicId = `${source.imageFolder}/${index}`
    const result = await cloudinary.uploader.upload(filePath, {
      folder: CLOUDINARY_FOLDER,
      public_id: publicId,
      overwrite: true,
    })
    images.push({ url: result.secure_url, publicId: result.public_id })
    console.log(`  uploaded ${source.imageFolder}/${index}.png -> ${result.public_id}`)
  }
  return images
}

async function seedProjects() {
  for (const source of sourceProjects) {
    console.log(`Seeding project: ${source.title}`)
    const images = await uploadProjectImages(source)
    const category = categorizeProject(source.tech)
    await Project.findOneAndUpdate(
      { title: source.title },
      {
        title: source.title,
        description: source.description,
        images,
        category,
        techStack: source.tech,
        liveLink: source.liveLink,
        featured: false,
        order: 0,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    )
    console.log(`  saved with categories: ${category.join(', ')}`)
  }
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL.trim().toLowerCase()
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
  await Admin.findOneAndUpdate({ email }, { email, passwordHash }, { upsert: true, new: true, setDefaultsOnInsert: true })
  console.log(`Seeded admin account: ${email}`)
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  await seedProjects()
  await seedAdmin()

  await mongoose.disconnect()
  console.log('Done.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
