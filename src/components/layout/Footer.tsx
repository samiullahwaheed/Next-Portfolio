import { useState } from "react";
import { Icon } from "../ui/Icon";
import { AdminLoginModal } from "../admin/AdminLoginModal";

export function Footer() {
  const [loginOpen, setLoginOpen] = useState(false)

  return (
    <footer className="border-t border-slate-200 bg-white px-5 py-9 dark:border-slate-700/50 dark:bg-[#030b16]">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-5 max-sm:justify-center max-sm:text-center">
        <div>
          <a
            href="#home"
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
            className="grid size-10 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white dark:border-slate-700 dark:text-slate-300"
          >
            <Icon name="linkedin" />
          </a>
          <a
            href="https://github.com/SamiullahWaheed"
            target="_blank"
            rel="noreferrer"
            className="grid size-10 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white dark:border-slate-700 dark:text-slate-300"
          >
            <Icon name="github" />
          </a>
          <button
            type="button"
            onClick={() => setLoginOpen(true)}
            aria-label="Admin login"
            title="Admin login"
            className="grid size-10 place-items-center rounded-full border border-slate-200 text-slate-400 transition hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white dark:border-slate-700 dark:text-slate-500"
          >
            <Icon name="lock" className="size-4" />
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
