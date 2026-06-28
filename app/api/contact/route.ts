const MAX_EMAIL_LENGTH = 320;
const MAX_MESSAGE_LENGTH = 1024;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { message, email } = (body ?? {}) as {
    message?: unknown;
    email?: unknown;
  };

  if (typeof message !== "string" || typeof email !== "string") {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  if (!trimmedMessage || !trimmedEmail) {
    return Response.json({ error: "Missing message or email" }, { status: 400 });
  }
  if (!EMAIL_REGEX.test(trimmedEmail) || trimmedEmail.length > MAX_EMAIL_LENGTH) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
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
              {
                name: "Message",
                value: trimmedMessage.slice(0, MAX_MESSAGE_LENGTH),
                inline: false,
              },
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
