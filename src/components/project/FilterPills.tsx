'use client'

import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'

type FilterPillsProps = {
  options: readonly string[]
  active: string
  onChange: (value: string) => void
}

// Single-row pill bar with an accent highlight that slides behind the active option;
// scrolls sideways (scrollbar hidden) when there isn't room for every option
export function FilterPills({ options, active, onChange }: FilterPillsProps) {
  const [indicator, setIndicator] = useState<CSSProperties | null>(null)
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})
  const scrollerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const measure = () => {
      const button = refs.current[active]
      setIndicator(button ? { left: button.offsetLeft, top: button.offsetTop, width: button.offsetWidth, height: button.offsetHeight } : null)
    }
    // Keep the active pill in view by scrolling the row only (scrollIntoView could also scroll the page)
    const button = refs.current[active]
    const scroller = scrollerRef.current
    if (button && scroller && scroller.scrollWidth > scroller.clientWidth) {
      scroller.scrollTo({ left: button.offsetLeft - (scroller.clientWidth - button.offsetWidth) / 2, behavior: 'smooth' })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [active, options])

  return (
    <div ref={scrollerRef} className="no-scrollbar w-full overflow-x-auto">
      <div className="relative mx-auto flex w-max gap-0.5 rounded-full border border-slate-200/80 bg-white/70 p-1 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/50">
      {indicator && (
        <span
          aria-hidden
          className="absolute rounded-full bg-[var(--accent)] shadow-lg shadow-[color-mix(in_srgb,var(--accent)_35%,transparent)] transition-all duration-300 ease-out"
          style={indicator}
        />
      )}
      {options.map((option) => (
        <button
          key={option}
          ref={(element) => {
            refs.current[option] = element
          }}
          type="button"
          onClick={() => onChange(option)}
          aria-pressed={active === option}
          className={`relative z-10 shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors duration-300 ${
            active === option ? 'text-white' : 'text-slate-600 hover:text-[var(--accent)] dark:text-slate-300'
          }`}
        >
          {option}
        </button>
      ))}
      </div>
    </div>
  )
}
