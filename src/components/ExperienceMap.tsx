"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { TimelineEntry } from "@/db";
import { klBoundaryRing } from "@/lib/kl-boundary";
import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";

export type ExperienceMapItem = Pick<
  TimelineEntry,
  "id" | "title" | "place" | "period" | "detail" | "location" | "isCurrent" | "mapLat" | "mapLng"
>;

function parseCoord(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function hasCoords(item: ExperienceMapItem) {
  const lat = parseCoord(item.mapLat);
  const lng = parseCoord(item.mapLng);
  return lat !== null && lng !== null && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

function placeLabel(item: ExperienceMapItem) {
  return item.place.split("·")[0]?.trim() || item.title;
}

export function ExperienceMapPanel({ items }: { items: ExperienceMapItem[] }) {
  const mapId = useId().replace(/:/g, "");
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<import("leaflet").Map | null>(null);
  const markersRef = useRef<Map<number, import("leaflet").Marker>>(new Map());
  const [activeId, setActiveId] = useState<number | null>(
    items.find((item) => item.isCurrent && hasCoords(item))?.id ??
      items.find((item) => hasCoords(item))?.id ??
      null,
  );

  const mappable = items.filter(hasCoords);
  const mapKey = mappable.map((item) => `${item.id}:${item.mapLat},${item.mapLng}`).join("|");

  useEffect(() => {
    if (!mapRef.current) return;
    let cancelled = false;
    const points = mappable;

    let detachTouchGuards: (() => void) | undefined;

    void (async () => {
      const L = await import("leaflet");
      if (cancelled || !mapRef.current) return;

      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        markersRef.current.clear();
      }

      const map = L.map(mapRef.current, {
        scrollWheelZoom: false,
        touchZoom: true,
        dragging: true,
        tapTolerance: 15,
        zoomControl: false,
        minZoom: 10,
        maxZoom: 18,
        // Integer zoom keeps tiles 1:1 crisp; fractional zoom CSS-scales tiles → blur.
        zoomSnap: 1,
        zoomDelta: 1,
      });
      mapInstance.current = map;
      L.control.zoom({ position: "bottomright" }).addTo(map);

      const container = map.getContainer();
      container.style.touchAction = "none";

      const isOverMap = (clientX: number, clientY: number) => {
        const rect = container.getBoundingClientRect();
        return (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        );
      };

      const snapToCrispZoom = () => {
        const z = map.getZoom();
        const snapped = Math.round(z);
        if (snapped !== z) {
          map.setZoom(snapped, { animate: false });
        }
      };

      // Two-finger scroll (same direction) → Leaflet wheel zoom while hovered.
      map.on("mouseover", () => {
        map.scrollWheelZoom.enable();
      });
      map.on("mouseout", () => {
        map.scrollWheelZoom.disable();
      });
      map.on("zoomend", snapToCrispZoom);

      type WheelZoomHandler = {
        enabled: () => boolean;
        enable: () => void;
        _onWheelScroll: (event: WheelEvent) => void;
      };
      const wheelZoom = map.scrollWheelZoom as unknown as WheelZoomHandler;

      // Pinch (fingers opposite) = Ctrl+wheel on Windows. Block page zoom, then feed
      // the same Leaflet scrollWheelZoom path so feel matches two-finger scroll.
      const onPinchWheel = (event: WheelEvent) => {
        if (!(event.ctrlKey || event.metaKey)) return;
        if (!isOverMap(event.clientX, event.clientY)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        if (!wheelZoom.enabled()) wheelZoom.enable();
        wheelZoom._onWheelScroll(event);
      };

      // Touch screens: block browser pinch, let Leaflet touchZoom handle it.
      const stopPagePinch = (event: TouchEvent) => {
        if (event.touches.length < 2) return;
        if (!isOverMap(event.touches[0].clientX, event.touches[0].clientY)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
      };
      const stopGesture = (event: Event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
      };

      window.addEventListener("wheel", onPinchWheel, { passive: false, capture: true });
      container.addEventListener("touchstart", stopPagePinch, { passive: false, capture: true });
      container.addEventListener("touchmove", stopPagePinch, { passive: false, capture: true });
      container.addEventListener("gesturestart", stopGesture, { passive: false, capture: true });
      container.addEventListener("gesturechange", stopGesture, { passive: false, capture: true });
      container.addEventListener("gestureend", stopGesture, { passive: false, capture: true });

      detachTouchGuards = () => {
        window.removeEventListener("wheel", onPinchWheel, true);
        container.removeEventListener("touchstart", stopPagePinch, true);
        container.removeEventListener("touchmove", stopPagePinch, true);
        container.removeEventListener("gesturestart", stopGesture, true);
        container.removeEventListener("gesturechange", stopGesture, true);
        container.removeEventListener("gestureend", stopGesture, true);
      };

      if (cancelled) {
        detachTouchGuards();
        map.remove();
        mapInstance.current = null;
        return;
      }

      const cartoKey = process.env.NEXT_PUBLIC_CARTO_API_KEY?.trim();
      const dark = document.documentElement.classList.contains("dark");
      if (cartoKey) {
        // light_all ≈ Positron; {r} + detectRetina loads @2x tiles on HiDPI screens.
        const path = dark ? "dark_all" : "light_all";
        L.tileLayer(
          `https://{s}.basemaps.cartocdn.com/${path}/{z}/{x}/{y}{r}.png?key=${encodeURIComponent(cartoKey)}`,
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: "abcd",
            maxZoom: 20,
            maxNativeZoom: 18,
            // {r} → @2x on HiDPI; don't also set detectRetina (that double-scales).
            updateWhenZooming: true,
            keepBuffer: 2,
          },
        ).addTo(map);
      } else {
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
          maxNativeZoom: 19,
          detectRetina: true,
          updateWhenZooming: true,
        }).addTo(map);
      }

      const klLatLngs = klBoundaryRing.map(([lng, lat]) => L.latLng(lat, lng));
      const klBounds = L.latLngBounds(klLatLngs);
      L.polygon(klLatLngs, {
        color: "#15803d",
        weight: 2.5,
        opacity: 1,
        fillColor: "#4ade80",
        fillOpacity: 0.28,
        interactive: false,
        className: "experience-map-kl-boundary",
      }).addTo(map);

      // Keep the default frame on KL (like the reference). Only widen for nearby markers.
      const viewBounds = L.latLngBounds(klLatLngs);

      for (const item of points) {
        const lat = parseCoord(item.mapLat)!;
        const lng = parseCoord(item.mapLng)!;
        const label = placeLabel(item);
        const marker = L.marker([lat, lng], {
          title: label,
          riseOnHover: true,
          icon: L.divIcon({
            className: "experience-map-div-icon",
            html: `<span data-map-marker="${item.id}" class="experience-map-marker${item.isCurrent ? " is-current" : ""}"></span>`,
            iconSize: [18, 18],
            iconAnchor: [9, 9],
          }),
        }).addTo(map);

        marker.bindTooltip(label, {
          permanent: true,
          direction: "top",
          offset: [0, -12],
          opacity: 1,
          className: "experience-map-tooltip",
        });
        marker.on("click", () => setActiveId(item.id));
        markersRef.current.set(item.id, marker);

        const point = L.latLng(lat, lng);
        if (klBounds.pad(0.6).contains(point)) {
          viewBounds.extend(point);
        }
      }

      map.fitBounds(viewBounds.pad(0.12), { maxZoom: 12 });
      snapToCrispZoom();

      requestAnimationFrame(() => {
        map.invalidateSize();
      });
    })();

    return () => {
      cancelled = true;
      detachTouchGuards?.();
      mapInstance.current?.remove();
      mapInstance.current = null;
      markersRef.current.clear();
    };
  }, [mapKey, mapId]);

  useEffect(() => {
    for (const [id, marker] of markersRef.current) {
      const el = marker.getElement()?.querySelector("[data-map-marker]");
      if (!el) continue;
      el.classList.toggle("is-active", id === activeId);
    }

    const active = markersRef.current.get(activeId ?? -1);
    if (active && mapInstance.current) {
      mapInstance.current.panTo(active.getLatLng(), { animate: true });
    }
  }, [activeId]);

  if (items.length === 0) {
    return <p className="mt-8 text-sm text-muted-foreground">No experience yet.</p>;
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start lg:gap-8">
      <ol className="min-w-0">
        {items.map((item) => {
          const active = item.id === activeId;
          const mapped = hasCoords(item);
          return (
            <li key={item.id} data-reveal>
              <button
                type="button"
                onClick={() => {
                  if (mapped) setActiveId(item.id);
                }}
                className={cn(
                  "grid w-full gap-1 border-b py-5 text-left transition-colors sm:grid-cols-[1.5rem_1fr] sm:gap-3",
                  active ? "bg-accent/40" : "hover:bg-accent/20",
                  !mapped && "cursor-default",
                )}
              >
                <span className="mt-1.5 flex justify-center sm:mt-1">
                  <span
                    className={cn(
                      "size-2.5 rounded-full ring-2 ring-background",
                      item.isCurrent
                        ? "bg-emerald-600"
                        : active
                          ? "bg-foreground"
                          : "bg-muted-foreground/50",
                    )}
                  />
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <span className="font-medium">{placeLabel(item)}</span>
                    <span className="text-sm text-muted-foreground">{item.period}</span>
                  </span>
                  <span className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-muted-foreground">{item.title}</span>
                    {item.isCurrent ? (
                      <span className="rounded-md bg-emerald-600/10 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-emerald-700 uppercase dark:text-emerald-400">
                        Current
                      </span>
                    ) : null}
                  </span>
                  {item.location ? (
                    <span className="mt-0.5 block text-xs text-muted-foreground">{item.location}</span>
                  ) : null}
                  {!mapped ? (
                    <span className="mt-1 block text-xs text-amber-700 dark:text-amber-400">
                      No map marker — add a Location in admin so coordinates can be filled.
                    </span>
                  ) : null}
                  {item.detail ? (
                    <span className="mt-2 block text-sm leading-6 text-muted-foreground">
                      {item.detail}
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="experience-map-shell overflow-hidden rounded-md border bg-card lg:sticky lg:top-20">
        <div
          ref={mapRef}
          id={`experience-map-${mapId}`}
          className="experience-map h-72 w-full touch-none sm:h-96 lg:h-[28rem]"
        />
        {mappable.length === 0 ? (
          <p className="border-t px-4 py-3 text-xs text-muted-foreground">
            Map shows Kuala Lumpur. Add a Location on each work entry in admin to place markers.
          </p>
        ) : null}
      </div>
    </div>
  );
}
