"use client";

import { useRef, useState } from "react";
import { nameKey, type CloudResource } from "@/lib/data";
import { CONFIG } from "@/lib/config";
import { CheckCircle, SpinnerGap, UploadSimple, WarningCircle } from "@/components/Icons";

type Status = "uploading" | "done" | "err" | "dupe";
interface Item { id: number; name: string; size: number; pct: number; status: Status; err?: string }

let nextId = 1;
const OK_EXT = /\.(pdf|pptx?|docx?|png|jpe?g)$/i;

// Compact inline uploader — Past Questions, Likely Questions or a lecture
// week. Files go straight to Cloudinary on select or drop, no page navigation.
export default function QuickUpload({ kind, week, courseTag, existing, onUploaded }: {
  kind: "pq" | "lq" | "week";
  week?: number;
  courseTag: string;
  existing: Set<string>;
  onUploaded: (r: CloudResource) => void;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inFlight = useRef<Set<string>>(new Set());
  const tagKind = kind === "week" ? `w${week}` : kind;
  const folder = kind === "week" ? `mba-notes/${courseTag}/w${week}` : `mba-notes/${courseTag}/${kind === "pq" ? "past-questions" : "likely-questions"}`;

  function uploadOne(item: Item, file: File) {
    return new Promise<CloudResource | null>(resolve => {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", CONFIG.UPLOAD_PRESET);
      fd.append("tags", `mba,${courseTag},${tagKind}`);
      fd.append("folder", folder);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${CONFIG.CLOUD_NAME}/auto/upload`);
      xhr.upload.onprogress = e => {
        if (e.lengthComputable) {
          const pct = (e.loaded / e.total) * 100;
          setItems(q => q.map(i => i.id === item.id ? { ...i, pct } : i));
        }
      };
      xhr.onload = () => {
        if (xhr.status === 200) {
          try {
            const j = JSON.parse(xhr.responseText);
            resolve({
              public_id: j.public_id,
              version: j.version,
              format: j.format || file.name.split(".").pop() || "",
              resource_type: j.resource_type,
              created_at: j.created_at,
              bytes: j.bytes,
              tags: j.tags || [kind]
            });
            return;
          } catch { /* fall through */ }
        }
        let detail = xhr.statusText || "upload failed";
        try { detail = JSON.parse(xhr.responseText).error?.message || detail; } catch {}
        setItems(q => q.map(i => i.id === item.id ? { ...i, status: "err", err: detail } : i));
        resolve(null);
      };
      xhr.onerror = () => {
        setItems(q => q.map(i => i.id === item.id ? { ...i, status: "err", err: "network error" } : i));
        resolve(null);
      };
      xhr.send(fd);
    });
  }

  function addFiles(files: File[]) {
    const good = files.filter(f => OK_EXT.test(f.name));
    if (!good.length) return;
    for (const file of good) {
      const key = nameKey(file.name);
      const item: Item = { id: nextId++, name: file.name, size: file.size, pct: 0, status: "uploading" };
      if (existing.has(key) || inFlight.current.has(key)) {
        setItems(q => [...q, { ...item, status: "dupe", err: "already uploaded" }]);
        continue;
      }
      inFlight.current.add(key);
      setItems(q => [...q, item]);
      uploadOne(item, file).then(r => {
        inFlight.current.delete(key);
        if (r) {
          onUploaded(r);
          setItems(q => q.map(i => i.id === item.id ? { ...i, status: "done", pct: 100 } : i));
        }
      });
    }
    // Done/duped rows fade out shortly after
    setTimeout(() => setItems(q => q.filter(i => i.status !== "done" && i.status !== "dupe")), 4000);
  }

  return (
    <div className="qu">
      <div
        className={`qu-zone${drag ? " drag" : ""}`}
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); addFiles(Array.from(e.dataTransfer.files)); }}
      >
        <span className="qu-ic"><UploadSimple size={15} /></span>
        <span>Drop files or <b>click to upload</b> <small>· {kind === "week" ? `goes to Week ${week}` : kind === "pq" ? "goes to Past Questions" : "goes to Likely & Tutorial Questions"}</small></span>
      </div>
      <input
        ref={inputRef}
        type="file"
        hidden
        multiple
        accept=".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg"
        onChange={e => { addFiles(Array.from(e.target.files || [])); e.target.value = ""; }}
      />
      {items.length > 0 && (
        <div className="qu-list">
          {items.map(i => (
            <div key={i.id} className={`qu-item qu-${i.status}`}>
              <span className="qu-ic">
                {i.status === "done" ? <CheckCircle size={16} weight="fill" />
                  : i.status === "err" || i.status === "dupe" ? <WarningCircle size={16} weight="fill" />
                  : <SpinnerGap size={16} className="spin" />}
              </span>
              <span className="qu-name">
                {i.name}
                <small>
                  {i.status === "uploading" && `uploading ${Math.round(i.pct)}%`}
                  {i.status === "err" && (i.err || "failed")}
                  {i.status === "dupe" && "already uploaded"}
                  {i.status === "done" && "added to the list"}
                </small>
              </span>
              {i.status === "uploading" && (
                <span className="qu-bar"><span style={{ width: `${i.pct}%` }} /></span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
