import { useState, type FormEvent } from 'react'
import type { IconName } from '../../types/portfolio'
import { Icon } from '../ui/Icon'
import { SectionTitle } from '../ui/SectionTitle'
import { trackSpotlight } from '../ui/spotlight'

const inputClass = 'glass-input h-13 rounded-full px-6 text-slate-800 dark:text-white'

const contactItems = [
  { icon: 'phone' as IconName, title: 'Call Me', content: '+92 3239865230', href: 'tel:+923239865230' },
  { icon: 'location' as IconName, title: 'Office', content: 'Islamabad' },
  { icon: 'email' as IconName, title: 'Email', content: 'samiullahwaheed@gmail.com', href: 'mailto:samiullahwaheed@gmail.com' },
  { icon: 'linkedin' as IconName, title: 'LinkedIn', content: 'in/samiullah-waheed', href: 'https://www.linkedin.com/in/samiullah-waheed/' },
  { icon: 'github' as IconName, title: 'GitHub', content: 'SamiullahWaheed', href: 'https://github.com/SamiullahWaheed' },
]

export function ContactSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="relative isolate overflow-hidden px-8 py-24 max-sm:px-5">
      <div aria-hidden className="pointer-events-none absolute -left-32 top-24 -z-10 size-[26rem] rounded-full bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 -z-10 size-[26rem] rounded-full bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] blur-3xl" />
      <div className="mx-auto max-w-[1100px]">
        <SectionTitle eyebrow="Contact" title="Let's work" highlight="together" />
        <div className="grid grid-cols-[0.85fr_1.15fr] gap-10 max-[900px]:grid-cols-1">
          <div className="reveal-item">
            <h3 className="text-3xl font-bold leading-tight text-slate-900 dark:text-white">
              Have a project in mind? <span className="text-accent-gradient">Let&apos;s talk.</span>
            </h3>
            <p className="mt-3 leading-7">I&apos;m very responsive to messages — reach out directly or use the form and I&apos;ll get back to you soon.</p>
            <ul className="mt-8 grid gap-3">
              {contactItems.map((item) => {
                const body = (
                  <>
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)] transition duration-300 group-hover:bg-[var(--accent)] group-hover:text-white">
                      <Icon name={item.icon} className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{item.title}</span>
                      <span className="block break-words font-semibold text-slate-900 dark:text-white">{item.content}</span>
                    </span>
                  </>
                )
                const cardClass = 'glass-card group flex items-center gap-4 rounded-2xl p-4'
                return (
                  <li key={item.title}>
                    {item.href ? (
                      <a onMouseMove={trackSpotlight} className={cardClass} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{body}</a>
                    ) : (
                      <div onMouseMove={trackSpotlight} className={cardClass}>{body}</div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="reveal-item glass-card no-lift self-start rounded-3xl p-8 max-sm:p-5">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Send me a message</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Fill in the form and I&apos;ll reply by email.</p>
            {error && <p className="mt-6 rounded-full bg-rose-600/10 px-6 py-2.5 text-center text-sm text-rose-600">{error}</p>}
            <div className="mt-6 grid grid-cols-2 gap-5 max-sm:grid-cols-1">
              <input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} name="name" placeholder="Name" aria-label="Name" required />
              <input className={inputClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} name="email" placeholder="Email" aria-label="Email" required />
            </div>
            <input className={`mt-5 w-full ${inputClass}`} value={subject} onChange={(event) => setSubject(event.target.value)} name="subject" placeholder="Subject" aria-label="Subject" required />
            <textarea className="glass-input mt-5 min-h-40 w-full resize-y rounded-3xl px-6 py-4 text-slate-800 dark:text-white" value={message} onChange={(event) => setMessage(event.target.value)} name="message" placeholder="Message" aria-label="Message" required />
            <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-10 py-3.5 font-semibold text-white shadow-lg shadow-[color-mix(in_srgb,var(--accent)_30%,transparent)] transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:hover:translate-y-0" type="submit" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send Message'}
              {!submitting && <span aria-hidden>→</span>}
            </button>
          </form>
        </div>
      </div>

      {submitted && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-5 backdrop-blur" role="dialog" aria-modal="true" aria-label="Message sent" onClick={() => setSubmitted(false)}>
          <div onClick={(event) => event.stopPropagation()} className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-2xl dark:border-slate-700 dark:bg-slate-800">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-rose-600/10 text-rose-600">
              <Icon name="check" className="size-7" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">Thank You!</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Your message has been sent successfully. I&apos;ll get back to you soon.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 rounded-full bg-rose-600 px-8 py-2.5 font-semibold text-white transition hover:opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
