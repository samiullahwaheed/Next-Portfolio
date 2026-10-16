import type { MouseEvent } from 'react'

// Feeds the pointer position to .glass-card's ::before spotlight
export function trackSpotlight(event: MouseEvent<HTMLElement>) {
  const card = event.currentTarget
  const rect = card.getBoundingClientRect()
  card.style.setProperty('--mx', `${event.clientX - rect.left}px`)
  card.style.setProperty('--my', `${event.clientY - rect.top}px`)
}
