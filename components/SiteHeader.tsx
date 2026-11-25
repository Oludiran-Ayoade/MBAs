"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GraduationCap, Moon, Sun } from "@/components/Icons";

export default function SiteHeader() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
    // SW only in production — in dev it serves stale pages and makes
    // hot-reload weird. Also purge any previously-registered workers.
    if ("serviceWorker" in navigator) {
      if (process.env.NODE_ENV === "production") {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      } else {
        navigator.serviceWorker.getRegistrations()
          .then(rs => rs.forEach(r => r.unregister()))
          .catch(() => {});
      }
    }
  }, []);

  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch {}
    setDark(next === "dark");
  }

  return (
    <header className="site-header">
      <div className="wrap">
        <Link className="brand" href="/">
          <span className="logo"><GraduationCap size={21} weight="fill" /></span>
          <span>
            LCU MBA Notes Hub
            <small>Postgraduate College · Lead City University</small>
          </span>
        </Link>
        <nav className="site-nav">
          <Link href="/">Courses</Link>
          <Link href="/#calendar">Calendar</Link>
          <button className="theme-toggle" onClick={toggle} title="Toggle dark mode" aria-label="Toggle dark mode">
            {dark ? <Sun size={17} weight="bold" /> : <Moon size={17} weight="bold" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
