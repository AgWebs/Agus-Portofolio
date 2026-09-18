// ============ Projects page: filtering + detail modal ============

document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");
  const emptyState = document.getElementById("empty-state");

  const applyFilter = (filter) => {
    let visibleCount = 0;

    cards.forEach((card) => {
      const match = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !match);
      if (match) visibleCount++;
    });

    if (emptyState) emptyState.classList.toggle("hidden", visibleCount !== 0);
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => {
        b.classList.remove("bg-ink", "text-paper", "border-ink");
        b.classList.add("border-ink/30", "text-ink-soft");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("bg-ink", "text-paper", "border-ink");
      btn.classList.remove("border-ink/30", "text-ink-soft");
      btn.setAttribute("aria-pressed", "true");

      applyFilter(btn.dataset.filter);
    });
  });

  // Open project card directly if URL has a matching hash (e.g. projects.html#sangket-desa)
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) target.scrollIntoView({ block: "start" });
  }

  // ============ Detail modal ============
  const modal = document.getElementById("project-modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalClose = document.getElementById("modal-close");
  const modalTitle = document.getElementById("modal-title");
  const modalEyebrow = document.getElementById("modal-eyebrow");
  const modalBody = document.getElementById("modal-body");

  const openModal = (card) => {
    const title = card.querySelector("h3")?.textContent ?? "";
    const eyebrow = card.querySelector("p")?.textContent ?? "";
    const body = card.querySelector("p.text-sm")?.textContent ?? "";

    modalTitle.textContent = title;
    modalEyebrow.textContent = eyebrow;
    modalBody.textContent = body;

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden";
    modalClose.focus();
  };

  const closeModal = () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".detail-btn").forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn.closest(".project-card")));
  });

  modalClose?.addEventListener("click", closeModal);
  modalBackdrop?.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
  });
});
