/**
 * Sanitize string by removing HTML tags and potential script injections.
 * Only allows plain text through.
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove inline event handlers
    .replace(/&lt;/g, "<") // Decode common entities first
    .replace(/&gt;/g, ">")
    .replace(/</g, "&lt;") // Encode < and >
    .replace(/>/g, "&gt;")
    .trim();
}

/**
 * Sanitize all string values in an object (shallow).
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  for (const key of Object.keys(result)) {
    if (typeof result[key] === "string") {
      (result as Record<string, unknown>)[key] = sanitizeString(
        result[key] as string,
      );
    }
  }
  return result;
}
