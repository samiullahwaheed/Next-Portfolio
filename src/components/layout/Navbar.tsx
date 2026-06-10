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

  return (
    <header className="fixed inset-x-0 top-0 z-[80] border-b border-slate-200/80 bg-white/85 shadow-sm backdrop-blur-xl dark:border-slate-700/50 dark:bg-[#030b16]/92">
      <nav className="mx-auto flex min-h-[74px] max-w-[1180px] items-center justify-between gap-5 px-5" aria-label="Main navigation">
        <a href="#home" onClick={closeMenu} className="font-serif text-xl font-bold text-slate-950 dark:text-white">
            Samiullah <span className="text-[var(--accent)]">Waheed .</span>
        </a>
        <ul className="flex items-center gap-1 max-[900px]:hidden">
          {navItems.map((item) => {
            const active = activeSection === item.href.slice(1)
            return (
              <li key={item.href}>
                <a href={item.href} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${active ? 'bg-[var(--accent)] text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100 hover:text-[var(--accent)] dark:text-slate-300 dark:hover:bg-slate-800'}`}>
                  <Icon name={item.icon} className="size-4" />
                  {item.label}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-[var(--accent)] shadow-sm transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-800" onClick={() => setPickerOpen((value) => !value)} aria-label="Choose accent color" aria-expanded={pickerOpen}>
              <Icon name="paletteControl" />
            </button>
            {pickerOpen && (
              <div className="absolute right-0 top-13 w-52 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
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
          <button className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-[var(--accent)] shadow-sm transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-800" onClick={() => setDark((value) => !value)} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>
            <Icon name={dark ? 'sun' : 'moon'} />
          </button>
          <button className="hidden size-10 place-items-center rounded-xl border border-slate-200 bg-white text-[var(--accent)] max-[900px]:grid dark:border-slate-700 dark:bg-slate-800" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-5 py-4 dark:border-slate-700 dark:bg-[#030b16] min-[901px]:hidden">
          <ul className="mx-auto grid max-w-[1180px] gap-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={closeMenu} className={`flex items-center gap-3 rounded-xl px-4 py-3 font-semibold ${activeSection === item.href.slice(1) ? 'bg-[var(--accent)] text-white' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'}`}>
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
