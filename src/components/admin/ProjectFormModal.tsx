import { useState, type ChangeEvent, type FormEvent } from 'react'
import { PROJECT_CATEGORIES, type ProjectCategory, type ProjectDoc, type ProjectImage } from '@/types/project'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024

type ProjectFormModalProps = {
  project: ProjectDoc | null
  onClose: () => void
  onSaved: () => void
}

export function ProjectFormModal({ project, onClose, onSaved }: ProjectFormModalProps) {
  const [title, setTitle] = useState(project?.title ?? '')
  const [description, setDescription] = useState(project?.description ?? '')
  const [category, setCategory] = useState<ProjectCategory[]>(project?.category ?? [])
  const [techStack, setTechStack] = useState(project?.techStack.join(', ') ?? '')
  const [liveLink, setLiveLink] = useState(project?.liveLink ?? '')
  const [githubLink, setGithubLink] = useState(project?.githubLink ?? '')
  const [featured, setFeatured] = useState(project?.featured ?? false)
  const [order, setOrder] = useState(project?.order ?? 0)
  const [images, setImages] = useState<ProjectImage[]>(project?.images ?? [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const toggleCategory = (value: ProjectCategory) => {
    setCategory((current) => (current.includes(value) ? current.filter((item) => item !== value) : [...current, value]))
  }

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setError('')
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          setError(`${file.name}: only JPG, PNG, and WEBP images are allowed`)
          continue
        }
        if (file.size > MAX_SIZE_BYTES) {
          setError(`${file.name}: image must be 5MB or smaller`)
          continue
        }

        const formData = new FormData()
        formData.append('file', file)
        const response = await fetch('/api/upload', { method: 'POST', body: formData })
        const data = await response.json()
        if (!response.ok) {
          setError(data.error || `Failed to upload ${file.name}`)
          continue
        }
        setImages((current) => [...current, { url: data.url, publicId: data.publicId }])
      }
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const removeImage = (publicId: string) => {
    setImages((current) => current.filter((image) => image.publicId !== publicId))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.')
      return
    }
    if (images.length === 0) {
      setError('At least one image is required.')
      return
    }
    if (category.length === 0) {
      setError('Select at least one category.')
      return
    }
    if (liveLink.trim() && !/^https?:\/\//i.test(liveLink.trim())) {
      setError('Live link must be a valid URL starting with http:// or https://.')
      return
    }
    if (githubLink.trim() && !/^https?:\/\//i.test(githubLink.trim())) {
      setError('GitHub link must be a valid URL starting with http:// or https://.')
      return
    }

    setSaving(true)
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        images,
        category,
        techStack: techStack.split(',').map((tech) => tech.trim()).filter(Boolean),
        liveLink: liveLink.trim() || undefined,
        githubLink: githubLink.trim() || undefined,
        featured,
        order: Number(order) || 0,
      }

      const response = await fetch(project ? `/api/projects/${project._id}` : '/api/projects', {
        method: project ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Failed to save project')
        return
      }
      onSaved()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/70 p-5" onClick={onClose}>
      <form
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
        className="my-8 w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800"
      >
        <h2 className="mb-5 text-lg font-bold text-slate-900 dark:text-white">{project ? 'Edit Project' : 'Add New Project'}</h2>

        {error && <p className="mb-4 rounded-lg bg-rose-600/10 px-3 py-2 text-sm text-rose-600">{error}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block text-slate-600 dark:text-slate-300">Title</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-slate-800 outline-none focus:border-rose-500 dark:border-slate-600 dark:text-slate-100" />
          </label>

          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block text-slate-600 dark:text-slate-300">Description</span>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-slate-800 outline-none focus:border-rose-500 dark:border-slate-600 dark:text-slate-100" />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-slate-600 dark:text-slate-300">Live Link</span>
            <input value={liveLink} onChange={(event) => setLiveLink(event.target.value)} placeholder="https://…" className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-slate-800 outline-none focus:border-rose-500 dark:border-slate-600 dark:text-slate-100" />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-slate-600 dark:text-slate-300">GitHub Link</span>
            <input value={githubLink} onChange={(event) => setGithubLink(event.target.value)} placeholder="https://…" className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-slate-800 outline-none focus:border-rose-500 dark:border-slate-600 dark:text-slate-100" />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-slate-600 dark:text-slate-300">Tech Stack (comma separated)</span>
            <input value={techStack} onChange={(event) => setTechStack(event.target.value)} placeholder="React.js, Node.js, MongoDB" className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-slate-800 outline-none focus:border-rose-500 dark:border-slate-600 dark:text-slate-100" />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-slate-600 dark:text-slate-300">Order</span>
            <input type="number" value={order} onChange={(event) => setOrder(Number(event.target.value))} className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-slate-800 outline-none focus:border-rose-500 dark:border-slate-600 dark:text-slate-100" />
          </label>

          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} />
            <span className="text-slate-600 dark:text-slate-300">Featured</span>
          </label>

          <div className="sm:col-span-2">
            <span className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Categories</span>
            <div className="flex flex-wrap gap-2">
              {PROJECT_CATEGORIES.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleCategory(item)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    category.includes(item)
                      ? 'border-rose-600 bg-rose-600 text-white'
                      : 'border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <span className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Images</span>
            {images.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-3">
                {images.map((image) => (
                  <div key={image.publicId} className="relative size-20 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-600">
                    <img src={image.url} alt="" className="size-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(image.publicId)}
                      aria-label="Remove image"
                      className="absolute right-0.5 top-0.5 grid size-5 place-items-center rounded-full bg-black/70 text-xs leading-none text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFileSelect} disabled={uploading} className="text-sm" />
            {uploading && <p className="mt-2 text-xs text-slate-400">Uploading…</p>}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full border border-slate-300 px-5 py-2.5 font-semibold text-slate-600 dark:border-slate-600 dark:text-slate-300">
            Cancel
          </button>
          <button type="submit" disabled={saving || uploading} className="rounded-full bg-rose-600 px-5 py-2.5 font-semibold text-white transition hover:opacity-90 disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Project'}
          </button>
        </div>
      </form>
    </div>
  )
}
