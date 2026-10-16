import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import '../index.css'

const siteUrl = 'https://samiullahwaheed.vercel.app'
const siteName = 'Samiullah Waheed'
const title = 'Samiullah Waheed | Software Engineer & MERN Stack Developer'
const description =
  'Samiullah Waheed is a software engineer and MERN stack developer in Islamabad, Pakistan, specializing in React.js, Node.js, and full stack web development. Explore his portfolio, projects, and experience.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | ${siteName}`,
  },
  description,
  applicationName: siteName,
  keywords: [
    'Samiullah Waheed',
    'Samiullah',
    'Waheed',
    'Samiullah Waheed portfolio',
    'Samiullah Waheed developer',
    'Samiullah Waheed software engineer',
    'MERN stack developer',
    'MERN stack developer Islamabad',
    'MERN stack developer Pakistan',
    'React.js developer Pakistan',
    'full stack developer Pakistan',
    'software engineer Islamabad',
    'web developer Pakistan',
    'Node.js developer',
    'JavaScript developer Pakistan',
  ],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: 'technology',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName,
    title,
    description,
    locale: 'en_US',
    images: [
      {
        url: '/portfolio/hero.png',
        width: 1024,
        height: 1024,
        alt: 'Samiullah Waheed — Software Engineer & MERN Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/portfolio/hero.png'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f2f2fc' },
    { media: '(prefers-color-scheme: dark)', color: '#010713' },
  ],
  colorScheme: 'light dark',
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteName,
  url: siteUrl,
  image: `${siteUrl}/portfolio/hero.png`,
  jobTitle: ['Software Engineer', 'MERN Stack Developer', 'Graphic Designer'],
  description,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Islamabad',
    addressCountry: 'PK',
  },
  sameAs: [
    'https://github.com/SamiullahWaheed',
    'https://www.linkedin.com/in/samiullah-waheed/',
  ],
  knowsAbout: [
    'React.js',
    'Node.js',
    'Express.js',
    'MongoDB',
    'JavaScript',
    'Full Stack Web Development',
  ],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  url: siteUrl,
  inLanguage: 'en',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
