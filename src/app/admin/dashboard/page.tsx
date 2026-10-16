'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/admin/DashboardHeader'
import { ProjectFormModal } from '@/components/admin/ProjectFormModal'
import { CountUp } from '@/components/ui/CountUp'
import { Icon } from '@/components/ui/Icon'
import { trackSpotlight } from '@/components/ui/spotlight'
import { useSavedTheme } from '@/hooks/useSavedTheme'
import type { ProjectDoc } from '@/types/project'

const gradientBadge =
  'grid shrink-0 place-items-center bg-gradient-to-br from-[var(--accent)] to-[color-mix(in_srgb,var(--accent)_55%,#38bdf8)] text-white shadow-lg shadow-[color-mix(in_srgb,var(--accent)_30%,transparent)]'

export default function AdminDashboardPage() {
  const router = useRouter()
  const { dark, toggleDark } = useSavedTheme()
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

  const openNewProject = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const stats = useMemo(() => {
    const featured = projects.filter((project) => project.featured).length
    const categories = new Set(projects.flatMap((project) => project.category))
    return { total: projects.length, featured, categories: categories.size }
  }, [projects])

  return (
    <div className="relative isolate min-h-screen bg-slate-50 pt-4 text-slate-700 dark:bg-[#010713] dark:text-slate-200">
      <div aria-hidden className="bg-hero-grid pointer-events-none fixed inset-0 -z-10" />
      <div aria-hidden className="pointer-events-none fixed -right-40 -top-20 -z-10 size-[30rem] rounded-full bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] blur-3xl" />
      <div aria-hidden className="pointer-events-none fixed -bottom-40 -left-40 -z-10 size-[28rem] rounded-full bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] blur-3xl" />

      <DashboardHeader dark={dark} onToggleDark={toggleDark} onLogout={handleLogout} />

      <main className="mx-auto max-w-6xl px-6 pt-12 pb-16 max-sm:px-4">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--accent)_25%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              <span aria-hidden>✦</span>
              Admin
            </span>
            <h1 className="mt-4 text-[clamp(1.9rem,4vw,2.6rem)] font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
              Project <span className="text-accent-gradient">Dashboard</span>
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Manage the projects shown on your portfolio.</p>
          </div>
          <button
            onClick={openNewProject}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-white shadow-lg shadow-[color-mix(in_srgb,var(--accent)_30%,transparent)] transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Icon name="edit" className="size-4" />
            Add New Project
          </button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StatCard icon="grid" label="Total Projects" value={stats.total} loading={loading} />
          <StatCard icon="star" label="Featured" value={stats.featured} loading={loading} />
          <StatCard icon="portfolio" label="Categories Used" value={stats.categories} loading={loading} />
        </div>

        <div className="glass-card no-lift overflow-hidden rounded-3xl">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200/70 px-6 py-4 dark:border-slate-700/50">
            <h2 className="font-bold text-slate-900 dark:text-white">All projects</h2>
            {!loading && (
              <span className="rounded-full bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                {projects.length} total
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3">Project</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Featured</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading &&
                  [1, 2, 3].map((key) => (
                    <tr key={key} className="border-t border-slate-200/60 dark:border-slate-700/40">
                      <td className="px-6 py-4" colSpan={4}>
                        <div className="flex items-center gap-3">
                          <div className="size-12 animate-pulse rounded-xl bg-slate-200/70 dark:bg-slate-700/60" />
                          <div className="h-4 w-full max-w-xs animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-700/60" />
                        </div>
                      </td>
                    </tr>
                  ))}

                {!loading && projects.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-16">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className={`${gradientBadge} size-14 rounded-2xl`}>
                          <Icon name="portfolio" className="size-6" />
                        </div>
                        <p className="font-medium text-slate-500 dark:text-slate-400">No projects yet</p>
                        <button onClick={openNewProject} className="mt-1 text-sm font-semibold text-[var(--accent)] hover:underline">
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
                      className="group border-t border-slate-200/60 transition hover:bg-[color-mix(in_srgb,var(--accent)_5%,transparent)] dark:border-slate-700/40"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {project.images[0] ? (
                            <img
                              src={project.images[0].url}
                              alt=""
                              className="size-12 shrink-0 rounded-xl border border-slate-200 object-cover transition duration-300 group-hover:scale-105 dark:border-slate-700"
                            />
                          ) : (
                            <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                              <Icon name="image" className="size-5" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-white">{project.title}</p>
                            <p className="text-xs text-slate-400">{project.images.length} images</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {project.category.map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-[color-mix(in_srgb,var(--accent)_30%,transparent)] px-2.5 py-0.5 text-xs font-medium text-[var(--accent)]"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {project.featured ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                            <Icon name="star" className="size-3.5" />
                            Featured
                          </span>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditing(project)
                              setFormOpen(true)
                            }}
                            aria-label={`Edit ${project.title}`}
                            title="Edit"
                            className="grid size-9 place-items-center rounded-full border border-transparent text-slate-500 transition hover:border-[color-mix(in_srgb,var(--accent)_30%,transparent)] hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] hover:text-[var(--accent)] dark:text-slate-400"
                          >
                            <Icon name="edit" className="size-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(project)}
                            aria-label={`Delete ${project.title}`}
                            title="Delete"
                            className="grid size-9 place-items-center rounded-full border border-transparent text-slate-500 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
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
          role="status"
          className={`fixed right-5 top-24 z-[110] flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium shadow-xl backdrop-blur-xl ${
            toast.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-50/90 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
              : 'border-red-500/30 bg-red-50/90 text-red-700 dark:bg-red-950/80 dark:text-red-300'
          }`}
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
        <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/60 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Confirm delete">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-700/60 dark:bg-[#071426]/95">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400">
                <Icon name="trash" className="size-5" />
              </div>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                aria-label="Close"
                className="grid size-8 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white"
              >
                <Icon name="close" className="size-4" />
              </button>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Delete Project</h2>
            <p className="mt-1 mb-6 text-sm text-slate-600 dark:text-slate-300">
              Delete &ldquo;{deleteTarget.title}&rdquo;? This also removes its images from Cloudinary.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold transition hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting} className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-700 disabled:opacity-60">
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, loading }: { icon: Parameters<typeof Icon>[0]['name']; label: string; value: number; loading: boolean }) {
  return (
    <div onMouseMove={trackSpotlight} className="glass-card flex items-center gap-4 rounded-2xl p-5">
      <div className={`${gradientBadge} size-12 rounded-xl`}>
        <Icon name={icon} className="size-5" />
      </div>
      <div>
        {loading ? (
          <div className="mb-1.5 h-8 w-10 animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-700/60" />
        ) : (
          <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            <CountUp value={value} duration={900} />
          </p>
        )}
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  )
}
