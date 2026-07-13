import { useEffect, useState } from 'react'

/**
 * Returns a debounced copy of `value` that updates after `delay` ms of inactivity.
 *
 * @example
 * const debouncedSearch = useDebouncedValue(query, 400)
 */
export function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(timer)
  }, [value, delay])

  return debounced
}
