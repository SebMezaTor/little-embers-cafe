"use strict";
/* Hamburger Menu */
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobile-nav");

hamburger.addEventListener("click", () => {
  const isOpen = hamburger.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", String(isOpen));
  if (isOpen) {
    mobileNav.removeAttribute("hidden");
  } else {
    mobileNav.setAttribute("hidden", "");
  }
});

/* Close when NAV link is clicked */
mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    mobileNav.setAttribute("hidden", "");
  });
});

/* Scroll Reveal */
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px",
  },
);
revealEls.forEach((el) => revealObserver.observe(el));
