// Shared with App.tsx: the visitor's saved theme + accent live in localStorage under these keys
export const THEME_KEY = 'portfolio-theme'
export const ACCENT_KEY = 'portfolio-accent'
export const DEFAULT_ACCENT = '#0F6CBD'
const LEGACY_ACCENTS = ['#3b82f6', '#161FA7', '#003366']

export function resolveAccent(saved: string | null) {
  return !saved || LEGACY_ACCENTS.includes(saved) ? DEFAULT_ACCENT : saved
}

// Inline <script> body for server-rendered pages: applies theme + accent before first paint
export const themeInitScript = `(function(){try{var d=document.documentElement;d.classList.toggle('dark',localStorage.getItem('${THEME_KEY}')!=='light');var a=localStorage.getItem('${ACCENT_KEY}');if(!a||${JSON.stringify(LEGACY_ACCENTS)}.indexOf(a)>-1)a='${DEFAULT_ACCENT}';d.style.setProperty('--accent',a)}catch(e){}})()`
