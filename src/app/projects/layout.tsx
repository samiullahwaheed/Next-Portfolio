import type { ReactNode } from 'react'
import { themeInitScript } from '@/lib/theme'

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Applies the visitor's saved theme + accent before first paint (no light-mode flash) */}
      <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      {children}
    </>
  )
}
