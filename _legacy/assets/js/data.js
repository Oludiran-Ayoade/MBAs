// Course catalogue — Lead City University MBA, First Semester 2026/2027.
// `tag` is the Cloudinary tag used to group uploads for each course.
// `notes` lists pictorial reading pages (markdown files in /notes/<tag>/),
// each pinned to the week its lecture happened.
const COURSES = [
  {
    code: "MGT 709",
    tag: "mgt709",
    title: "Corporate Strategy",
    icon: "♟️",
    color: "#0b6fa4",
    desc: "Vision, mission, levels of strategy, competitive advantage and the strategy process.",
    notes: []
  },
  {
    code: "HRM 702",
    tag: "hrm702",
    title: "Human Resource Management",
    icon: "🧑‍🤝‍🧑",
    color: "#c2187b",
    desc: "Recruitment, performance management, motivation and employee development.",
    notes: []
  },
  {
    code: "BUS 706",
    tag: "bus706",
    title: "Organisational Behaviour",
    icon: "🧠",
    color: "#6a4fc8",
    desc: "Individual and group behaviour, leadership, culture and organisational structure.",
    notes: []
  },
  {
    code: "MBA 707",
    tag: "mba707",
    title: "General Management",
    icon: "🗂️",
    color: "#0f8a5f",
    desc: "Functions of management: planning, organising, leading and controlling.",
    notes: []
  },
  {
    code: "POM 702",
    tag: "pom702",
    title: "Operations Management",
    icon: "⚙️",
    color: "#d0722a",
    desc: "Process design, capacity, quality management and supply chains.",
    notes: []
  },
  {
    code: "MGT 701",
    tag: "mgt701",
    title: "Research Methods",
    icon: "🔬",
    color: "#b3335e",
    desc: "Research design, sampling, data collection and analysis for business research.",
    notes: []
  },
  {
    code: "MBA 702",
    tag: "mba702",
    title: "Digital Business & Technology Management",
    icon: "💻",
    color: "#1568b8",
    desc: "Digital transformation, e-business models and managing technology.",
    notes: []
  },
  {
    code: "MBA 704",
    tag: "mba704",
    title: "Management Economics",
    icon: "📈",
    color: "#3f7d0c",
    desc: "Demand, cost, pricing and market structures for managerial decisions.",
    notes: []
  }
];

// First Semester 2026/2027 — lecture weeks only, from the Postgraduate College
// calendar. Week 1 = Sep 28–Oct 4 (lectures began Oct 2); Week 18 = Feb 15–21
// (last lectures before revision). `n` is the week number used in upload tags.
const WEEKS = [
  { n: 1,  start: "2026-09-28", end: "2026-10-04", label: "Sep 28 – Oct 4",  note: "Lectures begin Oct 2" },
  { n: 2,  start: "2026-10-05", end: "2026-10-11", label: "Oct 5 – 11" },
  { n: 3,  start: "2026-10-12", end: "2026-10-18", label: "Oct 12 – 18" },
  { n: 4,  start: "2026-10-19", end: "2026-10-25", label: "Oct 19 – 25" },
  { n: 5,  start: "2026-10-26", end: "2026-11-01", label: "Oct 26 – Nov 1" },
  { n: 6,  start: "2026-11-02", end: "2026-11-08", label: "Nov 2 – 8" },
  { n: 7,  start: "2026-11-09", end: "2026-11-15", label: "Nov 9 – 15" },
  { n: 8,  start: "2026-11-16", end: "2026-11-22", label: "Nov 16 – 22" },
  { n: 9,  start: "2026-11-23", end: "2026-11-29", label: "Nov 23 – 29" },
  { n: 10, start: "2026-11-30", end: "2026-12-06", label: "Nov 30 – Dec 6" },
  { n: 11, start: "2026-12-07", end: "2026-12-13", label: "Dec 7 – 13",      note: "Convocation Dec 11–13" },
  { n: 12, start: "2026-12-14", end: "2026-12-20", label: "Dec 14 – 20",     note: "Convocation Dec 14–17" },
  { n: 13, start: "2027-01-11", end: "2027-01-17", label: "Jan 11 – 17",     note: "Resumption Jan 11" },
  { n: 14, start: "2027-01-18", end: "2027-01-24", label: "Jan 18 – 24" },
  { n: 15, start: "2027-01-25", end: "2027-01-31", label: "Jan 25 – 31" },
  { n: 16, start: "2027-02-01", end: "2027-02-07", label: "Feb 1 – 7" },
  { n: 17, start: "2027-02-08", end: "2027-02-14", label: "Feb 8 – 14" },
  { n: 18, start: "2027-02-15", end: "2027-02-21", label: "Feb 15 – 21" }
];

// First Semester 2026/2027 — key dates for the landing page timeline.
const IMPORTANT_DATES = [
  { date: "Sep 28", label: "First Semester Begins", type: "start" },
  { date: "Oct 2", label: "Commencement of Lectures", type: "start" },
  { date: "Dec 11–17", label: "Convocation Ceremonies", type: "event" },
  { date: "Dec 21 – Jan 8", label: "Christmas / New Year Break", type: "break" },
  { date: "Jan 11", label: "Resumption from Break", type: "start" },
  { date: "Feb 26 – Mar 4", label: "Revision", type: "event" },
  { date: "Mar 3", label: "Induction", type: "event" },
  { date: "Mar 5–19", label: "First Semester Examinations", type: "exam" }
];

// Which courses are taught in each week. Default: all 8 every lecture week —
// edit to match the real timetable, e.g. TIMETABLE[3] = ["mgt709", "mba707"].
const TIMETABLE = {};
WEEKS.forEach(w => { if (w.n) TIMETABLE[w.n] = COURSES.map(c => c.tag); });

function getCourse(tag) {
  return COURSES.find(c => c.tag === tag);
}

// The week the semester is currently in (or null outside the calendar).
function currentWeek() {
  const today = new Date().toISOString().slice(0, 10);
  return WEEKS.find(w => w.start && today >= w.start && today <= w.end) || null;
}
