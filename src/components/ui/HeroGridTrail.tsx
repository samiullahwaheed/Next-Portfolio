import { useEffect, useRef } from 'react'

const CELL = 40 // must match --grid-size of .bg-hero-grid
const FADE_MS = 650 // how long a lit square takes to fade out
const FILL_ALPHA = 0.22 // square fill at full strength
const EDGE_ALPHA = 0.6 // square outline at full strength

// Lights up the hero grid square under the mouse; previously visited squares fade out, leaving a trail.
// Place inside the (relative) hero section; listens on that section. Mouse only.
export function HeroGridTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = canvas?.parentElement
    if (!canvas || !section || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const context = canvas.getContext('2d')
    if (!context) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0
    const resize = () => {
      width = section.clientWidth
      height = section.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(section)

    // The CSS grid is `background-position: center top`, so columns are offset to keep a tile centred
    const offsetX = () => (width - CELL) / 2 - Math.ceil((width - CELL) / 2 / CELL) * CELL

    const lit = new Map<string, { x: number; y: number; strength: number }>()
    let frame = 0
    let last = 0

    const draw = (now: number) => {
      const elapsed = last ? now - last : 16
      last = now
      context.clearRect(0, 0, width, height)
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#fa5b0f'
      context.fillStyle = accent
      context.strokeStyle = accent
      context.lineWidth = 1

      for (const [key, cell] of lit) {
        cell.strength -= elapsed / FADE_MS
        if (cell.strength <= 0) {
          lit.delete(key)
          continue
        }
        const eased = cell.strength * cell.strength
        context.globalAlpha = FILL_ALPHA * eased
        context.fillRect(cell.x, cell.y, CELL, CELL)
        context.globalAlpha = EDGE_ALPHA * eased
        context.strokeRect(cell.x + 0.5, cell.y + 0.5, CELL, CELL)
      }

      if (lit.size > 0) frame = requestAnimationFrame(draw)
      else {
        frame = 0
        last = 0
      }
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const rect = section.getBoundingClientRect()
      const startX = offsetX()
      const column = Math.floor((event.clientX - rect.left - startX) / CELL)
      const row = Math.floor((event.clientY - rect.top) / CELL)
      lit.set(`${column}:${row}`, { x: startX + column * CELL, y: row * CELL, strength: 1 })
      if (!frame) frame = requestAnimationFrame(draw)
    }

    section.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      section.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute top-0 left-0 -z-10" />
}
