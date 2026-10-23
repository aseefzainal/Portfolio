type Result = { error?: string };

export function initContact() {
  const form = document.querySelector<HTMLFormElement>("#contact-form");
  if (!form || form.dataset.ready === "true") return;
  form.dataset.ready = "true";

  const status = form.querySelector<HTMLElement>("[data-status]");
  const button = form.querySelector<HTMLButtonElement>("button[type='submit']");

  function setStatus(type: "idle" | "success" | "error", text: string) {
    if (!status) return;
    status.hidden = text.length === 0;
    status.textContent = text;
    status.className = type === "error" ? "text-sm text-destructive" : "text-sm text-muted-foreground";
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    if (button) {
      button.disabled = true;
      button.textContent = "Sending...";
    }
    setStatus("idle", "");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });
      const result = (await response.json()) as Result;
      if (!response.ok) {
        setStatus("error", result.error ?? "The message could not be sent. Try again.");
        return;
      }
      form.reset();
      setStatus("success", "Message sent. I'll reply by email.");
    } catch {
      setStatus("error", "The message could not be sent. Try again.");
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = "Send message";
      }
    }
  });
}
