'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSavedTheme } from '@/hooks/useSavedTheme'
import { AccentPicker } from '../ui/AccentPicker'
import { Icon } from '../ui/Icon'

const iconButton =
  'grid size-10 place-items-center rounded-full border border-slate-200/80 bg-white/70 text-[var(--accent)] transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/70'

const links: { label: string; href: string; mobile?: boolean; match?: (pathname: string) => boolean }[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects', mobile: true, match: (pathname) => pathname.startsWith('/projects') },
  { label: 'Contact', href: '/#contact' },
]

export function ProjectNavbar() {
  const { dark, toggleDark, accent, setAccent } = useSavedTheme()
  const pathname = usePathname()
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
          <ul className="mr-1 flex items-center gap-1 rounded-full bg-slate-100/70 p-1 dark:bg-slate-800/50">
            {links.map((link) => {
              const active = link.match?.(pathname) ?? false
              return (
                <li key={link.href} className={link.mobile ? '' : 'max-sm:hidden'}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={`block rounded-full px-4 py-1.5 text-sm font-semibold transition ${active ? 'bg-[var(--accent)] text-white shadow-md' : 'text-slate-600 hover:text-[var(--accent)] dark:text-slate-300'}`}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
          <AccentPicker accent={accent} onChange={setAccent} buttonClassName={iconButton} />
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
