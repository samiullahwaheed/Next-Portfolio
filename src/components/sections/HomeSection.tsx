import { roles } from '../../data/portfolio'
import { Icon } from '../ui/Icon'

export function HomeSection({ roleIndex }: { roleIndex: number }) {
  return (
    <section id="home" className="relative flex min-h-[calc(100vh-74px)] items-center overflow-hidden bg-[radial-gradient(circle_at_78%_25%,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_30%)] px-8 py-20 before:absolute before:-left-40 before:bottom-0 before:size-96 before:rounded-full before:bg-blue-500/10 before:blur-3xl max-sm:px-5 dark:bg-[#010713]">
      <div className="mx-auto grid w-full max-w-[1100px] grid-cols-[1.25fr_0.75fr] items-center gap-14 max-[740px]:grid-cols-1">
        <div className="reveal-item">
          <p className="mb-3 text-lg font-medium text-slate-500 dark:text-slate-400">Hello, my name is</p>
          <h1 className="font-serif text-[clamp(3rem,7vw,5.4rem)] font-bold leading-[0.95] tracking-tight text-slate-900 dark:text-white">
            Samiullah <span className="text-rose-600">Waheed</span>
          </h1>
          <h2 className="mt-6 text-[clamp(1.5rem,3vw,2.1rem)] font-bold text-slate-900 dark:text-white">
            I&apos;m a <span className="inline-block min-w-[280px] text-rose-600 transition-opacity">{roles[roleIndex]}</span>
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8">
            I&apos;m a MERN Stack Developer experienced in designing and developing responsive websites and web applications.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="/portfolio/Samiullah-Waheed-Resume.pdf" download className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-6 py-3 font-semibold text-white shadow-lg shadow-rose-600/20 transition hover:scale-105">
              <Icon name="download" />
              Download CV
            </a>
            <a href="#contact" className="rounded-full border-2 border-rose-600 px-7 py-3 font-semibold text-rose-600 transition hover:bg-rose-600 hover:text-white">
              Hire Me
            </a>
          </div>
        </div>
        <div className="reveal-item relative mx-auto max-[740px]:order-first [transition-delay:120ms]">
          <div className="absolute -inset-4 rounded-full border border-rose-600/20"></div>
          <div className="absolute -inset-8 rounded-full border border-rose-600/10"></div>
          <img src="/portfolio/hero.png" alt="Samiullah Waheed" className="relative size-[min(360px,70vw)] rounded-full border-[5px] border-rose-600 object-cover shadow-2xl" />
        </div>
      </div>
    </section>
  )
}
