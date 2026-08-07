import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '../index.css'

export const metadata: Metadata = {
  title: 'Samiullah Waheed | Software Engineer & MERN Stack Developer',
  description:
    'Portfolio of Samiullah Waheed, a software engineer and MERN stack developer specializing in responsive web applications, APIs, and modern software solutions.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
