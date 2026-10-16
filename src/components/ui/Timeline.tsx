import { useEffect, useRef } from 'react'
import type { TimelineEntry } from '../../types/portfolio'
import { Icon } from './Icon'
import { trackSpotlight } from './spotlight'

type TimelineProps = {
  title: string
  subtitle: string
  entries: TimelineEntry[]
  educationTimeline?: boolean
}

export function Timeline({ title, subtitle, entries, educationTimeline = false }: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timeline = timelineRef.current
    if (!timeline) return

    const items = timeline.querySelectorAll('.reveal-item')
    const observer = new IntersectionObserver(
      (observedEntries) => {
        observedEntries.forEach((observedEntry) => {
          if (observedEntry.isIntersecting) {
            observedEntry.target.classList.add('is-visible')
            observer.unobserve(observedEntry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' },
    )

    items.forEach((item) => observer.observe(item))
    window.dispatchEvent(new Event('scroll'))

    return () => observer.disconnect()
  }, [entries])

  return (
    <div ref={timelineRef} className="timeline-section mt-20" data-timeline>
      <div className="reveal-item mb-12 text-center">
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
      <div className="timeline-track relative ml-3 pl-10 sm:ml-7 sm:pl-14">
        <span className="timeline-line-base" aria-hidden="true"></span>
        <span className="timeline-line-progress" aria-hidden="true"></span>
        <div className="space-y-9">
          {entries.map((entry, index) => (
            <article
              onMouseMove={trackSpotlight}
              className="reveal-item glass-card timeline-item rounded-2xl p-6"
              key={`${entry.organization}-${entry.date}-${entry.role}-${index}`}
            >
              <span className="timeline-dot absolute -left-[49px] top-7 size-4 rounded-full bg-rose-600 sm:-left-[65px]" aria-hidden="true"></span>
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <Icon name={educationTimeline ? 'graduation' : 'briefcase'} className="size-5 text-rose-600" />
                  <h4 className="text-lg font-bold">{entry.organization}</h4>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] px-3 py-1.5 text-xs text-slate-600 dark:bg-slate-700/60 dark:text-slate-300">
                  <Icon name="calendar" className="size-3.5 text-rose-600" />
                  {entry.date}
                </span>
              </div>
              <h5 className="mb-2 font-semibold text-rose-600">{entry.role}</h5>
              <p className="leading-7 text-slate-600 dark:text-slate-300">{entry.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
