export type IconName =
  | 'home'
  | 'user'
  | 'services'
  | 'portfolio'
  | 'contact'
  | 'sun'
  | 'moon'
  | 'menu'
  | 'close'
  | 'briefcase'
  | 'calendar'
  | 'graduation'
  | 'frontend'
  | 'backend'
  | 'database'
  | 'tools'
  | 'mobile'
  | 'web'
  | 'palette'
  | 'code'
  | 'search'
  | 'marketing'
  | 'phone'
  | 'location'
  | 'email'
  | 'linkedin'
  | 'github'
  | 'left'
  | 'right'
  | 'external'
  | 'download'
  | 'paletteControl'
  | 'up'
  | 'lock'
  | 'check'
  | 'edit'
  | 'trash'
  | 'logout'
  | 'star'
  | 'grid'
  | 'image'

export type TimelineEntry = {
  organization: string
  date: string
  role: string
  description: ReactNode
}

export type GalleryState = {
  title: string
  images: string[]
  index: number
}
import type { ReactNode } from 'react'
