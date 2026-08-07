import { useState, type FormEvent } from 'react'
import type { IconName } from '../../types/portfolio'
import { Icon } from '../ui/Icon'
import { SectionTitle } from '../ui/SectionTitle'

const inputClass =
  'h-13 rounded-full border border-slate-200 bg-white px-6 text-slate-800 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white'

const contactItems = [
  { icon: 'phone' as IconName, title: 'Call Me', content: '+92 3239865230', href: 'tel:+923239865230' },
  { icon: 'location' as IconName, title: 'Office', content: 'Islamabad' },
  { icon: 'email' as IconName, title: 'Email', content: 'samiullahwaheed@gmail.com', href: 'mailto:samiullahwaheed@gmail.com' },
  { icon: 'linkedin' as IconName, title: 'LinkedIn', content: 'in/samiullah-waheed', href: 'https://www.linkedin.com/in/samiullah-waheed/' },
  { icon: 'github' as IconName, title: 'GitHub', content: 'DarkHorse786', href: 'https://github.com/DarkHorse786' },
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
    <section id="contact" className="min-h-screen bg-[radial-gradient(circle_at_12%_20%,color-mix(in_srgb,var(--accent)_10%,transparent),transparent_28%)] px-8 py-20 dark:bg-[#010713] max-sm:px-5">
      <div className="mx-auto max-w-[1100px]">
        <SectionTitle>Contact Me</SectionTitle>
        <h3 className="text-center text-2xl font-bold text-rose-600">Have You Any Questions?</h3>
        <p className="mt-2 text-center text-sm font-semibold uppercase tracking-widest text-slate-800 dark:text-slate-200">I&apos;m at your services</p>
        <div className="my-14 grid grid-cols-5 gap-6 max-[1172px]:grid-cols-3 max-[700px]:grid-cols-2 max-[480px]:grid-cols-1">
          {contactItems.map((item) => (
            <div className="reveal-item text-center" key={item.title}>
              <Icon name={item.icon} className="mx-auto size-8 text-rose-600" />
              <h4 className="mt-3 font-bold text-slate-900 dark:text-white">{item.title}</h4>
              {item.href ? (
                <a className="mt-1 block break-words text-sm hover:text-rose-600" href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{item.content}</a>
              ) : (
                <p className="mt-1 text-sm">{item.content}</p>
              )}
            </div>
          ))}
        </div>

        <h3 className="text-center text-2xl font-bold text-rose-600">Send Me An Email</h3>
        <p className="mt-2 text-center text-sm font-semibold uppercase tracking-widest text-slate-800 dark:text-slate-200">I&apos;m very responsive to messages</p>
        <form onSubmit={handleSubmit} className="reveal-item mx-auto mt-10 max-w-4xl">
          {error && <p className="mb-6 rounded-full bg-rose-600/10 px-6 py-2.5 text-center text-sm text-rose-600">{error}</p>}
          <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
            <input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} name="name" placeholder="Name" required />
            <input className={inputClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} name="email" placeholder="Email" required />
          </div>
          <input className={`mt-6 w-full ${inputClass}`} value={subject} onChange={(event) => setSubject(event.target.value)} name="subject" placeholder="Subject" required />
          <textarea className="mt-6 min-h-40 w-full resize-y rounded-3xl border border-slate-200 bg-white px-6 py-4 text-slate-800 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white" value={message} onChange={(event) => setMessage(event.target.value)} name="message" placeholder="Message" required />
          <div className="mt-6 text-center">
            <button className="rounded-full bg-rose-600 px-10 py-3 font-semibold text-white shadow-lg shadow-rose-600/20 transition hover:scale-105 disabled:opacity-60 disabled:hover:scale-100" type="submit" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send Message'}
            </button>
          </div>
        </form>
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
