import type { IconName, Project, TimelineEntry } from '../types/portfolio'

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

export const expertise = [
  { title: 'Front-End', icon: 'frontend' as IconName, skills: ['HTML/CSS', 'JavaScript', 'React.js', 'Tailwind CSS', 'Redux', 'Bootstrap', 'RTK Query'] },
  { title: 'Back-End', icon: 'backend' as IconName, skills: ['Node.js', 'Express.js', 'Laravel'] },
  { title: 'Databases', icon: 'database' as IconName, skills: ['MongoDB', 'MySQL', 'Firebase'] },
  { title: 'Others', icon: 'tools' as IconName, skills: ['RESTful APIs', 'WebSockets', 'Agile/Scrum', 'Git'] },
]

// Add, remove, or reorder objects here to update the experience timeline.
export const workExperience: TimelineEntry[] = [
  {
    organization: 'Solexes Pvt Ltd',
    date: 'Apr 2026 - Present',
    role: 'Full Stack Developer',
    description: (
      <>
        Providing full stack Support to multiple projects and contributed to <span className="font-semibold text-rose-600">DocuTect AI</span> App
        development and delivered full stack business applications. Performed testing on
        various projects and provided ongoing technical support, including debugging,
        updates, and system maintenance.
      </>
    ),
  },
  {
    organization: 'SiberKoza (NASTP)',
    date: 'Jun 2025 - Aug 2025',
    role: 'MERN Stack Developer Intern',
    description: (
      <>
        Interned as a Full Stack Developer at Mecca Innovations, a startup of SiberKoza
        International, where I worked on an AI-based startup by providing full MERN stack
        support. I also contributed to making other applications fully responsive and
        developed backend APIs to support project functionality.
      </>
    ),
  },
  {
    organization: 'Brain Wave',
    date: 'Apr 2025 - May 2025',
    role: 'Frontend Developer Intern',
    description: (
      <>
        Provided frontend support to the company by developing different projects in
        React.js. I developed and maintained web applications, designed user-friendly
        responsive websites, enhanced user experience, and optimized performance.
      </>
    ),
  },
  {
    organization: 'Intern Intelligence',
    date: 'Mar 2025 - Apr 2025',
    role: 'Web Developer Intern',
    description: (
      <>
        Worked as a Web Developer Intern, where I developed responsive UIs using Tailwind
        CSS, React, and APIs while working on five real-world projects.
      </>
    ),
  },
  {
    organization: 'Minhaj Model School',
    date: 'Sep 2022 - Apr 2026',
    role: 'Computer Teacher',
    description: (
      <>
        Worked as a Computer Science and Mathematics Teacher. I taught Matric-level
        students and provide them practical knowledge of <span className="font-semibold text-rose-600">HTML and C programming</span>.
      </>
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
  {
    organization: 'IMCB F-7/3 Islamabad',
    date: '2019 - 2021',
    role: 'Pre-Engineering',
    description: (
      <>
        Completed pre-engineering studies with a strong foundation in mathematics, physics,
        and chemistry, obtaining{' '}
        <span className="font-semibold text-rose-600">64%</span> marks.
      </>
    ),
  },
  {
    organization: 'Minhaj Model School',
    date: '2017 - 2019',
    role: 'Matriculation',
    description: (
      <>
        Completed high school education with a focus on science subjects and computer
        fundamentals, achieving{' '}
        <span className="font-semibold text-rose-600">76%</span> marks.
      </>
    ),
  },
]

export const services = [
  { title: 'Mobile App Development', icon: 'mobile' as IconName, description: 'Creating responsive and functional mobile applications for various platforms.' },
  { title: 'Web Development', icon: 'web' as IconName, description: 'Building and maintaining websites, ensuring they are functional, user-friendly, and visually appealing.' },
  { title: 'Graphic Designing', icon: 'palette' as IconName, description: 'Crafting visual content to communicate messages through typography, imagery, color, and form.' },
  { title: 'Software Development', icon: 'code' as IconName, description: 'Developing tailored software solutions to meet specific business needs and requirements.' },
  { title: 'SEO Optimization', icon: 'search' as IconName, description: 'Enhancing website visibility and search engine ranking through various optimization techniques.' },
  { title: 'Digital Marketing', icon: 'marketing' as IconName, description: 'Promoting brands and products through digital channels to reach and engage target audiences.' },
]

const projectPath = '/portfolio/projects'

export const projects: Project[] = [
  {
    title: 'CryptoVerse',
    description:
      'Developed a React-based cryptocurrency web application that provides real-time data, detailed statistics, and insights for global cryptocurrencies. Integrated APIs for live market updates, designed a responsive interface, and implemented user-friendly navigation for exploring coins and trends.',
    tech: ['React.js', 'Tailwind CSS', 'Cloudinary', 'Redux', 'RESTful APIs'],
    url: 'https://cryptoverse786.netlify.app/',
    images: [1, 2, 3].map((number) => `${projectPath}/CryptoVerse/${number}.png`),
  },
  {
    title: 'Movieo',
    description:
      'Developed a dynamic web application that allows users to search, browse, and explore detailed information about movies and TV shows. Integrated the TMDB API for real-time ratings, genres, and descriptions, with a responsive interface across devices.',
    tech: ['React.js', 'Node.js', 'Cloudinary', 'TMDB API', 'Tailwind CSS'],
    url: 'https://movieo786.vercel.app/',
    images: [1, 2, 3, 4].map((number) => `${projectPath}/Movieo/${number}.png`),
  },
  {
    title: 'QuickChat',
    description:
      'Built a real-time MERN chat app with JWT authentication and Socket.io. Designed a responsive React UI, managed state with Redux and Context APIs, developed RESTful APIs with Express and MongoDB, and added friend requests, group chat, and Meta AI.',
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Cloudinary', 'Redux', 'WebSockets', 'Meta AI', 'JWT', 'Socket.io'],
    url: 'https://mern-chatapp-786.onrender.com/',
    images: Array.from({ length: 10 }, (_, index) => `${projectPath}/QuickChat/${index + 1}.png`),
  },
  {
    title: 'Skill Exchange',
    description:
      'Developed a platform for exchanging skills and services through AI-powered matching. It includes secure authentication, chat, scheduling, feedback, barter and monetary transactions, agreements, ratings, and Stripe payments.',
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Cloudinary', 'Socket.io', 'JWT', 'Stripe'],
    url: 'https://www.linkedin.com/posts/samiullah-waheed_fullstackdeveloper-mernstack-socketio-activity-7415096227408642048-Wwqm',
    images: Array.from({ length: 10 }, (_, index) => `${projectPath}/Skill_Exchange/${index + 1}.png`),
  },
]
