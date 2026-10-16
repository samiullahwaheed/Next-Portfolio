'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { ACCENT_KEY, THEME_KEY, resolveAccent } from '@/lib/theme'

// Applies the theme/accent the visitor picked on the homepage

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
    root.style.setProperty('--accent', resolveAccent(localStorage.getItem(ACCENT_KEY)))
  }, [])

  const dark = useSyncExternalStore(subscribe, isDark, () => false)

  const toggleDark = () => {
    const next = !isDark()
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem(THEME_KEY, next ? 'dark' : 'light')
  }

  return { dark, toggleDark }
}
