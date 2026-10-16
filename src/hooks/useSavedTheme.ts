'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { ACCENT_KEY, THEME_KEY, resolveAccent } from '@/lib/theme'

// Applies the theme/accent the visitor picked on the homepage

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] })
  return () => observer.disconnect()
}

const isDark = () => document.documentElement.classList.contains('dark')
const currentAccent = () => document.documentElement.style.getPropertyValue('--accent').trim()

export function useSavedTheme() {
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', localStorage.getItem(THEME_KEY) !== 'light')
    root.style.setProperty('--accent', resolveAccent(localStorage.getItem(ACCENT_KEY)))
  }, [])

  const dark = useSyncExternalStore(subscribe, isDark, () => false)
  const accent = useSyncExternalStore(subscribe, currentAccent, () => '')

  const toggleDark = () => {
    const next = !isDark()
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem(THEME_KEY, next ? 'dark' : 'light')
  }

  const setAccent = (value: string) => {
    document.documentElement.style.setProperty('--accent', value)
    localStorage.setItem(ACCENT_KEY, value)
  }

  return { dark, toggleDark, accent, setAccent }
}
