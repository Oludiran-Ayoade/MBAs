import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import AppToaster from "@/components/AppToaster";

export const metadata: Metadata = {
  title: "LCU MBA Notes Hub | First Semester 2026/2027",
  description: "Course notes and pictorial study pages for Lead City University MBA, First Semester 2026/2027",
  manifest: "/manifest.json",
  icons: { icon: "/icon.svg" }
};

export const viewport: Viewport = { themeColor: "#0c2340" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{document.documentElement.dataset.theme=localStorage.theme||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}catch(e){}})();`
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteHeader />
        {children}
        <footer className="site-footer">
          <div className="wrap foot-grid">
            <div className="foot-cell">
              <b>LCU MBA Notes Hub</b>
              <span>Postgraduate College · Lead City University, Ibadan</span>
            </div>
            <div className="foot-cell">
              <b>Built by students, for students</b>
              <span>MBA · First Semester · 2026/2027</span>
            </div>
            <div className="foot-cell">
              <a className="foot-top" href="#">Back to top ↑</a>
            </div>
          </div>
        </footer>
        <AppToaster />
      </body>
    </html>
  );
}
