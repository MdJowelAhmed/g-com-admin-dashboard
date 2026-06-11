import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useFilteredList } from './useFilteredList'

type Item = {
  id: string
  name: string
  status: 'active' | 'inactive'
}

type Filter = {
  statuses: Array<Item['status']>
}

const initialData: Item[] = [
  { id: '1', name: 'Alpha Store', status: 'active' },
  { id: '2', name: 'Beta Shop', status: 'inactive' },
  { id: '3', name: 'Gamma Bazaar', status: 'active' },
]

const emptyFilter: Filter = { statuses: [] }

describe('useFilteredList', () => {
  it('filters by search query', () => {
    const { result } = renderHook(() =>
      useFilteredList<Item, Filter>({
        initialData,
        emptyFilter,
        filterFn: (item, query, filter) => {
          if (filter.statuses.length && !filter.statuses.includes(item.status)) {
            return false
          }
          return item.name.toLowerCase().includes(query)
        },
      }),
    )

    act(() => {
      result.current.setQuery('alpha')
    })

    expect(result.current.filtered).toHaveLength(1)
    expect(result.current.filtered[0]?.id).toBe('1')
  })

  it('filters by selected filter values', () => {
    const { result } = renderHook(() =>
      useFilteredList<Item, Filter>({
        initialData,
        emptyFilter,
        filterFn: (item, query, filter) => {
          if (query && !item.name.toLowerCase().includes(query)) return false
          if (filter.statuses.length && !filter.statuses.includes(item.status)) {
            return false
          }
          return true
        },
      }),
    )

    act(() => {
      result.current.setFilter({ statuses: ['inactive'] })
    })

    expect(result.current.filtered).toHaveLength(1)
    expect(result.current.filtered[0]?.id).toBe('2')
  })
})
