import type { ReactNode } from 'react'

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="reveal-item mb-14">
      <h2 className="relative inline-block text-4xl font-bold text-slate-900 after:absolute after:left-0 after:top-[calc(100%+8px)] after:h-1 after:w-7 after:rounded-full after:bg-rose-600 before:absolute before:left-0 before:top-full before:h-1 before:w-14 before:rounded-full before:bg-rose-600 dark:text-white">
        {children}
      </h2>
    </div>
  )
}
