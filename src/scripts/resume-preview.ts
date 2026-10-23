import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = workerUrl;

export async function initResumePreview() {
  const sheet = document.querySelector<HTMLElement>("[data-sheet]");
  if (!sheet || sheet.dataset.ready === "true") return;
  sheet.dataset.ready = "true";

  const canvas = sheet.querySelector("canvas");
  const fallback = sheet.querySelector<HTMLElement>("[data-resume-fallback]");
  const src = sheet.dataset.src;
  if (!canvas || !src) return;

  try {
    const pdf = await getDocument({ url: new URL(src, window.location.href).href }).promise;
    const page = await pdf.getPage(1);
    const base = page.getViewport({ scale: 1 });
    const scale = (sheet.clientWidth * window.devicePixelRatio) / base.width;
    const viewport = page.getViewport({ scale });
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    await page.render({ canvas, viewport }).promise;
  } catch {
    canvas.hidden = true;
    if (fallback) fallback.hidden = false;
  }
}
