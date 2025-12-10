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

    // Default to dark theme for all users if no preference is stored
    return "dark";
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

  // Contact Modal Logic
  const modal = document.getElementById("contactModal");
  // Header button no longer opens modal directly, it scrolls (handled by data-scroll-target)
  const footerContactBtn = document.getElementById("openContactModalFooter");
  const closeBtn = document.getElementById("closeModal");
  const form = document.getElementById("contactForm");
  const statusDiv = document.getElementById("formStatus");

  function openModal() {
    if (modal) {
      modal.classList.add("is-active");
      document.body.style.overflow = "hidden"; // Prevent background scroll
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove("is-active");
      document.body.style.overflow = "";

      // Reset form if it was successful (optional UX choice)
      if (statusDiv && statusDiv.classList.contains("success")) {
        statusDiv.innerText = "";
        statusDiv.classList.remove("success");
        form.reset();
      }
    }
  }

  // ONLY Footer button opens modal
  if (footerContactBtn) {
    footerContactBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  // Close on outside click
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && modal.classList.contains("is-active")) {
      closeModal();
    }
  });

  // Handle EmailJS Form Submission
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const btn = form.querySelector("button[type='submit']");
      const originalText = btn.innerText;

      // Reset status
      statusDiv.className = "form-status";
      statusDiv.innerText = "";

      // Loading state
      btn.innerText = "Sending...";
      btn.disabled = true;

      const serviceID = 'service_uwppumc';
      const templateID = 'template_38qn096';

      emailjs.sendForm(serviceID, templateID, this)
        .then(() => {
          statusDiv.innerText = "Thanks! Message sent successfully.";
          statusDiv.classList.add("success");
          form.reset();
          btn.innerText = originalText;
          btn.disabled = false;
          // Optionally close modal after delay
          setTimeout(closeModal, 2000);
        }, (err) => {
          btn.innerText = originalText;
          btn.disabled = false;
          statusDiv.innerText = "Oops! " + JSON.stringify(err);
          statusDiv.classList.add("error");
          console.error("EmailJS Error:", err);
        });
    });
  }

  // Initialize icons again
  if (window.lucide) {
    window.lucide.createIcons();
  }
})();
