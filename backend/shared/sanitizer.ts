/**
 * Repeatedly apply a regex replacement until no more matches are found.
 * Prevents bypass via nested payloads like "javasjavasccript:ript:".
 */
function replaceUntilClean(
  input: string,
  pattern: RegExp,
  replacement: string,
): string {
  let previous = input;
  let current = input.replace(pattern, replacement);
  while (current !== previous) {
    previous = current;
    current = current.replace(pattern, replacement);
  }
  return current;
}

/**
 * Sanitize string by removing HTML tags and potential script injections.
 * Only allows plain text through.
 */
export function sanitizeString(input: string): string {
  let result = input;

  // Strip HTML tags
  result = result.replace(/<[^>]*>/g, "");

  // Remove dangerous URI schemes (handles whitespace/tab obfuscation)
  // Covers javascript:, vbscript:, data:, and variants
  // No \b word boundary — allows detection inside nested bypass payloads
  result = replaceUntilClean(
    result,
    /(?:java\s*script|vb\s*script|data)\s*:/gi,
    "",
  );

  // Remove inline event handlers (loop to prevent nested bypass)
  result = replaceUntilClean(result, /on\w+\s*=/gi, "");

  // Decode common entities, then re-encode < and >
  result = result
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return result.trim();
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
