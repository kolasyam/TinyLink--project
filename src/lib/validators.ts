
export function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    // optionally restrict allowed protocols
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;