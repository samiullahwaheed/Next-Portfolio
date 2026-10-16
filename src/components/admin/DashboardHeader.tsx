'use client'

import Link from 'next/link'
import { AccentPicker } from '../ui/AccentPicker'
import { Icon } from '../ui/Icon'

const iconButton =
  'grid size-10 place-items-center rounded-full border border-slate-200/80 bg-white/70 text-[var(--accent)] transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/70'

type DashboardHeaderProps = {
  dark: boolean
  onToggleDark: () => void
  accent: string
  onAccentChange: (accent: string) => void
  onLogout: () => void
}

export function DashboardHeader({ dark, onToggleDark, accent, onAccentChange, onLogout }: DashboardHeaderProps) {
  return (
    <header className="sticky top-4 z-40 px-4">
      <div className="mx-auto flex min-h-[60px] max-w-6xl items-center justify-between gap-4 rounded-full border border-slate-200/70 bg-white/75 pl-6 pr-2.5 shadow-[0_8px_30px_-14px_rgba(15,23,42,0.25)] backdrop-blur-xl dark:border-slate-700/50 dark:bg-[#071426]/75">
        <Link href="/" className="font-serif text-lg font-bold text-slate-950 dark:text-white">
          Samiullah <span className="text-[var(--accent)]">Waheed .</span>
          <span className="ml-2 rounded-full border border-[color-mix(in_srgb,var(--accent)_25%,transparent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-2.5 py-1 align-middle font-sans text-[11px] font-semibold uppercase tracking-wide text-[var(--accent)] max-sm:hidden">
            Admin
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/" className={iconButton} aria-label="Go to homepage" title="Homepage">
            <Icon name="home" className="size-4" />
          </Link>

          <AccentPicker accent={accent} onChange={onAccentChange} buttonClassName={iconButton} />

          <button type="button" className={iconButton} onClick={onToggleDark} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>
            <Icon name={dark ? 'sun' : 'moon'} />
          </button>

          <button
            type="button"
            onClick={onLogout}
            aria-label="Logout"
            title="Logout"
            className="grid size-10 place-items-center rounded-full border border-red-500/30 bg-red-500/10 text-red-600 transition hover:-translate-y-0.5 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-600/25 dark:text-red-400 dark:hover:text-white"
          >
            <Icon name="logout" className="size-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
