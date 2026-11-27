"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type ToastPayload = { message: string; tone?: "ok" | "error" };

const EVENT = "portfolio:admin-toast";

export function showAdminToast(message: string, tone: "ok" | "error" = "ok") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<ToastPayload>(EVENT, { detail: { message, tone } }));
}

export function AdminToastHost() {
  const [toast, setToast] = useState<(ToastPayload & { id: number }) | null>(null);

  useEffect(() => {
    function onToast(event: Event) {
      const detail = (event as CustomEvent<ToastPayload>).detail;
      if (!detail?.message) return;
      setToast({ ...detail, id: Date.now() });
    }
    window.addEventListener(EVENT, onToast);
    return () => window.removeEventListener(EVENT, onToast);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  return (
    <div
      role="status"
      className={cn(
        "fixed right-4 bottom-4 z-50 max-w-sm rounded-md border px-4 py-3 text-sm shadow-lg",
        toast.tone === "error"
          ? "border-destructive/40 bg-destructive text-destructive-foreground"
          : "border-border bg-background text-foreground",
      )}
    >
      {toast.message}
    </div>
  );
}
