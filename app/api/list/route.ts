// Server-side proxy for listing a course tag's Cloudinary resources.
// Browsers can't call res.cloudinary.com/.../list/<tag>.json directly
// (its Accept-Encoding brotli quirk), and that CDN list is heavily cached -
// fresh uploads can take minutes to show. The Admin API is real-time, so we
// use it whenever the API secret is configured and fall back to the CDN list.
import { NextResponse } from "next/server";
import { get } from "https";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag") || "";
  const type = searchParams.get("type");
  const cloud = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  // Tag is interpolated into the Cloudinary URL - keep it to safe chars.
  if (!/^[a-zA-Z0-9_-]+$/.test(tag) || (type !== "image" && type !== "raw") || !cloud) {
    return NextResponse.json({ error: "tag ([a-z0-9_-]+), type (image|raw) and a configured cloud are required" }, { status: 400 });
  }

  try {
    if (key && secret) {
      const resources = await adminList(cloud, type, tag, key, secret);
      if (resources) return NextResponse.json({ resources });
      // Admin call failed (e.g. bad credentials) - drop through to the CDN path.
    }
    const { status, body } = await httpsGetJson(
      `https://res.cloudinary.com/${cloud}/${type}/list/${encodeURIComponent(tag)}.json`
    );
    // Cloudinary 404s a tag with no resources - that's an empty list, not an
    // error. Returning 200 keeps these routine requests out of the console.
    if (status === 404) return NextResponse.json({ resources: [] });
    return NextResponse.json(body, { status });
  } catch {
    return NextResponse.json({ error: "Cloudinary request failed" }, { status: 502 });
  }
}

// Admin API: resources by tag. Real-time (unlike the CDN list) - returns the
// same resource shape. Pages through next_cursor in case a tag ever grows
// past the 500-per-response cap.
async function adminList(cloud: string, type: string, tag: string, key: string, secret: string) {
  const auth = "Basic " + Buffer.from(`${key}:${secret}`).toString("base64");
  const resources: unknown[] = [];
  let cursor: string | undefined;
  for (let page = 0; page < 8; page++) {
    const u = new URL(`https://api.cloudinary.com/v1_1/${cloud}/resources/${type}/tags/${encodeURIComponent(tag)}`);
    u.searchParams.set("max_results", "500");
    u.searchParams.set("tags", "true");
    if (cursor) u.searchParams.set("next_cursor", cursor);
    const res = await fetch(u, { headers: { Authorization: auth }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const j = await res.json();
    resources.push(...(j.resources || []));
    cursor = j.next_cursor;
    if (!cursor) break;
  }
  return resources;
}

// Node's https module sends no Accept-Encoding (=> identity, plain JSON),
// which is exactly what dodges the brotli 404.
function httpsGetJson(url: string): Promise<{ status: number; body: unknown }> {
  return new Promise((resolve, reject) => {
    get(url, (res) => {
      let data = "";
      res.on("data", (c: Buffer) => (data += c));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode ?? 502, body: JSON.parse(data) });
        } catch {
          // Cloudinary's 404/5xx bodies aren't JSON - the client only needs
          // the status (404 = empty tag), so wrap it in an error object.
          resolve({ status: res.statusCode ?? 502, body: { error: data.slice(0, 200) || "Cloudinary error" } });
        }
      });
    }).on("error", reject);
  });
}
