import { education, expertise, workExperience } from '../../data/portfolio'
import { Icon } from '../ui/Icon'
import { SectionTitle } from '../ui/SectionTitle'
import { Timeline } from '../ui/Timeline'

export function AboutSection() {
  return (
    <section id="about" className="min-h-screen border-y border-slate-200/80 bg-gradient-to-br from-slate-100 via-white to-blue-50 px-8 py-20 dark:border-slate-700/40 dark:from-[#030b16] dark:via-[#04101e] dark:to-[#07182a] max-sm:px-5">
      <div className="mx-auto max-w-[1100px]">
        <SectionTitle>About Me</SectionTitle>
        <div className="reveal-item">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            I&apos;m Samiullah Waheed and a <span className="text-rose-600">Web &amp; App Developer</span>.
          </h3>
          <p className="mt-4 text-justify leading-7">
            I am a Web and App Developer who loves building efficient and scalable applications. With skills in various programming languages, I create high-quality software that meets client needs. I stay updated with the latest trends to ensure my work is modern and secure.
          </p>
          <p className="mt-4 text-justify leading-7">
            Whether you need a website from scratch, a redesign, a web application with specific features, custom software development, or eye-catching graphic designs, I can help you achieve your vision. I stay up-to-date with the latest technologies and best practices to ensure your project is future-proof.
          </p>
        </div>

        <div className="mt-16">
          <div className="reveal-item text-center">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Technical Expertise</h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">A comprehensive overview of my development stack and tools.</p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-7 max-[680px]:grid-cols-1">
            {expertise.map((group) => (
              <article className="reveal-item rounded-xl border border-transparent bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-rose-500 hover:shadow-[0_8px_28px_rgba(225,29,72,0.15)] dark:bg-slate-800" key={group.title}>
                <div className="mb-4 flex items-center gap-3">
                  <Icon name={group.icon} className="size-8 text-rose-600" />
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">{group.title}</h4>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {group.skills.map((skill) => (
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:scale-105 hover:bg-rose-600 hover:text-white dark:bg-slate-700 dark:text-slate-200" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <Timeline title="Work Experience" subtitle="My professional journey in web development" entries={workExperience} />
        <Timeline title="Education" subtitle="My academic background and qualifications" entries={education} educationTimeline />
      </div>
    </section>
  )
}
