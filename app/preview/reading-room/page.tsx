import Link from "next/link";
import { IMPORTANT_DATES } from "@/lib/data";
import SearchBox from "@/components/SearchBox";
import SemProgress from "@/components/SemProgress";
import Timetable from "@/components/Timetable";
import WeekNow from "@/components/WeekNow";

export default function ReadingRoomPreview() {
  return (
    <div className="concept concept-reading">
      <section className="hero">
        <div className="wrap">
          <Link className="back-link" href="/preview" style={{ color: "#a08f74" }}>← All concepts</Link>
          <div><span className="concept-tag">Concept B · The Reading Room</span></div>
          <WeekNow />
          <h1>All MBA first semester course notes.<br /><em>Clear and downloadable.</em></h1>
          <p>Pick a course to read illustrated study pages, or download the original lecture PDFs shared by your classmates.</p>
          <SearchBox />
          <SemProgress />
        </div>
      </section>

      <section className="section" id="courses">
        <div className="wrap">
          <h2 className="section-title">Course Library</h2>
          <p className="section-sub">One shelf per course · weeks run left to right, tap a card for that week's notes.</p>
          <Timetable />
        </div>
      </section>

      <section className="section" id="calendar">
        <div className="wrap">
          <h2 className="section-title">First Semester at a Glance</h2>
          <p className="section-sub">Postgraduate College academic calendar, 2026/2027.</p>
          <div className="timeline">
            {IMPORTANT_DATES.map(d => (
              <div className={`tl-item tl-${d.type}`} key={d.label}>
                <span className="date">{d.date}</span>
                <span className="label">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
