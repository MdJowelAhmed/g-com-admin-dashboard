import { useMemo, useState } from 'react'

/**
 * Generic reusable hook for filtered + searched lists.
 *
 * @example
 * const { data, setData, query, setQuery, filter, setFilter, filtered } =
 *   useFilteredList({
 *     initialData: initialUsers,
 *     emptyFilter: EMPTY_USER_FILTER,
 *     filterFn: (item, q, f) => { ... return true/false },
 *   })
 */
export function useFilteredList<TItem, TFilter>({
  initialData,
  emptyFilter,
  filterFn,
}: {
  initialData: TItem[]
  emptyFilter: TFilter
  filterFn: (item: TItem, query: string, filter: TFilter) => boolean
}) {
  const [data, setData] = useState<TItem[]>(initialData)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<TFilter>(emptyFilter)

  const filtered = useMemo(
    () => data.filter((item) => filterFn(item, query.trim().toLowerCase(), filter)),
    [data, query, filter, filterFn],
  )

  return { data, setData, query, setQuery, filter, setFilter, filtered }
}
