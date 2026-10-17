import { certifications, education, expertise, stats, workExperience } from '../../data/portfolio'
import { CountUp } from '../ui/CountUp'
import { Icon } from '../ui/Icon'
import { SectionTitle } from '../ui/SectionTitle'
import { Timeline } from '../ui/Timeline'
import { trackSpotlight } from '../ui/spotlight'

export function AboutSection() {
  return (
    <section id="about" className="relative isolate overflow-hidden px-8 py-16 max-sm:px-5 max-sm:py-12">
      <div aria-hidden className="bg-dots pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden className="pointer-events-none absolute -right-40 top-20 -z-10 size-[28rem] rounded-full bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] blur-3xl" />
      <div className="mx-auto max-w-[1100px]">
        <SectionTitle eyebrow="About me" title="Get to know" highlight="me" />
        <div className="reveal-item">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            I&apos;m Samiullah Waheed and a <span className="text-accent-gradient">Web &amp; App Developer</span>.
          </h3>
          <p className="mt-4 text-justify leading-7">
            I am a Web and App Developer who loves building efficient and scalable applications. With skills in various programming languages, I create high-quality software that meets client needs. I stay updated with the latest trends to ensure my work is modern and secure.
          </p>
          <p className="mt-4 text-justify leading-7">
            Whether you need a website from scratch, a redesign, a web application with specific features, custom software development, or eye-catching graphic designs, I can help you achieve your vision. I stay up-to-date with the latest technologies and best practices to ensure your project is future-proof.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-4 gap-5 max-[820px]:grid-cols-2">
          {stats.map((stat) => (
            <div onMouseMove={trackSpotlight} className="reveal-item glass-card rounded-2xl p-6 text-center" key={stat.label}>
              <p className="text-accent-gradient text-4xl font-bold tracking-tight">
                <CountUp value={stat.value} />
                {stat.suffix}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <div className="reveal-item text-center">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Technical Expertise</h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">A comprehensive overview of my development stack and tools.</p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-7 max-[680px]:grid-cols-1">
            {expertise.map((group) => (
              <article onMouseMove={trackSpotlight} className="reveal-item glass-card rounded-2xl p-7" key={group.title}>
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-[color-mix(in_srgb,var(--accent)_55%,#38bdf8)] text-white shadow-lg shadow-[color-mix(in_srgb,var(--accent)_30%,transparent)]">
                    <Icon name={group.icon} className="size-6" />
                  </span>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">{group.title}</h4>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {group.skills.map((skill) => (
                    <span className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[0_6px_18px_-6px_color-mix(in_srgb,var(--accent)_50%,transparent)] dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <Timeline title="Work Experience" subtitle="My professional journey in web development" entries={workExperience} />
        <Timeline title="Education" subtitle="My academic background and qualifications" entries={education} icon="graduation" />
        <Timeline title="Certifications" subtitle="Professional certificates I have earned" entries={certifications} icon="award" />
      </div>
    </section>
  )
}
