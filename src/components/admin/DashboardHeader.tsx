'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Icon } from '../ui/Icon'

const iconButton =
  'grid size-10 place-items-center rounded-full border border-slate-200/80 bg-white/70 text-[var(--accent)] transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/70'

type DashboardHeaderProps = {
  dark: boolean
  onToggleDark: () => void
  onLogout: () => void
}

export function DashboardHeader({ dark, onToggleDark, onLogout }: DashboardHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  return (
    <header className="sticky top-4 z-40 px-4">
      <div className="mx-auto flex min-h-[60px] max-w-6xl items-center justify-between gap-4 rounded-full border border-slate-200/70 bg-white/75 pl-6 pr-2.5 shadow-[0_8px_30px_-14px_rgba(15,23,42,0.25)] backdrop-blur-xl dark:border-slate-700/50 dark:bg-[#071426]/75">
        <Link href="/" className="font-serif text-lg font-bold text-slate-950 dark:text-white">
          Samiullah <span className="text-[var(--accent)]">Waheed .</span>
          <span className="ml-2 rounded-full border border-[color-mix(in_srgb,var(--accent)_25%,transparent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-2.5 py-1 align-middle font-sans text-[11px] font-semibold uppercase tracking-wide text-[var(--accent)]">
            Admin
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[var(--accent)] hover:text-[var(--accent)] dark:border-slate-700/60 dark:bg-slate-800/70 dark:text-slate-300 sm:flex"
          >
            <Icon name="external" className="size-4" />
            View Site
          </Link>

          <button type="button" className={iconButton} onClick={onToggleDark} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>
            <Icon name={dark ? 'sun' : 'moon'} />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label="Account menu"
              aria-expanded={menuOpen}
              className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[color-mix(in_srgb,var(--accent)_55%,#38bdf8)] text-white shadow-lg shadow-[color-mix(in_srgb,var(--accent)_35%,transparent)] transition hover:-translate-y-0.5"
            >
              <Icon name="user" className="size-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-14 w-56 overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-1.5 shadow-2xl backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/95">
                <div className="px-3 py-2.5">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Admin</p>
                  <p className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
                    Signed in
                  </p>
                </div>
                <Link
                  href="/"
                  className="flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 sm:hidden"
                >
                  <Icon name="external" className="size-4" />
                  View Site
                </Link>
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  <Icon name="logout" className="size-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
