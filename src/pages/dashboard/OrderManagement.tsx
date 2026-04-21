import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import OrdersTable from '../../components/dashboard/OrdersTable'
import OrderRecordModal from '../../components/dashboard/OrderRecordModal'
import OrderFilter, {
  EMPTY_ORDER_FILTER,
  type OrderFilterState,
} from '../../components/dashboard/OrderFilter'
import {
  initialOrders,
  type OrderRecord,
} from '../../components/dashboard/orderData'

export default function OrderManagement() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<OrderFilterState>(EMPTY_ORDER_FILTER)
  const [selected, setSelected] = useState<OrderRecord | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const min = filter.minAmount ? Number(filter.minAmount) : null
    const max = filter.maxAmount ? Number(filter.maxAmount) : null

    return initialOrders.filter((order) => {
      if (q) {
        const haystack =
          `${order.orderId} ${order.customerName} ${order.vendor}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      if (filter.statuses.length && !filter.statuses.includes(order.status)) {
        return false
      }
      if (min !== null && order.amount < min) return false
      if (max !== null && order.amount > max) return false
      return true
    })
  }, [query, filter])

  return (
    <div className="py-6">
      <section className="rounded-2xl border border-surface-border bg-surface-card p-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-white">Order Management</h1>

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
                placeholder="Search Order ID.."
                className="h-10 w-full rounded-md border border-surface-border bg-transparent pl-9 pr-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-brand"
              />
            </div>
            <OrderFilter value={filter} onChange={setFilter} />
          </div>
        </header>

        <div className="mt-6">
          <OrdersTable data={filtered} onRowClick={setSelected} />
        </div>
      </section>

      <OrderRecordModal
        order={selected}
        open={selected !== null}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}
