import { Suspense } from "react";
import NoteReader from "@/components/NoteReader";

async function Resolved({ params }: { params: Promise<{ tag: string; file: string }> }) {
  const { tag, file } = await params;
  return <NoteReader tag={tag} file={decodeURIComponent(file)} />;
}

export default function NotePage({ params }: { params: Promise<{ tag: string; file: string }> }) {
  return (
    <Suspense fallback={
      <div className="wrap section">
        <div className="upload-card" aria-hidden>
          <div className="skel-lines"><i /><i /><i /></div>
        </div>
      </div>
    }>
      <Resolved params={params} />
    </Suspense>
  );
}
