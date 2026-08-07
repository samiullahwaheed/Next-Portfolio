import { useState, type FormEvent } from 'react'
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

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-5 backdrop-blur" role="dialog" aria-modal="true" aria-label="Admin login" onClick={onClose}>
      <form onClick={(event) => event.stopPropagation()} onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Admin Login</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-8 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-700">
            <Icon name="close" className="size-4" />
          </button>
        </div>

        {error && <p className="mb-4 rounded-lg bg-rose-600/10 px-3 py-2 text-sm text-rose-600">{error}</p>}

        <label className="mb-3 block text-sm">
          <span className="mb-1 block text-slate-600 dark:text-slate-300">Email</span>
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-slate-800 outline-none focus:border-rose-500 dark:border-slate-600 dark:text-slate-100"
          />
        </label>

        <label className="mb-6 block text-sm">
          <span className="mb-1 block text-slate-600 dark:text-slate-300">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-slate-800 outline-none focus:border-rose-500 dark:border-slate-600 dark:text-slate-100"
          />
        </label>

        <button type="submit" disabled={loading} className="w-full rounded-full bg-rose-600 px-5 py-2.5 font-semibold text-white transition hover:opacity-90 disabled:opacity-60">
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
