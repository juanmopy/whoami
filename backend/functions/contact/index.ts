import { contactSchema } from "./schema.js";
import {
  getCorsHeaders,
  isOriginAllowed,
  checkRateLimit,
  sanitizeObject,
} from "../../shared/index.js";

export interface HttpRequest {
  method: string;
  headers: Record<string, string | undefined>;
  body: unknown;
  ip?: string;
}

export interface HttpResponse {
  status: number;
  headers: Record<string, string>;
  body: Record<string, unknown>;
}

function jsonResponse(
  status: number,
  body: Record<string, unknown>,
  headers: Record<string, string> = {},
): HttpResponse {
  return {
    status,
    headers: { "Content-Type": "application/json", ...headers },
    body,
  };
}

export async function handleContact(req: HttpRequest): Promise<HttpResponse> {
  const origin = req.headers["origin"];
  const corsHeaders = getCorsHeaders(origin);

  // Preflight
  if (req.method === "OPTIONS") {
    return {
      status: 204,
      headers: corsHeaders ?? {},
      body: {},
    };
  }

  // Only POST allowed
  if (req.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  // CORS check
  if (!isOriginAllowed(origin)) {
    return jsonResponse(403, { error: "Forbidden origin" });
  }

  // Rate limiting
  const clientIp = req.ip ?? req.headers["x-forwarded-for"] ?? "unknown";
  const rateLimit = checkRateLimit(clientIp, {
    maxRequests: 5,
    windowMs: 60_000,
  });

  if (!rateLimit.allowed) {
    return jsonResponse(
      429,
      { error: "Too many requests. Try again later." },
      {
        "Retry-After": String(
          Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
        ),
        ...(corsHeaders ?? {}),
      },
    );
  }

  // Validate input
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return jsonResponse(
      400,
      {
        error: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      },
      corsHeaders ?? {},
    );
  }

  // Honeypot check
  if (parsed.data.honeypot) {
    // Silently accept — bot doesn't know it was caught
    return jsonResponse(
      200,
      { ok: true, message: "Message sent" },
      corsHeaders ?? {},
    );
  }

  // Sanitize
  const sanitized = sanitizeObject({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });

  // Send email (replace with actual provider: Resend, SendGrid, etc.)
  try {
    await sendEmail(sanitized);
    return jsonResponse(
      200,
      { ok: true, message: "Message sent" },
      corsHeaders ?? {},
    );
  } catch {
    return jsonResponse(
      500,
      { error: "Failed to send message" },
      corsHeaders ?? {},
    );
  }
}

interface EmailPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

async function sendEmail(data: EmailPayload): Promise<void> {
  const apiKey = process.env["EMAIL_API_KEY"];
  if (!apiKey) {
    throw new Error("EMAIL_API_KEY not configured");
  }

  // Example using Resend API
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: "Portfolio Contact <noreply@tu-dominio.com>",
      to: process.env["CONTACT_EMAIL"] ?? "tu@email.com",
      subject: `[Portfolio] ${data.subject}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Email API error: ${response.status}`);
  }
}
