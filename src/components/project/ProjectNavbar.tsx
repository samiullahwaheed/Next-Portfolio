'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSavedTheme } from '@/hooks/useSavedTheme'
import { Icon } from '../ui/Icon'

const iconButton =
  'grid size-10 place-items-center rounded-full border border-slate-200/80 bg-white/70 text-[var(--accent)] transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/70'

export function ProjectNavbar() {
  const { dark, toggleDark } = useSavedTheme()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed inset-x-0 z-[80] px-4 transition-all duration-300 ${scrolled ? 'top-3' : 'top-5'}`}>
      <nav
        className={`mx-auto flex max-w-[1180px] items-center justify-between gap-4 rounded-full border border-slate-200/70 bg-white/75 pl-6 pr-2.5 backdrop-blur-xl transition-all duration-300 dark:border-slate-700/50 dark:bg-[#071426]/75 ${scrolled ? 'min-h-[58px] shadow-[0_12px_40px_-12px_rgba(15,23,42,0.35)]' : 'min-h-[64px] shadow-[0_8px_30px_-14px_rgba(15,23,42,0.25)]'}`}
        aria-label="Project navigation"
      >
        <Link href="/" className="shrink-0 font-serif text-xl font-bold text-slate-950 max-sm:text-lg dark:text-white">
          Samiullah <span className="text-[var(--accent)]">Waheed .</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/#portfolio"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[var(--accent)] hover:text-[var(--accent)] max-sm:hidden dark:border-slate-700/60 dark:bg-slate-800/70 dark:text-slate-300"
          >
            <Icon name="left" className="size-4" />
            All projects
          </Link>
          <button type="button" className={iconButton} onClick={toggleDark} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>
            <Icon name={dark ? 'sun' : 'moon'} />
          </button>
          <Link
            href="/#contact"
            className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[color-mix(in_srgb,var(--accent)_30%,transparent)] transition hover:-translate-y-0.5"
          >
            Hire me
          </Link>
        </div>
      </nav>
    </header>
  )
}
