# LCU MBA Notes Hub

A static site for Lead City University MBA students to **view pictorial study pages** and **download lecture note PDFs** — 8 courses, First Semester 2026/2027.

Features: light/dark theme toggle, global search, recently-uploaded feed,
semester progress, per-course coverage, installable PWA (offline app shell),
sticky note TOC with reading time and print-friendly pages.

## Files

```
index.html          Landing — timetable grid, search, recent uploads, calendar
course.html?c=tag   Course page — coverage strip + week-by-week notes
upload.html         Anyone uploads notes here (pick course + week)
reader.html         Pictorial notes with TOC, reading time, prev/next
manifest.json, sw.js, assets/icon.svg   PWA (installable, offline shell)
assets/js/data.js   Courses, WEEKS calendar, note manifest  ← edit to add weeks/notes
assets/js/config.js Your Cloudinary credentials  ← EDIT THIS
notes/<tag>/*.md    Pictorial note pages (markdown + HTML blocks)
```

## How weeks work

`assets/js/data.js` defines `WEEKS` — Week 1 = Sep 28–Oct 4 (lectures began
Oct 2) through Week 18 = Feb 15–21 (last lecture week before revision), with
the Christmas break, revision and exam periods shown as dividers. Each course
page lists every week; notes appear under the week their lecture happened.
The current week is highlighted automatically.

Uploads are filed to Cloudinary folder `mba-notes/<tag>/w<n>` and tagged
`<tag>` + `w<n>` — the course page groups them by week automatically.

## Cloudinary setup (one-time, ~5 min)

Uploads and file listing need a free Cloudinary account:

1. Sign up at [cloudinary.com](https://cloudinary.com) — note your **cloud name**
   (Dashboard → top of page).
2. **Create an unsigned upload preset:**
   Settings (⚙️) → **Upload** → *Upload presets* → **Add upload preset** →
   set **Signing Mode: Unsigned** → Save. Copy the preset name.
3. **Enable resource listing** (lets the site list uploaded files):
   Settings → **Security** → find **Resource list** → set to **Allowed**.
4. Open `assets/js/config.js` and paste both values:
   ```js
   CLOUD_NAME: "your_cloud_name",
   UPLOAD_PRESET: "your_unsigned_preset"
   ```

That's it — uploads are tagged per course and week (`mgt709` + `w3`) and the
course pages group them automatically.

## Adding a pictorial page

1. Write a markdown file in `notes/<tag>/your-topic.md` (create the folder —
   it matches the course tag, e.g. `notes/mgt709/`). You can mix markdown
   with HTML blocks — `pic-grid`/`pic-card` for visual cards, `callout
   tip|warn|info` for highlight boxes, and inline `<svg>` for diagrams.
2. Register it in `assets/js/data.js` under the course's `notes` array,
   pinned to the lecture week:
   ```js
   { file: "your-topic", week: 3, title: "Your Topic", desc: "Short summary." }
   ```

Tip: paste a lecture PDF's text into ChatGPT/Claude and ask for "pictorial
markdown study notes using pic-card and callout blocks" — then drop the
result into `notes/<tag>/`.

## Run locally

```bash
cd MBAs && python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy free

Push to GitHub → enable **GitHub Pages**, or drag the folder onto
[netlify.com/drop](https://app.netlify.com/drop). No build step needed.
