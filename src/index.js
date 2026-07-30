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

// Language switcher — vanilla dropdown with click, click-outside, and Esc
function closeAllLangMenus() {
  document.querySelectorAll("[data-lang-switcher][data-open='true']").forEach((el) => {
    el.removeAttribute("data-open");
    const toggle = el.querySelector("[data-lang-toggle]");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  });
}

document.querySelectorAll("[data-lang-switcher]").forEach((root) => {
  const toggle = root.querySelector("[data-lang-toggle]");
  const menu = root.querySelector("[data-lang-menu]");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = root.getAttribute("data-open") === "true";
    closeAllLangMenus();
    if (!isOpen) {
      root.setAttribute("data-open", "true");
      toggle.setAttribute("aria-expanded", "true");
    }
  });

  menu.addEventListener("click", (e) => e.stopPropagation());
});

document.addEventListener("click", () => closeAllLangMenus());
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAllLangMenus();
});
