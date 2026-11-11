import { createContactMessage } from "@/db";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(body: unknown, key: string) {
  if (typeof body !== "object" || body === null || !(key in body)) return "";
  return String((body as Record<string, unknown>)[key]).trim();
}

function json(body: unknown, status: number) {
  return Response.json(body, { status });
}

export async function POST(request: Request) {
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
