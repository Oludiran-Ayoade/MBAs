// Theme toggle + service worker registration (loaded on every page).
// The initial theme is applied by the inline <script> in <head> to avoid a flash.
(function () {
  const btn = document.getElementById("themeToggle");
  function sync() {
    if (btn) btn.textContent = document.documentElement.dataset.theme === "dark" ? "☀️" : "🌙";
  }
  sync();
  if (btn) btn.onclick = () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.theme = next;
    sync();
  };

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
