// Simple theme toggle (light <-> dark) and smooth scroll
(function () {
  console.log("App initialized"); // LOG
  const body = document.body;
  const toggleBtn = document.getElementById("themeToggle");

  const THEME_KEY = "nexaware_theme";

  function applyTheme(theme) {
    console.log(`Applying theme: ${theme}`); // LOG
    if (theme === "dark") {
      body.classList.add("dark");
    } else {
      body.classList.remove("dark");
    }
  }

  function getPreferredTheme() {
    const stored = window.localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") {
      console.log(`Found stored theme: ${stored}`); // LOG
      return stored;
    }

    // fallback to system preference
    if (window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches) {
      console.log("Using system preference: dark"); // LOG
      return "dark";
    }
    console.log("Using default preference: light"); // LOG
    return "light";
  }

  let currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      console.log("Theme toggle clicked"); // LOG
      currentTheme = currentTheme === "dark" ? "light" : "dark";
      window.localStorage.setItem(THEME_KEY, currentTheme);
      applyTheme(currentTheme);
    });
  }

  // Smooth scroll for any element with data-scroll-target
  document.addEventListener("click", function (e) {
    const target = e.target;
    if (target && target.dataset && target.dataset.scrollTarget) {
      console.log(`Scroll target clicked: ${target.dataset.scrollTarget}`); // LOG
      const selector = target.dataset.scrollTarget;
      const el = document.querySelector(selector);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.warn(`Scroll target element not found: ${selector}`); // LOG
      }
    }
  });

  // Scroll Reveal Animations
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log(`Element revealed: ${entry.target.tagName} ${entry.target.className}`); // LOG
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
    observer.observe(el);
    console.log("Observer attached to element", el); // LOG
  });
})();
