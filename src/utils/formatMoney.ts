/**
 * Formats a number as a compact currency string.
 * e.g.  1_250_000 → "GH₵1.25M"
 *       45_000    → "GH₵45.0K"
 *       320       → "GH₵320"
 */
export function formatMoney(n: number): string {
  if (n >= 1_000_000) return `GH₵${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `GH₵${(n / 1_000).toFixed(1)}K`
  return `GH₵${n.toFixed(0)}`
}
