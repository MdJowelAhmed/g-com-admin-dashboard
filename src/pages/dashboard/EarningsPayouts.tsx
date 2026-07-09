import { useMemo, useState } from 'react'
import { Clock, DollarSign, Search, Wallet } from 'lucide-react'
import StatCard from '../../components/dashboard/StatCard'
import PayoutsTable from '../../components/dashboard/PayoutsTable'
import PayoutFilter, {
  EMPTY_PAYOUT_FILTER,
  type PayoutFilterState,
} from '../../components/dashboard/PayoutFilter'
import {
  mapPayoutFromApi,
  useGetPayoutHistoryQuery,
} from '../../redux/api/earningPayoutApi'

const PAGE_SIZE = 10

function filterPayouts(
  payouts: ReturnType<typeof mapPayoutFromApi>[],
  query: string,
  activeFilter: PayoutFilterState,
) {
  const q = query.trim().toLowerCase()

  return payouts.filter((payout) => {
    if (q) {
      const haystack =
        `${payout.clientReference} ${payout.businessName} ${payout.method}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    if (
      activeFilter.statuses.length &&
      !activeFilter.statuses.includes(payout.status)
    ) {
      return false
    }
    if (
      activeFilter.methods.length &&
      !activeFilter.methods.includes(payout.method)
    ) {
      return false
    }
    return true
  })
}

export default function EarningsPayouts() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<PayoutFilterState>(EMPTY_PAYOUT_FILTER)
  const [page, setPage] = useState(1)

  const { data, isLoading, isFetching } = useGetPayoutHistoryQuery({
    page,
    limit: PAGE_SIZE,
  })

  const payouts = useMemo(
    () => (data?.data ?? []).map((doc, index) => mapPayoutFromApi(doc, index)),
    [data],
  )

  const filtered = useMemo(
    () => filterPayouts(payouts, query, filter),
    [payouts, query, filter],
  )

  const totals = useMemo(() => {
    const totalAmount = payouts.reduce((sum, payout) => sum + payout.amount, 0)
    const processingCount = payouts.filter(
      (payout) => payout.status === 'processing',
    ).length

    return {
      totalAmount,
      processingCount,
      totalRequests: data?.pagination.total ?? 0,
    }
  }, [payouts, data])

  const pagination = data?.pagination
  const loading = isLoading || isFetching

  return (
    <div className="py-6">
      

      <section className="mt-6 rounded-2xl border border-surface-border bg-surface-card p-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-white">
            Earnings &amp; Payments
          </h1>

          <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
            <div className="relative w-full max-w-sm">
              <Search
                size={16}
                className="pointer-events-none absolute inset-y-0 left-3 my-auto text-gray-400"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search reference or business..."
                className="h-10 w-full rounded-md border border-surface-border bg-transparent pl-9 pr-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-brand"
              />
            </div>
            <PayoutFilter value={filter} onChange={setFilter} />
          </div>
        </header>

        <div className="mt-6">
          <PayoutsTable
            data={filtered}
            loading={loading}
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
    </div>
  )
}
