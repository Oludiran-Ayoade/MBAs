// Course catalogue - Lead City University MBA, First Semester 2026/2027.
// `tag` is the Cloudinary tag used to group uploads for each course.
// `notes` lists pictorial reading pages (markdown files in /public/notes/<tag>/),
// each pinned to the week its lecture happened.

export interface NotePage {
  file: string;
  week: number;
  title: string;
  desc: string;
}

export interface Course {
  code: string;
  tag: string;
  title: string;
  icon: string;
  color: string;
  desc: string;
  notes: NotePage[];
}

export const COURSES: Course[] = [
  { code: "MGT 709", tag: "mgt709", title: "Corporate Strategy", icon: "♟️", color: "#2563eb",
    desc: "Vision, mission, levels of strategy, competitive advantage and the strategy process.", notes: [] },
  { code: "HRM 702", tag: "hrm702", title: "Human Resource Management", icon: "🧑‍🤝‍🧑", color: "#db2777",
    desc: "Recruitment, performance management, motivation and employee development.", notes: [] },
  { code: "BUS 706", tag: "bus706", title: "Organisational Behaviour", icon: "🧠", color: "#7c3aed",
    desc: "Individual and group behaviour, leadership, culture and organisational structure.", notes: [] },
  { code: "MBA 707", tag: "mba707", title: "General Management", icon: "🗂️", color: "#0891b2",
    desc: "Functions of management: planning, organising, leading and controlling.", notes: [] },
  { code: "POM 702", tag: "pom702", title: "Operations Management", icon: "⚙️", color: "#ea580c",
    desc: "Process design, capacity, quality management and supply chains.", notes: [] },
  { code: "MGT 701", tag: "mgt701", title: "Research Methods", icon: "🔬", color: "#16a34a",
    desc: "Research design, sampling, data collection and analysis for business research.", notes: [] },
  { code: "MBA 702", tag: "mba702", title: "Digital Business & Technology Management", icon: "💻", color: "#0d9488",
    desc: "Digital transformation, e-business models and managing technology.", notes: [] },
  { code: "MBA 704", tag: "mba704", title: "Management Economics", icon: "📈", color: "#ca8a04",
    desc: "Demand, cost, pricing and market structures for managerial decisions.", notes: [] }
];

// First Semester 2026/2027 - lecture weeks only.
// Lectures actually began the last week of October (Week 1 = Oct 26-Nov 1)
// and run to Feb 25, the day before revision. The Christmas break
// (Dec 21 - Jan 8) is excluded. `n` is the week number used in upload tags.
export interface Week {
  n: number | null;
  start?: string;
  end?: string;
  label: string;
  note?: string;
}

export const WEEKS: Week[] = [
  { n: 1,  start: "2026-10-26", end: "2026-11-01", label: "Oct 26 - Nov 1",  note: "Lectures begin" },
  { n: 2,  start: "2026-11-02", end: "2026-11-08", label: "Nov 2 - 8" },
  { n: 3,  start: "2026-11-09", end: "2026-11-15", label: "Nov 9 - 15" },
  { n: 4,  start: "2026-11-16", end: "2026-11-22", label: "Nov 16 - 22" },
  { n: 5,  start: "2026-11-23", end: "2026-11-29", label: "Nov 23 - 29" },
  { n: 6,  start: "2026-11-30", end: "2026-12-06", label: "Nov 30 - Dec 6" },
  { n: 7,  start: "2026-12-07", end: "2026-12-13", label: "Dec 7 - 13",      note: "Convocation Dec 11-13" },
  { n: 8,  start: "2026-12-14", end: "2026-12-20", label: "Dec 14 - 20",     note: "Convocation Dec 14-17" },
  { n: 9,  start: "2027-01-11", end: "2027-01-17", label: "Jan 11 - 17",     note: "Resumption Jan 11" },
  { n: 10, start: "2027-01-18", end: "2027-01-24", label: "Jan 18 - 24" },
  { n: 11, start: "2027-01-25", end: "2027-01-31", label: "Jan 25 - 31" },
  { n: 12, start: "2027-02-01", end: "2027-02-07", label: "Feb 1 - 7" },
  { n: 13, start: "2027-02-08", end: "2027-02-14", label: "Feb 8 - 14" },
  { n: 14, start: "2027-02-15", end: "2027-02-25", label: "Feb 15 - 25",     note: "Lectures end Feb 25" }
];

// First Semester 2026/2027 - key dates for the landing page timeline.
export interface ImportantDate { date: string; label: string; type: "start" | "event" | "break" | "exam"; }

export const IMPORTANT_DATES: ImportantDate[] = [
  { date: "Sep 28", label: "First Semester Begins", type: "start" },
  { date: "Oct 26", label: "Commencement of Lectures", type: "start" },
  { date: "Dec 11-17", label: "Convocation Ceremonies", type: "event" },
  { date: "Dec 21 - Jan 8", label: "Christmas / New Year Break", type: "break" },
  { date: "Jan 11", label: "Resumption from Break", type: "start" },
  { date: "Feb 26 - Mar 4", label: "Revision", type: "event" },
  { date: "Mar 3", label: "Induction", type: "event" },
  { date: "Mar 5-19", label: "First Semester Examinations", type: "exam" }
];

// Which courses are taught in each week. Default: all 8 every lecture week -
// edit to match the real timetable, e.g. TIMETABLE[3] = ["mgt709", "mba707"].
export const TIMETABLE: Record<number, string[]> = {};
WEEKS.forEach(w => { if (w.n) TIMETABLE[w.n] = COURSES.map(c => c.tag); });

export function getCourse(tag: string | null | undefined): Course | undefined {
  return COURSES.find(c => c.tag === tag);
}

// The week the semester is currently in (or undefined outside lecture weeks).
export function currentWeek(): Week | undefined {
  const today = new Date().toISOString().slice(0, 10);
  return WEEKS.find(w => w.start && w.end && today >= w.start && today <= w.end);
}

// ---- Cloudinary helpers shared by client components ----
export interface CloudResource {
  public_id: string;
  version: number;
  format: string;
  resource_type: string;
  created_at?: string;
  bytes?: number;
  tags?: string[];
}

export function prettyName(publicId: string): string {
  // Drop the file extension first (raw public_ids carry it), then strip
  // Cloudinary's unique suffix - always the last "_xxxxxx" token on uploads.
  // 5-char tails only strip when they mix letters+digits so real word
  // suffixes (_notes, _final) survive.
  const stem = publicId.split("/").pop()!.replace(/\.[a-z0-9]{1,6}$/i, "");
  const stripped = stem.replace(/_([a-z0-9]{5,8})$/i, (m, s) =>
    s.length >= 6 || (/\d/.test(s) && /[a-z]/i.test(s)) ? "" : m);
  return stripped
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, ch => ch.toUpperCase());
}

// Normalize a filename for duplicate comparison - strips extension,
// Cloudinary's auto-suffix (e.g. "_a1b2c3") and punctuation.
export function nameKey(name: string): string {
  return name
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/_[a-z0-9]{5,8}$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

export function weekOfResource(r: CloudResource): number | null {
  const m = r.public_id.match(/\/w(\d+)\//) ||
    (r.tags || []).map(t => t.match(/^w(\d+)$/)).find(Boolean);
  return m ? Number(m[1]) : null;
}

export function isPastQuestion(r: CloudResource): boolean {
  return r.public_id.includes("/past-questions/") || (r.tags || []).includes("pq");
}

export function isLikelyQuestion(r: CloudResource): boolean {
  return r.public_id.includes("/likely-questions/") || (r.tags || []).includes("lq");
}

// Extension suffix for a delivery URL. Cloudinary is inconsistent: list-API
// raw resources carry the ext inside public_id ("name.docx"), while upload
// responses return it separately (public_id "name", format "docx"). Append
// ".<format>" only when the public_id doesn't already end with it - this
// fixes both ".docx.docx" (double ext) and "name." (trailing dot).
function extOf(r: CloudResource): string {
  const ext = r.format ? `.${r.format}` : "";
  if (!ext || r.public_id.toLowerCase().endsWith(ext.toLowerCase())) return "";
  return ext;
}

export function viewUrl(r: CloudResource, cloud: string): string {
  return `https://res.cloudinary.com/${cloud}/${r.resource_type}/upload/v${r.version}/${r.public_id}${extOf(r)}`;
}

export function downloadUrl(r: CloudResource, cloud: string): string {
  return `https://res.cloudinary.com/${cloud}/${r.resource_type}/upload/fl_attachment/v${r.version}/${r.public_id}${extOf(r)}`;
}

// Browsers can't render Word/Office files inline - route them through the
// Google Docs viewer (the /gview endpoint; /viewer downloads a stub file
// named "viewer" instead of rendering). Everything else (pdf, txt, images)
// renders natively from the direct URL, so skip the detour.
const OFFICE_EXT = /\.(docx?|pptx?|xlsx?|odt|ods|odp|rtf)$/i;
export function previewUrl(r: CloudResource, cloud: string): string {
  const direct = viewUrl(r, cloud);
  if (r.resource_type !== "raw" || !OFFICE_EXT.test(r.public_id)) return direct;
  return `https://docs.google.com/gview?url=${encodeURIComponent(direct)}&embedded=true`;
}

// Client-side preview open with a preflight HEAD request. When Google can't
// fetch the file (deleted, stale row) gview answers `204 application/binary`
// and Chrome shows a failed "gview" download - checking first turns that
// into a clean toast. Returns false when the file is gone.
// The window is opened synchronously (inside the click) then navigated after
// the check, so popup blockers stay happy.
export async function openPreview(r: CloudResource, cloud: string): Promise<boolean> {
  const w = window.open("", "_blank");
  try {
    const res = await fetch(viewUrl(r, cloud), { method: "HEAD" });
    if (!res.ok) { w?.close(); return false; }
  } catch {
    // network blip - still try to open
  }
  const url = previewUrl(r, cloud);
  if (w) w.location.href = url; else window.location.href = url;
  return true;
}

export function fmtBytes(b?: number): string {
  if (!b) return "";
  return b > 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB";
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// Node's fetch (undici) sends Accept-Encoding with brotli, which makes
// Cloudinary's list endpoint return 404. The https module doesn't.
function serverFetch(url: string): Promise<{ ok: boolean; status: number; json: () => Promise<any> }> {
  return new Promise((resolve, reject) => {
    const https = require("https");
    https.get(url, (res: any) => {
      let data = "";
      res.on("data", (c: Buffer) => data += c);
      res.on("end", () => resolve({
        ok: res.statusCode === 200,
        status: res.statusCode,
        json: async () => JSON.parse(data)
      }));
    }).on("error", reject);
  });
}

export async function fetchTag(cloud: string, resourceType: string, tag: string): Promise<CloudResource[]> {
  // Browsers can't hit res.cloudinary.com directly - its list endpoint 404s
  // whenever Accept-Encoding includes brotli (which all browsers send and
  // fetch() can't override). /api/list proxies it brotli-free. The _ param
  // busts the browser cache so fresh uploads show immediately.
  const url = typeof window === "undefined"
    ? `https://res.cloudinary.com/${cloud}/${resourceType}/list/${encodeURIComponent(tag)}.json`
    : `/api/list?tag=${encodeURIComponent(tag)}&type=${resourceType}&_=${Date.now()}`;
  const doFetch = typeof window === "undefined" ? serverFetch : (u: string) => fetch(u);
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await doFetch(url);
      if (res.ok) {
        const data = await res.json();
        return (data.resources || []).map((r: CloudResource) => ({ ...r, resource_type: resourceType }));
      }
      // 404 = tag has no resources yet - expected, not an error. Other 4xx
      // (bad config) won't heal on retry either. Both bail out quietly.
      if (res.status < 500 && res.status !== 429) return [];
    } catch {
      // network blip - fall through to retry
    }
    if (attempt < 2) await sleep(600 * (attempt + 1));
  }
  throw new Error(`fetchTag ${resourceType}/${tag} failed`);
}

export interface UploadItem extends CloudResource {
  course: Course;
  week: number | null;
}

// Stable key for a resource - used for delete-selection sets.
export function rid(r: CloudResource): string {
  return `${r.resource_type}|${r.public_id}|${r.version}`;
}

// Every uploaded file across all courses, in parallel.
export async function allUploads(cloud: string): Promise<UploadItem[]> {
  if (!cloud || cloud.startsWith("YOUR_")) return [];
  const lists = await Promise.all(COURSES.map(async c => {
    const files = (await Promise.all([
      fetchTag(cloud, "image", c.tag).catch(() => [] as CloudResource[]),
      fetchTag(cloud, "raw", c.tag).catch(() => [] as CloudResource[])
    ])).flat();
    return files.map(r => ({ ...r, course: c, week: weekOfResource(r) }));
  }));
  return lists.flat();
}

// Shared per-cloud cache - Timetable, SearchBox and RecentUploads all need
// the same list; without this the homepage fires 3x the requests.
// 60s TTL so uploads made in another tab/page show up on revisit.
let uploadsCache: { at: number; p: Promise<UploadItem[]> } | null = null;
export function allUploadsCached(cloud: string): Promise<UploadItem[]> {
  if (!uploadsCache || Date.now() - uploadsCache.at > 60_000) {
    uploadsCache = { at: Date.now(), p: allUploads(cloud) };
    uploadsCache.p.catch(() => { uploadsCache = null; });
  }
  return uploadsCache.p;
}
