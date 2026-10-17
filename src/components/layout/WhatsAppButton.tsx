'use client'

import { usePathname } from 'next/navigation'
import { Icon } from '../ui/Icon'

const WHATSAPP_NUMBER = '923239865230' // 0323 9865230 in international format, no "+"
const GREETING = "Hi Samiullah, I came across your portfolio and I'd like to discuss a project."

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(GREETING)}`

// Floating bottom-right chat button on public pages (hidden on the admin)
export function WhatsAppButton() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
      className="group fixed right-5 bottom-5 z-[70] grid size-12 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgb(37_211_102/0.6)] transition duration-300 hover:-translate-y-1 hover:scale-105"
    >
      <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30 [animation-duration:2.4s]" />
      <Icon name="whatsapp" className="relative size-6" />
      <span className="pointer-events-none absolute right-full mr-3 rounded-full bg-slate-900 px-3 py-1.5 text-sm font-medium whitespace-nowrap text-white opacity-0 shadow-lg transition duration-300 group-hover:opacity-100 max-sm:hidden dark:bg-white dark:text-slate-900">
        Chat on WhatsApp
      </span>
    </a>
  )
}
