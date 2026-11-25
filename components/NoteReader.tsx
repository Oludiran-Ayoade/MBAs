"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { marked } from "marked";
import { getCourse } from "@/lib/data";
import { Clock, FileText } from "@/components/Icons";
import { CourseIcon } from "@/components/Icons";

function slugify(t: string) {
  return t.toLowerCase().replace(/[^\w]+/g, "-").replace(/^-|-$/g, "");
}

export default function NoteReader({ tag, file }: { tag: string; file: string }) {
  const course = getCourse(tag);
  const [html, setHtml] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [heads, setHeads] = useState<{ id: string; text: string; h3: boolean }[]>([]);

  useEffect(() => {
    if (!course) { setMissing(true); return; }
    fetch(`/notes/${course.tag}/${file}.md`)
      .then(res => { if (!res.ok) throw new Error("nf"); return res.text(); })
      .then(md => setHtml(marked.parse(md, { async: false }) as string))
      .catch(() => setMissing(true));
  }, [course, file]);

  // After render: anchor ids on headings + collect them for the TOC
  useEffect(() => {
    if (!html || !contentRef.current) return;
    const els = contentRef.current.querySelectorAll("h2, h3");
    const used = new Set<string>();
    const list: { id: string; text: string; h3: boolean }[] = [];
    els.forEach(h => {
      let id = slugify(h.textContent || "");
      while (used.has(id)) id += "-x";
      used.add(id);
      h.id = id;
      list.push({ id, text: h.textContent || "", h3: h.tagName === "H3" });
    });
    setHeads(list);
  }, [html]);

  const mins = useMemo(() => {
    if (!html) return 0;
    const words = html.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  }, [html]);

  const idx = course?.notes.findIndex(n => n.file === file) ?? -1;
  const prev = idx > 0 ? course!.notes[idx - 1] : null;
  const next = course && idx >= 0 && idx < course.notes.length - 1 ? course.notes[idx + 1] : null;
  const note = course?.notes.find(n => n.file === file);
  const title = note?.title || "Note";

  if (!course || missing) {
    return (
      <main className="wrap section">
        <div className="empty-state"><div className="big"><FileText size={40} weight="duotone" /></div>This note doesn't exist yet. <Link href="/">Back to courses</Link></div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="wrap">
        <div className="breadcrumb">
          <Link href="/">Courses</Link> / <Link href={`/course/${course.tag}`}>{course.code} · {course.title}</Link>
        </div>
        <div className="reader-layout">
          <nav className="toc">
            {heads.length > 2 && (
              <>
                <b>On this page</b>
                {heads.map(h => (
                  <a key={h.id} href={`#${h.id}`} style={h.h3 ? { paddingLeft: 24 } : undefined}>{h.text}</a>
                ))}
              </>
            )}
          </nav>
          <div>
            <article className="reader" ref={contentRef}>
              {html ? (
                <>
                  <div className="note-meta">
                    <span className="ic" style={{ gap: 5 }}><Clock size={13} /> {mins} min read</span><span>·</span><span className="ic" style={{ gap: 5 }}><CourseIcon tag={course.tag} size={13} /> {course.code} · {course.title}</span>
                    <span>·</span><span>Week {note?.week}</span>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: html }} />
                </>
              ) : (
                <div className="empty-state">Loading…</div>
              )}
            </article>
            <div className="pn-nav">
              {prev
                ? <Link href={`/note/${course.tag}/${encodeURIComponent(prev.file)}`}>← {prev.title}</Link>
                : <span />}
              {next && <Link className="next" href={`/note/${course.tag}/${encodeURIComponent(next.file)}`}>{next.title} →</Link>}
            </div>
            <div style={{ margin: "24px 0 40px" }}>
              <Link className="btn btn-outline btn-sm" href={`/course/${course.tag}`}>← Back to {course.code}</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
