import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import type { GalleryState } from '../../types/portfolio'
import { PROJECT_CATEGORIES, type ProjectDoc } from '../../types/project'
import { Icon } from '../ui/Icon'
import { SectionTitle } from '../ui/SectionTitle'
import { trackSpotlight } from '../ui/spotlight'

const FILTERS = ['All', ...PROJECT_CATEGORIES] as const

export function PortfolioSection({ openGallery }: { openGallery: (gallery: GalleryState) => void }) {
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
              const images = project.images.map((image) => image.url)
              return (
                <article onMouseMove={trackSpotlight} className="reveal-item glass-card group flex overflow-hidden rounded-2xl" key={project._id}>
                  <div className="flex w-full flex-col">
                    <button className="relative h-60 overflow-hidden bg-slate-100 text-left dark:bg-slate-900" onClick={() => openGallery({ title: project.title, images, index: 0 })} aria-label={`Open ${project.title} image gallery`}>
                      <img src={images[0]} alt={`${project.title} project`} className="size-full object-cover transition duration-700 group-hover:scale-110" />
                      <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                      <span className="absolute bottom-4 left-4 inline-flex translate-y-3 items-center gap-2 font-semibold text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        View project <span aria-hidden>→</span>
                      </span>
                      <span className="absolute right-3 top-3 rounded-full bg-slate-950/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">{images.length} images</span>
                    </button>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{project.title}</h3>
                      <p className="mt-3 flex-1 leading-7">{project.description}</p>
                      <div className="my-5 flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <span className="rounded-full border border-[color-mix(in_srgb,var(--accent)_30%,transparent)] px-3 py-1 text-xs font-medium text-[var(--accent)] dark:text-slate-200" key={tech}>{tech}</span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {project.liveLink && (
                          <a href={project.liveLink} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-2 rounded-full border border-rose-600 px-5 py-2.5 font-semibold text-rose-600 transition hover:bg-rose-600 hover:text-white">
                            Visit Site
                            <Icon name="external" className="size-4" />
                          </a>
                        )}
                        {project.githubLink && (
                          <a href={project.githubLink} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 font-semibold text-slate-600 transition hover:border-rose-600 hover:text-rose-600 dark:border-slate-600 dark:text-slate-300">
                            <Icon name="github" className="size-4" />
                            Code
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
