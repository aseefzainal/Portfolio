import type { APIRoute } from "astro";

export const prerender = false;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(body: unknown, key: string) {
  if (typeof body !== "object" || body === null || !(key in body)) return "";
  return String((body as Record<string, unknown>)[key]).trim();
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const name = field(body, "name");
  const email = field(body, "email");
  const message = field(body, "message");

  if (!name || !emailPattern.test(email) || message.length < 10) {
    return json(
      { error: "Name, a valid email, and a message of at least 10 characters are required." },
      400,
    );
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    return json(
      { error: "Email is not configured yet. Add WEB3FORMS_ACCESS_KEY to .env.local." },
      503,
    );
  }

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `Portfolio message from ${name}`,
      name,
      email,
      message,
    }),
  });

  const result = (await response.json().catch(() => null)) as { success?: boolean } | null;
  if (!response.ok || !result?.success) {
    return json({ error: "The message could not be sent. Try again." }, 502);
  }

  return json({ ok: true }, 200);
};
