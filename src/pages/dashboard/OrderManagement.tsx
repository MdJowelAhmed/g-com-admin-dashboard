import { useState } from 'react'
import { Search } from 'lucide-react'
import OrdersTable from '../../components/dashboard/OrdersTable'
import OrderRecordModal from '../../components/dashboard/OrderRecordModal'
import OrderFilter, {
  EMPTY_ORDER_FILTER,
  type OrderFilterState,
} from '../../components/dashboard/OrderFilter'
import { useFilteredList } from '../../hooks/useFilteredList'
import { type OrderRecord } from '../../data/orderData'
import { getInitialOrders } from '../../services/mock/dashboardDataService'

export default function OrderManagement() {
  const { query, setQuery, filter, setFilter, filtered } =
    useFilteredList<OrderRecord, OrderFilterState>({
      initialData: getInitialOrders(),
      emptyFilter: EMPTY_ORDER_FILTER,
      filterFn: (order, q, activeFilter) => {
        const min = activeFilter.minAmount ? Number(activeFilter.minAmount) : null
        const max = activeFilter.maxAmount ? Number(activeFilter.maxAmount) : null
        if (q) {
          const haystack =
            `${order.orderId} ${order.customerName} ${order.vendor}`.toLowerCase()
          if (!haystack.includes(q)) return false
        }
        if (
          activeFilter.statuses.length &&
          !activeFilter.statuses.includes(order.status)
        ) {
          return false
        }
        if (min !== null && order.amount < min) return false
        if (max !== null && order.amount > max) return false
        return true
      },
    })
  const [selected, setSelected] = useState<OrderRecord | null>(null)

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
