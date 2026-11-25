"use client";

// Phosphor re-exports through a client module so server components can
// render them as client leaves, plus the tag/format -> icon mappers.

export {
  ArrowUpRight, BookOpenText, Brain, CalendarBlank, Check, CheckCircle,
  CheckSquare, Clock, Coffee, DownloadSimple, Exam, Eye, FileDoc, FileImage,
  FilePdf, FilePpt, FileText, FileXls, FileZip, Flag, Flask, FolderOpen,
  GearSix, GraduationCap, Kanban, Laptop, MagnifyingGlass, Moon, Notebook,
  Paperclip, Plus, SpinnerGap, Star, Strategy, Sun, Target, Trash, TrendUp,
  UploadSimple, UsersThree, WarningCircle
} from "@phosphor-icons/react";

export type { Icon, IconWeight } from "@phosphor-icons/react";

import { FileDoc, FileImage, FilePdf, FilePpt, FileText, FileXls, FileZip,
  Brain, Flask, GearSix, Kanban, Laptop, Strategy, TrendUp, UsersThree,
  type Icon, type IconWeight } from "@phosphor-icons/react";

const COURSE_ICONS: Record<string, Icon> = {
  mgt709: Strategy, hrm702: UsersThree, bus706: Brain, mba707: Kanban,
  pom702: GearSix, mgt701: Flask, mba702: Laptop, mba704: TrendUp
};

export function CourseIcon({ tag, size = 16, weight = "duotone" }: { tag: string; size?: number; weight?: IconWeight }) {
  const Ic = COURSE_ICONS[tag] || FileText;
  return <Ic size={size} weight={weight} />;
}

const FORMAT_ICONS: Record<string, Icon> = {
  pdf: FilePdf, doc: FileDoc, docx: FileDoc, ppt: FilePpt, pptx: FilePpt,
  xls: FileXls, xlsx: FileXls, csv: FileXls, png: FileImage, jpg: FileImage,
  jpeg: FileImage, zip: FileZip
};

export function FileIcon({ format, size = 20, weight = "duotone" }: { format?: string; size?: number; weight?: IconWeight }) {
  const Ic = FORMAT_ICONS[(format || "").toLowerCase()] || FileText;
  return <Ic size={size} weight={weight} />;
}
