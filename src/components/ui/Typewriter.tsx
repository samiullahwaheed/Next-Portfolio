import { useEffect, useState } from 'react'

const TYPE_MS = 90
const DELETE_MS = 45
const HOLD_MS = 1600 // pause once a word is fully typed
const GAP_MS = 350 // pause after deleting, before the next word

// Types each word letter by letter, holds, deletes it, then moves to the next
export function Typewriter({ words, className = '' }: { words: string[]; className?: string }) {
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const word = words[wordIndex]
    if (reducedMotion) {
      // No typing animation: just swap whole words
      const timer = window.setTimeout(() => setWordIndex((index) => (index + 1) % words.length), HOLD_MS + 800)
      return () => window.clearTimeout(timer)
    }

    const typedFull = !deleting && text === word
    const erased = deleting && text === ''
    const delay = typedFull ? HOLD_MS : erased ? GAP_MS : deleting ? DELETE_MS : TYPE_MS

    const timer = window.setTimeout(() => {
      if (typedFull) setDeleting(true)
      else if (erased) {
        setDeleting(false)
        setWordIndex((index) => (index + 1) % words.length)
      } else setText(word.slice(0, text.length + (deleting ? -1 : 1)))
    }, delay)
    return () => window.clearTimeout(timer)
  }, [words, wordIndex, text, deleting, reducedMotion])

  return (
    <span className={className}>
      {/* Screen readers get the full list instead of letter-by-letter changes */}
      <span className="sr-only">{words.join(', ')}</span>
      <span aria-hidden>
        {reducedMotion ? words[wordIndex] : text}
        <span className="typewriter-caret" />
      </span>
    </span>
  )
}
