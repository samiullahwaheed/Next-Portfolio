type SectionTitleProps = {
  eyebrow: string
  title: string
  highlight?: string
  subtitle?: string
}

export function SectionTitle({ eyebrow, title, highlight, subtitle }: SectionTitleProps) {
  return (
    <div className="reveal-item mb-10 text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--accent)_25%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
        <span aria-hidden>✦</span>
        {eyebrow}
      </span>
      <h2 className="mt-5 text-[clamp(2.1rem,4.5vw,3rem)] font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
        {title} {highlight && <span className="text-accent-gradient">{highlight}</span>}
      </h2>
      {subtitle && <p className="mx-auto mt-3 max-w-xl text-slate-500 dark:text-slate-400">{subtitle}</p>}
    </div>
  )
}
