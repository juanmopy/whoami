import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, resetRateLimitStore } from "./rate-limiter.js";

describe("Rate Limiter", () => {
  beforeEach(() => {
    resetRateLimitStore();
  });

  it("should allow requests under limit", () => {
    const result = checkRateLimit("1.2.3.4", { maxRequests: 3 });
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it("should block after exceeding limit", () => {
    const config = { maxRequests: 2, windowMs: 60_000 };
    checkRateLimit("1.2.3.4", config);
    checkRateLimit("1.2.3.4", config);
    const result = checkRateLimit("1.2.3.4", config);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("should track different IPs independently", () => {
    const config = { maxRequests: 1 };
    checkRateLimit("1.1.1.1", config);
    const result = checkRateLimit("2.2.2.2", config);
    expect(result.allowed).toBe(true);
  });

  it("should return remaining count", () => {
    const config = { maxRequests: 3 };
    const r1 = checkRateLimit("1.2.3.4", config);
    expect(r1.remaining).toBe(2);
    const r2 = checkRateLimit("1.2.3.4", config);
    expect(r2.remaining).toBe(1);
    const r3 = checkRateLimit("1.2.3.4", config);
    expect(r3.remaining).toBe(0);
  });
});
