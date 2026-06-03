/**
 * Layer 2 - Core/Utils
 * Pure, side-effect-free helpers. No Playwright imports here.
 */

export function uniqueEmail(prefix = 'user'): string {
  return `${prefix}+${Date.now()}@example.com`;
}

export function randomString(length = 8): string {
  return Math.random()
    .toString(36)
    .slice(2, 2 + length);
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

/** Retry an async predicate without using waitForTimeout in test code. */
export async function pollUntil<T>(
  fn: () => Promise<T>,
  predicate: (v: T) => boolean,
  { timeoutMs = 5000, intervalMs = 200 } = {},
): Promise<T> {
  const deadline = Date.now() + timeoutMs;
  let last: T = await fn();
  while (Date.now() < deadline) {
    if (predicate(last)) return last;
    await new Promise((r) => setTimeout(r, intervalMs));
    last = await fn();
  }
  if (predicate(last)) return last;
  throw new Error(`pollUntil timed out after ${timeoutMs}ms`);
}
