import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { PROJECT_CATEGORIES, type ProjectDoc } from '../../types/project'
import { Icon } from '../ui/Icon'
import { SectionTitle } from '../ui/SectionTitle'
import { trackSpotlight } from '../ui/spotlight'

const FILTERS = ['All', ...PROJECT_CATEGORIES] as const

const MAX_TECH = 4

export function PortfolioSection() {
  const [projects, setProjects] = useState<ProjectDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>('All')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [indicator, setIndicator] = useState<CSSProperties | null>(null)
  const filterRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  // Slide the active pill behind the selected filter (buttons may wrap onto two rows)
  useLayoutEffect(() => {
    const measure = () => {
      const button = filterRefs.current[activeFilter]
      setIndicator(button ? { left: button.offsetLeft, top: button.offsetTop, width: button.offsetWidth, height: button.offsetHeight } : null)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [activeFilter])

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
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 300)
    return () => window.clearTimeout(timer)
  }, [search])

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory = activeFilter === 'All' || project.category.includes(activeFilter)
      const matchesSearch =
        !debouncedSearch ||
        project.title.toLowerCase().includes(debouncedSearch) ||
        project.techStack.some((tech) => tech.toLowerCase().includes(debouncedSearch))
      return matchesCategory && matchesSearch
    })
  }, [projects, activeFilter, debouncedSearch])

  return (
    <section id="portfolio" className="relative isolate overflow-hidden px-8 py-24 max-sm:px-5">
      <div aria-hidden className="bg-dots pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden className="pointer-events-none absolute -right-48 bottom-20 -z-10 size-[30rem] rounded-full bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] blur-3xl" />
      <div className="mx-auto max-w-[1100px]">
        <SectionTitle eyebrow="Portfolio" title="Featured" highlight="projects" subtitle="Showcase of my recent work in full-stack web development" />

        <div className="mb-6 flex justify-center">
          <div className="relative flex max-w-full flex-wrap justify-center gap-1 rounded-3xl border border-slate-200/80 bg-white/70 p-1 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/50">
            {indicator && (
              <span
                aria-hidden
                className="absolute rounded-full bg-[var(--accent)] shadow-lg shadow-[color-mix(in_srgb,var(--accent)_35%,transparent)] transition-all duration-300 ease-out"
                style={indicator}
              />
            )}
            {FILTERS.map((filter) => (
              <button
                key={filter}
                ref={(element) => {
                  filterRefs.current[filter] = element
                }}
                type="button"
                onClick={() => setActiveFilter(filter)}
                aria-pressed={activeFilter === filter}
                className={`relative z-10 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-300 ${
                  activeFilter === filter ? 'text-white' : 'text-slate-600 hover:text-[var(--accent)] dark:text-slate-300'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto mb-12 max-w-md">
          <label className="glass-input flex items-center gap-2 rounded-full px-4 py-2.5 focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent)_14%,transparent)]">
            <Icon name="search" className="size-4 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title or tech..."
              aria-label="Search projects"
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200"
            />
          </label>
        </div>

        {loading && (
          <div className="grid grid-cols-2 gap-7 max-[700px]:grid-cols-1">
            {[1, 2].map((key) => (
              <div key={key} className="glass-card h-[420px] animate-pulse rounded-2xl" />
            ))}
          </div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <p className="text-center text-slate-400">No projects found.</p>
        )}

        {!loading && filteredProjects.length > 0 && (
          <div className="grid grid-cols-2 gap-7 max-[700px]:grid-cols-1">
            {filteredProjects.map((project) => {
              const visibleTech = project.techStack.slice(0, MAX_TECH)
              const hiddenTech = project.techStack.length - visibleTech.length
              return (
                <Link
                  href={`/projects/${project.slug}`}
                  onMouseMove={trackSpotlight}
                  className="reveal-item glass-card group flex flex-col overflow-hidden rounded-2xl"
                  key={project._id}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <img src={project.images[0]?.url} alt={`${project.title} project`} className="size-full object-cover transition duration-700 group-hover:scale-110" />
                    <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                    <span aria-hidden className="absolute bottom-4 left-4 inline-flex translate-y-3 items-center gap-2 font-semibold text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      View project <span>→</span>
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <h3 className="flex items-start justify-between gap-3 text-xl font-bold text-slate-900 dark:text-white">
                      {project.title}
                      <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-400 transition duration-300 group-hover:-rotate-45 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white dark:border-slate-700">
                        <Icon name="right" className="size-4" />
                      </span>
                    </h3>
                    {project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {visibleTech.map((tech) => (
                          <span className="rounded-full border border-[color-mix(in_srgb,var(--accent)_30%,transparent)] px-3 py-1 text-xs font-medium text-[var(--accent)] dark:text-slate-200" key={tech}>{tech}</span>
                        ))}
                        {hiddenTech > 0 && (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">+{hiddenTech}</span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
