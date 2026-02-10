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

    it("should strip nested HTML tag bypass attempts", () => {
      // <<script>script>alert(1) → first pass removes <<script> → "script>alert(1)"
      // No more tags to strip, then > is encoded → safe plain text
      expect(sanitizeString("<<script>script>alert(1)")).toBe(
        "script&gt;alert(1)",
      );
    });

    it("should remove javascript: protocol", () => {
      expect(sanitizeString("javascript:alert(1)")).toBe("alert(1)");
    });

    it("should remove nested javascript: bypass attempts", () => {
      expect(sanitizeString("javasjavascript:cript:alert(1)")).toBe("alert(1)");
    });

    it("should remove javascript: with whitespace obfuscation", () => {
      expect(sanitizeString("java\tscript:alert(1)")).toBe("alert(1)");
    });

    it("should remove vbscript: protocol", () => {
      expect(sanitizeString("vbscript:MsgBox(1)")).toBe("MsgBox(1)");
    });

    it("should remove data: protocol", () => {
      expect(sanitizeString("data:text/html,payload")).toBe(
        "text/html,payload",
      );
    });

    it("should remove inline event handlers", () => {
      expect(sanitizeString("onerror=alert(1)")).toBe("alert(1)");
    });

    it("should remove nested event handler bypass attempts", () => {
      expect(sanitizeString("ononerrorerror=alert(1)")).toBe("alert(1)");
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
