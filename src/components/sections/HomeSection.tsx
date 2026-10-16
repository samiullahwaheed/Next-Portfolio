import { roles } from '../../data/portfolio'
import { Icon } from '../ui/Icon'
import { Typewriter } from '../ui/Typewriter'

export function HomeSection() {
  return (
    <section id="home" className="relative isolate flex min-h-screen items-center overflow-hidden px-8 pt-36 pb-20 max-sm:px-5 max-sm:pt-32 dark:bg-[#010713]">
      <div aria-hidden className="bg-hero-grid pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_30%,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_32%)]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-10 -left-40 -z-10 size-96 rounded-full bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] blur-3xl" />
      <div className="mx-auto grid w-full max-w-[1100px] grid-cols-[1.25fr_0.75fr] items-center gap-14 max-[740px]:grid-cols-1">
        <div className="reveal-item">
          <p className="mb-3 text-lg font-medium text-slate-500 dark:text-slate-400">Hello, my name is</p>
          <h1 className="font-serif text-[clamp(3rem,7vw,5.4rem)] font-bold leading-[0.95] tracking-tight text-slate-900 dark:text-white">
            Samiullah <span className="text-[var(--accent)]">Waheed</span>
          </h1>
          <h2 className="mt-6 text-[clamp(1.5rem,3vw,2.1rem)] font-bold text-slate-900 dark:text-white">
            I&apos;m a <Typewriter words={roles} className="inline-block min-w-[280px] text-[var(--accent)]" />
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8">
            I&apos;m a Full Stack Developer experienced in designing and developing responsive websites and web applications.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="/portfolio/Samiullah-Waheed-Resume.pdf" download className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-white shadow-lg shadow-[color-mix(in_srgb,var(--accent)_20%,transparent)] transition hover:scale-105">
              <Icon name="download" />
              My Resume
            </a>
            <a href="#contact" className="rounded-full border-2 border-[var(--accent)] px-7 py-3 font-semibold text-[var(--accent)] transition hover:bg-[var(--accent)] hover:text-white">
              Hire Me
            </a>
          </div>
        </div>
        <div className="reveal-item relative mx-auto max-[740px]:order-first [transition-delay:120ms]">
          <div className="absolute -inset-4 rounded-full border border-[color-mix(in_srgb,var(--accent)_20%,transparent)]"></div>
          <div className="absolute -inset-8 rounded-full border border-[color-mix(in_srgb,var(--accent)_10%,transparent)]"></div>
          <img src="/portfolio/hero.png" alt="Samiullah Waheed" className="relative size-[min(360px,70vw)] rounded-full border-[5px] border-[var(--accent)] object-cover shadow-2xl" />
        </div>
      </div>
    </section>
  )
}
