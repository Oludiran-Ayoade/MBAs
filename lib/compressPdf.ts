// Client-side PDF compression for files over Cloudinary's 10MB cap.
// Strategy: render each page to a canvas at a reduced DPI, encode as JPEG,
// and rebuild the PDF with pdf-lib. Output is rasterized (no selectable
// text) — acceptable for scanned lecture notes. Both libs are dynamically
// imported so the ~1.4MB pdf.js cost only loads when actually needed.
import { MAX_UPLOAD_BYTES } from "@/lib/config";

export interface CompressProgress { page: number; pages: number }

interface Pass { dpi: number; quality: number }

// Escalating passes: try to keep quality high, step down if still oversized.
const PASSES: Pass[] = [
  { dpi: 150, quality: 0.75 },
  { dpi: 110, quality: 0.62 },
  { dpi: 85, quality: 0.5 },
];

export async function compressPdf(file: File, onProgress?: (p: CompressProgress) => void): Promise<File> {
  const [pdfjs, { PDFDocument }] = await Promise.all([
    import("pdfjs-dist"),
    import("pdf-lib"),
  ]);
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const src = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;

  for (const pass of PASSES) {
    const out = await PDFDocument.create();
    const scale = pass.dpi / 72; // pdf.js renders at 72dpi units
    for (let p = 1; p <= src.numPages; p++) {
      onProgress?.({ page: p, pages: src.numPages });
      const page = await src.getPage(p);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport }).promise;
      const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, "image/jpeg", pass.quality));
      if (!blob) throw new Error("JPEG encode failed");
      const img = await out.embedJpg(await blob.arrayBuffer());
      const pg = out.addPage([viewport.width, viewport.height]);
      pg.drawImage(img, { x: 0, y: 0, width: viewport.width, height: viewport.height });
      page.cleanup();
    }
    const bytes = await out.save();
    if (bytes.length <= MAX_UPLOAD_BYTES || pass === PASSES[PASSES.length - 1]) {
      if (bytes.length > MAX_UPLOAD_BYTES) {
        throw new Error("still too large after compression — split the file into parts");
      }
      return new File([bytes as unknown as BlobPart], file.name, { type: "application/pdf" });
    }
  }
  throw new Error("compression failed");
}
