import { Icon } from '../ui/Icon'

export function ScrollToTop({ visible }: { visible: boolean }) {
  return (
    <button
      className={`fixed bottom-22 right-5 z-[70] grid size-12 place-items-center rounded-full bg-[var(--accent)] text-white shadow-xl transition duration-300 hover:-translate-y-1 ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Go to top"
    >
      <Icon name="up" />
    </button>
  )
}
