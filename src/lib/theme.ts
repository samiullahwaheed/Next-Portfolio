// The visitor's saved theme + accent live in localStorage under these keys.
// Keys are versioned: bumping them resets every visitor to the current defaults once.
export const THEME_KEY = 'portfolio-theme-v2'
export const ACCENT_KEY = 'portfolio-accent-v2'
export const DEFAULT_ACCENT = '#fa5b0f' // Orange

export function resolveAccent(saved: string | null) {
  return saved || DEFAULT_ACCENT
}

// Inline <script> body for the root layout: applies theme (dark unless the visitor chose light) + accent before first paint
export const themeInitScript = `(function(){try{var d=document.documentElement;d.classList.toggle('dark',localStorage.getItem('${THEME_KEY}')!=='light');d.style.setProperty('--accent',localStorage.getItem('${ACCENT_KEY}')||'${DEFAULT_ACCENT}')}catch(e){}})()`
