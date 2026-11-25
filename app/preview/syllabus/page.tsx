"use client";

import Link from "next/link";
import SearchBox from "@/components/SearchBox";
import Timetable from "@/components/Timetable";
import SemesterRibbon from "../SemesterRibbon";
import { COURSES, WEEKS, IMPORTANT_DATES } from "@/lib/data";
import {
  FileText, BookOpenText, Eye, DownloadSimple, Trash,
  Books, Files, CalendarBlank, ArrowUpRight, MagnifyingGlass,
  Flag, Star, Coffee, Exam
} from "@phosphor-icons/react";

const SAMPLE_FILES = [
  { icon: FileText, name: "Week 3 Lecture Slides", meta: "PDF · 2.4 MB", alt: false },
  { icon: BookOpenText, name: "Chapter 4 Reading Summary", meta: "DOCX · 310 KB", alt: true },
  { icon: FileText, name: "MBA 702 Likely Questions Pack", meta: "DOCX · 84 KB", alt: false },
];

const TL_ICONS = { start: Flag, event: Star, break: Coffee, exam: Exam };

export default function SyllabusPreview() {
  const lectWeeks = WEEKS.filter(w => w.n).length;
  const marquee = [...COURSES, ...COURSES]; // duplicate for the seamless loop
  return (
    <div className="concept concept-syllabus">
      <section className="hero">
        <div className="wrap">
          <Link className="back-link" href="/preview" style={{ color: "#9db2c8" }}>← All concepts</Link>
          <div className="sy-in sy-in-1"><span className="concept-tag">Concept D · The Syllabus</span></div>
          <h1 className="sy-in sy-in-2">Every note.<br /><strong>One shelf.</strong></h1>
          <p className="sy-in sy-in-3">Lecture notes, past questions and likely exam questions shared by the class. Pick a course and start reading.</p>
          <div className="actions sy-in sy-in-4">
            <a className="btn btn-primary" href="#courses">Browse courses</a>
            <Link className="btn btn-ghost" href="/upload">Upload a note <ArrowUpRight size={14} weight="bold" /></Link>
          </div>
          <div className="sy-search sy-in sy-in-5">
            <MagnifyingGlass size={20} weight="bold" />
            <SearchBox />
          </div>
          <div className="sy-proof sy-in sy-in-5">
            <span><b>{COURSES.length}</b> courses</span>
            <span><b>{lectWeeks}</b> lecture weeks</span>
            <span><b>Open</b> to every classmate</span>
          </div>
        </div>
      </section>

      <div className="sy-marquee" aria-hidden>
        <div className="sy-mq-track">
          {marquee.map((c, i) => (
            <span key={i}><i>✦</i>{c.code} · {c.title}</span>
          ))}
        </div>
      </div>

      <SemesterRibbon />

      <section className="section" id="files-look">
        <div className="wrap">
          <h2 className="section-title"><Files size={28} weight="duotone" className="sy-section-ic" />Files, rebuilt</h2>
          <p className="section-sub">Icon tiles replace emoji. One accent. Actions sit in a clean second row on phones.</p>
          <div className="sy-card">
            {SAMPLE_FILES.map((f, i) => (
              <div className="sy-file" key={i}>
                <span className={`f-ic${f.alt ? " alt" : ""}`}><f.icon size={20} weight="duotone" /></span>
                <span className="f-name">{f.name}<small>{f.meta}</small></span>
                <span className="f-act">
                  <a href="#files-look"><Eye size={16} weight="bold" /> Preview</a>
                  <a href="#files-look"><DownloadSimple size={16} weight="bold" /> Download</a>
                  <button className="f-del" title="Remove this file"><Trash size={17} weight="bold" /></button>
                </span>
              </div>
            ))}
          </div>

          <div className="sy-stats">
            <div className="sy-stat"><b>{COURSES.length}</b><span>courses this semester</span></div>
            <div className="sy-stat"><b>{lectWeeks}</b><span>lecture weeks, break excluded</span></div>
            <div className="sy-stat"><b><em>100%</em></b><span>shared by classmates</span></div>
          </div>
        </div>
      </section>

      <section className="section" id="courses" style={{ paddingTop: 10 }}>
        <div className="wrap">
          <h2 className="section-title"><Books size={28} weight="duotone" className="sy-section-ic" />Course Library</h2>
          <p className="section-sub">One shelf per course. Weeks run left to right, tap a card for that week's notes.</p>
          <Timetable />
        </div>
      </section>

      <section className="section" id="calendar">
        <div className="wrap">
          <h2 className="section-title"><CalendarBlank size={28} weight="duotone" className="sy-section-ic" />First Semester at a Glance</h2>
          <p className="section-sub">Postgraduate College academic calendar, 2026/2027.</p>
          <div className="timeline">
            {IMPORTANT_DATES.map(d => {
              const Icon = TL_ICONS[d.type];
              return (
                <div className={`tl-item tl-${d.type}`} key={d.label}>
                  <span className="sy-tl-ic"><Icon size={14} weight="bold" /></span>
                  <span className="date">{d.date}</span>
                  <span className="label">{d.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
