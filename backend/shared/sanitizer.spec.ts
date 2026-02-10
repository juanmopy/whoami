import { describe, it, expect } from "vitest";
import { sanitizeString, sanitizeObject } from "./sanitizer.js";

describe("Sanitizer", () => {
  describe("sanitizeString", () => {
    it("should strip HTML tags", () => {
      expect(sanitizeString("Hello <b>World</b>")).toBe("Hello World");
    });

    it("should strip script tags", () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe(
        'alert("xss")',
      );
    });

    it("should remove javascript: protocol", () => {
      expect(sanitizeString("javascript:alert(1)")).toBe("alert(1)");
    });

    it("should remove inline event handlers", () => {
      expect(sanitizeString("onerror=alert(1)")).toBe("alert(1)");
    });

    it("should trim whitespace", () => {
      expect(sanitizeString("  hello  ")).toBe("hello");
    });

    it("should pass through clean strings", () => {
      expect(sanitizeString("Hello World")).toBe("Hello World");
    });
  });

  describe("sanitizeObject", () => {
    it("should sanitize all string values", () => {
      const result = sanitizeObject({
        name: "<b>John</b>",
        email: "john@test.com",
      });
      expect(result.name).toBe("John");
      expect(result.email).toBe("john@test.com");
    });

    it("should not modify non-string values", () => {
      const result = sanitizeObject({
        name: "John",
        count: 42,
      });
      expect(result.count).toBe(42);
    });
  });
});
