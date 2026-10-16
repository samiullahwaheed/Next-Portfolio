'use client'

import { useEffect, useRef, useState } from 'react'
import type { ProjectDoc } from '@/types/project'
import { Icon } from '../ui/Icon'
import { Pagination } from '../ui/Pagination'
import { FilterPills } from './FilterPills'
import { ProjectCard, ProjectCardSkeleton } from './ProjectCard'

type ProjectsBrowserProps = {
  initialProjects: ProjectDoc[]
  initialTotal: number
  categories: string[]
  initialCategory: string
  initialSearch: string
  initialPage: number
  pageSize: number
}

type Filters = { category: string; search: string; page: number }
type Page = { projects: ProjectDoc[]; total: number }

const fetchPage = async ({ category, search, page }: Filters, pageSize: number): Promise<Page> => {
  const params = new URLSearchParams({ limit: String(pageSize), skip: String((page - 1) * pageSize) })
  if (category !== 'All') params.set('category', category)
  if (search.trim()) params.set('search', search.trim())
  const response = await fetch(`/api/projects?${params}`)
  if (!response.ok) throw new Error('Failed to load projects')
  return response.json()
}

// Mirrors the filters into the address bar (?category=…&q=…&page=…) so views are shareable
const syncUrl = ({ category, search, page }: Filters) => {
  const params = new URLSearchParams()
  if (category !== 'All') params.set('category', category)
  if (search.trim()) params.set('q', search.trim())
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname)
}

export function ProjectsBrowser({ initialProjects, initialTotal, categories, initialCategory, initialSearch, initialPage, pageSize }: ProjectsBrowserProps) {
  const [projects, setProjects] = useState(initialProjects)
  const [total, setTotal] = useState(initialTotal)
  const [category, setCategory] = useState(initialCategory)
  const [search, setSearch] = useState(initialSearch)
  const [page, setPage] = useState(initialPage)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const requestId = useRef(0)
  const searchTimer = useRef<number | undefined>(undefined)
  const topRef = useRef<HTMLDivElement>(null)

  useEffect(() => () => window.clearTimeout(searchTimer.current), [])

  const totalPages = Math.max(Math.ceil(total / pageSize), 1)
  const firstShown = total === 0 ? 0 : (page - 1) * pageSize + 1
  const lastShown = Math.min(page * pageSize, total)

  const load = async (filters: Filters) => {
    const id = ++requestId.current
    setPage(filters.page)
    setLoading(true)
    setError('')
    syncUrl(filters)
    try {
      const result = await fetchPage(filters, pageSize)
      if (id !== requestId.current) return
      setProjects(result.projects)
      setTotal(result.total)
    } catch {
      if (id === requestId.current) setError('Could not load projects. Please try again.')
    } finally {
      if (id === requestId.current) setLoading(false)
    }
  }

  const changeCategory = (value: string) => {
    setCategory(value)
    load({ category: value, search, page: 1 })
  }

  const changeSearch = (value: string) => {
    setSearch(value)
    window.clearTimeout(searchTimer.current)
    searchTimer.current = window.setTimeout(() => load({ category, search: value, page: 1 }), 300)
  }

  const changePage = (value: number) => {
    load({ category, search, page: value })
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const clearFilters = () => {
    setCategory('All')
    setSearch('')
    load({ category: 'All', search: '', page: 1 })
  }

  const hasFilters = category !== 'All' || search.trim() !== ''

  return (
    <div ref={topRef}>
      {/* Toolbar */}
      <div className="flex flex-col items-center gap-5">
        <FilterPills options={['All', ...categories]} active={category} onChange={changeCategory} />
        <div className="flex w-full max-w-xl items-center gap-3">
          <label className="glass-input flex flex-1 items-center gap-2 rounded-full px-5 py-3 focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent)_14%,transparent)]">
            <Icon name="search" className="size-4 text-slate-400" />
            <input
              value={search}
              onChange={(event) => changeSearch(event.target.value)}
              placeholder="Search by title or technology…"
              aria-label="Search projects"
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200"
            />
            {search && (
              <button type="button" onClick={() => changeSearch('')} aria-label="Clear search" className="grid size-6 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800">
                <Icon name="close" className="size-3.5" />
              </button>
            )}
          </label>
        </div>
      </div>

      <div className="mt-10 mb-6 flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-slate-500 dark:text-slate-400" aria-live="polite">
          {loading ? 'Loading…' : (
            <>
              Showing <span className="font-semibold text-slate-900 dark:text-white">{firstShown}–{lastShown}</span> of{' '}
              <span className="font-semibold text-slate-900 dark:text-white">{total}</span> projects
            </>
          )}
        </p>
        <div className="flex items-center gap-4">
          {hasFilters && (
            <button type="button" onClick={clearFilters} className="font-semibold text-[var(--accent)] hover:underline">
              Clear filters
            </button>
          )}
          {totalPages > 1 && (
            <span className="text-slate-500 dark:text-slate-400">
              Page {page} of {totalPages}
            </span>
          )}
        </div>
      </div>

      {error && <p className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-center text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="grid grid-cols-3 gap-6 max-[1000px]:grid-cols-2 max-[640px]:grid-cols-1">
        {loading
          ? Array.from({ length: pageSize }, (_, index) => <ProjectCardSkeleton key={index} />)
          : projects.map((project, index) => (
              <ProjectCard
                key={project._id}
                project={project}
                className="animate-[reveal-up_600ms_cubic-bezier(0.22,1,0.36,1)_both]"
                style={{ animationDelay: `${index * 50}ms` }}
              />
            ))}
      </div>

      {!loading && projects.length === 0 && (
        <div className="glass-card no-lift mx-auto max-w-md rounded-3xl px-8 py-12 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)]">
            <Icon name="search" className="size-6" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No projects found</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try a different category or search term.</p>
          {hasFilters && (
            <button type="button" onClick={clearFilters} className="mt-5 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white">
              Clear filters
            </button>
          )}
        </div>
      )}

      <div className="mt-12">
        <Pagination page={page} totalPages={totalPages} onChange={changePage} disabled={loading} />
      </div>
    </div>
  )
}
