const header = document.querySelector("#site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("#primary-navigation");
const navigationItems = [...document.querySelectorAll(".nav-links a[href^='#']")];
const sections = [...document.querySelectorAll("main section[id]")];

const setHeaderState = () => {
  header?.classList.toggle("scrolled", window.scrollY > 24);
};

const closeNavigation = () => {
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Open navigation");
  navLinks?.classList.remove("open");
  document.body.classList.remove("nav-open");
};

navToggle?.addEventListener("click", () => {
  const opening = navToggle.getAttribute("aria-expanded") !== "true";
  navToggle.setAttribute("aria-expanded", String(opening));
  navToggle.setAttribute("aria-label", opening ? "Close navigation" : "Open navigation");
  navLinks?.classList.toggle("open", opening);
  document.body.classList.toggle("nav-open", opening);
});

navigationItems.forEach((link) => {
  link.addEventListener("click", closeNavigation);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 800) closeNavigation();
});

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

const revealItems = document.querySelectorAll(".reveal");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -48px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navigationItems.forEach((link) => {
        const active = link.getAttribute("href") === `#${visible.target.id}`;
        link.classList.toggle("active", active);
        if (active) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },
    { rootMargin: "-30% 0px -55% 0px", threshold: [0.05, 0.25, 0.5] }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();
