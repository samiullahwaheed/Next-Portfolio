import { useEffect, useState } from 'react'
import { Footer } from './components/layout/Footer'
import { GalleryModal } from './components/layout/GalleryModal'
import { Navbar } from './components/layout/Navbar'
import { ScrollToTop } from './components/layout/ScrollToTop'
import { AboutSection } from './components/sections/AboutSection'
import { ContactSection } from './components/sections/ContactSection'
import { HomeSection } from './components/sections/HomeSection'
import { PortfolioSection } from './components/sections/PortfolioSection'
import { ServicesSection } from './components/sections/ServicesSection'
import { navItems, roles } from './data/portfolio'
import type { GalleryState } from './types/portfolio'

function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('portfolio-theme') !== 'light')
  const [menuOpen, setMenuOpen] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [accent, setAccent] = useState(() => {
    const savedAccent = localStorage.getItem('portfolio-accent')
    return !savedAccent ||
      savedAccent === '#3b82f6' ||
      savedAccent === '#161FA7' ||
      savedAccent === '#003366'
      ? '#0F6CBD'
      : savedAccent
  })
  const [activeSection, setActiveSection] = useState('home')
  const [roleIndex, setRoleIndex] = useState(0)
  const [gallery, setGallery] = useState<GalleryState | null>(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent)
    localStorage.setItem('portfolio-accent', accent)
  }, [accent])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
      setPickerOpen(false)

      const marker = window.scrollY + 150
      let currentSection = navItems[0].href.slice(1)
      navItems.forEach(({ href }) => {
        const section = document.querySelector<HTMLElement>(href)
        if (section && section.offsetTop <= marker) currentSection = section.id
      })
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
        currentSection = navItems[navItems.length - 1].href.slice(1)
      }
      setActiveSection(currentSection)

      document.querySelectorAll<HTMLElement>('[data-timeline]').forEach((timeline) => {
        const rect = timeline.getBoundingClientRect()
        const start = window.innerHeight * 0.78
        const distance = rect.height + window.innerHeight * 0.25
        const progress = Math.min(1, Math.max(0, (start - rect.top) / distance))
        timeline.style.setProperty('--timeline-progress', progress.toString())
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(
      () => setRoleIndex((index) => (index + 1) % roles.length),
      2400,
    )
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            revealObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    document.querySelectorAll('.reveal-item').forEach((element) => {
      revealObserver.observe(element)
    })

    // Sections like Portfolio render their .reveal-item cards after an async
    // fetch resolves, i.e. after this observer has already done its initial
    // scan — watch for those late-arriving elements too, or they'd stay stuck
    // at opacity: 0 forever (still clickable, just invisible).
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return
          if (node.matches('.reveal-item')) revealObserver.observe(node)
          node.querySelectorAll('.reveal-item').forEach((element) => revealObserver.observe(element))
        })
      })
    })
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      revealObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!gallery) return

    document.body.style.overflow = 'hidden'
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setGallery(null)
      if (event.key === 'ArrowLeft') {
        setGallery((current) =>
          current
            ? { ...current, index: (current.index - 1 + current.images.length) % current.images.length }
            : null,
        )
      }
      if (event.key === 'ArrowRight') {
        setGallery((current) =>
          current
            ? { ...current, index: (current.index + 1) % current.images.length }
            : null,
        )
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [gallery])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-600 transition-colors duration-300 dark:bg-[#010713] dark:text-slate-300">
      <Navbar
        activeSection={activeSection}
        accent={accent}
        dark={dark}
        menuOpen={menuOpen}
        pickerOpen={pickerOpen}
        setAccent={setAccent}
        setDark={setDark}
        setMenuOpen={setMenuOpen}
        setPickerOpen={setPickerOpen}
      />

      <main className="pt-[96px]">
        <HomeSection roleIndex={roleIndex} />
        <AboutSection />
        <ServicesSection />
        <PortfolioSection openGallery={setGallery} />
        <ContactSection />
      </main>

      <Footer />
      <ScrollToTop visible={showScrollTop} />
      {gallery && <GalleryModal gallery={gallery} setGallery={setGallery} />}
    </div>
  )
}

export default App
