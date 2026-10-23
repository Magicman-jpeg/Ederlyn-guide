/* =============================================================
   Ederlyn H. Caparas — Portfolio · script.js
   Lightweight vanilla JS:
     1. Persistent light/dark theme (localStorage + OS preference)
     2. Scroll-reveal entrance motion (anime.js if present; graceful
        CSS/no-JS fallback otherwise)
     3. Accessible smooth scrolling
     4. Dynamic copyright year
   No build step. anime.js is optional — the site works without it.
   ============================================================= */

(function () {
  "use strict";

  /* Mark that JS is active so CSS can hide reveal elements pre-animation.
     If JS is disabled, content stays visible (no .js class). */
  document.documentElement.classList.add("js");

  var root = document.documentElement;
  var prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================================================
     1. THEME
     ========================================================= */
  var STORAGE_KEY = "ec-portfolio-theme";
  var DARK = "dark";
  var LIGHT = "light";

  var toggleBtn = document.getElementById("theme-toggle");
  var toggleLabel = toggleBtn
    ? toggleBtn.querySelector(".theme-toggle__label")
    : null;
  var themeColorMeta = document.querySelector('meta[name="theme-color"]');

  function getInitialTheme() {
    var saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      /* storage blocked (private mode) — ignore */
    }
    if (saved === DARK || saved === LIGHT) return saved;

    var prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? DARK : LIGHT;
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);

    // Keep the browser chrome color in sync with the page background.
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", theme === DARK ? "#0b0f18" : "#fafbfc");
    }

    if (!toggleBtn) return;
    var isDark = theme === DARK;
    toggleBtn.setAttribute("aria-pressed", String(isDark));
    toggleBtn.setAttribute(
      "aria-label",
      isDark ? "Switch to light theme" : "Switch to dark theme"
    );
    if (toggleLabel) toggleLabel.textContent = isDark ? "Light" : "Dark";
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* ignore write failure */
    }
  }

  function toggleTheme() {
    var next = root.getAttribute("data-theme") === DARK ? LIGHT : DARK;
    applyTheme(next);
    saveTheme(next);
  }

  applyTheme(getInitialTheme());
  if (toggleBtn) toggleBtn.addEventListener("click", toggleTheme);

  // Follow live OS theme changes only if the user hasn't chosen manually.
  if (window.matchMedia) {
    var media = window.matchMedia("(prefers-color-scheme: dark)");
    var onSchemeChange = function (e) {
      var hasSaved = false;
      try {
        hasSaved = Boolean(localStorage.getItem(STORAGE_KEY));
      } catch (err) {
        /* ignore */
      }
      if (!hasSaved) applyTheme(e.matches ? DARK : LIGHT);
    };
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onSchemeChange);
    } else if (typeof media.addListener === "function") {
      media.addListener(onSchemeChange); // older Safari
    }
  }

  /* =========================================================
     2. SCROLL REVEAL
     ========================================================= */
  var revealEls = Array.prototype.slice.call(
    document.querySelectorAll("[data-reveal]")
  );

  // Reveal everything immediately if motion is reduced or tech is missing.
  function revealAll() {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
      el.style.opacity = "";
      el.style.transform = "";
    });
  }

  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealAll();
  } else {
    var hasAnime = typeof window.anime === "function";

    var animateIn = function (el) {
      if (hasAnime) {
        // anime.js: smooth, GPU-friendly (opacity + translateY only).
        window.anime({
          targets: el,
          opacity: [0, 1],
          translateY: [16, 0],
          easing: "cubicBezier(0.22, 0.61, 0.36, 1)",
          duration: 650,
        });
        el.classList.add("is-visible");
      } else {
        // Fallback: let the CSS transition handle it via the class toggle.
        el.classList.add("is-visible");
      }
    };

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          // Light stagger by DOM order for a composed feel.
          var delay = Math.min(revealEls.indexOf(el) % 4, 3) * 60;
          window.setTimeout(function () {
            animateIn(el);
          }, delay);
          obs.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });

    // Reveal above-the-fold items on load (they may already be past the
    // viewport before the observer fires).
    window.addEventListener("load", function () {
      revealEls.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && !el.classList.contains("is-visible")) {
          animateIn(el);
        }
      });
    });

    // Hard safety net: never let content stay invisible. If, for any reason,
    // the observer hasn't revealed an element within a few seconds (e.g. a
    // failed CDN, an unexpected layout, or an automated full-page capture),
    // force it visible so the page is never broken.
    window.setTimeout(function () {
      revealEls.forEach(function (el) {
        if (!el.classList.contains("is-visible")) {
          el.classList.add("is-visible");
          el.style.opacity = "";
          el.style.transform = "";
        }
      });
    }, 2500);
  }

  /* =========================================================
     3. SMOOTH SCROLL + FOCUS (accessible in-page nav)
     ========================================================= */
  var inPageLinks = document.querySelectorAll('a[href^="#"]');
  inPageLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var id = link.getAttribute("href");
      if (!id || id === "#" || id.length < 2) return;

      var target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: prefersReduced ? "auto" : "smooth",
        block: "start",
      });

      // Move focus into the section for keyboard / screen-reader users.
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });

  /* =========================================================
     4. DYNAMIC YEAR
     ========================================================= */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
