# Samiullah Waheed Portfolio

## Manually Update Experience

Work experience data is stored in:

`src/data/portfolio.tsx`

Find the `workExperience` array:

```ts
export const workExperience: TimelineEntry[] = [
  {
    organization: 'Company Name',
    date: 'Jan 2026 - Present',
    role: 'Full Stack Developer',
    description:
      'Describe your responsibilities, technologies, and achievements here.',
  },
]
```

Each experience requires these fields:

- `organization`: Company or organization name.
- `date`: Employment period displayed on the timeline.
- `role`: Your job title.
- `description`: Summary of your responsibilities and achievements.

To add a new experience, insert another object into the array:

```ts
{
  organization: 'New Company',
  date: 'Sep 2026 - Present',
  role: 'Backend Developer',
  description:
    'Developed APIs, authentication systems, dashboards, and backend services.',
},
```

The entries appear in the same order as the array. Move an object upward to show it earlier, or delete the complete object to remove that experience.

After editing, verify the website with:

```bash
npm run lint
npm run build
```

## Development

This project is built with [Next.js](https://nextjs.org) (App Router) and TypeScript.

```bash
npm run dev    # start the dev server
npm run build  # production build
npm run start  # run the production build
npm run lint   # run ESLint
```

## Dynamic Projects & Admin Panel

The Projects section is backed by MongoDB instead of a static file, with a hidden admin
panel for managing project data. This section explains how the moving parts fit together.

### 1. Environment setup

Copy `.env.example` to `.env.local` and fill in:

- `MONGODB_URI` — a MongoDB Atlas connection string.
- `JWT_SECRET` — any long random string, used to sign the admin session token.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the single admin login. Only read once, by the seed
  script below, to create the hashed `Admin` document — not used at runtime after that.
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — from your
  Cloudinary dashboard's "Account Details" panel.

### 2. Seed the database

```bash
npm run seed
```

This one-time migration script (`scripts/seed.mjs`):

- Uploads the images in `public/portfolio/projects/**` to Cloudinary under the
  `portfolio/projects` folder.
- Creates the four projects that used to be hardcoded in `src/data/portfolio.tsx` in the
  `projects` MongoDB collection, with a best-guess `category` assigned from each
  project's tech stack (correct these from `/admin/dashboard` if needed).
- Creates the single `Admin` document from `ADMIN_EMAIL` / `ADMIN_PASSWORD`, with the
  password bcrypt-hashed before it's stored.

It's safe to re-run — projects are upserted by `title` and the admin by `email`, so
re-running won't create duplicates.

### 3. How auth works

- `POST /api/auth/login` checks the submitted credentials against the `Admin` collection
  (bcrypt compare) and, on success, signs a JWT (`src/lib/auth.ts`) and sets it as an
  `httpOnly` cookie (`admin_token`).
- `src/proxy.ts` (the Next.js 16 replacement for `middleware.ts`) checks that cookie on
  every request to `/admin/dashboard/*` and redirects unauthenticated visitors to `/`.
- Mutating API routes (`POST`/`PUT`/`DELETE` under `/api/projects` and
  `POST /api/upload`) independently verify the same cookie via `requireAdmin()` in
  `src/lib/auth.ts`, so they're protected even if hit directly.
- `POST /api/auth/logout` clears the cookie.

To reach the login modal, click the footer's copyright line 5 times within 2 seconds
(see `src/components/layout/Footer.tsx`) — there's no visible link to it.

### 4. How Cloudinary is wired up

- `src/lib/cloudinary.ts` configures the SDK from the `CLOUDINARY_*` env vars.
- `POST /api/upload` (admin-only) accepts a single file, validates its type
  (jpg/png/webp) and size (≤5MB), and uploads it to the `portfolio/projects` folder,
  returning `{ url, publicId }`.
- The admin dashboard's project form (`src/components/admin/ProjectFormModal.tsx`)
  calls `/api/upload` per selected file and stores the returned `{url, publicId}` pairs
  on the project document (a project can have multiple images — they open in the same
  gallery modal the public site already used).
- Deleting a project, or removing an image from it during an edit, deletes the
  matching Cloudinary asset via its `publicId` (see `src/app/api/projects/[id]/route.ts`)
  so nothing is orphaned in the media library.

### 5. Data model

See `src/models/Project.ts` for the full schema. Categories are one or more of:
`Mobile App`, `Web App`, `WordPress`, `Flutter`, `React`, `Next.js`, `Frontend`,
`Full Stack` — these also power the filter tabs on the public Projects section.
