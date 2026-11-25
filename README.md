# LCU MBA Notes Hub

A Next.js (App Router + TypeScript) site for Lead City University MBA students
to **view pictorial study pages** and **download lecture note PDFs** —
8 courses, First Semester 2026/2027.

Features: light/dark theme toggle, global search, recently-uploaded feed,
semester progress, per-course coverage, installable PWA (offline app shell),
sticky note TOC with reading time and print-friendly pages.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- Custom design system in `app/globals.css` (no Tailwind)
- **marked** renders the pictorial markdown notes
- **Cloudinary** unsigned uploads for student-submitted PDFs (no backend needed)

## Commands

```bash
npm run dev     # http://localhost:3000
npm run build   # production build + typecheck
npm run lint    # eslint
```

## Structure

```
app/                    routes — / (timetable), /course/[tag], /upload, /note/[tag]/[file]
components/             client components (Timetable, SearchBox, CourseView, …)
lib/data.ts             COURSES, WEEKS, TIMETABLE, Cloudinary helpers
lib/config.ts           Cloudinary credentials  ← EDIT THIS
public/notes/<tag>/*.md pictorial note pages (markdown + HTML blocks)
public/manifest.json, sw.js, icon.svg   PWA
_legacy/                the previous static-HTML version (safe to delete)
```

## Cloudinary setup (one-time, ~5 min)

1. Sign up at [cloudinary.com](https://cloudinary.com) — note your **cloud name**.
2. Settings → **Upload** → *Upload presets* → **Add upload preset** →
   **Signing Mode: Unsigned** → copy the preset name.
3. Settings → **Security** → **Resource list** → **Allowed**.
4. Paste both values into `lib/config.ts`.

Uploads land in `mba-notes/<tag>/w<n>` and group by course + week automatically.

### Enabling deletes (removing uploaded notes)

Deletes require a signed request with your **API secret**, which must stay
server-side. Create `.env.local` in the project root:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Find these in Cloudinary → Dashboard (top of page). Without these, the 🗑
button in the week popover will return an error.

## Adding a pictorial page

1. Write markdown in `public/notes/<tag>/your-topic.md`. Mix markdown with HTML —
   `pic-grid`/`pic-card` for visual cards, `callout tip|warn|info` for highlight
   boxes, inline `<svg>` for diagrams.
2. Register it in `lib/data.ts` under the course's `notes` array, pinned to the
   lecture week:
   ```ts
   { file: "your-topic", week: 3, title: "Your Topic", desc: "Short summary." }
   ```

Tip: paste a lecture PDF's text into an AI chat and ask for "pictorial markdown
study notes using pic-card and callout blocks".

## Lecture weeks

`lib/data.ts` → `WEEKS`: 14 lecture weeks, Week 1 = Oct 26–Nov 1 (lectures
actually began the last week of October) through Week 14 = Feb 15–25.
The Christmas break is excluded. `TIMETABLE` maps weeks → course tags
(default: all courses every week — edit to match the real lecture schedule).

## Deploy

Push to GitHub → import into Vercel (free). PWA install needs HTTPS.
