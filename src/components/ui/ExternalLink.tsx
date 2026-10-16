import type { ReactNode } from 'react'

// Accent-coloured inline link that opens in a new tab (used inside timeline descriptions)
export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-semibold text-[var(--accent)] underline decoration-[color-mix(in_srgb,var(--accent)_40%,transparent)] underline-offset-4 transition hover:decoration-[var(--accent)]"
    >
      {children}
    </a>
  )
}
