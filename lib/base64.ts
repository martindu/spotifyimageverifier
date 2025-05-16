// Decode base64 string to text
export function decode(base64String: string): string {
  try {
    // Handle URL-safe base64 by replacing characters
    const sanitized = base64String.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "")

    // Add padding if needed
    const padded = sanitized.padEnd(sanitized.length + ((4 - (sanitized.length % 4 || 4)) % 4), "=")

    // Decode using Buffer in Node.js environment
    return Buffer.from(padded, "base64").toString("utf-8")
  } catch (error) {
    throw new Error("Invalid base64 string")
  }
}

// Encode text to base64
export function encode(text: string): string {
  return Buffer.from(text).toString("base64")
}
