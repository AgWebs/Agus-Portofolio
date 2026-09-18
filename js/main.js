// ============ Shared behaviour across all pages ============

document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu toggle
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuToggle && mobileMenu) {
    const bars = menuToggle.querySelectorAll(".menu-bar");

    const setOpen = (open) => {
      menuToggle.setAttribute("aria-expanded", String(open));
      mobileMenu.classList.toggle("hidden", !open);
      mobileMenu.classList.toggle("flex", open);

      if (bars.length === 3) {
        bars[0].style.transform = open ? "translateY(6px) rotate(45deg)" : "";
        bars[1].style.opacity = open ? "0" : "1";
        bars[2].style.transform = open ? "translateY(-6px) rotate(-45deg)" : "";
      }
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      setOpen(!isOpen);
    });

    // Close menu after tapping a link
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    // Close on escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  }
});
