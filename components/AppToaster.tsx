"use client";

import { Toaster } from "sonner";

// Styled via the site's CSS vars so it follows light/dark automatically
// (data-theme on <html> flips the var values — no JS needed).
export default function AppToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: "var(--card)",
          color: "var(--ink)",
          border: "1px solid var(--line)",
          borderRadius: "14px",
          fontFamily: "inherit",
          boxShadow: "var(--shadow-3)"
        },
        classNames: {
          description: "toast-desc",
          actionButton: "toast-btn toast-btn-danger",
          cancelButton: "toast-btn toast-btn-ghost",
          error: "toast-err",
          success: "toast-ok"
        }
      }}
    />
  );
}
