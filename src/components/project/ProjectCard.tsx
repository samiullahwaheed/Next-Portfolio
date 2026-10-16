'use client'

import type { CSSProperties } from 'react'
import Link from 'next/link'
import { visibleCategories, type ProjectDoc } from '@/types/project'
import { Icon } from '../ui/Icon'
import { trackSpotlight } from '../ui/spotlight'

const MAX_TECH = 3

type ProjectCardProps = {
  project: ProjectDoc
  className?: string
  style?: CSSProperties
}

export function ProjectCard({ project, className = '', style }: ProjectCardProps) {
  const visibleTech = project.techStack.slice(0, MAX_TECH)
  const hiddenTech = project.techStack.length - visibleTech.length
  const [primaryCategory] = visibleCategories(project.category)

  return (
    <Link
      href={`/projects/${project.slug}`}
      onMouseMove={trackSpotlight}
      style={style}
      className={`glass-card group flex flex-col overflow-hidden rounded-2xl ${className}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img src={project.images[0]?.url} alt={`${project.title} project`} loading="lazy" className="size-full object-cover object-top transition duration-700 group-hover:scale-105" />
        <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
        <span aria-hidden className="absolute bottom-3 left-4 inline-flex translate-y-3 items-center gap-1.5 text-sm font-semibold text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          View project <span>→</span>
        </span>
        {project.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-400/90 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-950 shadow">
            <Icon name="star" className="size-3" />
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {primaryCategory && (
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">{primaryCategory}</p>
            )}
            <h3 className="mt-1 line-clamp-2 text-lg font-bold leading-snug text-slate-900 dark:text-white">{project.title}</h3>
          </div>
          <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-400 transition duration-300 group-hover:-rotate-45 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white dark:border-slate-700">
            <Icon name="right" className="size-3.5" />
          </span>
        </div>

        {project.techStack.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5">
            {visibleTech.map((tech) => (
              <span key={tech} className="rounded-full border border-[color-mix(in_srgb,var(--accent)_30%,transparent)] px-2.5 py-0.5 text-xs font-medium text-[var(--accent)] dark:text-slate-200">
                {tech}
              </span>
            ))}
            {hiddenTech > 0 && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">+{hiddenTech}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

export function ProjectCardSkeleton() {
  return (
    <div className="glass-card no-lift overflow-hidden rounded-2xl">
      <div className="aspect-[16/10] animate-pulse bg-slate-200/70 dark:bg-slate-800/70" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-20 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-800/70" />
        <div className="h-5 w-3/4 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-800/70" />
        <div className="flex gap-1.5 pt-1">
          {[1, 2, 3].map((key) => (
            <div key={key} className="h-5 w-16 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-800/70" />
          ))}
        </div>
      </div>
    </div>
  )
}
