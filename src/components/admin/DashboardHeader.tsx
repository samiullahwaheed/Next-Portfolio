'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Icon } from '../ui/Icon'

export function DashboardHeader({ onLogout }: { onLogout: () => void }) {
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
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur-xl dark:border-slate-700/50 dark:bg-[#030b16]/92">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-serif text-lg font-bold text-slate-950 dark:text-white">
          Samiullah <span className="text-rose-600">Waheed .</span>
          <span className="ml-2 rounded-full bg-rose-600/10 px-2.5 py-1 align-middle text-[11px] font-semibold uppercase tracking-wide text-rose-600">
            Admin
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-rose-500 hover:text-rose-600 dark:border-slate-700 dark:text-slate-300 sm:flex"
          >
            <Icon name="external" className="size-4" />
            View Site
          </Link>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label="Account menu"
              aria-expanded={menuOpen}
              className="grid size-10 place-items-center rounded-full border border-rose-600 bg-rose-600/10 text-rose-600 transition hover:bg-rose-600 hover:text-white"
            >
              <Icon name="user" className="size-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-13 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
                <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-700">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Admin</p>
                  <p className="text-xs text-slate-400">Signed in</p>
                </div>
                <Link
                  href="/"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700 sm:hidden"
                >
                  <Icon name="external" className="size-4" />
                  View Site
                </Link>
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-950/40"
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
