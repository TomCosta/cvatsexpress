type CloneFunction = <T>(value: T) => T;

export function cloneJsonValue<T>(
  value: T,
  nativeClone: CloneFunction | null | undefined = globalThis.structuredClone,
): T {
  if (nativeClone) {
    try {
      return nativeClone(value);
    } catch {
      // JSON-safe domain data can still be cloned on partial WebView support.
    }
  }

  return JSON.parse(JSON.stringify(value)) as T;
}
