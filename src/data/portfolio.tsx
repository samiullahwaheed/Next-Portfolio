import { ExternalLink } from '../components/ui/ExternalLink'
import type { IconName, TimelineEntry } from '../types/portfolio'

export const navItems: Array<{ label: string; href: string; icon: IconName }> = [
  { label: 'Home', href: '#home', icon: 'home' },
  { label: 'About', href: '#about', icon: 'user' },
  { label: 'Services', href: '#services', icon: 'services' },
  { label: 'Portfolio', href: '#portfolio', icon: 'portfolio' },
  { label: 'Contact', href: '#contact', icon: 'contact' },
]

export const accentColors = [
  { name: 'Crimson', value: '#ec1839' },
  { name: 'Orange', value: '#fa5b0f' },
  { name: 'Emerald', value: '#37b182' },
  { name: 'Blue', value: '#0F6CBD' },
  { name: 'Pink', value: '#f021b2' },
]

export const roles = ['Software Engineer', 'MERN Stack Developer', 'Graphic Designer']

// Core-stack logos come from the Devicon set: `logo` is the path under icons/ without ".svg"
export const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons'

export type Skill = { name: string; logo?: string }

// Highlighted above the skill groups — the stack to be remembered for
export const coreStack: Skill[] = [
  { name: 'React', logo: 'react/react-original' },
  { name: 'Next.js', logo: 'nextjs/nextjs-original' },
  { name: 'Node.js', logo: 'nodejs/nodejs-original' },
  { name: 'Python', logo: 'python/python-original' },
  { name: 'MongoDB', logo: 'mongodb/mongodb-original' },
  { name: 'Flutter', logo: 'flutter/flutter-original' },
  { name: 'AWS', logo: 'amazonwebservices/amazonwebservices-original-wordmark' },
]

export const expertise: { title: string; icon: IconName; skills: string[] }[] = [
  {
    title: 'Front-End',
    icon: 'frontend',
    skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Redux Toolkit', 'RTK Query', 'HTML5', 'CSS3', 'Flutter'],
  },
  {
    title: 'Back-End',
    icon: 'backend',
    skills: ['Node.js', 'Express.js', 'Python', 'PHP', 'Laravel', 'REST APIs', 'GraphQL', 'WebSockets', 'Socket.io'],
  },
  {
    title: 'Databases',
    icon: 'database',
    skills: ['MongoDB', 'Mongoose', 'PostgreSQL', 'MySQL', 'Supabase', 'Firebase', 'Prisma', 'Redis'],
  },
  {
    title: 'Tools & DevOps',
    icon: 'tools',
    skills: ['Git', 'GitHub', 'CI/CD', 'Docker', 'AWS', 'Vercel', 'Cloudinary', 'Postman', 'Jira', 'Figma', 'WordPress'],
  },
]

// Add, remove, or reorder objects here to update the experience timeline.
export const workExperience: TimelineEntry[] = [
  {
    organization: 'Solexes (Pvt.) Ltd.',
    date: 'Apr 2026 - Present',
    role: 'Full Stack Developer',
    location: 'NSTP, Islamabad, PK',
    description: (
      <ul className="list-disc space-y-1.5 pl-5 marker:text-[var(--accent)]">
        <li>
          Contributed to <ExternalLink href="https://www.docutect.com/">DocuTect AI</ExternalLink> and{' '}
          <ExternalLink href="https://rewaldo.com/">Rewaldo</ExternalLink> App development and
          delivered full stack business applications. Performed testing on various existing projects and provided
          ongoing technical support, including debugging, updates, and system maintenance.
        </li>
        <li>
          Working in the project support team, focusing on dashboards optimization and managing updates for both Android
          and iOS platforms.
        </li>
      </ul>
    ),
  },
  {
    organization: 'SiberKoza International',
    date: 'Jun 2025 - Aug 2025',
    role: 'MERN Stack Developer – Internship',
    location: 'NASTP, Rawalpindi, PK',
    description: (
      <ul className="list-disc space-y-1.5 pl-5 marker:text-[var(--accent)]">
        <li>
          Contributed to an AI-based startup by providing full <strong className="font-semibold text-slate-900 dark:text-white">MERN</strong> stack development support.
        </li>
        <li>
          Developed full Frontend in <strong className="font-semibold text-slate-900 dark:text-white">React</strong> and <strong className="font-semibold text-slate-900 dark:text-white">Next.js</strong>, integrated APIs,
          added attractive animations and also implemented authentication with JWT.
        </li>
        <li>
          Assisted in the development and improvement of other web applications in <strong className="font-semibold text-slate-900 dark:text-white">MERN</strong>.
        </li>
      </ul>
    ),
  },
  {
    organization: 'Minhaj Model School & Islamabad College of Education',
    date: 'Sep 2022 - Mar 2026',
    role: 'Computer Teacher',
    location: 'Islamabad, PK',
    description: (
      <ul className="list-disc space-y-1.5 pl-5 marker:text-[var(--accent)]">
        <li>
          Taught Computer Science to Matric-level students and provided practical training in 
          <strong className="font-semibold text-slate-900 dark:text-white"> Web Development</strong> and <strong className="font-semibold text-slate-900 dark:text-white">C programming</strong>.
        </li>
      </ul>
    ),
  },
]

export const education: TimelineEntry[] = [
  {
    organization: 'National University of Modern Languages',
    date: '2022 - 2026',
    role: 'Bachelor in Software Engineering',
    description: (
      <>
        Completed comprehensive studies in software engineering with a focus on modern web
        technologies and software development methodologies, achieving a CGPA of <span className="font-semibold text-rose-600">3.62</span>.
      </>
    ),
  },
]

// Each link renders as a "Verify" button on the card
export const certifications: TimelineEntry[] = [
  {
    organization: 'Meta · Coursera',
    date: 'Jun 2025',
    role: 'Front-End Developer Professional Certificate',
    link: { label: 'Verify', href: 'https://www.coursera.org/account/accomplishments/specialization/certificate/S6GVX1XYXHVD' },
  },
  {
    organization: 'Amazon Web Services (AWS)',
    date: 'Aug 2026',
    role: 'AWS Certified Solutions Architect – Associate',
    link: { label: 'Verify', href: 'https://cp.certmetrics.com/amazon/en/public/verify/credential/f2f5e05678bd4604a12ba9e8ccce1f48' },
  },
]

export const services = [
  { title: 'Mobile App Development', icon: 'mobile' as IconName, description: 'Creating responsive and functional mobile applications for various platforms.' },
  { title: 'Web Development', icon: 'web' as IconName, description: 'Building and maintaining websites, ensuring they are functional, user-friendly, and visually appealing.' },
  { title: 'SEO Optimization', icon: 'search' as IconName, description: 'Enhancing website visibility and search engine ranking through various optimization techniques.' },
]

// Projects have moved to MongoDB — see src/models/Project.ts and scripts/seed.mjs for the
// one-time migration of the data that used to live in this file.

// About-section stat tiles. PLACEHOLDERS — replace `value` with your real numbers.
export const stats = [
  { value: 3, suffix: '+', label: 'Years of experience' },
  { value: 15, suffix: '+', label: 'Projects delivered' },
  { value: 10, suffix: '+', label: 'Happy clients' },
  { value: 12, suffix: '+', label: 'Technologies' },
]
