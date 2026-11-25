"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { COURSES, TIMETABLE, WEEKS, allUploadsCached, currentWeek, isPastQuestion, isLikelyQuestion, type UploadItem, type Week } from "@/lib/data";
import { CONFIG } from "@/lib/config";
import WeekCell from "@/components/WeekCell";
import { BookOpenText, FileText, Notebook, Plus, Target } from "@/components/Icons";
import { CourseIcon } from "@/components/Icons";

export default function Timetable() {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [cur, setCur] = useState<Week | undefined>();
  const [lastSeen, setLastSeen] = useState<string | null>(null);
  const lectWeeks = WEEKS.filter(w => w.n);
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const didScroll = useRef(false);

  useEffect(() => {
    setCur(currentWeek());
    // "New since last visit" — read the previous stamp, then write the new
    // one after a delay (StrictMode double-mount would otherwise stamp twice
    // and the second read would see the first write, hiding everything).
    setLastSeen(localStorage.getItem("mba-last-visit"));
    const t = setTimeout(() =>
      localStorage.setItem("mba-last-visit", new Date().toISOString()), 2500);
    allUploadsCached(CONFIG.CLOUD_NAME).then(setUploads).catch(() => {});
    return () => clearTimeout(t);
  }, []);

  // Once current week is known, scroll each shelf so it is visible
  useEffect(() => {
    if (!cur?.n || didScroll.current) return;
    didScroll.current = true;
    const idx = lectWeeks.findIndex(w => w.n === cur.n);
    rowRefs.current.forEach(row => {
      const card = row.children[idx] as HTMLElement | undefined;
      if (card) row.scrollTo({ left: card.offsetLeft - 8, behavior: "smooth" });
    });
  }, [cur, lectWeeks]);

  const countFor = (tag: string, week: number) =>
    uploads.filter(r => r.course.tag === tag && r.week === week && !isPastQuestion(r)).length;

  const pqCountFor = (tag: string) =>
    uploads.filter(r => r.course.tag === tag && isPastQuestion(r)).length;

  const lqCountFor = (tag: string) =>
    uploads.filter(r => r.course.tag === tag && isLikelyQuestion(r)).length;

  const newCountFor = (tag: string) =>
    lastSeen ? uploads.filter(r => r.course.tag === tag && r.created_at && r.created_at > lastSeen).length : 0;

  const coveredFor = (tag: string) =>
    lectWeeks.filter(w => {
      const c = COURSES.find(x => x.tag === tag);
      const pages = c?.notes.filter(n => n.week === w.n).length || 0;
      return pages + countFor(tag, w.n!) > 0;
    }).length;

  return (
    <>
      <div className="shelves">
        {COURSES.map(c => {
          const covered = coveredFor(c.tag);
          const fresh = newCountFor(c.tag);
          return (
            <section className="shelf" key={c.tag} style={{ ["--accent" as string]: c.color }}>
              <div className="shelf-head">
                <Link className="shelf-title" href={`/course/${c.tag}`}>
                  <span className="shelf-ic"><CourseIcon tag={c.tag} size={16} /></span> {c.code}
                  <span className="shelf-name">{c.title}</span>
                  {fresh > 0 && (
                    <span className="new-dot" title={`${fresh} new upload${fresh === 1 ? "" : "s"} since your last visit`}>
                      {fresh}
                    </span>
                  )}
                </Link>
                <span className="shelf-cover">{covered}/{lectWeeks.length} weeks</span>
              </div>

              <div
                className="shelf-row"
                ref={el => { if (el) rowRefs.current.set(c.tag, el); }}
              >
                {lectWeeks.map(w => {
                  const n = w.n!;
                  const pages = c.notes.filter(x => x.week === n);
                  return (
                    <WeekCell
                      key={n}
                      courseTag={c.tag}
                      courseCode={c.code}
                      courseColor={c.color}
                      week={n}
                      weekLabel={w.label}
                      pageFiles={pages.map(p => ({ file: p.file, title: p.title }))}
                      pdfCount={countFor(c.tag, n)}
                      scheduled={(TIMETABLE[n] || []).includes(c.tag)}
                      isCurrent={cur?.n === n}
                    />
                  );
                })}

                {/* Past Questions card — end of shelf */}
                <Link
                  className="wk-card wk-card-pq"
                  href={`/course/${c.tag}#past-questions`}
                  title={`${c.code} · Past Questions`}
                  style={{ ["--accent" as string]: c.color }}
                >
                  <span className="wk-card-n">PQ</span>
                  <span className="wk-card-d">Past questions</span>
                  <span className="wk-card-marks">
                    {pqCountFor(c.tag) > 0
                      ? <span className="tt-chip tt-chip-pdf"><Notebook size={11} /> {pqCountFor(c.tag)}</span>
                      : <span className="tt-plus"><Plus size={13} weight="bold" /></span>}
                  </span>
                </Link>

                {/* Likely Exam Questions card — end of shelf */}
                <Link
                  className="wk-card wk-card-pq wk-card-lq"
                  href={`/course/${c.tag}#likely-questions`}
                  title={`${c.code} · Likely & Tutorial Questions`}
                  style={{ ["--accent" as string]: c.color }}
                >
                  <span className="wk-card-n">LQ</span>
                  <span className="wk-card-d">Likely Qs</span>
                  <span className="wk-card-marks">
                    {lqCountFor(c.tag) > 0
                      ? <span className="tt-chip tt-chip-lq"><Target size={11} /> {lqCountFor(c.tag)}</span>
                      : <span className="tt-plus"><Plus size={13} weight="bold" /></span>}
                  </span>
                </Link>
              </div>
            </section>
          );
        })}
      </div>
      <p className="tt-legend">
        <span className="ic"><BookOpenText size={12} /> <span>pictorial</span></span>
        <span className="ic"><FileText size={12} /> <span>uploaded notes</span></span>
        <span>tap a card to view</span>
        <span className="ic"><Plus size={11} weight="bold" /> <span>upload strip to add</span></span>
        <span>scroll shelves sideways</span>
      </p>
    </>
  );
}
