import { useEffect, useRef, useState } from 'react'
import { useDebouncedValue } from './useDebouncedValue'

/**
 * Reusable search state for backend-driven lists.
 * - `value`: immediate input value (for the text field)
 * - `searchTerm`: debounced trimmed value to send as API `searchTerm`
 *
 * When the debounced term changes, `onSearchTermChange` fires (useful to reset page to 1).
 */
export function useDebouncedSearch(options?: {
  delay?: number
  initialValue?: string
  onSearchTermChange?: (searchTerm: string) => void
}) {
  const delay = options?.delay ?? 400
  const [value, setValue] = useState(options?.initialValue ?? '')
  const debounced = useDebouncedValue(value, delay)
  const searchTerm = debounced.trim()

  const onSearchTermChangeRef = useRef(options?.onSearchTermChange)
  onSearchTermChangeRef.current = options?.onSearchTermChange

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    onSearchTermChangeRef.current?.(searchTerm)
  }, [searchTerm])

  return {
    value,
    setValue,
    searchTerm,
    clear: () => setValue(''),
  }
}
