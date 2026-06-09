export async function POST(req: Request) {
  try {
    const { message, email } = await req.json();

    if (!message || !email) {
      return Response.json(
        { error: "Missing message or email" },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      return Response.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }

    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [
          {
            title: "New Contact Form Submission",
            color: 5814783,
            fields: [
              {
                name: "Email",
                value: email,
                inline: false,
              },
              {
                name: "Message",
                value: message.slice(0, 1024),
                inline: false,
              },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
