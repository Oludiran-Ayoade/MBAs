// Reader: renders /notes/<tag>/<file>.md with TOC, reading time, prev/next.
(function () {
  const params = new URLSearchParams(location.search);
  const tag = params.get("c");
  const file = params.get("n");
  const course = getCourse(tag);
  const content = document.getElementById("content");
  const crumb = document.getElementById("crumb");
  const backLink = document.getElementById("backLink");
  const toc = document.getElementById("toc");
  const pnNav = document.getElementById("pnNav");

  if (course) {
    crumb.innerHTML = `<a href="index.html">Courses</a> / <a href="course.html?c=${course.tag}">${course.code} · ${course.title}</a>`;
    backLink.href = `course.html?c=${course.tag}`;
  }

  if (!course || !file) {
    content.innerHTML = `<div class="empty-state"><div class="big">🤔</div>Note not found. <a href="index.html">Back to courses</a></div>`;
    return;
  }

  function slugify(t) {
    return t.toLowerCase().replace(/[^\w]+/g, "-").replace(/^-|-$/g, "");
  }

  function decorate() {
    // Heading anchors + sticky TOC
    const heads = content.querySelectorAll("h2, h3");
    if (heads.length > 2) {
      const used = new Set();
      heads.forEach(h => {
        let id = slugify(h.textContent);
        while (used.has(id)) id += "-x";
        used.add(id);
        h.id = id;
      });
      toc.innerHTML = `<b>On this page</b>` + [...heads].map(h =>
        `<a href="#${h.id}" style="${h.tagName === "H3" ? "padding-left:24px" : ""}">${h.textContent}</a>`
      ).join("");
    }

    // Reading time under the title
    const words = content.textContent.trim().split(/\s+/).length;
    const mins = Math.max(1, Math.round(words / 200));
    const h1 = content.querySelector("h1");
    if (h1) {
      h1.insertAdjacentHTML("afterend",
        `<div class="note-meta"><span>⏱️ ${mins} min read</span><span>·</span><span>${course.icon} ${course.code} · ${course.title}</span></div>`);
    }
  }

  function prevNext() {
    const i = course.notes.findIndex(n => n.file === file);
    if (i === -1) return;
    const prev = course.notes[i - 1];
    const next = course.notes[i + 1];
    pnNav.innerHTML =
      (prev ? `<a href="reader.html?c=${course.tag}&n=${encodeURIComponent(prev.file)}">← ${prev.title}</a>` : "<span></span>") +
      (next ? `<a class="next" href="reader.html?c=${course.tag}&n=${encodeURIComponent(next.file)}">${next.title} →</a>` : "");
  }

  fetch(`notes/${course.tag}/${file}.md`)
    .then(res => {
      if (!res.ok) throw new Error("not found");
      return res.text();
    })
    .then(md => {
      content.innerHTML = marked.parse(md);
      const h1 = content.querySelector("h1");
      if (h1) document.title = `${h1.textContent} — ${course.code} · LCU MBA Notes Hub`;
      decorate();
      prevNext();
    })
    .catch(() => {
      content.innerHTML = `<div class="empty-state"><div class="big">📄</div>This note doesn't exist yet. <a href="course.html?c=${course.tag}">Back to ${course.code}</a></div>`;
    });
})();
