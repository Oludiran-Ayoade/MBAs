"use client";

import { useEffect, useState } from "react";
import { currentWeek, WEEKS, type Week } from "@/lib/data";

export default function SemProgress() {
  const [cur, setCur] = useState<Week | undefined>();
  useEffect(() => setCur(currentWeek()), []);
  const total = WEEKS.filter(w => w.n).length;
  if (!cur?.n) return null;
  const pct = Math.round((cur.n / total) * 100);
  return (
    <div className="sem-progress">
      <div className="sp-track"><div className="sp-fill" style={{ width: `${pct}%` }} /></div>
      <div className="sp-label">Week {cur.n} of {total} · {pct}% through the semester</div>
    </div>
  );
}
