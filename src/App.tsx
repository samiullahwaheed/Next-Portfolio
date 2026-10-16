import { useEffect, useState } from 'react'
import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'
import { ScrollToTop } from './components/layout/ScrollToTop'
import { AboutSection } from './components/sections/AboutSection'
import { ContactSection } from './components/sections/ContactSection'
import { HomeSection } from './components/sections/HomeSection'
import { PortfolioSection } from './components/sections/PortfolioSection'
import { ServicesSection } from './components/sections/ServicesSection'
import { navItems } from './data/portfolio'
import { ACCENT_KEY, THEME_KEY, resolveAccent } from './lib/theme'

function App() {
  const [dark, setDark] = useState(() => localStorage.getItem(THEME_KEY) !== 'light')
  const [menuOpen, setMenuOpen] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [accent, setAccent] = useState(() => resolveAccent(localStorage.getItem(ACCENT_KEY)))
  // Persist only explicit choices, so visitors who never picked keep following the site defaults
  const chooseAccent = (value: string) => {
    setAccent(value)
    localStorage.setItem(ACCENT_KEY, value)
  }
  const chooseDark = (updater: (value: boolean) => boolean) => {
    const next = updater(dark)
    setDark(next)
    localStorage.setItem(THEME_KEY, next ? 'dark' : 'light')
  }
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent)
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

  // Links like /#contact from other pages land here before the sections exist:
  // scroll once mounted, and again after async content (projects) settles the layout
  useEffect(() => {
    const target = window.location.hash && document.querySelector<HTMLElement>(window.location.hash)
    if (!target) return
    let userScrolled = false
    const markScrolled = () => {
      userScrolled = true
    }
    const scrollToTarget = () => {
      if (!userScrolled) target.scrollIntoView({ behavior: 'instant' as ScrollBehavior })
    }
    scrollToTarget()
    window.addEventListener('wheel', markScrolled, { passive: true, once: true })
    window.addEventListener('touchmove', markScrolled, { passive: true, once: true })
    const timer = window.setTimeout(scrollToTarget, 900)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('wheel', markScrolled)
      window.removeEventListener('touchmove', markScrolled)
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-600 transition-colors duration-300 dark:bg-[#010713] dark:text-slate-300">
      <Navbar
        activeSection={activeSection}
        accent={accent}
        dark={dark}
        menuOpen={menuOpen}
        pickerOpen={pickerOpen}
        setAccent={chooseAccent}
        setDark={chooseDark}
        setMenuOpen={setMenuOpen}
        setPickerOpen={setPickerOpen}
      />

      <main>
        <HomeSection />
        <AboutSection />
        <ServicesSection />
        <PortfolioSection />
        <ContactSection />
      </main>

      <Footer />
      <ScrollToTop visible={showScrollTop} />
    </div>
  )
}

export default App
