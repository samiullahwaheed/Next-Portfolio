import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'
import { Footer } from '@/components/layout/Footer'
import { ProjectGallery } from '@/components/project/ProjectGallery'
import { ProjectNavbar } from '@/components/project/ProjectNavbar'
import { Icon } from '@/components/ui/Icon'
import { getProjectBySlug } from '@/lib/projects'

// Cached per project; admin writes call revalidateProjectPages() to refresh immediately
export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

const siteUrl = 'https://samiullahwaheed.vercel.app'
const enter = {
  0: 'animate-[reveal-up_700ms_cubic-bezier(0.22,1,0.36,1)_both]',
  80: 'animate-[reveal-up_700ms_80ms_cubic-bezier(0.22,1,0.36,1)_both]',
  160: 'animate-[reveal-up_700ms_160ms_cubic-bezier(0.22,1,0.36,1)_both]',
  240: 'animate-[reveal-up_700ms_240ms_cubic-bezier(0.22,1,0.36,1)_both]',
  260: 'animate-[reveal-up_700ms_260ms_cubic-bezier(0.22,1,0.36,1)_both]',
  320: 'animate-[reveal-up_700ms_320ms_cubic-bezier(0.22,1,0.36,1)_both]',
  400: 'animate-[reveal-up_700ms_400ms_cubic-bezier(0.22,1,0.36,1)_both]',
}

const toParagraphs = (text: string) =>
  text
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

const summarize = (text: string, max = 160) => {
  const flat = text.replace(/\s+/g, ' ').trim()
  const firstSentence = flat.match(/^.+?[.!?](\s|$)/)?.[0].trim() ?? flat
  const summary = firstSentence.length <= max ? firstSentence : flat
  return summary.length <= max ? summary : `${summary.slice(0, max - 1).trimEnd()}…`
}

const hostname = (url?: string) => {
  if (!url) return null
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

async function loadProject(slug: string) {
  const result = await getProjectBySlug(slug)
  if (result.status === 'moved') permanentRedirect(`/projects/${result.slug}`)
  if (result.status === 'missing') notFound()
  return result.project
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await loadProject((await params).slug)
  const description = summarize(project.description)
  const url = `/projects/${project.slug}`
  const image = project.images[0]?.url

  return {
    title: project.title,
    description,
    keywords: [project.title, ...project.techStack, ...project.category, 'Samiullah Waheed project'],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: project.title,
      description,
      images: image ? [{ url: image, alt: `${project.title} preview` }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

export default async function ProjectPage({ params }: Props) {
  const project = await loadProject((await params).slug)
  const [lead, ...rest] = toParagraphs(project.description)
  const images = project.images.map((image) => image.url)
  const address = hostname(project.liveLink) ?? `samiullahwaheed.vercel.app/projects/${project.slug}`

  const facts = [
    { label: 'Category', value: project.category[0] },
    { label: 'Technologies', value: String(project.techStack.length) },
    { label: 'Screenshots', value: String(images.length) },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: summarize(project.description),
    url: `${siteUrl}/projects/${project.slug}`,
    image: images,
    keywords: project.techStack.join(', '),
    author: { '@type': 'Person', name: 'Samiullah Waheed', url: siteUrl },
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-600 dark:bg-[#010713] dark:text-slate-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProjectNavbar />

      <main className="relative isolate overflow-hidden">
        <div aria-hidden className="bg-hero-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[820px]" />
        <div aria-hidden className="pointer-events-none absolute -right-32 top-24 -z-10 size-[36rem] rounded-full bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -left-48 top-[44rem] -z-10 size-[30rem] rounded-full bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] blur-3xl" />

        {/* Split hero: story on the left, browser-framed cover on the right */}
        <section className="mx-auto grid max-w-[1180px] grid-cols-[1fr_1.15fr] items-center gap-14 px-8 pt-36 pb-20 max-[960px]:grid-cols-1 max-[960px]:gap-12 max-sm:px-5 max-sm:pt-32">
          <div>
            <Link href="/#portfolio" className={`${enter[0]} inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-600 backdrop-blur transition hover:border-[var(--accent)] hover:text-[var(--accent)] dark:border-slate-700/60 dark:bg-slate-900/50 dark:text-slate-300`}>
              <Icon name="left" className="size-3.5" />
              All projects
            </Link>

            <div className={`${enter[80]} mt-6 flex flex-wrap items-center gap-2`}>
              {project.category.map((item) => (
                <span key={item} className="rounded-full border border-[color-mix(in_srgb,var(--accent)_25%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                  {item}
                </span>
              ))}
              {project.featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  <Icon name="star" className="size-3.5" />
                  Featured
                </span>
              )}
            </div>

            <h1 className={`${enter[160]} mt-5 font-serif text-[clamp(1.75rem,3.4vw,2.6rem)] font-bold leading-[1.08] tracking-tight text-slate-900 dark:text-white`}>
              {project.title}
            </h1>
            <p className={`${enter[240]} mt-5 max-w-xl text-lg leading-8`}>{summarize(project.description, 220)}</p>

            {(project.liveLink || project.githubLink) && (
              <div className={`${enter[320]} mt-8 flex flex-wrap gap-3`}>
                {project.liveLink && (
                  <a href={project.liveLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-white shadow-lg shadow-[color-mix(in_srgb,var(--accent)_30%,transparent)] transition hover:-translate-y-0.5 hover:shadow-xl">
                    Visit live site
                    <Icon name="external" className="size-4" />
                  </a>
                )}
                {project.githubLink && (
                  <a href={project.githubLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-6 py-3 font-semibold text-slate-700 backdrop-blur transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)] dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-200">
                    <Icon name="github" className="size-4" />
                    View source
                  </a>
                )}
              </div>
            )}

            <dl className={`${enter[400]} mt-10 grid max-w-md grid-cols-3 divide-x divide-slate-200 border-t border-slate-200 pt-6 dark:divide-slate-700/60 dark:border-slate-700/60`}>
              {facts.map((fact) => (
                <div key={fact.label} className="px-4 first:pl-0">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{fact.label}</dt>
                  <dd className="mt-1 truncate text-lg font-bold text-slate-900 dark:text-white">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {images[0] && (
            <div className={`${enter[260]} relative`}>
              <div aria-hidden className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-[color-mix(in_srgb,var(--accent)_30%,transparent)] to-transparent blur-2xl" />
              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_40px_90px_-30px_color-mix(in_srgb,var(--accent)_50%,transparent)] dark:border-slate-700/60 dark:bg-[#071426]">
                <div className="flex items-center gap-3 border-b border-slate-200/80 px-4 py-3 dark:border-slate-700/60">
                  <span aria-hidden className="flex gap-1.5">
                    <span className="size-3 rounded-full bg-[#ff5f57]" />
                    <span className="size-3 rounded-full bg-[#febc2e]" />
                    <span className="size-3 rounded-full bg-[#28c840]" />
                  </span>
                  <span className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
                    <Icon name="lock" className="size-3 shrink-0" />
                    <span className="truncate">{address}</span>
                  </span>
                </div>
                <ProjectGallery title={project.title} images={images} />
              </div>
            </div>
          )}
        </section>

        {/* Built with */}
        {project.techStack.length > 0 && (
          <section className="border-y border-slate-200/70 bg-white/50 backdrop-blur dark:border-slate-700/40 dark:bg-slate-900/30">
            <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-8 gap-y-4 px-8 py-7 max-sm:px-5">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Built with</h2>
              <ul className="flex flex-1 flex-wrap gap-2.5">
                {project.techStack.map((tech) => (
                  <li key={tech} className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)] dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Overview */}
        <section className="mx-auto max-w-3xl px-8 pt-24 max-sm:px-5">
          <SectionLabel number="01" title="Overview" />
          {lead && <p className="mt-6 text-[1.15rem] leading-8 text-slate-700 dark:text-slate-300">{lead}</p>}
          {rest.length > 0 && (
            <div className="mt-6 space-y-5 text-[1.05rem] leading-8">
              {rest.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
        </section>


        {/* CTA */}
        <section className="mx-auto mt-24 mb-24 max-w-[1180px] px-8 max-sm:px-5">
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[var(--accent)] to-[color-mix(in_srgb,var(--accent)_55%,#0f172a)] px-10 py-14 text-white shadow-[0_30px_80px_-30px_color-mix(in_srgb,var(--accent)_70%,transparent)] max-sm:px-6">
            <div aria-hidden className="bg-hero-grid grid-on-accent pointer-events-none absolute inset-0 -z-10" />
            <div className="flex flex-wrap items-center justify-between gap-8">
              <div>
                <h2 className="font-serif text-[clamp(1.8rem,4vw,2.6rem)] font-bold leading-tight">Have a similar project in mind?</h2>
                <p className="mt-2 max-w-xl text-white/80">Let&apos;s talk about what you&apos;re building and how I can help bring it to life.</p>
              </div>
              <Link href="/#contact" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3 font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
                Let&apos;s work together <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function SectionLabel({ number, title }: { number: string; title: string }) {
  return (
    <h2 className="flex items-center gap-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
      <span className="text-[var(--accent)]">{number}</span>
      <span aria-hidden className="h-px w-10 bg-[var(--accent)]" />
      {title}
    </h2>
  )
}
