import { describe, it, expect, vi, beforeEach } from "vitest";
import { handleContact } from "./index.js";
import type { HttpRequest } from "./index.js";
import { resetRateLimitStore } from "../../shared/rate-limiter.js";

function makeRequest(overrides: Partial<HttpRequest> = {}): HttpRequest {
  return {
    method: "POST",
    headers: { origin: "https://tu-usuario.github.io" },
    body: {
      name: "John Doe",
      email: "john@test.com",
      subject: "Hello",
      message: "This is a test message with enough characters.",
    },
    ip: "1.2.3.4",
    ...overrides,
  };
}

describe("handleContact", () => {
  beforeEach(() => {
    resetRateLimitStore();
    vi.stubEnv("EMAIL_API_KEY", "test-api-key");
    vi.stubEnv("CONTACT_EMAIL", "me@test.com");
  });

  it("should handle OPTIONS preflight", async () => {
    const res = await handleContact(makeRequest({ method: "OPTIONS" }));
    expect(res.status).toBe(204);
  });

  it("should reject non-POST methods", async () => {
    const res = await handleContact(makeRequest({ method: "GET" }));
    expect(res.status).toBe(405);
  });

  it("should reject disallowed origins", async () => {
    const res = await handleContact(
      makeRequest({ headers: { origin: "https://evil.com" } }),
    );
    expect(res.status).toBe(403);
  });

  it("should reject invalid input", async () => {
    const res = await handleContact(
      makeRequest({
        body: { name: "", email: "bad", subject: "", message: "" },
      }),
    );
    expect(res.status).toBe(400);
    expect(res.body["error"]).toBe("Validation failed");
  });

  it("should silently accept honeypot submissions", async () => {
    const res = await handleContact(
      makeRequest({
        body: {
          name: "Bot",
          email: "bot@spam.com",
          subject: "Spam",
          message: "This is a spam message.",
          honeypot: "bot-value",
        },
      }),
    );
    expect(res.status).toBe(200);
    expect(res.body["ok"]).toBe(true);
  });

  it("should rate limit after too many requests", async () => {
    for (let i = 0; i < 5; i++) {
      // Mock fetch for successful requests
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
      await handleContact(makeRequest());
    }

    const res = await handleContact(makeRequest());
    expect(res.status).toBe(429);
    expect(res.body["error"]).toContain("Too many requests");
  });

  it("should send email on valid request", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", mockFetch);

    const res = await handleContact(makeRequest());

    expect(res.status).toBe(200);
    expect(res.body["ok"]).toBe(true);
    expect(mockFetch).toHaveBeenCalledOnce();
  });

  it("should return 500 on email send failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500 }),
    );

    const res = await handleContact(makeRequest());
    expect(res.status).toBe(500);
  });
});
