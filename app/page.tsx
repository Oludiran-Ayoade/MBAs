import Link from "next/link";
import { COURSES, IMPORTANT_DATES, WEEKS } from "@/lib/data";
import SearchBox from "@/components/SearchBox";
import SemProgress from "@/components/SemProgress";
import Timetable from "@/components/Timetable";
import RecentUploads from "@/components/RecentUploads";
import WeekNow from "@/components/WeekNow";
import SemesterRibbon from "@/components/SemesterRibbon";
import Reveal from "@/components/Reveal";
import { Coffee, Exam, Flag, Star, type Icon } from "@/components/Icons";

const TL_ICON: Record<string, Icon> = { start: Flag, event: Star, break: Coffee, exam: Exam };

export default function Home() {
  const lectWeeks = WEEKS.filter(w => w.n).length;
  return (
    <>
      <section className="hero-pro">
        <div className="hero-pro-frame">
          <div className="wrap">
            <div className="rise rise-1"><WeekNow /></div>
            <h1 className="rise rise-2">
              Every course.<br />
              <b>Every note. One shelf.</b>
            </h1>
            <p className="rise rise-3">
              Study notes and lecture files for the first-semester MBA, shared by the cohort.
            </p>
            <div className="actions rise rise-4">
              <Link className="btn btn-primary" href="#courses">Browse Courses</Link>
              <Link className="btn btn-ghost" href="/upload">Share a note</Link>
            </div>
            <div className="hero-pro-search rise rise-5"><SearchBox /></div>
            <div className="rise rise-5"><SemProgress /></div>
            <div className="hero-pro-proof rise rise-5">
              <span>{COURSES.length} courses</span>
              <span>{lectWeeks} lecture weeks</span>
              <span>Free for every classmate</span>
            </div>
          </div>
        </div>
      </section>

      <div className="mq" aria-hidden>
        <div className="mq-track">
          {[0, 1].map(dup => (
            <span className="mq-inner" key={dup}>
              {COURSES.map(c => (
                <span className="mq-item" key={c.tag}><b>{c.code}</b> {c.title} <i>✦</i></span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <SemesterRibbon />

      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <Reveal>
            <div className="stat-band">
              <div className="stat-cell"><b>{COURSES.length}</b><span>courses in the library</span></div>
              <div className="stat-cell"><b>{lectWeeks}</b><span>lecture weeks mapped</span></div>
              <div className="stat-cell"><b>100%</b><span>shared by classmates</span></div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" id="courses">
        <div className="wrap">
          <h2 className="section-title">Course Library</h2>
          <p className="section-sub">One shelf per course. Weeks run left to right, tap a card for that week's notes.</p>
          <Reveal><Timetable /></Reveal>
        </div>
      </section>

      <RecentUploads />

      <section className="section" id="calendar">
        <div className="wrap">
          <h2 className="section-title">First Semester at a Glance</h2>
          <p className="section-sub">Postgraduate College academic calendar, 2026/2027.</p>
          <Reveal>
          <div className="timeline">
            {IMPORTANT_DATES.map(d => {
              const TlIco = TL_ICON[d.type] || Star;
              return (
                <div className={`tl-item tl-${d.type}`} key={d.label}>
                  <span className="tl-ic"><TlIco size={18} weight="duotone" /></span>
                  <span className="date">{d.date}</span>
                  <span className="label">{d.label}</span>
                </div>
              );
            })}
          </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
