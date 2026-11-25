// Server-side Cloudinary delete — the API secret must never reach the browser.
// Set CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET in .env.local (see README).
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { public_id, resource_type } = await req.json();
  if (!public_id || !resource_type) {
    return NextResponse.json({ error: "public_id and resource_type required" }, { status: 400 });
  }
  // Scope deletes to this app's namespace — anything else in the Cloudinary
  // account is off-limits even if someone calls this endpoint directly.
  if (!public_id.startsWith("mba-notes/")) {
    return NextResponse.json({ error: "Can only delete files under mba-notes/" }, { status: 403 });
  }

  const cloud = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret) {
    return NextResponse.json({ error: "Server not configured for deletes (set CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET)" }, { status: 500 });
  }

  // Cloudinary signature: SHA-1 of the signed params (alphabetical, joined by &)
  // followed by the api_secret. The signed params must go in the request
  // BODY — the signed-DELETE-with-query-params variant is rejected with 401.
  const ts = Math.floor(Date.now() / 1000);
  const toSign = `public_id=${public_id}&timestamp=${ts}${secret}`;
  const sig = await sha1Hex(toSign);
  const body =
    `public_id=${encodeURIComponent(public_id)}` +
    `&timestamp=${ts}&api_key=${key}&signature=${sig}`;

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/${resource_type}/destroy`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json({ error: `Cloudinary: ${data?.error?.message || res.status}` }, { status: res.status });
  }
  if (data.result === "not found") {
    return NextResponse.json({ error: "File not found on Cloudinary (maybe already deleted)" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

// Plain SHA-1 hex (Web Crypto — works in Node 18+ / edge).
async function sha1Hex(message: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(message));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}
