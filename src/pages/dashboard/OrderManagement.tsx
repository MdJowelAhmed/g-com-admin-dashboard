import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import OrdersTable from '../../components/dashboard/OrdersTable'
import OrderRecordModal from '../../components/dashboard/OrderRecordModal'
import ResolveDisputeModal from '../../components/dashboard/ResolveDisputeModal'
import OrderFilter, {
  EMPTY_ORDER_FILTER,
  type OrderFilterState,
} from '../../components/dashboard/OrderFilter'
import {
  mapOrderFromApi,
  useGetOrdersQuery,
  type OrderListItem,
} from '../../redux/api/orderManageApi'

const PAGE_SIZE = 10

function filterOrders(
  orders: OrderListItem[],
  query: string,
  activeFilter: OrderFilterState,
) {
  const min = activeFilter.minAmount ? Number(activeFilter.minAmount) : null
  const max = activeFilter.maxAmount ? Number(activeFilter.maxAmount) : null

  return orders.filter((order) => {
    if (query) {
      const haystack =
        `${order.orderId} ${order.customerName} ${order.businessName} ${order.branchName ?? ''}`.toLowerCase()
      if (!haystack.includes(query)) return false
    }
    if (
      activeFilter.statuses.length &&
      !activeFilter.statuses.includes(order.status)
    ) {
      return false
    }
    if (min !== null && order.totalAmount < min) return false
    if (max !== null && order.totalAmount > max) return false
    return true
  })
}

export default function OrderManagement() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<OrderFilterState>(EMPTY_ORDER_FILTER)
  const [page, setPage] = useState(1)
  const [viewingId, setViewingId] = useState<string | null>(null)
  const [disputeOrder, setDisputeOrder] = useState<OrderListItem | null>(null)

  const { data, isLoading, isError, isFetching } = useGetOrdersQuery({
    page,
    limit: PAGE_SIZE,
  })

  const orders = useMemo(
    () => (data?.data ?? []).map((doc, index) => mapOrderFromApi(doc, index)),
    [data],
  )

  const filtered = useMemo(
    () => filterOrders(orders, query.trim().toLowerCase(), filter),
    [orders, query, filter],
  )

  const pagination = data?.pagination

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
                placeholder="Search Order ID, customer, business..."
                className="h-10 w-full rounded-md border border-surface-border bg-transparent pl-9 pr-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-brand"
              />
            </div>
            <OrderFilter value={filter} onChange={setFilter} />
          </div>
        </header>

        <div className="mt-6">
          {isError ? (
            <p className="py-10 text-center text-sm text-red-400">
              Failed to load orders. Please try again.
            </p>
          ) : (
            <OrdersTable
              data={filtered}
              loading={isLoading || isFetching}
              onView={(order) => setViewingId(order.key)}
              onResolveDispute={setDisputeOrder}
              pagination={{
                current: pagination?.page ?? page,
                pageSize: pagination?.limit ?? PAGE_SIZE,
                total: pagination?.total ?? 0,
                showSizeChanger: false,
                hideOnSinglePage: false,
                onChange: (nextPage) => setPage(nextPage),
              }}
            />
          )}
        </div>
      </section>

      <OrderRecordModal
        orderId={viewingId}
        open={viewingId !== null}
        onClose={() => setViewingId(null)}
      />

      <ResolveDisputeModal
        order={disputeOrder}
        open={disputeOrder !== null}
        onClose={() => setDisputeOrder(null)}
      />
    </div>
  )
}
