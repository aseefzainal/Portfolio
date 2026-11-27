"use client";

import { useState } from "react";
import html2canvas from "html2canvas";
import { PDFDocument } from "pdf-lib";

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = Math.round((A4_WIDTH_PX * 297) / 210);
const A4_WIDTH_PT = 595.28;
const A4_HEIGHT_PT = 841.89;

async function waitForImages(root: HTMLElement) {
  const images = [...root.querySelectorAll("img")];
  await Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve) => {
          if (image.complete) {
            resolve();
            return;
          }
          image.addEventListener("load", () => resolve(), { once: true });
          image.addEventListener("error", () => resolve(), { once: true });
        }),
    ),
  );
}

function canvasToPng(canvas: HTMLCanvasElement) {
  return new Promise<Uint8Array>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not render resume page."));
          return;
        }
        void blob.arrayBuffer().then((buffer) => resolve(new Uint8Array(buffer)), reject);
      },
      "image/png",
    );
  });
}

export function ResumeDownloadButton({ filename }: { filename: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleDownload() {
    const source = document.querySelector<HTMLElement>("[data-resume-export-root]");
    if (!source) {
      setError("Resume preview is not ready yet.");
      return;
    }

    setBusy(true);
    setError("");

    const mount = document.createElement("div");
    mount.setAttribute("aria-hidden", "true");
    mount.style.cssText = `position:fixed;left:-10000px;top:0;width:${A4_WIDTH_PX}px;background:#fff;pointer-events:none;`;
    const clone = source.cloneNode(true) as HTMLElement;
    clone.removeAttribute("data-resume-export-root");
    mount.appendChild(clone);
    document.body.appendChild(mount);

    try {
      await waitForImages(clone);
      const fullCanvas = await html2canvas(clone, {
        backgroundColor: "#ffffff",
        scale: 2,
        width: A4_WIDTH_PX,
        windowWidth: A4_WIDTH_PX,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const scale = fullCanvas.width / A4_WIDTH_PX;
      const pagePixelHeight = Math.round(A4_HEIGHT_PX * scale);
      const pageCount = Math.max(1, Math.ceil(fullCanvas.height / pagePixelHeight));
      const pdf = await PDFDocument.create();

      for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
        const isLast = pageIndex === pageCount - 1;
        const sliceHeight = isLast
          ? Math.min(pagePixelHeight, Math.max(1, fullCanvas.height - pageIndex * pagePixelHeight))
          : pagePixelHeight;
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = fullCanvas.width;
        pageCanvas.height = sliceHeight;
        const context = pageCanvas.getContext("2d");
        if (!context) throw new Error("Could not render resume page.");

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        context.drawImage(
          fullCanvas,
          0,
          pageIndex * pagePixelHeight,
          fullCanvas.width,
          sliceHeight,
          0,
          0,
          fullCanvas.width,
          sliceHeight,
        );

        const png = await canvasToPng(pageCanvas);
        const image = await pdf.embedPng(png);
        const pageHeightPt = isLast
          ? Math.max(1, (sliceHeight / pagePixelHeight) * A4_HEIGHT_PT)
          : A4_HEIGHT_PT;
        const page = pdf.addPage([A4_WIDTH_PT, pageHeightPt]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: A4_WIDTH_PT,
          height: pageHeightPt,
        });
      }

      const bytes = await pdf.save();
      const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Could not generate the PDF. Try again or use your browser print dialog.";
      setError(message);
    } finally {
      mount.remove();
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={busy}
        onClick={() => void handleDownload()}
        className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
      >
        {busy ? "Preparing…" : "Download"}
      </button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
