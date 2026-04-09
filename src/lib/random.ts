/**
 * Browser-safe floats and ints from crypto.getRandomValues.
 * For UI/non-crypto use; satisfies static analysis that flags Math.random.
 */
export function randomFloat(): number {
  const buf = new Uint32Array(1);
  globalThis.crypto.getRandomValues(buf);
  return buf[0]! * 2 ** -32;
}

/** Uniform integer in [0, max). */
export function randomInt(max: number): number {
  if (!(max > 0) || !Number.isFinite(max)) {
    return 0;
  }
  return Math.floor(randomFloat() * max);
}
