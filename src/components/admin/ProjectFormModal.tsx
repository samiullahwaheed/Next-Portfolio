import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { PROJECT_CATEGORIES, type ProjectCategory, type ProjectDoc, type ProjectImage } from '@/types/project'
import { Icon } from '../ui/Icon'

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
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-slate-950/60 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={project ? 'Edit Project' : 'Add New Project'}>
      <form
        onSubmit={handleSubmit}
        className="my-8 w-full max-w-2xl rounded-3xl p-7 max-sm:p-5 border border-slate-200/80 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-slate-700/60 dark:bg-[#071426]/95"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{project ? 'Edit Project' : 'Add New Project'}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-8 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white">
            <Icon name="close" className="size-4" />
          </button>
        </div>

        {error && <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">{error}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block text-slate-600 dark:text-slate-300">Title</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} className="glass-input w-full rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-100" />
          </label>

          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block text-slate-600 dark:text-slate-300">Description</span>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className="glass-input w-full rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-100" />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-slate-600 dark:text-slate-300">Live Link</span>
            <input value={liveLink} onChange={(event) => setLiveLink(event.target.value)} placeholder="https://…" className="glass-input w-full rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-100" />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-slate-600 dark:text-slate-300">GitHub Link</span>
            <input value={githubLink} onChange={(event) => setGithubLink(event.target.value)} placeholder="https://…" className="glass-input w-full rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-100" />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-slate-600 dark:text-slate-300">Tech Stack (comma separated)</span>
            <input value={techStack} onChange={(event) => setTechStack(event.target.value)} placeholder="React.js, Node.js, MongoDB" className="glass-input w-full rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-100" />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-slate-600 dark:text-slate-300">Order</span>
            <input type="number" value={order} onChange={(event) => setOrder(Number(event.target.value))} className="glass-input w-full rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-100" />
          </label>

          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" className="size-4 accent-[var(--accent)]" checked={featured} onChange={(event) => setFeatured(event.target.checked)} />
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
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-white shadow-md shadow-[color-mix(in_srgb,var(--accent)_30%,transparent)]'
                      : 'border-slate-300 text-slate-600 hover:border-[var(--accent)] hover:text-[var(--accent)] dark:border-slate-600 dark:text-slate-300'
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
                  <div key={image.publicId} className="relative size-20 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-600">
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
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-60 dark:border-slate-600 dark:text-slate-300"
            >
              <Icon name="image" className="size-4" />
              {uploading ? 'Uploading…' : 'Choose Images'}
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full border border-slate-300 px-5 py-2.5 font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
            Cancel
          </button>
          <button type="submit" disabled={saving || uploading} className="rounded-full bg-[var(--accent)] px-5 py-2.5 font-semibold text-white shadow-lg shadow-[color-mix(in_srgb,var(--accent)_30%,transparent)] transition hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0">
            {saving ? 'Saving…' : 'Save Project'}
          </button>
        </div>
      </form>
    </div>
  )
}
