import { services } from '../../data/portfolio'
import { Icon } from '../ui/Icon'
import { SectionTitle } from '../ui/SectionTitle'

export function ServicesSection() {
  return (
    <section id="services" className="min-h-screen bg-slate-50 px-8 py-20 dark:bg-[#010713] max-sm:px-5">
      <div className="mx-auto max-w-[1100px]">
        <SectionTitle>Services</SectionTitle>
        <div className="grid grid-cols-3 gap-7 max-[1172px]:grid-cols-2 max-[550px]:grid-cols-1">
          {services.map((service) => (
            <article className="reveal-item group rounded-xl border border-slate-200 bg-white p-7 text-center transition duration-300 hover:-translate-y-1 hover:border-rose-500 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800" key={service.title}>
              <div className="service-icon mx-auto mb-6 grid size-16 place-items-center rounded-full border border-[color-mix(in_srgb,var(--accent)_25%,transparent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)] transition duration-300 group-hover:bg-[var(--accent)] group-hover:text-white">
                <Icon name={service.icon} className="size-9 transition duration-300 group-hover:rotate-6 group-hover:scale-110" />
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
