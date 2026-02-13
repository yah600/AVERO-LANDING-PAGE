import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const ses = new SESv2Client({ region: "us-east-1" });

const ALLOWED_ORIGINS = [
  "https://averocloud.com",
  "https://www.averocloud.com",
  "http://localhost:5173",
];

const TO_EMAIL = "info@averocloud.com";

const BRAND_CONFIG = {
  from: "noreply@averocloud.com",
  replyTo: "info@averocloud.com",
  label: "Avero",
  domain: "averocloud.com",
  url: "https://averocloud.com",
  tagline: "All-In-One Marketing Platform",
};

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function buildInternalEmail(config, { type, name, email, company, role, message }, origin) {
  const formType = type === "signup" ? "Sign Up" : "Contact";

  const rows = [
    { label: "Type", value: formType },
    { label: "Name", value: name },
    { label: "Email", value: `<a href="mailto:${escapeHtml(email)}" style="color: #8B5CF6;">${escapeHtml(email)}</a>`, raw: true },
    ...(company ? [{ label: "Company", value: company }] : []),
    ...(role ? [{ label: "Role", value: role }] : []),
    ...(message ? [{ label: "Message", value: message }] : []),
  ];

  const tableRows = rows
    .map(
      (r) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #2a2a2a; color: #9b9b9b; width: 100px; font-size: 14px;">${r.label}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #2a2a2a; font-weight: 600; color: #ffffff; font-size: 14px;">${r.raw ? r.value : escapeHtml(r.value)}</td>
      </tr>`
    )
    .join("");

  const html = `
    <div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1a1025 0%, #0d0d0d 100%); color: #fff; padding: 24px; border-radius: 12px 12px 0 0; border-bottom: 2px solid #8B5CF6;">
        <h2 style="margin: 0; font-size: 20px; font-weight: 600;">New ${escapeHtml(formType)} Submission</h2>
        <p style="margin: 8px 0 0; color: #9b9b9b; font-size: 14px;">via ${escapeHtml(config.label)}</p>
      </div>
      <div style="background: #111111; color: #e0e0e0; padding: 24px; border-radius: 0 0 12px 12px;">
        <table style="width: 100%; border-collapse: collapse;">
          ${tableRows}
        </table>
        <p style="margin: 20px 0 0; color: #555; font-size: 12px;">
          Source: ${escapeHtml(origin || "unknown")} | ${escapeHtml(config.label)}
        </p>
      </div>
    </div>
  `;

  const text = `New ${formType} Submission (${config.label})\n\nName: ${name}\nEmail: ${email}${company ? `\nCompany: ${company}` : ""}${role ? `\nRole: ${role}` : ""}${message ? `\nMessage: ${message}` : ""}\n\nSource: ${origin || "unknown"}`;

  return { html, text };
}

function buildConfirmationEmail(config, { type, name, company }) {
  const formType = type === "signup" ? "sign-up" : "message";
  const firstName = name.split(" ")[0];

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

        <!-- Header -->
        <div style="text-align: center; padding: 32px 0;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: 2px;">
            AVERO
          </h1>
          <p style="margin: 8px 0 0; font-size: 13px; color: #8B5CF6; letter-spacing: 1px;">
            ${escapeHtml(config.tagline)}
          </p>
        </div>

        <!-- Main Card -->
        <div style="background: linear-gradient(140deg, #141414 0%, #0d0d0d 100%); border-radius: 16px; overflow: hidden; border: 1px solid #2a2a2a;">

          <!-- Accent bar -->
          <div style="height: 3px; background: linear-gradient(90deg, #8B5CF6 0%, #6D28D9 50%, #4C1D95 100%);"></div>

          <!-- Card Header -->
          <div style="padding: 32px 32px 0;">
            <p style="margin: 0; font-size: 14px; color: #8B5CF6; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
              We Got Your ${escapeHtml(formType)}
            </p>
            <h2 style="margin: 12px 0 0; font-size: 24px; font-weight: 700; color: #ffffff; line-height: 1.3;">
              Thanks, ${escapeHtml(firstName)}
            </h2>
          </div>

          <!-- Divider -->
          <div style="margin: 24px 32px; height: 1px; background: linear-gradient(90deg, #2a2a2a 0%, #8B5CF6 50%, #2a2a2a 100%);"></div>

          <!-- Body -->
          <div style="padding: 0 32px 32px;">
            <p style="margin: 0 0 16px; font-size: 15px; color: #d8d8d8; line-height: 1.6;">
              We received your ${escapeHtml(formType)}${company ? ` regarding <strong style="color: #ffffff;">${escapeHtml(company)}</strong>` : ""}.
              A member of our team will be in touch within one business day.
            </p>

            <p style="margin: 0 0 24px; font-size: 15px; color: #d8d8d8; line-height: 1.6;">
              In the meantime, explore how Avero can transform your marketing:
            </p>

            <!-- CTA Button -->
            <div style="text-align: center; padding: 8px 0 16px;">
              <a href="${config.url}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #8B5CF6, #6D28D9); color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 50px; letter-spacing: 0.5px;">
                Visit Avero
              </a>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 32px 0;">
          <p style="margin: 0 0 8px; font-size: 13px; color: #9b9b9b;">
            Questions? Reply to this email or reach us at
            <a href="mailto:${config.replyTo}" style="color: #8B5CF6; text-decoration: none;">${config.replyTo}</a>
          </p>
          <p style="margin: 0; font-size: 12px; color: #555555;">
            Avero &mdash; ${escapeHtml(config.tagline)}
          </p>
          <p style="margin: 8px 0 0; font-size: 11px; color: #3a3a3a;">
            <a href="${config.url}" style="color: #3a3a3a; text-decoration: none;">${config.domain}</a>
          </p>
        </div>

      </div>
    </body>
    </html>
  `;

  const text = `Thanks, ${firstName}!\n\nWe received your ${formType}${company ? ` regarding ${company}` : ""}. A member of our team will be in touch within one business day.\n\nVisit us: ${config.url}\n\nQuestions? Email us at ${config.replyTo}\n\nAvero — ${config.tagline}`;

  return { html, text };
}

export async function handler(event) {
  const origin = event.headers?.origin || event.headers?.Origin || "";
  const headers = corsHeaders(origin);

  // Handle CORS preflight
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { type, name, email, company, role, message } = body;

    // Honeypot check — silently succeed to fool bots
    if (body._honeypot) {
      return {
        statusCode: 200,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ success: true }),
      };
    }

    // Validate required fields
    if (!name || !email) {
      return {
        statusCode: 400,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Name and email are required" }),
      };
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        statusCode: 400,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Invalid email address" }),
      };
    }

    const config = BRAND_CONFIG;
    const formType = type === "signup" ? "sign-up" : "contact";
    const fields = { type, name, email, company, role, message };

    // 1. Send internal notification to team
    const internal = buildInternalEmail(config, fields, origin);
    await ses.send(
      new SendEmailCommand({
        FromEmailAddress: config.from,
        ReplyToAddresses: [email],
        Destination: { ToAddresses: [TO_EMAIL] },
        Content: {
          Simple: {
            Subject: {
              Data: `[Avero] New ${formType} from ${name}${company ? ` — ${company}` : ""}`,
            },
            Body: {
              Html: { Data: internal.html },
              Text: { Data: internal.text },
            },
          },
        },
      })
    );

    // 2. Send branded confirmation to the submitter
    try {
      const confirmation = buildConfirmationEmail(config, fields);
      await ses.send(
        new SendEmailCommand({
          FromEmailAddress: `Avero <${config.from}>`,
          ReplyToAddresses: [config.replyTo],
          Destination: { ToAddresses: [email] },
          Content: {
            Simple: {
              Subject: { Data: "We received your request — Avero" },
              Body: {
                Html: { Data: confirmation.html },
                Text: { Data: confirmation.text },
              },
            },
          },
        })
      );
    } catch (confirmErr) {
      // Don't fail the request if confirmation email fails (e.g., SES sandbox mode)
      console.warn("Confirmation email failed (may be sandbox mode):", confirmErr.message);
    }

    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("Contact form error:", err);
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to send message. Please try again." }),
    };
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
