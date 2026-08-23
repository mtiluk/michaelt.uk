import { MAX_MESSAGE_LENGTH, isValidEmail, isValidMessage } from "@/lib/validation";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { message, email, website } = (body ?? {}) as {
    message?: unknown;
    email?: unknown;
    website?: unknown;
  };

  if (typeof website === "string" && website.trim()) {
    return Response.json({ success: true });
  }

  if (typeof message !== "string" || typeof email !== "string") {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  if (!trimmedMessage || !trimmedEmail) {
    return Response.json({ error: "Missing message or email" }, { status: 400 });
  }
  if (!isValidEmail(trimmedEmail)) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }
  if (!isValidMessage(trimmedMessage)) {
    return Response.json(
      { error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer` },
      { status: 400 },
    );
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("DISCORD_WEBHOOK_URL is not set");
    return Response.json({ error: "Server error" }, { status: 500 });
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(5000),
      body: JSON.stringify({
        allowed_mentions: { parse: [] },
        embeds: [
          {
            title: "New Contact Form Submission",
            color: 5814783,
            fields: [
              { name: "Email", value: trimmedEmail, inline: false },
              { name: "Message", value: trimmedMessage, inline: false },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error(`Discord webhook failed: ${res.status} ${res.statusText}`);
      return Response.json({ error: "Failed to deliver message" }, { status: 502 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
