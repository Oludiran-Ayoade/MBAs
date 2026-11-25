"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { COURSES, allUploadsCached, prettyName, previewUrl } from "@/lib/data";
import { CONFIG } from "@/lib/config";
import { BookOpenText, MagnifyingGlass } from "@/components/Icons";
import { CourseIcon, FileIcon } from "@/components/Icons";

interface Result {
  icon: ReactNode;
  title: string;
  sub: string;
  href: string;
  ext?: boolean;
  hay: string;
}

function staticIndex(): Result[] {
  const idx: Result[] = [];
  for (const c of COURSES) {
    idx.push({
      icon: <CourseIcon tag={c.tag} size={16} />, title: `${c.code} · ${c.title}`, sub: "Course",
      href: `/course/${c.tag}`, hay: `${c.code} ${c.title}`.toLowerCase()
    });
    for (const n of c.notes) {
      idx.push({
        icon: <BookOpenText size={16} />, title: n.title, sub: `${c.code} · Week ${n.week}`,
        href: `/note/${c.tag}/${encodeURIComponent(n.file)}`,
        hay: `${n.title} ${n.desc} ${c.code}`.toLowerCase()
      });
    }
  }
  return idx;
}

// Derived fresh from allUploadsCached — that cache carries the 60s TTL, so
// search results pick up new uploads instead of going permanently stale.
function uploadIndex(): Promise<Result[]> {
  return allUploadsCached(CONFIG.CLOUD_NAME).then(rs =>
    rs.map(r => ({
      icon: <FileIcon format={r.format} size={16} />, title: prettyName(r.public_id),
      sub: `${r.course.code}${r.week ? ` · Week ${r.week}` : ""} · ${(r.format || "").toUpperCase()}`,
      href: previewUrl(r, CONFIG.CLOUD_NAME), ext: true,
      hay: `${prettyName(r.public_id)} ${r.course.code}`.toLowerCase()
    }))
  );
}

export default function SearchBox() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[] | null>(null);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const query = q.trim().toLowerCase();
    if (query.length < 2) { setResults(null); setOpen(false); return; }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const idx = staticIndex().concat(await uploadIndex().catch(() => []));
      setResults(idx.filter(i => i.hay.includes(query)));
      setOpen(true);
    }, 180);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [q]);

  return (
    <div className="search-wrap" ref={wrapRef}>
      <span className="s-icon"><MagnifyingGlass size={17} weight="bold" /></span>
      <input
        className="search-input"
        type="search"
        placeholder="Search courses, topics, uploaded notes…"
        autoComplete="off"
        value={q}
        onChange={e => setQ(e.target.value)}
        onFocus={() => results && setOpen(true)}
      />
      <div className={`search-results${open ? " open" : ""}`}>
        {results && (results.length ? results.slice(0, 12).map(r => (
          <a key={r.href + r.title} className="sr-item" href={r.href} {...(r.ext ? { target: "_blank", rel: "noopener" } : {})}>
            <span className="sr-ic">{r.icon}</span>
            <span><span className="sr-t">{r.title}</span><br /><span className="sr-s">{r.sub}</span></span>
          </a>
        )) : <div className="sr-none">No matches found.</div>)}
      </div>
    </div>
  );
}
