"use client";

import { useEffect, useState } from "react";
import { WEEKS, currentWeek } from "@/lib/data";

export default function SemesterRibbon() {
  const [cur, setCur] = useState<number | null>(null);
  useEffect(() => { setCur(currentWeek()?.n ?? null); }, []);

  const lectWeeks = WEEKS.filter(w => w.n);
  const months = ["Oct", "Nov", "Dec", "·", "Jan", "Feb"];

  // A "break" is any real gap between consecutive weeks (> 9 days) —
  // derived from the data rather than hardcoded to a week number.
  const isBreakAfter = (i: number) => {
    const w = lectWeeks[i], nx = lectWeeks[i + 1];
    if (!w?.end || !nx?.start) return false;
    return new Date(nx.start).getTime() - new Date(w.end).getTime() > 9 * 86400000;
  };

  return (
    <div className="sem-ribbon">
      <div className="sr-card">
        <div className="sr-head">
          <span className="sr-title">Semester map</span>
          <span className="sr-now">{cur ? `Week ${cur} of ${lectWeeks.length}` : `${lectWeeks.length} lecture weeks`}</span>
        </div>
        <div className="sr-track">
          {lectWeeks.map((w, i) => {
            const n = w.n!;
            const state = cur === null ? "" : n < cur ? "past" : n === cur ? "now" : "";
            const showBreak = isBreakAfter(i);
            return (
              <div key={n} style={{ display: "contents" }}>
                {i > 0 && <div className={`sr-line ${cur !== null && n <= cur ? "past" : ""}`} />}
                <div className={`sr-stop ${state}`}>
                  <span className="sr-dot">{n}</span>
                  <span className="sr-wk">W{n}</span>
                </div>
                {showBreak && (
                  <div className="sr-gap">
                    <div className="sr-gap-line" />
                    <span className="sr-gap-label">break</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="sr-months">
          {months.map((m, i) => <span key={i} className="sr-month" style={{ flex: m === "·" ? "0 0 24px" : 1 }}>{m === "·" ? "" : m}</span>)}
        </div>
      </div>
    </div>
  );
}
