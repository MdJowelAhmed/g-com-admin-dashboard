import { useMemo, useState } from 'react'
import SearchInput from '../../components/common/SearchInput'
import PayoutsTable from '../../components/dashboard/PayoutsTable'
import PayoutDetailsModal from '../../components/dashboard/PayoutDetailsModal'
import PayoutFilter, {
  EMPTY_PAYOUT_FILTER,
  type PayoutFilterState,
} from '../../components/dashboard/PayoutFilter'
import { useDebouncedSearch } from '../../hooks/useDebouncedSearch'
import {
  mapPayoutFromApi,
  type PayoutListItem,
  useGetPayoutHistoryQuery,
} from '../../redux/api/earningPayoutApi'

const PAGE_SIZE = 10

export default function EarningsPayouts() {
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<PayoutFilterState>(EMPTY_PAYOUT_FILTER)
  const [selected, setSelected] = useState<PayoutListItem | null>(null)

  const { value: query, setValue: setQuery, searchTerm } = useDebouncedSearch({
    delay: 400,
    onSearchTermChange: () => setPage(1),
  })

  const { data, isLoading, isFetching } = useGetPayoutHistoryQuery({
    page,
    limit: PAGE_SIZE,
    ...(searchTerm ? { searchTerm } : {}),
    ...(filter.status ? { status: filter.status } : {}),
  })

  const payouts = useMemo(() => {
    const pageOffset = ((data?.pagination.page ?? page) - 1) * PAGE_SIZE
    return (data?.data ?? []).map((doc, index) =>
      mapPayoutFromApi(doc, pageOffset + index),
    )
  }, [data, page])

  const pagination = data?.pagination
  const loading = isLoading || isFetching

  const handleFilterChange = (next: PayoutFilterState) => {
    setFilter(next)
    setPage(1)
  }

  return (
    <div className="py-6">
      <section className="mt-6 rounded-2xl border border-surface-border bg-surface-card p-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-white">
            Earnings &amp; Payments
          </h1>

          <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search reference or business..."
            />
            <PayoutFilter value={filter} onChange={handleFilterChange} />
          </div>
        </header>

        <div className="mt-6">
          <PayoutsTable
            data={payouts}
            loading={loading}
            onView={setSelected}
            pagination={{
              current: pagination?.page ?? page,
              pageSize: pagination?.limit ?? PAGE_SIZE,
              total: pagination?.total ?? 0,
              showSizeChanger: false,
              hideOnSinglePage: false,
              onChange: (nextPage) => setPage(nextPage),
            }}
          />
        </div>
      </section>

      <PayoutDetailsModal
        payout={selected}
        open={selected !== null}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}
