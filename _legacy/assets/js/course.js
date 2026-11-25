// Course page: week-by-week list — pictorial pages + shared PDFs per week.
(function () {
  const params = new URLSearchParams(location.search);
  const course = getCourse(params.get("c"));

  if (!course) {
    document.getElementById("courseTitle").textContent = "Course not found";
    document.getElementById("courseDesc").textContent = "Go back and pick a valid course.";
    return;
  }

  document.title = `${course.code} · ${course.title} — LCU MBA Notes Hub`;
  document.getElementById("courseHero").style.setProperty("--accent", course.color);
  document.getElementById("courseCode").textContent = course.code;
  document.getElementById("courseTitle").textContent = `${course.icon} ${course.title}`;
  document.getElementById("courseDesc").textContent = course.desc;

  const weekList = document.getElementById("weekList");
  const pdfStatus = document.getElementById("pdfStatus");
  const current = currentWeek();
  const today = new Date().toISOString().slice(0, 10);

  function prettyName(publicId) {
    return publicId.split("/").pop()
      .replace(/[-_]+/g, " ").replace(/\b\w/g, ch => ch.toUpperCase());
  }
  function fmtBytes(b) {
    if (!b) return "";
    return b > 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB";
  }
  // Files upload to folder mba-notes/<tag>/w<n> — read the week from the path or tags.
  function weekOf(r) {
    const m = r.public_id.match(/\/w(\d+)\//) || (r.tags || []).map(t => t.match(/^w(\d+)$/)).find(Boolean);
    return m ? Number(m[1]) : null;
  }
  function viewUrl(r) {
    return `https://res.cloudinary.com/${CONFIG.CLOUD_NAME}/${r.resource_type}/upload/v${r.version}/${r.public_id}.${r.format}`;
  }
  function downloadUrl(r) {
    return `https://res.cloudinary.com/${CONFIG.CLOUD_NAME}/${r.resource_type}/upload/fl_attachment/v${r.version}/${r.public_id}.${r.format}`;
  }

  async function fetchTag(resourceType) {
    const url = `https://res.cloudinary.com/${CONFIG.CLOUD_NAME}/${resourceType}/list/${encodeURIComponent(course.tag)}.json`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.resources || []).map(r => ({ ...r, resource_type: resourceType }));
  }

  async function loadPdfs() {
    if (CONFIG.CLOUD_NAME.startsWith("YOUR_")) return new Map();
    try {
      const results = await Promise.all([
        fetchTag("image").catch(() => []),
        fetchTag("raw").catch(() => [])
      ]);
      const byWeek = new Map();
      for (const r of results.flat()) {
        const w = weekOf(r);
        if (!byWeek.has(w)) byWeek.set(w, []);
        byWeek.get(w).push(r);
      }
      return byWeek;
    } catch (e) {
      pdfStatus.innerHTML = `<div class="notice">Couldn't load shared notes — check the Cloudinary config (see README.md).</div>`;
      return new Map();
    }
  }

  function badge(w) {
    if (!w.start) return "";
    if (current && current.n === w.n) return `<span class="wk-badge wk-now">This week</span>`;
    if (today > w.end) return `<span class="wk-badge wk-past">Done</span>`;
    return `<span class="wk-badge wk-next">Upcoming</span>`;
  }

  function pdfRows(files) {
    return files.map(r => `
      <div class="wk-row">
        <span class="wk-ic">📄</span>
        <span class="wk-name">${prettyName(r.public_id)} <small>${r.format.toUpperCase()} · ${fmtBytes(r.bytes)}</small></span>
        <a class="wk-link" href="${viewUrl(r)}" target="_blank" rel="noopener">View</a>
        <a class="wk-link dl" href="${downloadUrl(r)}">⬇ Download</a>
      </div>`).join("");
  }

  function pageRows(notes) {
    return notes.map(n => `
      <a class="wk-row wk-page" href="reader.html?c=${course.tag}&n=${encodeURIComponent(n.file)}">
        <span class="wk-ic">📖</span>
        <span class="wk-name">${n.title} <small>${n.desc}</small></span>
        <span class="wk-link">Read →</span>
      </a>`).join("");
  }

  function renderCoverage(pdfsByWeek) {
    const lectWeeks = WEEKS.filter(w => w.n);
    const covered = lectWeeks.filter(w =>
      course.notes.some(n => n.week === w.n) || (pdfsByWeek.get(w.n) || []).length
    ).length;
    document.getElementById("coverage").innerHTML =
      lectWeeks.map(w => {
        const has = course.notes.some(n => n.week === w.n) || (pdfsByWeek.get(w.n) || []).length;
        const cls = ["cov-dot", has ? "has" : "", current && current.n === w.n ? "now" : ""].filter(Boolean).join(" ");
        return `<a class="${cls}" style="--accent:${course.color}" href="#w${w.n}"
                   title="Week ${w.n} · ${w.label}${has ? " · has notes" : ""}">${w.n}</a>`;
      }).join("") +
      `<span class="cov-label">${covered}/${lectWeeks.length} weeks covered</span>`;
  }

  function renderWeeks(pdfsByWeek) {
    weekList.innerHTML = WEEKS.map(w => {
      // Non-teaching entries (break, exams) render as slim dividers.
      if (!w.n) {
        return `<div class="wk-divider wk-${w.type}"><b>${w.title}</b><span>${w.label}</span></div>`;
      }
      const files = pdfsByWeek.get(w.n) || [];
      const notes = course.notes.filter(n => n.week === w.n);
      const hasContent = files.length + notes.length > 0;
      const target = Number(params.get("w")) === w.n;
      const open = hasContent || target || (current && current.n === w.n) ? " open" : "";
      const body = hasContent
        ? pageRows(notes) + pdfRows(files)
        : `<div class="wk-empty">Nothing uploaded yet —
             <a href="upload.html?c=${course.tag}&w=${w.n}">add this week's note</a></div>`;
      return `
        <details class="wk"${open}>
          <summary id="w${w.n}">
            <span class="wk-num">Week ${w.n}</span>
            <span class="wk-dates">${w.label}${w.note ? ` · <em>${w.note}</em>` : ""}</span>
            ${badge(w)}
            <span class="wk-count">${hasContent ? `${notes.length + files.length} item${notes.length + files.length === 1 ? "" : "s"}` : ""}</span>
          </summary>
          <div class="wk-body">${body}</div>
        </details>`;
    }).join("");

    // Deep link: ?w=n scrolls to and opens that week.
    const targetWeek = params.get("w");
    if (targetWeek) {
      const el = document.getElementById("w" + targetWeek);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  if (CONFIG.CLOUD_NAME.startsWith("YOUR_")) {
    pdfStatus.innerHTML = `<div class="notice">Cloudinary isn't configured yet — shared PDFs won't load until you add your credentials in <code>assets/js/config.js</code> (see README.md).</div>`;
  }
  loadPdfs().then(pdfs => { renderCoverage(pdfs); renderWeeks(pdfs); });
})();
