'use client'

import { useEffect, useSyncExternalStore } from 'react'

// Shares the theme/accent the visitor picked on the homepage (same localStorage keys as App.tsx)
const THEME_KEY = 'portfolio-theme'
const ACCENT_KEY = 'portfolio-accent'

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}

const isDark = () => document.documentElement.classList.contains('dark')

export function useSavedTheme() {
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', localStorage.getItem(THEME_KEY) !== 'light')
    const accent = localStorage.getItem(ACCENT_KEY)
    if (accent) root.style.setProperty('--accent', accent)
  }, [])

  const dark = useSyncExternalStore(subscribe, isDark, () => false)

  const toggleDark = () => {
    const next = !isDark()
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem(THEME_KEY, next ? 'dark' : 'light')
  }

  return { dark, toggleDark }
}
