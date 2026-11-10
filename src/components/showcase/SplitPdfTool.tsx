"use client";

import { useEffect, useState } from "react";
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  createZip,
  downloadBlob,
  downloadPdf,
  getPdfPageCount,
  splitPdfByPages,
  splitPdfToSeparatePages,
} from "@/lib/pdf-tools";
import { cn } from "@/lib/utils";

type Thumb = { page: number; url: string };

function allPages(count: number) {
  return new Set(Array.from({ length: count }, (_, index) => index + 1));
}

export function SplitPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [mergePages, setMergePages] = useState(true);
  const [thumbs, setThumbs] = useState<Thumb[]>([]);
  const [busy, setBusy] = useState(false);
  const [loadingPages, setLoadingPages] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      for (const thumb of thumbs) URL.revokeObjectURL(thumb.url);
    };
  }, [thumbs]);

  async function loadThumbs(nextFile: File, count: number) {
    setLoadingPages(true);
    setThumbs((current) => {
      for (const thumb of current) URL.revokeObjectURL(thumb.url);
      return [];
    });

    try {
      const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
      GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const data = await nextFile.arrayBuffer();
      const pdf = await getDocument({ data: new Uint8Array(data) }).promise;
      const next: Thumb[] = [];

      for (let page = 1; page <= count; page += 1) {
        const pdfPage = await pdf.getPage(page);
        const viewport = pdfPage.getViewport({ scale: 0.4 });
        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        await pdfPage.render({ canvas, viewport }).promise;
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", 0.75),
        );
        if (blob) next.push({ page, url: URL.createObjectURL(blob) });
      }

      setThumbs(next);
    } catch {
      setThumbs([]);
    } finally {
      setLoadingPages(false);
    }
  }

  async function onFile(list: FileList | null) {
    const next = list?.[0];
    if (!next) return;
    if (next.type !== "application/pdf" && !next.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files are supported.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const count = await getPdfPageCount(next);
      setFile(next);
      setPageCount(count);
      setSelected(allPages(count));
      setBusy(false);
      void loadThumbs(next, count);
    } catch (err) {
      setFile(null);
      setPageCount(0);
      setSelected(new Set());
      setThumbs((current) => {
        for (const thumb of current) URL.revokeObjectURL(thumb.url);
        return [];
      });
      setError(err instanceof Error ? err.message : "Could not read that PDF.");
      setBusy(false);
    }
  }

  function togglePage(page: number) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(page)) next.delete(page);
      else next.add(page);
      return next;
    });
  }

  async function handleSplit() {
    if (!file || pageCount < 1) {
      setError("Choose a PDF first.");
      return;
    }
    if (selected.size === 0) {
      setError("Tick at least one page to keep.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const pages = [...selected].sort((a, b) => a - b);
      const base = file.name.replace(/\.pdf$/i, "") || "document";

      if (mergePages) {
        const bytes = await splitPdfByPages(file, pages);
        downloadPdf(bytes, `${base}-pages.pdf`);
      } else {
        const parts = await splitPdfToSeparatePages(file, pages);
        if (parts.length === 1) {
          downloadPdf(parts[0].bytes, `${base}-page-${parts[0].page}.pdf`);
        } else {
          const zip = createZip(
            parts.map((part) => ({
              name: `${base}-page-${part.page}.pdf`,
              data: part.bytes,
            })),
          );
          downloadBlob(new Blob([new Uint8Array(zip)], { type: "application/zip" }), `${base}-pages.zip`);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not split PDF.");
    } finally {
      setBusy(false);
    }
  }

  function clearFile() {
    setFile(null);
    setPageCount(0);
    setSelected(new Set());
    setMergePages(true);
    setThumbs((current) => {
      for (const thumb of current) URL.revokeObjectURL(thumb.url);
      return [];
    });
    setLoadingPages(false);
    setError("");
  }

  const thumbByPage = new Map(thumbs.map((thumb) => [thumb.page, thumb.url]));

  return (
    <div className="mt-8 grid gap-6">
      <label
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed px-6 py-10 text-center transition-colors hover:bg-accent/40",
        )}
      >
        <span className="text-sm font-medium">
          {file ? file.name : "Drop a PDF here or browse"}
        </span>
        <span className="mt-1 text-xs text-muted-foreground">
          {file ? `${pageCount} page${pageCount === 1 ? "" : "s"}` : "Processed locally in your browser"}
        </span>
        <input
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          onChange={(event) => {
            void onFile(event.target.files);
            event.target.value = "";
          }}
        />
      </label>

      {file ? (
        <div className="grid gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-medium">Pages to keep</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Tick pages to keep. Unticked pages are removed.{" "}
                {selected.size} of {pageCount} selected.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busy || loadingPages || selected.size === pageCount}
                onClick={() => setSelected(allPages(pageCount))}
              >
                Select all
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busy || loadingPages || selected.size === 0}
                onClick={() => setSelected(new Set())}
              >
                Clear ticks
              </Button>
            </div>
          </div>

          {loadingPages ? (
            <p className="text-sm text-muted-foreground">Loading page previews…</p>
          ) : null}

          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: pageCount }, (_, index) => {
              const page = index + 1;
              const checked = selected.has(page);
              const thumbUrl = thumbByPage.get(page);

              return (
                <li key={page}>
                  <button
                    type="button"
                    aria-pressed={checked}
                    disabled={busy}
                    onClick={() => togglePage(page)}
                    className={cn(
                      "group relative flex h-full w-full flex-col overflow-hidden rounded-md border text-left transition-colors",
                      checked
                        ? "border-foreground bg-accent/30"
                        : "border-border opacity-70 hover:opacity-100",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-2 left-2 z-10 flex size-5 items-center justify-center rounded-[4px] border bg-background shadow-sm",
                        checked
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input",
                      )}
                    >
                      {checked ? <CheckIcon className="size-3.5" /> : null}
                    </span>
                    <span className="relative block aspect-[3/4] w-full shrink-0 overflow-hidden bg-muted/40">
                      {thumbUrl ? (
                        <img
                          src={thumbUrl}
                          alt={`Page ${page}`}
                          className="absolute inset-0 h-full w-full object-contain"
                        />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                          {page}
                        </span>
                      )}
                    </span>
                    <span className="mt-auto border-t px-2.5 py-1.5 text-xs font-medium">
                      Page {page}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {file ? (
        <div className="grid gap-1.5">
          <Label className="font-normal">
            <Checkbox
              checked={mergePages}
              onCheckedChange={(checked) => setMergePages(checked === true)}
              disabled={busy}
            />
            Merge extracted pages into one PDF file
          </Label>
          <p className="text-xs text-muted-foreground">
            {mergePages
              ? "Selected pages are combined into a single PDF."
              : selected.size > 1
                ? "Each selected page becomes its own PDF, packed in a ZIP."
                : "The selected page downloads as its own PDF."}
          </p>
        </div>
      ) : null}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex flex-wrap gap-2">
        <Button type="button" disabled={busy || !file || selected.size === 0} onClick={() => void handleSplit()}>
          {busy ? "Working…" : mergePages ? "Split & download" : "Split into files"}
        </Button>
        {file ? (
          <Button type="button" variant="outline" disabled={busy} onClick={clearFile}>
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  );
}
