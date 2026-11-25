"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { COURSES, WEEKS, getCourse, currentWeek, fetchTag, nameKey, type CloudResource } from "@/lib/data";
import { CONFIG, cloudinaryConfigured } from "@/lib/config";
import { CheckCircle, FileText, Notebook, Paperclip, SpinnerGap, Target, WarningCircle } from "@/components/Icons";
import { CourseIcon } from "@/components/Icons";

type Status = "pending" | "uploading" | "done" | "err" | "dupe";
interface QItem { id: number; file: File; week: string; pct: number; status: Status; err?: string }

let nextId = 1;
const OK_EXT = /\.(pdf|pptx?|docx?|png|jpe?g)$/i;

export default function UploadForm() {
  const params = useSearchParams();
  const isPQ = !!params.get("pq");
  const isLQ = !!params.get("lq");
  const courseParam = params.get("c");
  const hasCourseParam = !!(courseParam && getCourse(courseParam));
  const [tag, setTag] = useState(hasCourseParam ? courseParam! : COURSES[0].tag);
  const course = getCourse(tag) || COURSES[0];

  const validWeek = (v: string | null) => v && WEEKS.some(w => w.n === Number(v)) ? v! : "1";
  const [week, setWeek] = useState(validWeek(params.get("w")));

  useEffect(() => {
    if (!params.get("w")) {
      const cur = currentWeek();
      if (cur?.n) setWeek(String(cur.n));
    }
  }, [params]);

  const [queue, setQueue] = useState<QItem[]>([]);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [existing, setExisting] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  // Load what's already on Cloudinary for this course — for duplicate detection.
  useEffect(() => {
    if (!cloudinaryConfigured) return;
    Promise.all([
      fetchTag(CONFIG.CLOUD_NAME, "image", tag).catch(() => []),
      fetchTag(CONFIG.CLOUD_NAME, "raw", tag).catch(() => [])
    ]).then(([a, b]) => {
      setExisting(new Set(
        [...a, ...b].map((r: CloudResource) => nameKey(r.public_id.split("/").pop() || ""))
      ));
    });
  }, [tag]);

  const lectWeeks = WEEKS.filter(w => w.n);
  const pending = queue.filter(i => i.status === "pending");
  const uploading = queue.find(i => i.status === "uploading");

  function addFiles(list: File[]) {
    const good = list.filter(f => OK_EXT.test(f.name));
    if (!good.length) {
      setMsg({ ok: false, text: "Only PDF, Word, PowerPoint or image files." });
      return;
    }
    const dest = isPQ ? "pq" : isLQ ? "lq" : week; // capture the week at the moment files are added
    setQueue(q => {
      const seen = new Set(q.map(i => i.file.name + i.file.size + i.week));
      return [...q, ...good
        .filter(f => !seen.has(f.name + f.size + dest))
        .map(f => ({
          id: nextId++, file: f, week: dest, pct: 0,
          status: existing.has(nameKey(f.name)) ? "dupe" as Status : "pending" as Status
        }))];
    });
    setMsg(null);
  }

  function uploadOne(item: QItem): Promise<{ ok: boolean; err?: string }> {
    return new Promise(resolve => {
      const fd = new FormData();
      fd.append("file", item.file);
      fd.append("upload_preset", CONFIG.UPLOAD_PRESET);
      if (item.week === "pq") {
        fd.append("tags", `mba,${course.tag},pq`);
        fd.append("folder", `mba-notes/${course.tag}/past-questions`);
      } else if (item.week === "lq") {
        fd.append("tags", `mba,${course.tag},lq`);
        fd.append("folder", `mba-notes/${course.tag}/likely-questions`);
      } else {
        fd.append("tags", `mba,${course.tag},w${item.week}`);
        fd.append("folder", `mba-notes/${course.tag}/w${item.week}`);
      }

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${CONFIG.CLOUD_NAME}/auto/upload`);
      xhr.upload.onprogress = e => {
        if (e.lengthComputable) {
          const pct = (e.loaded / e.total) * 100;
          setQueue(q => q.map(i => i.id === item.id ? { ...i, pct } : i));
        }
      };
      xhr.onload = () => {
        if (xhr.status === 200) resolve({ ok: true });
        else {
          let detail = xhr.statusText;
          try { detail = JSON.parse(xhr.responseText).error?.message || detail; } catch {}
          resolve({ ok: false, err: detail });
        }
      };
      xhr.onerror = () => resolve({ ok: false, err: "network error" });
      xhr.send(fd);
    });
  }

  async function upload() {
    const todo = queue.filter(i => i.status === "pending" || i.status === "err");
    if (!todo.length) return;
    setBusy(true);
    setMsg(null);
    let ok = 0, bad = 0;
    for (const item of todo) {
      setQueue(q => q.map(i => i.id === item.id ? { ...i, status: "uploading" } : i));
      const res = await uploadOne(item);
      if (res.ok) setExisting(s => new Set(s).add(nameKey(item.file.name)));
      setQueue(q => q.map(i => i.id === item.id
        ? { ...i, status: res.ok ? "done" : "err", err: res.err, pct: res.ok ? 100 : i.pct }
        : i));
      res.ok ? ok++ : bad++;
    }
    setBusy(false);
    setMsg({
      ok: bad === 0,
      text: bad === 0
        ? `${ok} file${ok === 1 ? "" : "s"} uploaded!`
        : `${ok} uploaded, ${bad} failed. Fix and retry the failed ones.`
    });
  }

  return (
    <div className="upload-card">
      {isPQ && (
        <div className="notice pq-hint">
          <Notebook size={15} /> This goes into the Past Questions section on the course page. No week needed.
          Name files clearly, e.g. <code>ACC-704-2023-Final.pdf</code>.
        </div>
      )}
      {isLQ && (
        <div className="notice pq-hint">
          <Target size={15} /> This goes into the Likely &amp; Tutorial Questions section, questions the lecturer hinted at or gave in tutorials.
          Name files clearly, e.g. <code>HRM-702-Tutorial-Questions.pdf</code>.
        </div>
      )}

      <div className="field">
        <label>Course</label>
        {hasCourseParam ? (
          <div className="course-static"><span className="ic" style={{ marginRight: 8 }}><CourseIcon tag={course.tag} size={16} /></span>{course.code} · {course.title}</div>
        ) : (
          <select value={tag} onChange={e => setTag(e.target.value)} disabled={busy}>
            {COURSES.map(c => <option key={c.tag} value={c.tag}>{c.code} · {c.title}</option>)}
          </select>
        )}
      </div>

      {!isPQ && !isLQ && (
        <div className="field">
          <label htmlFor="weekSelect">Week the lecture happened</label>
          <select id="weekSelect" value={week} onChange={e => setWeek(e.target.value)} disabled={busy}>
            {lectWeeks.map(w => (
              <option key={w.n} value={String(w.n)}>Week {w.n} · {w.label}{w.note ? ` (${w.note})` : ""}</option>
            ))}
          </select>
        </div>
      )}

      <div className="field">
        <label>Files <small className="muted">(select or drop several at once)</small></label>
        <div
          className={`dropzone${drag ? " drag" : ""}`}
          onClick={() => !busy && inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); if (!busy) addFiles(Array.from(e.dataTransfer.files)); }}
        >
          {queue.length === 0 ? (
            <div>
              <div style={{ color: "var(--accent)" }}><Paperclip size={32} weight="duotone" /></div>
              <div>Drag & drop files here, or <b>click to choose</b></div>
              <small className="muted">PDF, Word, PowerPoint, images. Multiple files supported.</small>
            </div>
          ) : (
            <div className="dz-list">
              {queue.map(i => (
                <div key={i.id} className={`dz-item dz-${i.status}`}>
                  <span className="dz-ic">
                    {i.status === "done" ? <CheckCircle size={16} weight="fill" />
                      : i.status === "err" || i.status === "dupe" ? <WarningCircle size={16} weight="fill" />
                      : i.status === "uploading" ? <SpinnerGap size={16} className="spin" />
                      : <FileText size={16} />}
                  </span>
                  <span className="dz-name">
                    {i.file.name}
                    <small>
                      {(i.file.size / 1048576).toFixed(2)} MB
                      {i.status === "uploading" && ` · uploading ${Math.round(i.pct)}%`}
                      {i.status === "err" && i.err ? ` · ${i.err}` : ""}
                      {i.status === "dupe" && " · already uploaded, skipped"}
                    </small>
                  </span>
                  <span className="dz-wk">{i.week === "pq" ? "PQ" : i.week === "lq" ? "LQ" : `W${i.week}`}</span>
                  {i.status !== "uploading" && (
                    <button
                      type="button"
                      className="dz-x"
                      disabled={busy}
                      title="Remove"
                      onClick={e => { e.stopPropagation(); setQueue(q => q.filter(x => x.id !== i.id)); }}
                    >×</button>
                  )}
                </div>
              ))}
              <div className="dz-more">Click or drop to add more files</div>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            hidden
            multiple
            accept=".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg"
            onChange={e => {
              addFiles(Array.from(e.target.files || []));
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <button className="btn btn-primary" onClick={upload} disabled={!pending.length || busy || !cloudinaryConfigured}>
        {busy
          ? `Uploading ${queue.filter(i => i.status === "done").length + 1} of ${queue.length}…`
          : pending.length > 1 ? `Upload ${pending.length} files` : "Upload file"}
      </button>
      {uploading && (
        <div className="progress" style={{ display: "block" }}>
          <div className="bar" style={{ width: `${uploading.pct}%` }} />
        </div>
      )}
      {msg && (
        <div className={`upload-result ${msg.ok ? "ok" : "err"}`} style={{ display: "block" }}>
          {msg.text}{" "}
          {msg.ok && <a href={`/course/${course.tag}`}>See them on the {course.code} page →</a>}
        </div>
      )}
    </div>
  );
}
