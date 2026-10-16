import type { Metadata } from 'next'
import { Footer } from '@/components/layout/Footer'
import { ProjectCta } from '@/components/project/ProjectCta'
import { ProjectNavbar } from '@/components/project/ProjectNavbar'
import { ProjectsBrowser } from '@/components/project/ProjectsBrowser'
import { getProjectStats, queryProjects } from '@/lib/projects'

const PAGE_SIZE = 9
const description =
  'Browse all projects by Samiullah Waheed — full-stack web apps, mobile apps, SaaS products and more, built with React, Node.js, Next.js and MongoDB.'

export const metadata: Metadata = {
  title: 'All Projects',
  description,
  alternates: { canonical: '/projects' },
  openGraph: { url: '/projects', title: 'All Projects | Samiullah Waheed', description },
  twitter: { title: 'All Projects | Samiullah Waheed', description },
}

type Props = { searchParams: Promise<{ category?: string | string[]; q?: string | string[]; page?: string | string[] }> }

export default async function ProjectsPage({ searchParams }: Props) {
  const params = await searchParams
  const stats = await getProjectStats()
  const requestedCategory = typeof params.category === 'string' ? params.category : 'All'
  const category = (stats.categories as string[]).includes(requestedCategory) ? requestedCategory : 'All'
  const search = typeof params.q === 'string' ? params.q : ''
  const requestedPage = Math.max(Math.floor(Number(typeof params.page === 'string' ? params.page : 1)) || 1, 1)
  const fetchPage = (page: number) => queryProjects({ category, search, skip: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE })
  let page = requestedPage
  let result = await fetchPage(page)
  // ?page= past the end (e.g. after deletions) falls back to the last real page
  const lastPage = Math.max(Math.ceil(result.total / PAGE_SIZE), 1)
  if (page > lastPage) {
    page = lastPage
    result = await fetchPage(page)
  }
  const { projects, total } = result

  const tiles = [
    { value: stats.total, label: 'Projects' },
    { value: stats.categoryCount, label: 'Categories' },
    { value: stats.featured, label: 'Featured' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-600 dark:bg-[#010713] dark:text-slate-300">
      <ProjectNavbar />

      <main className="relative isolate overflow-hidden">
        <div aria-hidden className="bg-hero-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[760px]" />
        <div aria-hidden className="pointer-events-none absolute -right-40 top-10 -z-10 size-[34rem] rounded-full bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -left-48 top-[34rem] -z-10 size-[30rem] rounded-full bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] blur-3xl" />

        {/* Hero */}
        <section className="mx-auto max-w-[1180px] px-8 pt-36 pb-14 text-center max-sm:px-5 max-sm:pt-32">
          <span className="inline-flex animate-[reveal-up_700ms_cubic-bezier(0.22,1,0.36,1)_both] items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--accent)_25%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            <span aria-hidden>✦</span>
            Portfolio
          </span>
          <h1 className="mt-5 animate-[reveal-up_700ms_80ms_cubic-bezier(0.22,1,0.36,1)_both] font-serif text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
            All <span className="text-accent-gradient">projects</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl animate-[reveal-up_700ms_160ms_cubic-bezier(0.22,1,0.36,1)_both] text-lg leading-8">
            A complete archive of what I&apos;ve designed and built — from full-stack web apps to mobile and SaaS products.
          </p>

          <dl className="mx-auto mt-10 grid max-w-xl animate-[reveal-up_700ms_240ms_cubic-bezier(0.22,1,0.36,1)_both] grid-cols-3 gap-4 max-sm:gap-2">
            {tiles.map((tile) => (
              <div key={tile.label} className="glass-card no-lift flex flex-col-reverse rounded-2xl px-4 py-5 max-sm:px-2">
                <dt className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{tile.label}</dt>
                <dd className="text-accent-gradient text-3xl font-bold tracking-tight">{tile.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Browser */}
        <section className="mx-auto max-w-[1180px] animate-[reveal-up_800ms_320ms_cubic-bezier(0.22,1,0.36,1)_both] px-8 max-sm:px-5">
          <ProjectsBrowser
            // Remount when the URL's filters change (e.g. back/forward), so state matches the server data
            key={`${category}|${search}|${page}`}
            initialProjects={projects}
            initialTotal={total}
            categories={stats.categories}
            initialCategory={category}
            initialSearch={search}
            initialPage={page}
            pageSize={PAGE_SIZE}
          />
        </section>

        <ProjectCta />
      </main>

      <Footer />
    </div>
  )
}
