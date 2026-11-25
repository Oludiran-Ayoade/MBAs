"use client";

import { useEffect, useState } from "react";
import { currentWeek } from "@/lib/data";
import { CalendarBlank } from "@/components/Icons";

export default function WeekNow() {
  const [label, setLabel] = useState("MBA · First Semester · 2026/2027");
  useEffect(() => {
    const cur = currentWeek();
    if (cur?.n) setLabel(`Week ${cur.n} · ${cur.label} · MBA First Semester 2026/2027`);
  }, []);
  return <span className="kicker"><CalendarBlank size={16} weight="bold" /> {label}</span>;
}
