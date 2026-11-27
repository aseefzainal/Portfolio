import { createContactMessage } from "@/db";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_NAME = 100;
const MAX_EMAIL = 200;
const MAX_MESSAGE = 5000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

/** Per-isolate in-memory limit; resets when the Worker isolate recycles. */
const rateByIp = new Map<string, { count: number; resetAt: number }>();

function field(body: unknown, key: string) {
  if (typeof body !== "object" || body === null || !(key in body)) return "";
  return String((body as Record<string, unknown>)[key]).trim();
}

function json(body: unknown, status: number) {
  return Response.json(body, { status });
}

function clientIp(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = rateByIp.get(ip);
  if (!entry || entry.resetAt <= now) {
    rateByIp.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(request: Request) {
  if (isRateLimited(clientIp(request))) {
    return json({ error: "Too many messages. Please wait a minute and try again." }, 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  // Honeypot: bots fill hidden "company" / "website" fields; humans leave them empty.
  if (field(body, "company") || field(body, "website")) {
    return json({ ok: true }, 200);
  }

  const name = field(body, "name");
  const email = field(body, "email");
  const message = field(body, "message");

  if (name.length > MAX_NAME || email.length > MAX_EMAIL || message.length > MAX_MESSAGE) {
    return json({ error: "One or more fields are too long." }, 400);
  }

  if (!name || !emailPattern.test(email) || message.length < 10) {
    return json(
      { error: "Name, a valid email, and a message of at least 10 characters are required." },
      400,
    );
  }

  try {
    await createContactMessage({ name, email, message });
  } catch {
    return json({ error: "The message could not be saved. Try again." }, 502);
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (accessKey) {
    try {
      await fetch("https://api.web3forms.com/submit", {
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
    } catch {
      // In-app inbox already has the message; email is optional.
    }
  }

  return json({ ok: true }, 200);
}
