import { describe, it, expect } from "vitest";
import { getCorsHeaders, isOriginAllowed } from "./cors.js";

describe("CORS", () => {
  describe("isOriginAllowed", () => {
    it("should allow whitelisted origins", () => {
      expect(isOriginAllowed("https://tu-usuario.github.io")).toBe(true);
      expect(isOriginAllowed("http://localhost:4200")).toBe(true);
    });

    it("should reject unknown origins", () => {
      expect(isOriginAllowed("https://evil.com")).toBe(false);
      expect(isOriginAllowed("http://localhost:3000")).toBe(false);
    });

    it("should reject undefined origin", () => {
      expect(isOriginAllowed(undefined)).toBe(false);
    });
  });

  describe("getCorsHeaders", () => {
    it("should return headers for allowed origin", () => {
      const headers = getCorsHeaders("https://tu-usuario.github.io");
      expect(headers).not.toBeNull();
      expect(headers?.["Access-Control-Allow-Origin"]).toBe(
        "https://tu-usuario.github.io",
      );
      expect(headers?.["Access-Control-Allow-Methods"]).toContain("POST");
    });

    it("should return null for disallowed origin", () => {
      expect(getCorsHeaders("https://evil.com")).toBeNull();
    });

    it("should return null for undefined origin", () => {
      expect(getCorsHeaders(undefined)).toBeNull();
    });
  });
});
