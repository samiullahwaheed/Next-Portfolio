'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/admin/DashboardHeader'
import { ProjectFormModal } from '@/components/admin/ProjectFormModal'
import { Icon } from '@/components/ui/Icon'
import type { ProjectDoc } from '@/types/project'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<ProjectDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshIndex, setRefreshIndex] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<ProjectDoc | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ProjectDoc | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const loadProjects = () => setRefreshIndex((index) => index + 1)

  useEffect(() => {
    let cancelled = false
    fetch('/api/projects')
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled) setProjects(data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [refreshIndex])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 3000)
    return () => window.clearTimeout(timer)
  }, [toast])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const response = await fetch(`/api/projects/${deleteTarget._id}`, { method: 'DELETE' })
      if (response.ok) {
        setToast({ type: 'success', message: 'Project deleted' })
        setDeleteTarget(null)
        loadProjects()
      } else {
        setToast({ type: 'error', message: 'Failed to delete project' })
      }
    } finally {
      setDeleting(false)
    }
  }

  const stats = useMemo(() => {
    const featured = projects.filter((project) => project.featured).length
    const categories = new Set(projects.flatMap((project) => project.category))
    return { total: projects.length, featured, categories: categories.size }
  }, [projects])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
      <DashboardHeader onLogout={handleLogout} />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Project Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage the projects shown on your portfolio.</p>
          </div>
          <button
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
            className="flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            <Icon name="edit" className="size-4" />
            Add New Project
          </button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon="grid" label="Total Projects" value={stats.total} />
          <StatCard icon="star" label="Featured" value={stats.featured} />
          <StatCard icon="portfolio" label="Categories Used" value={stats.categories} />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-900/40 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3">Project</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Featured</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading &&
                  [1, 2, 3].map((key) => (
                    <tr key={key} className="border-t border-slate-100 dark:border-slate-700/50">
                      <td className="px-5 py-4" colSpan={4}>
                        <div className="h-4 w-full max-w-xs animate-pulse rounded bg-slate-100 dark:bg-slate-700" />
                      </td>
                    </tr>
                  ))}

                {!loading && projects.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-16">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="grid size-12 place-items-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-700">
                          <Icon name="portfolio" className="size-5" />
                        </div>
                        <p className="font-medium text-slate-500 dark:text-slate-400">No projects yet</p>
                        <button
                          onClick={() => {
                            setEditing(null)
                            setFormOpen(true)
                          }}
                          className="mt-1 text-sm font-semibold text-rose-600 hover:underline"
                        >
                          Add your first project
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {!loading &&
                  projects.map((project) => (
                    <tr
                      key={project._id}
                      className="border-t border-slate-100 transition hover:bg-slate-50 dark:border-slate-700/50 dark:hover:bg-slate-900/30"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {project.images[0] && (
                            <img
                              src={project.images[0].url}
                              alt=""
                              className="size-10 shrink-0 rounded-lg border border-slate-200 object-cover dark:border-slate-700"
                            />
                          )}
                          <span className="font-medium text-slate-900 dark:text-white">{project.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {project.category.map((item) => (
                            <span
                              key={item}
                              className="rounded-full bg-rose-600/10 px-2.5 py-1 text-xs font-medium text-rose-600"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {project.featured ? (
                          <span className="inline-flex items-center gap-1 text-amber-500">
                            <Icon name="star" className="size-4" />
                          </span>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditing(project)
                              setFormOpen(true)
                            }}
                            aria-label={`Edit ${project.title}`}
                            title="Edit"
                            className="grid size-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-slate-700"
                          >
                            <Icon name="edit" className="size-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(project)}
                            aria-label={`Delete ${project.title}`}
                            title="Delete"
                            className="grid size-9 place-items-center rounded-full text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/40"
                          >
                            <Icon name="trash" className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {toast && (
        <div
          className={`fixed right-5 top-20 z-[110] flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-white shadow-lg ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}
        >
          <Icon name={toast.type === 'success' ? 'check' : 'close'} className="size-4" />
          {toast.message}
        </div>
      )}

      {formOpen && (
        <ProjectFormModal
          project={editing}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false)
            setToast({ type: 'success', message: editing ? 'Project updated' : 'Project created' })
            loadProjects()
          }}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-5" role="dialog" aria-modal="true" aria-label="Confirm delete">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 dark:bg-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Delete Project</h2>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                aria-label="Close"
                className="grid size-8 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-700"
              >
                <Icon name="close" className="size-4" />
              </button>
            </div>
            <p className="mb-5 text-sm text-slate-600 dark:text-slate-300">
              Delete &ldquo;{deleteTarget.title}&rdquo;? This also removes its images from Cloudinary.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-600">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting} className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: Parameters<typeof Icon>[0]['name']; label: string; value: number }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-rose-600/10 text-rose-600">
        <Icon name={icon} className="size-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  )
}
