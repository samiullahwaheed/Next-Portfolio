import Link from 'next/link'

export function ProjectCta() {
  return (
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
  )
}
