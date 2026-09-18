// ============ Contact form: validation + mailto handoff ============
// No backend is wired up here — this composes a mailto: link so the message
// goes out through the visitor's own email client. Swap this for a real
// endpoint (Formspree, a serverless function, etc.) if you want messages
// delivered without opening the visitor's mail app.

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const successMsg = document.getElementById("form-success");
  const destinationEmail = "agussuardita2@gmail.com";

  const fields = {
    name: form.querySelector("#name"),
    email: form.querySelector("#email"),
    message: form.querySelector("#message"),
  };

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const showError = (field, show) => {
    const errorEl = field.closest("div").querySelector(".field-error");
    field.classList.toggle("border-clay", show);
    errorEl?.classList.toggle("hidden", !show);
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    successMsg?.classList.add("hidden");

    const nameValid = fields.name.value.trim().length > 0;
    const emailValid = isValidEmail(fields.email.value.trim());
    const messageValid = fields.message.value.trim().length > 0;

    showError(fields.name, !nameValid);
    showError(fields.email, !emailValid);
    showError(fields.message, !messageValid);

    if (!nameValid || !emailValid || !messageValid) {
      const firstInvalid = !nameValid ? fields.name : !emailValid ? fields.email : fields.message;
      firstInvalid.focus();
      return;
    }

    const subject = encodeURIComponent(`Pesan dari portofolio — ${fields.name.value.trim()}`);
    const body = encodeURIComponent(
      `${fields.message.value.trim()}\n\n— ${fields.name.value.trim()} (${fields.email.value.trim()})`
    );

    window.location.href = `mailto:${destinationEmail}?subject=${subject}&body=${body}`;
    successMsg?.classList.remove("hidden");
    form.reset();
  });

  // Clear error state as the visitor types
  Object.values(fields).forEach((field) => {
    field.addEventListener("input", () => showError(field, false));
  });
});
