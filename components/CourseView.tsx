"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  WEEKS, getCourse, currentWeek, prettyName, weekOfResource, isPastQuestion, isLikelyQuestion,
  fetchTag, downloadUrl, previewUrl, openPreview, fmtBytes, rid, nameKey, type CloudResource, type Week
} from "@/lib/data";
import { CONFIG, cloudinaryConfigured } from "@/lib/config";
import QuickUpload from "@/components/QuickUpload";
import Reveal from "@/components/Reveal";
import {
  BookOpenText, Check, CheckSquare, DownloadSimple, Exam, Eye, FolderOpen,
  MagnifyingGlass, Notebook, Plus, Target, Trash
} from "@/components/Icons";
import { CourseIcon, FileIcon } from "@/components/Icons";

export default function CourseView({ tag }: { tag: string }) {
  const course = getCourse(tag);
  const searchParams = useSearchParams();
  const targetWeek = Number(searchParams.get("w")) || null;
  const [pdfs, setPdfs] = useState<Map<number | null, CloudResource[]>>(new Map());
  const [pastQs, setPastQs] = useState<CloudResource[]>([]);
  const [likelyQs, setLikelyQs] = useState<CloudResource[]>([]);
  const [activeWeek, setActiveWeek] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const [cur, setCur] = useState<Week | undefined>();
  const [today, setToday] = useState("");
  const [managing, setManaging] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [delBusy, setDelBusy] = useState(false);
  const [loading, setLoading] = useState(cloudinaryConfigured);

  const lectWeeks = WEEKS.filter(w => w.n);

  useEffect(() => {
    setCur(currentWeek());
    setToday(new Date().toISOString().slice(0, 10));
  }, []);

  useEffect(() => {
    if (!course || !cloudinaryConfigured) return;
    Promise.all([
      fetchTag(CONFIG.CLOUD_NAME, "image", course.tag).catch(() => null),
      fetchTag(CONFIG.CLOUD_NAME, "raw", course.tag).catch(() => null)
    ])
      .then(([a, b]) => {
        if (a === null && b === null) { setError(true); setLoading(false); return; }
        const all = [...(a || []), ...(b || [])];
        const map = new Map<number | null, CloudResource[]>();
        const pqs: CloudResource[] = [];
        const lqs: CloudResource[] = [];
        for (const r of all) {
          if (isPastQuestion(r)) {
            pqs.push(r);
          } else if (isLikelyQuestion(r)) {
            lqs.push(r);
          } else {
            const w = weekOfResource(r);
            if (!map.has(w)) map.set(w, []);
            map.get(w)!.push(r);
          }
        }
        const newest = (x: CloudResource, y: CloudResource) => (y.created_at || "").localeCompare(x.created_at || "");
        pqs.sort(newest);
        lqs.sort(newest);
        setPdfs(map);
        setPastQs(pqs);
        setLikelyQs(lqs);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [course]);

  useEffect(() => {
    if (!targetWeek) return;
    // Scroll the master-detail block into view after Next's scroll-to-top.
    const timers = [150, 500].map(ms =>
      setTimeout(() => document.querySelector(".wk-md")
        ?.scrollIntoView({ behavior: "smooth", block: "start" }), ms)
    );
    return () => timers.forEach(clearTimeout);
  }, [targetWeek]);

  // Coverage dots / hash links (#w5) — select the week they point at.
  useEffect(() => {
    function onHash() {
      const m = location.hash.match(/^#w(\d+)$/);
      if (m) setActiveWeek(Number(m[1]));
    }
    window.addEventListener("hashchange", onHash);
    onHash(); // handle a hash present on initial load (no ?w= param)
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Add a resource to the week bucket it belongs to (after inline upload).
  function addRes(r: CloudResource) {
    const w = weekOfResource(r);
    setPdfs(m => { const n = new Map(m); n.set(w, [...(n.get(w) || []), r]); return n; });
  }

  // Remove a resource from whichever list holds it
  function removeRes(r: CloudResource) {
    setPdfs(m => {
      const n = new Map(m);
      for (const [w, arr] of n) n.set(w, arr.filter(x => rid(x) !== rid(r)));
      return n;
    });
    setPastQs(a => a.filter(x => rid(x) !== rid(r)));
    setLikelyQs(a => a.filter(x => rid(x) !== rid(r)));
    setSelected(s => { const n = new Set(s); n.delete(rid(r)); return n; });
  }

  async function deleteOne(r: CloudResource, quiet = false): Promise<boolean> {
    try {
      const res = await fetch("/api/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: r.public_id, resource_type: r.resource_type })
      });
      if (res.ok) { removeRes(r); return true; }
      const data = await res.json().catch(() => ({}));
      if (!quiet) toast.error(data.error || "Delete failed");
      return false;
    } catch {
      if (!quiet) toast.error("Delete failed. Check your connection.");
      return false;
    }
  }

  async function deleteFile(r: CloudResource) {
    toast(`Remove "${prettyName(r.public_id)}"?`, {
      description: "This deletes it for everyone.",
      action: {
        label: "Delete",
        onClick: async () => {
          setDelBusy(true);
          await deleteOne(r);
          setDelBusy(false);
        }
      },
      cancel: { label: "Cancel", onClick: () => {} },
      duration: 8000
    });
  }

  function allResources(): CloudResource[] {
    return [...Array.from(pdfs.values()).flat(), ...pastQs, ...likelyQs];
  }

  async function deleteSelected() {
    const targets = allResources().filter(r => selected.has(rid(r)));
    if (!targets.length) return;
    toast(`Delete ${targets.length} file${targets.length === 1 ? "" : "s"}?`, {
      description: "This deletes them for everyone.",
      action: {
        label: "Delete all",
        onClick: async () => {
          setDelBusy(true);
          let failed = 0;
          for (const r of targets) {
            const ok = await deleteOne(r, true);
            if (!ok) failed++;
            setSelected(s => { const n = new Set(s); n.delete(rid(r)); return n; });
          }
          setDelBusy(false);
          if (failed) toast.error(`${failed} file${failed === 1 ? "" : "s"} couldn't be deleted.`);
          else toast.success(`Deleted ${targets.length} file${targets.length === 1 ? "" : "s"}.`);
        }
      },
      cancel: { label: "Cancel", onClick: () => {} },
      duration: 8000
    });
  }

  function toggleManage() {
    setManaging(m => !m);
    setSelected(new Set());
  }

  function toggleSelect(r: CloudResource) {
    setSelected(s => {
      const n = new Set(s);
      if (n.has(rid(r))) n.delete(rid(r)); else n.add(rid(r));
      return n;
    });
  }

  if (!course) {
    return (
      <main className="wrap section">
        <div className="empty-state"><div className="big"><MagnifyingGlass size={40} weight="duotone" /></div>Course not found. <Link href="/">Back to courses</Link></div>
      </main>
    );
  }

  const badge = (w: (typeof lectWeeks)[number]) => {
    if (!today) return null;
    if (cur?.n === w.n) return <span className="wk-badge wk-now">This week</span>;
    if (w.end && today > w.end) return null; // past weeks need no badge
    return <span className="wk-badge wk-next">Upcoming</span>;
  };

  const covered = lectWeeks.filter(w =>
    course.notes.some(n => n.week === w.n) || (pdfs.get(w.n) || []).length
  ).length;

  // Master–detail: which week is showing in the pane.
  const validTarget = targetWeek && lectWeeks.some(w => w.n === targetWeek) ? targetWeek : null;
  const activeN = activeWeek ?? validTarget ?? cur?.n ?? 1;
  const activeW = lectWeeks.find(w => w.n === activeN) || lectWeeks[0];
  const activeFiles = pdfs.get(activeW.n) || [];
  const activeNotes = course.notes.filter(n => n.week === activeW.n);
  const activeHas = activeFiles.length + activeNotes.length > 0;
  const weekCount = (n: number) => (pdfs.get(n) || []).length + course.notes.filter(x => x.week === n).length;
  const existingKeys = new Set(allResources().map(r => nameKey(r.public_id.split("/").pop() || "")));
  const isBreakAfter = (i: number) => {
    const w = lectWeeks[i], nx = lectWeeks[i + 1];
    return !!(w?.end && nx?.start &&
      new Date(nx.start).getTime() - new Date(w.end).getTime() > 9 * 86400000);
  };

  // Loading placeholder matching the .wk-row shape.
  const SkelRows = ({ count = 3 }: { count?: number }) => (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div className="skel-row" key={i}>
          <span className="skel-tile" />
          <span className="skel-lines"><i /><i /></span>
        </div>
      ))}
    </>
  );

  // One uploaded-file row — used for weeks, past questions and likely questions.
  const uploadRow = (r: CloudResource) => (
    <div className="wk-row" key={rid(r)}>
      {managing && (
        <input
          type="checkbox"
          className="wk-check"
          checked={selected.has(rid(r))}
          onChange={() => toggleSelect(r)}
          aria-label={`Select ${prettyName(r.public_id)}`}
        />
      )}
      <span className="wk-ic"><FileIcon format={r.format} /></span>
      <span className="wk-name">
        {prettyName(r.public_id)} <small>{(r.format || "").toUpperCase()} · {fmtBytes(r.bytes)}</small>
      </span>
      <a
        className="wk-link"
        href={previewUrl(r, CONFIG.CLOUD_NAME)}
        target="_blank"
        rel="noopener"
        onClick={async e => {
          e.preventDefault();
          const ok = await openPreview(r, CONFIG.CLOUD_NAME);
          if (!ok) toast.error("That file is no longer available. Refresh to see the latest list.");
        }}
      >
        <Eye size={15} weight="bold" /> {r.resource_type === "raw" ? "Preview" : "View"}
      </a>
      <a className="wk-link dl" href={downloadUrl(r, CONFIG.CLOUD_NAME)}><DownloadSimple size={15} weight="bold" /> Download</a>
      <button
        className="wk-del"
        onClick={() => deleteFile(r)}
        disabled={delBusy}
        title="Remove this file"
      ><Trash size={16} /></button>
    </div>
  );

  return (
    <>
      <section className="course-hero" style={{ ["--accent" as string]: course.color }}>
        <div className="course-hero-frame">
          <div className="wrap">
            <span className="code">{course.code}</span>
            <h1><CourseIcon tag={course.tag} size={30} weight="duotone" /> {course.title}</h1>
            <p>{course.desc}</p>
            <div className="ch-stats">
              <span>{covered}/{lectWeeks.length} weeks covered</span>
              <span>{allResources().length} file{allResources().length === 1 ? "" : "s"} shared</span>
              {pastQs.length > 0 && <span>{pastQs.length} past question{pastQs.length === 1 ? "" : "s"}</span>}
              {likelyQs.length > 0 && <span>{likelyQs.length} likely Q{likelyQs.length === 1 ? "" : "s"}</span>}
            </div>
          </div>
        </div>
      </section>

      <main className="wrap">
        <div className="breadcrumb"><Link href="/">← All courses</Link></div>

        {error && <div className="notice">Couldn't load shared notes. Check your connection and refresh.</div>}

        {cloudinaryConfigured && (
          <div className="wk-tools">
            <button className={`tool-btn${managing ? " on" : ""}`} onClick={toggleManage}>
              {managing ? <><Check size={14} weight="bold" /> Done</> : <><CheckSquare size={14} /> Select files</>}
            </button>
          </div>
        )}

        <Reveal>
        <div className="wk-md" style={{ margin: "20px 0 50px", ["--accent" as string]: course.color }}>
          <div className="wk-rail" role="group" aria-label="Lecture weeks">
            <div className="wk-rail-cover">{covered}/{lectWeeks.length} weeks covered</div>
            {lectWeeks.map((w, i) => {
              const n = w.n!;
              const cnt = weekCount(n);
              return (
                <Fragment key={n}>
                  <button
                    id={`w${n}`}
                    aria-pressed={n === activeW.n}
                    aria-label={`Week ${n} · ${w.label}`}
                    className={["wk-stop", n === activeW.n ? "on" : "", cnt ? "has" : "", cur?.n === n ? "cur" : ""].filter(Boolean).join(" ")}
                    onClick={() => setActiveWeek(n)}
                  >
                    <span className="ws-num">W{n}</span>
                    <span className="ws-dates">{w.label}</span>
                    {cnt > 0 && <span className="ws-count">{cnt}</span>}
                    {cur?.n === n && <span className="ws-now">now</span>}
                  </button>
                  {isBreakAfter(i) && <div className="wk-rail-break">· break ·</div>}
                </Fragment>
              );
            })}
          </div>

          <div className="wk-pane">
            <div className="wp-head">
              <div className="wp-titles">
                <b>Week {activeW.n}</b>
                <span className="wp-dates">
                  {activeW.label}{activeW.note ? <> · <em>{activeW.note}</em></> : ""}
                </span>
              </div>
              {badge(activeW)}
              <Link className="btn btn-outline btn-sm" href={`/upload?c=${course.tag}&w=${activeW.n}`}>
                <Plus size={14} weight="bold" /> Add note
              </Link>
            </div>
            <div className="wp-body">
              {loading ? (
                <div><SkelRows /></div>
              ) : activeHas ? (
                <>
                  {activeNotes.map(n => (
                    <Link key={n.file} className="wk-row wk-page" href={`/note/${course.tag}/${encodeURIComponent(n.file)}`}>
                      <span className="wk-ic"><BookOpenText size={20} /></span>
                      <span className="wk-name">{n.title} <small>{n.desc}</small></span>
                      <span className="wk-link">Read →</span>
                    </Link>
                  ))}
                  {activeFiles.map(uploadRow)}
                  <QuickUpload kind="week" week={activeW.n!} courseTag={course.tag} existing={existingKeys} compact onUploaded={addRes} />
                </>
              ) : (
                <div className="wk-empty">
                  <span>Nothing uploaded yet</span>
                  <QuickUpload kind="week" week={activeW.n!} courseTag={course.tag} existing={existingKeys} onUploaded={addRes} />
                </div>
              )}
            </div>
          </div>
        </div>
        </Reveal>

        {/* Unfiled uploads — files outside any week/PQ/LQ folder */}
        {(pdfs.get(null) || []).length > 0 && (
          <section className="pq-section" style={{ marginTop: 0 }}>
            <div className="pq-head">
              <h2 className="pq-title"><FolderOpen size={20} /> Other uploads</h2>
            </div>
            <div className="pq-list">
              {(pdfs.get(null) || []).map(uploadRow)}
            </div>
          </section>
        )}

        {/* Exam Prep: Past Questions + Likely Questions in one card */}
        <Reveal>
        <section className="pq-section" id="exam-prep">
          <div className="pq-head">
            <h2 className="pq-title"><Exam size={20} /> Exam Prep</h2>
          </div>
          <div className="exam-cols">
            <div className="exam-col" id="past-questions">
              <h3 className="exam-sub"><Notebook size={17} /> Past Questions</h3>
              {pastQs.length === 0 ? (
                loading ? <div className="pq-list"><SkelRows count={2} /></div> :
                <p className="exam-none">Nothing shared for {course.code} yet. Be the first.</p>
              ) : (
                <div className="pq-list">{pastQs.map(uploadRow)}</div>
              )}
              <QuickUpload kind="pq" courseTag={course.tag} existing={existingKeys}
                onUploaded={r => setPastQs(a => [r, ...a])} />
            </div>
            <div className="exam-col lq" id="likely-questions">
              <h3 className="exam-sub"><Target size={17} /> Likely &amp; Tutorial Questions</h3>
              {likelyQs.length === 0 ? (
                loading ? <div className="pq-list"><SkelRows count={2} /></div> :
                <p className="exam-none">Nothing shared for {course.code} yet. Be the first.</p>
              ) : (
                <div className="pq-list">{likelyQs.map(uploadRow)}</div>
              )}
              <QuickUpload kind="lq" courseTag={course.tag} existing={existingKeys}
                onUploaded={r => setLikelyQs(a => [r, ...a])} />
            </div>
          </div>
        </section>
        </Reveal>

        {managing && selected.size > 0 && (
          <div className="del-bar">
            <span>{selected.size} selected</span>
            <button className="del-bar-btn" onClick={deleteSelected} disabled={delBusy}>
              {delBusy ? "Deleting…" : <><Trash size={14} /> Delete selected</>}
            </button>
            <button className="del-bar-cancel" onClick={() => setSelected(new Set())} disabled={delBusy}>
              Cancel
            </button>
          </div>
        )}
      </main>
    </>
  );
}
