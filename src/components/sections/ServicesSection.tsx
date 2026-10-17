import { services } from '../../data/portfolio'
import { Icon } from '../ui/Icon'
import { SectionTitle } from '../ui/SectionTitle'
import { trackSpotlight } from '../ui/spotlight'

export function ServicesSection() {
  return (
    <section id="services" className="relative isolate overflow-hidden px-8 py-16 max-sm:px-5 max-sm:py-12">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-1/3 -z-10 size-[26rem] rounded-full bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] blur-3xl" />
      <div className="mx-auto max-w-[1100px]">
        <SectionTitle eyebrow="What I do" title="Services I" highlight="offer" subtitle="From idea to launch — design, development and growth under one roof." />
        <div className="grid grid-cols-3 gap-7 max-[900px]:grid-cols-1">
          {services.map((service, index) => (
            <article onMouseMove={trackSpotlight} className="reveal-item glass-card group overflow-hidden rounded-2xl p-7" key={service.title}>
              <span aria-hidden className="pointer-events-none absolute -right-1 -top-3 select-none text-7xl font-black text-slate-900/[0.05] transition duration-300 group-hover:text-[color-mix(in_srgb,var(--accent)_14%,transparent)] dark:text-white/[0.05]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="service-icon mb-6 grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[color-mix(in_srgb,var(--accent)_55%,#38bdf8)] text-white shadow-lg shadow-[color-mix(in_srgb,var(--accent)_30%,transparent)]">
                <Icon name={service.icon} className="size-7 transition duration-300 group-hover:rotate-6 group-hover:scale-110" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">{service.title}</h3>
              <p className="leading-7">{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
