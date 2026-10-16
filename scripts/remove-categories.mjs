// One-time migration: removes categories that no longer exist in src/types/project.ts
// from every project in MongoDB. A project left with no category gets FALLBACK_CATEGORY
// (the model requires at least one) and is listed so you can re-categorise it in the admin.
//
// Usage:
//   npm run migrate:categories
//
// Requires .env.local to contain MONGODB_URI. Safe to re-run.

import mongoose from 'mongoose'

const REMOVED_CATEGORIES = ['Backend', 'RAG Apps']
const FALLBACK_CATEGORY = 'Full Stack'

if (!process.env.MONGODB_URI) {
  console.error('Missing MONGODB_URI. Run with: node --env-file=.env.local scripts/remove-categories.mjs')
  process.exit(1)
}

await mongoose.connect(process.env.MONGODB_URI)
const projects = mongoose.connection.collection('projects')

const affected = await projects.find({ category: { $in: REMOVED_CATEGORIES } }, { projection: { title: 1, category: 1 } }).toArray()
console.log(`Projects using ${REMOVED_CATEGORIES.join(' / ')}: ${affected.length}`)

if (affected.length > 0) {
  const pulled = await projects.updateMany({ category: { $in: REMOVED_CATEGORIES } }, { $pull: { category: { $in: REMOVED_CATEGORIES } } })
  console.log(`Removed the categories from ${pulled.modifiedCount} project(s).`)

  const emptied = affected.filter((project) => project.category.every((category) => REMOVED_CATEGORIES.includes(category)))
  if (emptied.length > 0) {
    await projects.updateMany({ _id: { $in: emptied.map((project) => project._id) } }, { $set: { category: [FALLBACK_CATEGORY] } })
    console.log(`\nThese had no other category and were set to "${FALLBACK_CATEGORY}" — review them in the admin:`)
    emptied.forEach((project) => console.log(`  - ${project.title}`))
  }
}

await mongoose.disconnect()
console.log('\nDone.')
