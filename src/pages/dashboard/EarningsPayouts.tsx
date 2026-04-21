import { useMemo, useState } from 'react'
import { DollarSign, Search, ShieldCheck, Zap } from 'lucide-react'
import StatCard from '../../components/dashboard/StatCard'
import PayoutsTable from '../../components/dashboard/PayoutsTable'
import PayoutFilter, {
  EMPTY_PAYOUT_FILTER,
  type PayoutFilterState,
} from '../../components/dashboard/PayoutFilter'
import {
  feeFor,
  initialTransactions,
  type Transaction,
} from '../../components/dashboard/payoutData'

const formatUsd = (n: number) =>
  `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`

export default function EarningsPayouts() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<PayoutFilterState>(EMPTY_PAYOUT_FILTER)

  const totals = useMemo(() => {
    let escrow = 0
    let direct = 0
    let fees = 0
    for (const t of transactions) {
      if (t.category === 'Escrow') escrow += t.grossAmount
      else direct += t.grossAmount
      fees += feeFor(t.grossAmount)
    }
    return { escrow, direct, fees }
  }, [transactions])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return transactions.filter((t) => {
      if (q) {
        const haystack = `${t.transactionId} ${t.name}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      if (filter.statuses.length && !filter.statuses.includes(t.status)) {
        return false
      }
      if (filter.systems.length && !filter.systems.includes(t.system)) {
        return false
      }
      return true
    })
  }, [transactions, query, filter])

  const release = (key: string) =>
    setTransactions((prev) =>
      prev.map((t) => (t.key === key ? { ...t, status: 'Released' } : t)),
    )

  return (
    <div className="py-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Secure Pay (Escrow)"
          value={formatUsd(totals.escrow)}
          icon={ShieldCheck}
        />
        <StatCard
          label="Instant Pay (Direct)"
          value={formatUsd(totals.direct)}
          icon={Zap}
        />
        <StatCard
          label="Collected Fees"
          value={formatUsd(totals.fees)}
          icon={DollarSign}
        />
      </section>

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
                placeholder="Search TXN ID.."
                className="h-10 w-full rounded-md border border-surface-border bg-transparent pl-9 pr-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-brand"
              />
            </div>
            <PayoutFilter value={filter} onChange={setFilter} />
          </div>
        </header>

        <div className="mt-6">
          <PayoutsTable data={filtered} onRelease={release} />
        </div>
      </section>
    </div>
  )
}
