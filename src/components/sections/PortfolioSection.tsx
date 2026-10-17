import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { ProjectDoc } from '../../types/project'
import { ProjectCard, ProjectCardSkeleton } from '../project/ProjectCard'
import { InteractiveDots } from '../ui/InteractiveDots'
import { SectionTitle } from '../ui/SectionTitle'

// Homepage shows a curated two-row showcase; the full archive lives at /projects
const SHOWCASE_SIZE = 6

export function PortfolioSection() {
  const [projects, setProjects] = useState<ProjectDoc[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/projects?limit=${SHOWCASE_SIZE}&featuredFirst=1`)
      .then((response) => response.json())
      .then((data: { projects: ProjectDoc[]; total: number }) => {
        if (cancelled) return
        setProjects(data.projects)
        setTotal(data.total)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="portfolio" className="relative isolate overflow-hidden px-8 py-16 max-sm:px-5 max-sm:py-12">
      <InteractiveDots />
      <div aria-hidden className="pointer-events-none absolute -right-48 bottom-20 -z-10 size-[30rem] rounded-full bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] blur-3xl" />
      <div className="mx-auto max-w-[1180px]">
        <SectionTitle eyebrow="Portfolio" title="Featured" highlight="projects" subtitle="A selection of my recent work in full-stack web development" />

        <div className="grid grid-cols-3 gap-6 max-[1000px]:grid-cols-2 max-[640px]:grid-cols-1">
          {loading && Array.from({ length: SHOWCASE_SIZE }, (_, index) => <ProjectCardSkeleton key={index} />)}
          {!loading && projects.map((project) => <ProjectCard key={project._id} project={project} className="reveal-item" />)}
        </div>

        {!loading && projects.length === 0 && <p className="text-center text-slate-400">No projects yet.</p>}

        {!loading && total > 0 && (
          <div className="reveal-item mt-10 flex justify-center">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-3 rounded-full border border-[var(--accent)] bg-white/70 py-2 pr-2 pl-6 font-semibold text-[var(--accent)] backdrop-blur transition hover:bg-[var(--accent)] hover:text-white hover:shadow-lg hover:shadow-[color-mix(in_srgb,var(--accent)_30%,transparent)] dark:bg-slate-900/50"
            >
              View all {total} projects
              <span aria-hidden className="grid size-9 place-items-center rounded-full bg-[var(--accent)] text-white transition group-hover:translate-x-1 group-hover:bg-white group-hover:text-[var(--accent)]">
                →
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
