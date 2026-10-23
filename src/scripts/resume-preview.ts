export function initResumePreview() {
  const sheet = document.querySelector<HTMLElement>("[data-sheet]");
  if (!sheet || sheet.dataset.ready === "true") return () => {};
  sheet.dataset.ready = "true";

  const canvas = sheet.querySelector("canvas");
  const fallback = sheet.querySelector<HTMLElement>("[data-resume-fallback]");
  const src = sheet.dataset.src;
  if (!canvas || !src) {
    delete sheet.dataset.ready;
    return () => {};
  }

  let cancelled = false;

  void (async () => {
    try {
      const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
      if (cancelled) return;
      GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const pdf = await getDocument({ url: new URL(src, window.location.href).href }).promise;
      if (cancelled) return;
      const page = await pdf.getPage(1);
      if (cancelled) return;
      const base = page.getViewport({ scale: 1 });
      const scale = (sheet.clientWidth * window.devicePixelRatio) / base.width;
      const viewport = page.getViewport({ scale });
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      await page.render({ canvas, viewport }).promise;
    } catch {
      if (cancelled) return;
      canvas.hidden = true;
      if (fallback) fallback.hidden = false;
    }
  })();

  return () => {
    cancelled = true;
    delete sheet.dataset.ready;
  };
}
