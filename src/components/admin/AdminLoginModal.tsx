import { useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { Icon } from '../ui/Icon'

export function AdminLoginModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Invalid credentials')
        return
      }
      router.push('/admin/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Portaled: the footer's backdrop-filter would otherwise become the containing block for `fixed`
  return createPortal(
    <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/60 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Admin login" onClick={onClose}>
      <form onClick={(event) => event.stopPropagation()} onSubmit={handleSubmit} className="w-full max-w-sm rounded-3xl p-7 border border-slate-200/80 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-slate-700/60 dark:bg-[#071426]/95">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Admin Login</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-8 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white">
            <Icon name="close" className="size-4" />
          </button>
        </div>

        {error && <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">{error}</p>}

        <label className="mb-3 block text-sm">
          <span className="mb-1 block text-slate-600 dark:text-slate-300">Email</span>
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="glass-input w-full rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-100"
          />
        </label>

        <label className="mb-6 block text-sm">
          <span className="mb-1 block text-slate-600 dark:text-slate-300">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="glass-input w-full rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-100"
          />
        </label>

        <button type="submit" disabled={loading} className="w-full rounded-full bg-[var(--accent)] px-5 py-2.5 font-semibold text-white shadow-lg shadow-[color-mix(in_srgb,var(--accent)_30%,transparent)] transition hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0">
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>,
    document.body,
  )
}
