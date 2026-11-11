export type GeocodeResult = { lat: string; lng: string };

/** Resolve an address to coordinates via OpenStreetMap Nominatim. */
export async function geocodeLocation(query: string, signal?: AbortSignal): Promise<GeocodeResult | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(trimmed)}`,
    {
      headers: { Accept: "application/json" },
      signal,
    },
  );

  if (!response.ok) throw new Error("Geocode request failed.");

  const results = (await response.json()) as { lat?: string; lon?: string }[];
  const hit = results[0];
  if (!hit?.lat || !hit?.lon) return null;
  return { lat: hit.lat, lng: hit.lon };
}
