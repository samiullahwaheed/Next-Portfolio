import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { accentColors, navItems } from '../../data/portfolio'
import { Icon } from '../ui/Icon'

type NavbarProps = {
  activeSection: string
  accent: string
  dark: boolean
  menuOpen: boolean
  pickerOpen: boolean
  setAccent: (accent: string) => void
  setDark: (updater: (value: boolean) => boolean) => void
  setMenuOpen: (updater: (value: boolean) => boolean) => void
  setPickerOpen: (updater: (value: boolean) => boolean) => void
}

const iconButton =
  'grid size-10 place-items-center rounded-full border border-slate-200/80 bg-white/70 text-[var(--accent)] transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/70'

export function Navbar({
  activeSection,
  accent,
  dark,
  menuOpen,
  pickerOpen,
  setAccent,
  setDark,
  setMenuOpen,
  setPickerOpen,
}: NavbarProps) {
  const closeMenu = () => setMenuOpen(() => false)
  const [scrolled, setScrolled] = useState(false)
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null)
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({})

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Slide the active pill under the current section's link
  useLayoutEffect(() => {
    const measure = () => {
      const link = linkRefs.current[activeSection]
      setIndicator(link ? { left: link.offsetLeft, width: link.offsetWidth } : null)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [activeSection])

  return (
    <header className={`fixed inset-x-0 z-[80] px-4 transition-all duration-300 ${scrolled ? 'top-3' : 'top-5'}`}>
      <nav
        className={`mx-auto flex max-w-[1180px] items-center justify-between gap-5 rounded-full border border-slate-200/70 bg-white/75 pl-6 pr-2.5 backdrop-blur-xl transition-all duration-300 dark:border-slate-700/50 dark:bg-[#071426]/75 ${scrolled ? 'min-h-[58px] shadow-[0_12px_40px_-12px_rgba(15,23,42,0.35)]' : 'min-h-[64px] shadow-[0_8px_30px_-14px_rgba(15,23,42,0.25)]'}`}
        aria-label="Main navigation"
      >
        <a href="#home" onClick={closeMenu} className="shrink-0 font-serif text-xl font-bold text-slate-950 dark:text-white">
          Samiullah <span className="text-[var(--accent)]">Waheed .</span>
        </a>

        <ul className="relative flex items-center gap-1 rounded-full bg-slate-100/70 p-1 max-[900px]:hidden dark:bg-slate-800/50">
          {indicator && (
            <span
              aria-hidden
              className="absolute top-1 bottom-1 rounded-full bg-[var(--accent)] shadow-lg transition-all duration-300 ease-out"
              style={{ left: indicator.left, width: indicator.width }}
            />
          )}
          {navItems.map((item) => {
            const id = item.href.slice(1)
            const active = activeSection === id
            return (
              <li key={item.href}>
                <a
                  ref={(el) => {
                    linkRefs.current[id] = el
                  }}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative z-10 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${active ? 'text-white' : 'text-slate-600 hover:text-[var(--accent)] dark:text-slate-300'}`}
                >
                  <Icon name={item.icon} className="size-4" />
                  {item.label}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button className={iconButton} onClick={() => setPickerOpen((value) => !value)} aria-label="Choose accent color" aria-expanded={pickerOpen}>
              <Icon name="paletteControl" />
            </button>
            {pickerOpen && (
              <div className="absolute right-0 top-14 w-52 rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/95">
                <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">Theme colors</h3>
                <div className="flex justify-between gap-2">
                  {accentColors.map((color) => (
                    <button
                      key={color.value}
                      className={`size-7 rounded-full border-2 transition hover:scale-110 ${accent === color.value ? 'border-slate-900 ring-2 ring-slate-300 dark:border-white dark:ring-slate-600' : 'border-transparent'}`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => {
                        setAccent(color.value)
                        setPickerOpen(() => false)
                      }}
                      aria-label={`Use ${color.name} accent`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <button className={iconButton} onClick={() => setDark((value) => !value)} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>
            <Icon name={dark ? 'sun' : 'moon'} />
          </button>
          <button className={`${iconButton} hidden max-[900px]:grid`} onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="mx-auto mt-3 max-w-[1180px] rounded-3xl border border-slate-200/70 bg-white/90 p-3 shadow-2xl backdrop-blur-xl dark:border-slate-700/50 dark:bg-[#071426]/90 min-[901px]:hidden">
          <ul className="grid gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={closeMenu} className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold transition ${activeSection === item.href.slice(1) ? 'bg-[var(--accent)] text-white' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'}`}>
                  <Icon name={item.icon} />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
