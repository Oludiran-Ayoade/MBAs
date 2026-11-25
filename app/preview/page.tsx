import Link from "next/link";

export default function PreviewIndex() {
  const concepts = [
    {
      href: "/preview/vault",
      name: "The Vault",
      tag: "Concept A · dark, cinematic",
      desc: "Full dark theme as default. Glowing accents, spotlight search, film-strip week cards. Built for late-night browsing.",
      colors: ["#070b14", "#0e1626", "#4fd1e8", "#e85aa0"]
    },
    {
      href: "/preview/reading-room",
      name: "The Reading Room",
      tag: "Concept B · warm paper, editorial",
      desc: "Cream paper, burgundy ink accent, week cards styled like book spines on literal shelves. A library, not a dashboard.",
      colors: ["#f4efe4", "#fcf9f1", "#7a3b2e", "#8a5a2e"]
    },
    {
      href: "/preview/semester-map",
      name: "The Semester Map",
      tag: "Concept C · spatial, calendar-shaped",
      desc: "Keeps the brand palette but leads with a semester ribbon · 14 week stops on a line, the break as a visible gap.",
      colors: ["#eef2f8", "#0c2340", "#0f9bc4", "#c2187b"]
    },
    {
      href: "/preview/syllabus",
      name: "The Syllabus",
      tag: "Concept D · grotesk, one accent, icon-driven",
      desc: "The design-taste pass. Plus Jakarta Sans carries display too (no serif), a single blue accent, Phosphor icons instead of emoji, no em-dashes.",
      colors: ["#f5f8fc", "#0c2340", "#2378cc", "#8ac7f8"]
    }
  ];

  return (
    <section className="section">
      <div className="wrap">
        <h2 className="section-title">Design Concept Previews</h2>
        <p className="section-sub">Three directions for the landing page · the real site is untouched.</p>
        <div className="preview-list">
          {concepts.map(c => (
            <Link className="preview-card" key={c.href} href={c.href}>
              <span className="concept-tag">{c.tag}</span>
              <h3>{c.name}</h3>
              <div className="sw">
                {c.colors.map(col => <i key={col} style={{ background: col, border: "1px solid rgba(0,0,0,0.08)" }} />)}
              </div>
              <p>{c.desc}</p>
              <span className="go">Open preview →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
