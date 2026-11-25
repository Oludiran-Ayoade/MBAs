import Link from "next/link";
import SearchBox from "@/components/SearchBox";
import SemProgress from "@/components/SemProgress";
import Timetable from "@/components/Timetable";
import WeekNow from "@/components/WeekNow";

export default function VaultPreview() {
  return (
    <div className="concept concept-vault">
      <section className="hero">
        <div className="wrap">
          <Link className="back-link" href="/preview" style={{ color: "#55657e" }}>← All concepts</Link>
          <div><span className="concept-tag">Concept A · The Vault</span></div>
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
    </div>
  );
}
