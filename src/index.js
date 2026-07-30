// Main entry for the public-facing site.
// Tailwind v4 picks up utility classes used anywhere in /site and /src at build time.
import "./css/main.css";

// Mobile menu toggle
const mobileMenu = document.querySelector("[data-mobile-menu]");
const nav = document.querySelector("[data-nav]");

function toggleMobileMenu() {
  nav.classList.toggle("menu-open");
}

if (mobileMenu) {
  mobileMenu.addEventListener("click", toggleMobileMenu);
}

// Close mobile menu when a nav link is clicked
document.querySelectorAll("[data-nav] a[href^='#'], [data-nav] a[href^='/']").forEach((a) => {
  a.addEventListener("click", () => {
    if (nav && nav.classList.contains("menu-open")) {
      nav.classList.remove("menu-open");
    }
  });
});

// Reveal-on-scroll for sections tagged with [data-reveal]
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
}
