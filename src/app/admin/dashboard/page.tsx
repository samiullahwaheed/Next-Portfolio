'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProjectFormModal } from '@/components/admin/ProjectFormModal'
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

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Project Dashboard</h1>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setEditing(null)
                setFormOpen(true)
              }}
              className="rounded-full bg-rose-600 px-5 py-2.5 font-semibold text-white transition hover:opacity-90"
            >
              + Add New Project
            </button>
            <button onClick={handleLogout} className="rounded-full border border-slate-300 px-5 py-2.5 font-semibold dark:border-slate-600">
              Logout
            </button>
          </div>
        </div>

        {toast && (
          <div className={`mb-4 rounded-lg px-4 py-2 text-sm text-white ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
            {toast.message}
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && projects.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                    No projects yet.
                  </td>
                </tr>
              )}
              {projects.map((project) => (
                <tr key={project._id} className="border-b border-slate-100 last:border-0 dark:border-slate-700/50">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{project.title}</td>
                  <td className="px-4 py-3">{project.category.join(', ')}</td>
                  <td className="px-4 py-3">{project.featured ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setEditing(project)
                        setFormOpen(true)
                      }}
                      className="mr-4 text-rose-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button onClick={() => setDeleteTarget(project)} className="text-slate-500 hover:text-rose-600 hover:underline dark:text-slate-400">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-5" onClick={() => setDeleteTarget(null)}>
          <div onClick={(event) => event.stopPropagation()} className="w-full max-w-sm rounded-xl bg-white p-6 dark:bg-slate-800">
            <p className="mb-5 text-slate-700 dark:text-slate-200">
              Delete &ldquo;{deleteTarget.title}&rdquo;? This also removes its images from Cloudinary.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="rounded-full border border-slate-300 px-4 py-2 dark:border-slate-600">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting} className="rounded-full bg-rose-600 px-4 py-2 text-white disabled:opacity-60">
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
