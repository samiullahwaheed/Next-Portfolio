'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "../ui/Icon";
import { AdminLoginModal } from "../admin/AdminLoginModal";
import { useAdminSession } from "@/hooks/useAdminSession";

export function Footer() {
  const router = useRouter()
  const [loginOpen, setLoginOpen] = useState(false)
  const { authenticated } = useAdminSession()

  return (
    <footer className="relative isolate overflow-hidden border-t border-slate-200/70 bg-white/60 px-5 py-9 backdrop-blur dark:border-slate-700/40 dark:bg-[#030b16]/60">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-60" />
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-5 max-sm:justify-center max-sm:text-center">
        <div>
          <a
            href="/#home"
            className="font-serif text-xl font-bold text-slate-950 dark:text-white"
          >
            Samiullah <span className="text-[var(--accent)]">Waheed .</span>
          </a>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Software Engineer &amp; MERN Stack Developer
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://www.linkedin.com/in/samiullah-waheed/"
            target="_blank"
            rel="noreferrer"
            className="grid size-10 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white hover:shadow-lg hover:shadow-[color-mix(in_srgb,var(--accent)_35%,transparent)] dark:border-slate-700 dark:text-slate-300"
          >
            <Icon name="linkedin" />
          </a>
          <a
            href="https://github.com/SamiullahWaheed"
            target="_blank"
            rel="noreferrer"
            className="grid size-10 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white hover:shadow-lg hover:shadow-[color-mix(in_srgb,var(--accent)_35%,transparent)] dark:border-slate-700 dark:text-slate-300"
          >
            <Icon name="github" />
          </a>
          <button
            type="button"
            onClick={() => (authenticated ? router.push('/admin/dashboard') : setLoginOpen(true))}
            aria-label={authenticated ? 'Go to dashboard' : 'Admin login'}
            title={authenticated ? 'Go to dashboard' : 'Admin login'}
            className="grid size-10 place-items-center rounded-full border border-slate-200 text-slate-400 transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white hover:shadow-lg hover:shadow-[color-mix(in_srgb,var(--accent)_35%,transparent)] dark:border-slate-700 dark:text-slate-500"
          >
            <Icon name="user" className="size-4" />
          </button>
        </div>
        <p className="w-full border-t border-slate-200 pt-5 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          Copyright © {new Date().getFullYear()} <span className="text-[var(--accent)]"> Samiullah Waheed .</span> All rights reserved.
        </p>
      </div>
      {loginOpen && <AdminLoginModal onClose={() => setLoginOpen(false)} />}
    </footer>
  );
}
