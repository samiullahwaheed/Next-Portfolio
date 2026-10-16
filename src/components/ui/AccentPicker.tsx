'use client'

import { useEffect, useRef, useState } from 'react'
import { accentColors } from '@/data/portfolio'
import { Icon } from './Icon'

type AccentPickerProps = {
  accent: string
  onChange: (accent: string) => void
  buttonClassName: string
}

// Palette button + dropdown of accent swatches (closes on pick or outside click)
export function AccentPicker({ accent, onChange, buttonClassName }: AccentPickerProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button type="button" className={buttonClassName} onClick={() => setOpen((value) => !value)} aria-label="Choose accent color" aria-expanded={open}>
        <Icon name="paletteControl" />
      </button>
      {open && (
        <div className="absolute right-0 top-14 z-10 w-52 rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/95">
          <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">Theme colors</h3>
          <div className="flex justify-between gap-2">
            {accentColors.map((color) => (
              <button
                type="button"
                key={color.value}
                className={`size-7 rounded-full border-2 transition hover:scale-110 ${accent.toLowerCase() === color.value.toLowerCase() ? 'border-slate-900 ring-2 ring-slate-300 dark:border-white dark:ring-slate-600' : 'border-transparent'}`}
                style={{ backgroundColor: color.value }}
                onClick={() => {
                  onChange(color.value)
                  setOpen(false)
                }}
                aria-label={`Use ${color.name} accent`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
