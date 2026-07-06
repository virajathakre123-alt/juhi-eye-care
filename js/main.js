const body = document.body;
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-site-nav]");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("[data-treatment-toggle]")) {
      return;
    }

    if (event.target.closest("a")) {
      body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

document.querySelectorAll("[data-treatment-toggle]").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const isExpanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isExpanded));
  });
});

const currentPage = window.location.pathname.split("/").pop() || "index.html";
const navAlias = {
  "treatment-detail.html": "treatments.html"
};
const activePage = navAlias[currentPage] || currentPage;

const setActiveNavLinks = () => {
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    const href = link.getAttribute("href");

    link.classList.remove("is-active");
    link.removeAttribute("aria-current");

    if (href === activePage || (activePage === "" && href === "index.html")) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });
};

setActiveNavLinks();
document.addEventListener("navbar:loaded", setActiveNavLinks);

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const floatingActions = document.querySelector(".home-quick-actions");
const footerElement = document.querySelector("footer.site-footer");

if (floatingActions && footerElement) {
  const footerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          floatingActions.classList.add("home-quick-actions--stopped");
        } else {
          floatingActions.classList.remove("home-quick-actions--stopped");
        }
      });
    },
    { threshold: 0 }
  );

  footerObserver.observe(footerElement);
}
