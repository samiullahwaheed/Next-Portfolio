import { useEffect, useRef } from 'react'

const GAP = 22 // must match .bg-dots background-size
const RADIUS = 150 // px around the pointer where dots react
const BASE_DOT = 1 // px, matches the static CSS dots
const MAX_DOT = 3.2 // px at the pointer

// Static .bg-dots background + a small canvas that follows the mouse and redraws only the nearby dots,
// bigger and brighter the closer they are. Place inside a `relative` section; listens on that section.
export function InteractiveDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = canvas?.parentElement
    if (!canvas || !section || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const context = canvas.getContext('2d')
    if (!context) return

    const size = RADIUS * 2
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    context.scale(dpr, dpr)

    let frame = 0
    const pointer = { x: 0, y: 0 }

    const draw = () => {
      frame = 0
      // Canvas box is centred on the pointer, in section coordinates
      const left = pointer.x - RADIUS
      const top = pointer.y - RADIUS
      canvas.style.transform = `translate3d(${left}px, ${top}px, 0)`
      context.clearRect(0, 0, size, size)
      context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#fa5b0f'

      // CSS dots sit at the centre of each GAP×GAP tile: (GAP/2 + n·GAP)
      const firstX = Math.ceil((left - GAP / 2) / GAP) * GAP + GAP / 2
      const firstY = Math.ceil((top - GAP / 2) / GAP) * GAP + GAP / 2
      for (let y = firstY; y < top + size; y += GAP) {
        for (let x = firstX; x < left + size; x += GAP) {
          const strength = 1 - Math.hypot(x - pointer.x, y - pointer.y) / RADIUS
          if (strength <= 0) continue
          const eased = strength * strength
          context.globalAlpha = 0.2 + 0.7 * eased
          context.beginPath()
          context.arc(x - left, y - top, BASE_DOT + (MAX_DOT - BASE_DOT) * eased, 0, Math.PI * 2)
          context.fill()
        }
      }
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const rect = section.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      canvas.classList.add('is-active')
      if (!frame) frame = requestAnimationFrame(draw)
    }
    const onLeave = () => canvas.classList.remove('is-active')

    section.addEventListener('pointermove', onMove, { passive: true })
    section.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <>
      <div aria-hidden className="bg-dots pointer-events-none absolute inset-0 -z-10" />
      <canvas ref={canvasRef} aria-hidden className="dots-glow pointer-events-none absolute top-0 left-0 -z-10" />
    </>
  )
}
