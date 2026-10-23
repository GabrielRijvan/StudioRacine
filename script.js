
/* =========================================================
   STUDIO RACINE — INTERACTIONS
   ========================================================= */

document.documentElement.classList.add("js-enabled");

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".main-nav a");
  const scrollProgress = document.querySelector(".scroll-progress");
  const yearElement = document.querySelector("#current-year");

  /* 01. ANNÉE AUTOMATIQUE
     ========================================================= */

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  /* 02. MENU MOBILE
     ========================================================= */

  if (menuToggle && mainNav) {
    const closeMenu = () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Ouvrir le menu");

      mainNav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    };

    const openMenu = () => {
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Fermer le menu");

      mainNav.classList.add("is-open");
      document.body.classList.add("menu-open");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Fermer le menu après un clic sur un lien.
    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Fermer avec la touche Échap.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    // Fermer si la fenêtre repasse en mode ordinateur.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) {
        closeMenu();
      }
    });
  }


  /* 03. HEADER AU DÉFILEMENT
     ========================================================= */

  const updateHeader = () => {
    if (!header) return;

    header.classList.toggle(
      "is-scrolled",
      window.scrollY > 30
    );
  };

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });


  /* 04. BARRE DE PROGRESSION
     ========================================================= */

  let progressTicking = false;

  const updateProgress = () => {
    if (!scrollProgress) return;

    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress =
      scrollableHeight > 0
        ? (window.scrollY / scrollableHeight) * 100
        : 0;

    scrollProgress.style.width = `${Math.min(progress, 100)}%`;

    progressTicking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (progressTicking) return;

      progressTicking = true;
      window.requestAnimationFrame(updateProgress);
    },
    { passive: true }
  );

  window.addEventListener("resize", updateProgress);

  updateProgress();


  /* 05. APPARITION DES ÉLÉMENTS AU SCROLL
     ========================================================= */

  const revealElements = document.querySelectorAll("[data-reveal]");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (
    "IntersectionObserver" in window &&
    !prefersReducedMotion
  ) {
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
  } else {
    // Afficher le contenu si les animations sont indisponibles.
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }


  /* 06. FAQ : UNE SEULE RÉPONSE OUVERTE À LA FOIS
     ========================================================= */

  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;

      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.open = false;
        }
      });
    });
  });


  /* 07. LIENS INTERNES AVEC DÉFILEMENT FLUIDE
     ========================================================= */

  const internalLinks = document.querySelectorAll(
    'a[href^="#"]:not([href="#"])'
  );

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });

      // Mettre à jour le fragment de l'URL sans saut brutal.
      if (window.location.hash !== targetId) {
        window.history.pushState(null, "", targetId);
      }
    });
  });


  /* 08. SÉCURITÉ : LIENS VERS DES ANCRES INEXISTANTES
     ========================================================= */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const href = link.getAttribute("href");

    if (!href || href === "#") return;

    if (!document.querySelector(href)) {
      console.warn(
        `Studio Racine : la cible "${href}" n'existe pas dans le HTML.`
      );
    }
  });

});
