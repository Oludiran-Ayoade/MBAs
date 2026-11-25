import { Suspense } from "react";
import CourseView from "@/components/CourseView";

async function Resolved({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  return <CourseView tag={tag} />;
}

export default function CoursePage({ params }: { params: Promise<{ tag: string }> }) {
  return (
    <Suspense fallback={<main className="wrap section"><div className="empty-state">Loading…</div></main>}>
      <Resolved params={params} />
    </Suspense>
  );
}
