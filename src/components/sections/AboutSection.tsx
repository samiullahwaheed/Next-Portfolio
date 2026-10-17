import { DEVICON_BASE, certifications, coreStack, education, expertise, stats, workExperience, type Skill } from '../../data/portfolio'
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
          {/* Core stack */}
          <div className="reveal-item mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="mr-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Core stack</span>
            {coreStack.map((skill) => (
              <span
                key={skill.name}
                className="inline-flex items-center gap-2.5 rounded-2xl border border-[color-mix(in_srgb,var(--accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] py-2 pr-4 pl-2 font-semibold text-slate-900 shadow-[0_8px_24px_-12px_color-mix(in_srgb,var(--accent)_50%,transparent)] dark:text-white"
              >
                <SkillLogo skill={skill} size="size-8" />
                {skill.name}
              </span>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6 max-[680px]:grid-cols-1">
            {expertise.map((group) => (
              <article onMouseMove={trackSpotlight} className="reveal-item glass-card rounded-2xl p-6" key={group.title}>
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-[color-mix(in_srgb,var(--accent)_55%,#38bdf8)] text-white shadow-lg shadow-[color-mix(in_srgb,var(--accent)_30%,transparent)]">
                    <Icon name={group.icon} className="size-5" />
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">{group.title}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[0_6px_18px_-6px_color-mix(in_srgb,var(--accent)_50%,transparent)] dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200"
                    >
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

// Logos sit on a white tile so monochrome marks (e.g. Next.js) stay visible in dark mode
function SkillLogo({ skill, size }: { skill: Skill; size: string }) {
  return (
    <span className={`${size} grid shrink-0 place-items-center rounded-full bg-white shadow-sm ring-1 ring-slate-200/80 dark:ring-white/10`}>
      {skill.logo ? (
        <img src={`${DEVICON_BASE}/${skill.logo}.svg`} alt="" loading="lazy" className="size-[62%] object-contain" />
      ) : (
        <span className="size-1.5 rounded-full bg-[var(--accent)]" />
      )}
    </span>
  )
}
