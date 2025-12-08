// Simple theme toggle (light <-> dark) and smooth scroll
(function () {
  const body = document.body;
  const toggleBtn = document.getElementById("themeToggle");

  const THEME_KEY = "nexaware_theme";

  function applyTheme(theme) {
    if (theme === "dark") {
      body.classList.add("dark");
    } else {
      body.classList.remove("dark");
    }
  }

  function getPreferredTheme() {
    const stored = window.localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;

    // fallback to system preference
    if (window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }

  let currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      currentTheme = currentTheme === "dark" ? "light" : "dark";
      window.localStorage.setItem(THEME_KEY, currentTheme);
      applyTheme(currentTheme);
    });
  }

  // Smooth scroll for any element with data-scroll-target
  document.addEventListener("click", function (e) {
    const target = e.target;
    if (target && target.dataset && target.dataset.scrollTarget) {
      const selector = target.dataset.scrollTarget;
      const el = document.querySelector(selector);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });
})();
