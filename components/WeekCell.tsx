"use client";

import Link from "next/link";
import { BookOpenText, FileText, Plus } from "@/components/Icons";

interface Props {
  courseTag: string;
  courseCode: string;
  courseColor: string;
  week: number;
  weekLabel: string;
  pageFiles: { file: string; title: string }[];
  pdfCount: number;
  scheduled: boolean;
  isCurrent: boolean;
}

export default function WeekCell({ courseTag, courseCode, courseColor, week, weekLabel, pageFiles, pdfCount, scheduled, isCurrent }: Props) {
  const hasPages = pageFiles.length > 0;
  const hasFiles = pdfCount > 0;
  const cls = ["wk-card", scheduled ? "" : "wk-off", isCurrent ? "wk-cur" : ""].filter(Boolean).join(" ");

  return (
    <div
      className={cls}
      title={`${courseCode} · Week ${week} (${weekLabel})`}
      style={{ ["--accent" as string]: courseColor }}
    >
      <Link
        className="wk-card-main"
        href={`/course/${courseTag}?w=${week}#w${week}`}
        title={`View ${courseCode} Week ${week} notes`}
      >
        <span className="wk-card-n">W{week}</span>
        <span className="wk-card-d">{weekLabel}</span>
        <span className="wk-card-marks">
          {hasPages && <span className="tt-chip tt-chip-page"><BookOpenText size={11} /> {pageFiles.length}</span>}
          {hasFiles && <span className="tt-chip tt-chip-pdf"><FileText size={11} /> {pdfCount}</span>}
          {!hasPages && !hasFiles && <span className="wk-card-view">View</span>}
        </span>
      </Link>
      <Link
        className="wk-card-upload"
        href={`/upload?c=${courseTag}&w=${week}`}
        title={`Upload a note for ${courseCode} Week ${week}`}
      >
        <Plus size={11} weight="bold" aria-hidden /> Upload
      </Link>
    </div>
  );
}
