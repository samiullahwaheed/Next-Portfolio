import { useEffect, useMemo, useState } from 'react'
import type { GalleryState } from '../../types/portfolio'
import { PROJECT_CATEGORIES, type ProjectDoc } from '../../types/project'
import { Icon } from '../ui/Icon'
import { SectionTitle } from '../ui/SectionTitle'

const FILTERS = ['All', ...PROJECT_CATEGORIES] as const

export function PortfolioSection({ openGallery }: { openGallery: (gallery: GalleryState) => void }) {
  const [projects, setProjects] = useState<ProjectDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>('All')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

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
    <section id="portfolio" className="min-h-screen border-y border-slate-200/80 bg-gradient-to-br from-slate-100 via-white to-blue-50 px-8 py-20 dark:border-slate-700/40 dark:from-[#030b16] dark:via-[#04101e] dark:to-[#07182a] max-sm:px-5">
      <div className="mx-auto max-w-[1100px]">
        <SectionTitle>Featured Projects</SectionTitle>
        <p className="-mt-8 mb-10 text-center text-slate-500 dark:text-slate-400">Showcase of my recent work in full-stack web development</p>

        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                activeFilter === filter
                  ? 'border-rose-600 bg-rose-600 text-white'
                  : 'border-slate-200 text-slate-600 hover:border-rose-500 hover:text-rose-600 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mx-auto mb-12 max-w-md">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 dark:border-slate-700 dark:bg-slate-800">
            <Icon name="search" className="size-4 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title or tech..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200"
            />
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-2 gap-7 max-[700px]:grid-cols-1">
            {[1, 2].map((key) => (
              <div key={key} className="h-[420px] animate-pulse rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800" />
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
                <article className="reveal-item group flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-rose-500 hover:shadow-[0_8px_28px_rgba(225,29,72,0.16)] dark:border-slate-700 dark:bg-slate-800" key={project._id}>
                  <div className="flex w-full flex-col">
                    <button className="relative h-60 overflow-hidden bg-slate-100 text-left dark:bg-slate-900" onClick={() => openGallery({ title: project.title, images, index: 0 })} aria-label={`Open ${project.title} image gallery`}>
                      <img src={images[0]} alt={`${project.title} project`} className="size-full object-cover transition duration-500 group-hover:scale-105" />
                      <span className="absolute bottom-3 right-3 rounded-full bg-slate-950/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur">View {images.length} images</span>
                    </button>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{project.title}</h3>
                      <p className="mt-3 flex-1 leading-7">{project.description}</p>
                      <div className="my-5 flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-rose-600 hover:text-white dark:bg-slate-700 dark:text-slate-200" key={tech}>{tech}</span>
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
