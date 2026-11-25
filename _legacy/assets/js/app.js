// Landing page: timetable grid + search + recent uploads + semester progress.
(function () {
  const cur = currentWeek();
  const lectWeeks = WEEKS.filter(w => w.n);
  const totalWeeks = lectWeeks.length;

  // --- Hero: current week pill + semester progress bar ---
  const weekNow = document.getElementById("weekNow");
  if (weekNow && cur && cur.n) {
    weekNow.textContent = `📅 Week ${cur.n} · ${cur.label} · MBA First Semester 2026/2027`;
  }
  const sp = document.getElementById("semProgress");
  if (sp && cur && cur.n) {
    const pct = Math.round((cur.n / totalWeeks) * 100);
    sp.innerHTML = `
      <div class="sp-track"><div class="sp-fill" style="width:${pct}%"></div></div>
      <div class="sp-label">Week ${cur.n} of ${totalWeeks} · ${pct}% through the semester</div>`;
  }

  // --- Cloudinary: fetch every course's uploads once (parallel) ---
  async function fetchTag(resourceType, tag) {
    const url = `https://res.cloudinary.com/${CONFIG.CLOUD_NAME}/${resourceType}/list/${encodeURIComponent(tag)}.json`;
    const res = await fetch(url);
    if (!res.ok) return [];
    return ((await res.json()).resources || []).map(r => ({ ...r, resource_type: resourceType }));
  }
  function weekOf(publicId) {
    const m = publicId.match(/\/w(\d+)\//);
    return m ? Number(m[1]) : null;
  }
  function prettyName(publicId) {
    return publicId.split("/").pop().replace(/[-_]+/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  }
  function viewUrl(r) {
    return `https://res.cloudinary.com/${CONFIG.CLOUD_NAME}/${r.resource_type}/upload/v${r.version}/${r.public_id}.${r.format}`;
  }

  async function allUploads() {
    if (CONFIG.CLOUD_NAME.startsWith("YOUR_")) return [];
    const lists = await Promise.all(COURSES.map(async c => {
      const files = (await Promise.all([
        fetchTag("image", c.tag).catch(() => []),
        fetchTag("raw", c.tag).catch(() => [])
      ])).flat();
      return files.map(r => ({ ...r, course: c, week: weekOf(r.public_id) }));
    }));
    return lists.flat();
  }

  // --- Timetable ---
  function cell(course, week, files) {
    const pages = course.notes.filter(n => n.week === week).length;
    const scheduled = (TIMETABLE[week] || []).includes(course.tag);
    const marks = [
      pages ? `📖${pages}` : "",
      files.length ? `📄${files.length}` : ""
    ].filter(Boolean).join(" ");
    const cls = ["tt-cell", scheduled ? "" : "tt-off", cur && cur.n === week ? "tt-cur" : ""].filter(Boolean).join(" ");
    return `<td class="${cls}">
      <a href="course.html?c=${course.tag}&w=${week}" title="${course.code} · ${course.title} — Week ${week}">
        ${marks || (scheduled ? "·" : "–")}
      </a>
    </td>`;
  }

  function renderTable(uploads) {
    const byCourseWeek = {};
    for (const r of uploads) {
      const k = r.course.tag + ":" + r.week;
      (byCourseWeek[k] = byCourseWeek[k] || []).push(r);
    }
    document.getElementById("timetable").innerHTML = `
      <div class="tt-scroll">
        <table class="tt-table">
          <thead>
            <tr>
              <th class="tt-course-col">Course</th>
              ${lectWeeks.map(w => `<th class="${cur && cur.n === w.n ? "tt-cur" : ""}" title="${w.label}">W${w.n}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${COURSES.map(c => `
              <tr>
                <th class="tt-course-col" style="--accent:${c.color}">
                  <a href="course.html?c=${c.tag}">${c.icon} ${c.code}</a>
                </th>
                ${lectWeeks.map(w => cell(c, w.n, byCourseWeek[c.tag + ":" + w.n] || [])).join("")}
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
      <p class="tt-legend">📖 pictorial page · 📄 uploaded PDF · tap a cell for that week's notes · scroll sideways →</p>`;
  }

  // --- Recently uploaded feed ---
  function timeAgo(iso) {
    const s = (Date.now() - new Date(iso)) / 1000;
    if (s < 3600) return Math.max(1, Math.round(s / 60)) + "m ago";
    if (s < 86400) return Math.round(s / 3600) + "h ago";
    return Math.round(s / 86400) + "d ago";
  }
  function renderRecent(uploads) {
    const recent = uploads
      .filter(r => r.created_at)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 6);
    if (!recent.length) return;
    document.getElementById("recentSection").classList.remove("hidden");
    document.getElementById("recentGrid").innerHTML = recent.map(r => `
      <a class="recent-item" href="${viewUrl(r)}" target="_blank" rel="noopener">
        <span class="r-ic">${r.course.icon}</span>
        <span>
          <span class="r-t">${prettyName(r.public_id)}</span><br>
          <span class="r-s">${r.course.code} · ${r.course.title}${r.week ? ` · Week ${r.week}` : ""}</span>
        </span>
        <span class="r-when">${timeAgo(r.created_at)}</span>
      </a>`).join("");
  }

  // --- Search ---
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  let uploadIndex = null; // lazily built on first search

  function staticIndex() {
    const idx = [];
    for (const c of COURSES) {
      idx.push({ icon: c.icon, title: `${c.code} · ${c.title}`, sub: "Course", href: `course.html?c=${c.tag}`, hay: `${c.code} ${c.title}`.toLowerCase() });
      for (const n of c.notes) {
        idx.push({ icon: "📖", title: n.title, sub: `${c.code} · Week ${n.week}`, href: `reader.html?c=${c.tag}&n=${encodeURIComponent(n.file)}`, hay: `${n.title} ${n.desc} ${c.code}`.toLowerCase() });
      }
    }
    return idx;
  }

  async function ensureUploadIndex() {
    if (uploadIndex) return uploadIndex;
    const uploads = await allUploads();
    uploadIndex = uploads.map(r => ({
      icon: "📄",
      title: prettyName(r.public_id),
      sub: `${r.course.code}${r.week ? ` · Week ${r.week}` : ""} · ${r.format.toUpperCase()}`,
      href: viewUrl(r),
      ext: true,
      hay: `${prettyName(r.public_id)} ${r.course.code}`.toLowerCase()
    }));
    return uploadIndex;
  }

  function showResults(items) {
    if (!items.length) {
      searchResults.innerHTML = `<div class="sr-none">No matches found.</div>`;
    } else {
      searchResults.innerHTML = items.slice(0, 12).map(i => `
        <a class="sr-item" href="${i.href}" ${i.ext ? 'target="_blank" rel="noopener"' : ""}>
          <span class="sr-ic">${i.icon}</span>
          <span><span class="sr-t">${i.title}</span><br><span class="sr-s">${i.sub}</span></span>
        </a>`).join("");
    }
    searchResults.classList.add("open");
  }

  let searchTimer;
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();
    clearTimeout(searchTimer);
    if (q.length < 2) { searchResults.classList.remove("open"); return; }
    searchTimer = setTimeout(async () => {
      const idx = staticIndex().concat(await ensureUploadIndex());
      showResults(idx.filter(i => i.hay.includes(q)));
    }, 180);
  });
  document.addEventListener("click", e => {
    if (!e.target.closest(".search-wrap")) searchResults.classList.remove("open");
  });

  // --- Important dates timeline ---
  const tl = document.getElementById("timeline");
  if (tl) {
    tl.innerHTML = IMPORTANT_DATES.map(d => `
      <div class="tl-item tl-${d.type}">
        <span class="date">${d.date}</span>
        <span class="label">${d.label}</span>
      </div>`).join("");
  }

  // Render immediately, then repaint with upload counts + fill the feed.
  renderTable([]);
  allUploads().then(u => { renderTable(u); renderRecent(u); });
})();
