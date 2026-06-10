import { projects } from '../../data/portfolio'
import type { GalleryState } from '../../types/portfolio'
import { Icon } from '../ui/Icon'
import { SectionTitle } from '../ui/SectionTitle'

export function PortfolioSection({ openGallery }: { openGallery: (gallery: GalleryState) => void }) {
  return (
    <section id="portfolio" className="min-h-screen border-y border-slate-200/80 bg-gradient-to-br from-slate-100 via-white to-blue-50 px-8 py-20 dark:border-slate-700/40 dark:from-[#030b16] dark:via-[#04101e] dark:to-[#07182a] max-sm:px-5">
      <div className="mx-auto max-w-[1100px]">
        <SectionTitle>Featured Projects</SectionTitle>
        <p className="-mt-8 mb-10 text-center text-slate-500 dark:text-slate-400">Showcase of my recent work in full-stack web development</p>
        <div className="grid grid-cols-2 gap-7 max-[700px]:grid-cols-1">
          {projects.map((project) => (
            <article className="reveal-item group flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-rose-500 hover:shadow-[0_8px_28px_rgba(225,29,72,0.16)] dark:border-slate-700 dark:bg-slate-800" key={project.title}>
              <div className="flex w-full flex-col">
                <button className="relative h-60 overflow-hidden bg-slate-100 text-left dark:bg-slate-900" onClick={() => openGallery({ title: project.title, images: project.images, index: 0 })} aria-label={`Open ${project.title} image gallery`}>
                  <img src={project.images[0]} alt={`${project.title} project`} className="size-full object-cover transition duration-500 group-hover:scale-105" />
                  <span className="absolute bottom-3 right-3 rounded-full bg-slate-950/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur">View {project.images.length} images</span>
                </button>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{project.title}</h3>
                  <p className="mt-3 flex-1 leading-7">{project.description}</p>
                  <div className="my-5 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-rose-600 hover:text-white dark:bg-slate-700 dark:text-slate-200" key={tech}>{tech}</span>
                    ))}
                  </div>
                  <a href={project.url} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-2 rounded-full border border-rose-600 px-5 py-2.5 font-semibold text-rose-600 transition hover:bg-rose-600 hover:text-white">
                    Visit Site
                    <Icon name="external" className="size-4" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
