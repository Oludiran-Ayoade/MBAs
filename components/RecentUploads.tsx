"use client";

import { useEffect, useState } from "react";
import { allUploadsCached, prettyName, previewUrl, type UploadItem } from "@/lib/data";
import { CONFIG } from "@/lib/config";
import { CourseIcon } from "@/components/Icons";

function timeAgo(iso: string): string {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 3600) return Math.max(1, Math.round(s / 60)) + "m ago";
  if (s < 86400) return Math.round(s / 3600) + "h ago";
  return Math.round(s / 86400) + "d ago";
}

export default function RecentUploads() {
  const [items, setItems] = useState<UploadItem[]>([]);

  useEffect(() => {
    allUploadsCached(CONFIG.CLOUD_NAME).then(rs => {
      setItems(
        rs.filter(r => r.created_at)
          .sort((a, b) => b.created_at!.localeCompare(a.created_at!))
          .slice(0, 6)
      );
    }).catch(() => {});
  }, []);

  if (!items.length) return null;

  return (
    <section className="section">
      <div className="wrap">
        <h2 className="section-title">Recently Uploaded</h2>
        <p className="section-sub">The latest notes shared by your classmates.</p>
        <div className="recent-grid">
          {items.map(r => (
            <a key={r.public_id + r.version} className="recent-item" href={previewUrl(r, CONFIG.CLOUD_NAME)} target="_blank" rel="noopener">
              <span className="r-ic"><CourseIcon tag={r.course.tag} size={19} /></span>
              <span>
                <span className="r-t">{prettyName(r.public_id)}</span><br />
                <span className="r-s">{r.course.code} · {r.course.title}{r.week ? ` · Week ${r.week}` : ""}</span>
              </span>
              <span className="r-when">{timeAgo(r.created_at!)}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
