interface LocalRandomSource {
  randomUUID?: () => string;
  getRandomValues?: (array: Uint8Array) => Uint8Array;
}

let fallbackSequence = 0;

export function createLocalId(
  source: LocalRandomSource | null | undefined = globalThis.crypto,
): string {
  if (source?.randomUUID) {
    try {
      return source.randomUUID();
    } catch {
      // Some WebViews expose randomUUID outside a context where it can be used.
    }
  }

  if (source?.getRandomValues) {
    try {
      const bytes = source.getRandomValues(new Uint8Array(16));
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const hex = Array.from(bytes, (byte) =>
        byte.toString(16).padStart(2, '0'),
      ).join('');
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    } catch {
      // A local-only fallback below keeps creation available on older runtimes.
    }
  }

  fallbackSequence += 1;
  const time = Date.now().toString(36);
  const sequence = fallbackSequence.toString(36);
  const random = Math.random().toString(36).slice(2, 12);
  return `local-${time}-${sequence}-${random}`;
}
