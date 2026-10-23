
/* =========================================================
   STUDIO RACINE — INTERACTIONS
   JavaScript natif, sans bibliothèque externe
   ========================================================= */

document.documentElement.classList.add("js-enabled");

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector(".site-header");
  const loader = document.querySelector(".site-loader");
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const progressBar = document.querySelector(".scroll-progress");
  const yearElement = document.querySelector("#current-year");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------------------------------------------------------
     1. ANNÉE AUTOMATIQUE
     --------------------------------------------------------- */

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------
     2. ÉCRAN DE CHARGEMENT
     --------------------------------------------------------- */

  const hideLoader = () => {
    if (!loader) return;

    loader.classList.add("is-hidden");

    // Retire le loader du rendu après sa transition.
    window.setTimeout(() => {
      loader.hidden = true;
    }, 800);
  };

  if (reducedMotion) {
    hideLoader();
  } else {
    // Durée maîtrisée pour conserver une introduction fluide.
    window.setTimeout(hideLoader, 1100);
  }

  // Sécurité : ne pas conserver le loader si le chargement est long.
  window.addEventListener("load", hideLoader, { once: true });

  /* ---------------------------------------------------------
     3. MENU MOBILE
     --------------------------------------------------------- */

  const openMenu = () => {
    if (!menuToggle || !mainNav) return;

    mainNav.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Fermer le menu");
    body.classList.add("menu-open");
  };

  const closeMenu = () => {
    if (!menuToggle || !mainNav) return;

    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
    body.classList.remove("menu-open");
  };

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Fermer après la sélection d'une destination.
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Fermer avec Échap.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    // Évite de conserver le menu mobile lors d'un passage
    // vers la mise en page de bureau.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }

  /* ---------------------------------------------------------
     4. HEADER AU DÉFILEMENT
     --------------------------------------------------------- */

  const updateHeader = () => {
    if (!header) return;

    header.classList.toggle(
      "is-scrolled",
      window.scrollY > 25
    );
  };

  /* ---------------------------------------------------------
     5. BARRE DE PROGRESSION
     --------------------------------------------------------- */

  let scrollScheduled = false;

  const updateScrollProgress = () => {
    const scrollableHeight =
      root.scrollHeight - window.innerHeight;

    const progress =
      scrollableHeight > 0
        ? Math.min(
            100,
            Math.max(0, (window.scrollY / scrollableHeight) * 100)
          )
        : 0;

    if (progressBar) {
      progressBar.style.setProperty(
        "--scroll-width",
        `${progress}%`
      );
    }

    updateHeader();
    scrollScheduled = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (scrollScheduled) return;

      scrollScheduled = true;

      window.requestAnimationFrame(updateScrollProgress);
    },
    { passive: true }
  );

  updateScrollProgress();

  /* ---------------------------------------------------------
     6. RÉVÉLATION DES ÉLÉMENTS
     --------------------------------------------------------- */

  const revealElements = document.querySelectorAll(".reveal");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  /* ---------------------------------------------------------
     7. FAQ : UNE QUESTION OUVERTE À LA FOIS
     --------------------------------------------------------- */

  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;

      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.open) {
          otherItem.open = false;
        }
      });
    });
  });

  /* ---------------------------------------------------------
     8. NAVIGATION INTERNE
     --------------------------------------------------------- */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const target = document.getElementById(href.slice(1));

      // Laisser le navigateur gérer les liens sans cible locale.
      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start"
      });

      // Met à jour le fragment sans déclencher un saut de page.
      if (window.location.hash !== href) {
        window.history.pushState(null, "", href);
      }
    });
  });

  /* ---------------------------------------------------------
     9. ANIMATION DES PROJETS AU SURVOL
     --------------------------------------------------------- */

  const projectVisuals = document.querySelectorAll(".project-visual");

  projectVisuals.forEach((visual) => {
    visual.addEventListener("pointermove", (event) => {
      if (
        reducedMotion ||
        event.pointerType !== "mouse"
      ) {
        return;
      }

      const rect = visual.getBoundingClientRect();
      const relativeX = (event.clientX - rect.left) / rect.width;
      const relativeY = (event.clientY - rect.top) / rect.height;

      visual.style.setProperty(
        "--pointer-x",
        `${relativeX * 100}%`
      );

      visual.style.setProperty(
        "--pointer-y",
        `${relativeY * 100}%`
      );
    });

    visual.addEventListener("pointerleave", () => {
      visual.style.removeProperty("--pointer-x");
      visual.style.removeProperty("--pointer-y");
    });
  });
});
