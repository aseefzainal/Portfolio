"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { downloadPdf, mergePdfs } from "@/lib/pdf-tools";
import { cn } from "@/lib/utils";

type Item = { id: string; file: File };

export function MergePdfTool() {
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function addFiles(list: FileList | null) {
    if (!list?.length) return;
    setError("");
    const next = [...items];
    for (const file of Array.from(list)) {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        setError("Only PDF files are supported.");
        continue;
      }
      next.push({ id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`, file });
    }
    setItems(next);
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    setItems(next);
  }

  async function handleMerge() {
    if (items.length < 2) {
      setError("Add at least two PDFs to merge.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const bytes = await mergePdfs(items.map((item) => item.file));
      downloadPdf(bytes, "merged.pdf");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not merge PDFs.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-8 grid gap-6">
      <label
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed px-6 py-10 text-center transition-colors hover:bg-accent/40",
        )}
      >
        <span className="text-sm font-medium">Drop PDFs here or browse</span>
        <span className="mt-1 text-xs text-muted-foreground">Files stay in your browser</span>
        <input
          type="file"
          accept="application/pdf,.pdf"
          multiple
          className="sr-only"
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </label>

      {items.length > 0 ? (
        <ul className="grid gap-2">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm"
            >
              <span className="min-w-0 truncate font-medium">{item.file.name}</span>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  Up
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  disabled={index === items.length - 1}
                  onClick={() => move(index, 1)}
                >
                  Down
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => setItems((prev) => prev.filter((entry) => entry.id !== item.id))}
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex flex-wrap gap-2">
        <Button type="button" disabled={busy || items.length < 2} onClick={() => void handleMerge()}>
          {busy ? "Merging…" : "Merge & download"}
        </Button>
        {items.length > 0 ? (
          <Button type="button" variant="outline" disabled={busy} onClick={() => setItems([])}>
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  );
}
