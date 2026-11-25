import { Suspense } from "react";
import UploadForm from "@/components/UploadForm";

export const metadata = { title: "Upload Notes | LCU MBA Notes Hub" };

export default function UploadPage() {
  return (
    <section className="section">
      <div className="wrap">
        <h2 className="section-title">Share a Note</h2>
        <p className="section-sub">Upload a PDF (or slides/doc) for a course. It appears on the course page for everyone. No login needed.</p>
        <Suspense fallback={
          <div className="upload-card" aria-hidden>
            <div className="skel-lines"><i /><i /><i /><i /></div>
          </div>
        }>
          <UploadForm />
        </Suspense>
      </div>
    </section>
  );
}
