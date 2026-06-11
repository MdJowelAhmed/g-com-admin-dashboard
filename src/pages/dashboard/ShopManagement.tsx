import { useMemo, useState } from 'react'
import { CheckCircle, Clock, Search, ShieldX, Store } from 'lucide-react'
import StatCard from '../../components/dashboard/StatCard'
import ShopsTable from '../../components/dashboard/ShopsTable'
import ShopDetailsModal from '../../components/dashboard/ShopDetailsModal'
import ShopFilter, {
  EMPTY_FILTER,
  type FilterState,
} from '../../components/dashboard/ShopFilter'
import { useFilteredList } from '../../hooks/useFilteredList'
import { type Shop } from '../../data/shopData'
import { getInitialShops } from '../../services/mock/dashboardDataService'

export default function ShopManagement() {
  const { data: shops, setData: setShops, query, setQuery, filter, setFilter, filtered } =
    useFilteredList<Shop, FilterState>({
      initialData: getInitialShops(),
      emptyFilter: EMPTY_FILTER,
      filterFn: (shop, q, activeFilter) => {
        if (q) {
          const haystack =
            `${shop.name} ${shop.shopId} ${shop.type} ${shop.category}`.toLowerCase()
          if (!haystack.includes(q)) return false
        }
        if (
          activeFilter.statuses.length &&
          !activeFilter.statuses.includes(shop.status)
        ) {
          return false
        }
        if (activeFilter.types.length && !activeFilter.types.includes(shop.type)) {
          return false
        }
        return true
      },
    })
  const [selected, setSelected] = useState<Shop | null>(null)

  const counts = useMemo(() => {
    let verified = 0
    let pending = 0
    let suspended = 0
    for (const shop of shops) {
      if (shop.status === 'Verified') verified++
      else if (shop.status === 'Pending' || shop.status === 'In Review')
        pending++
      else if (shop.status === 'Suspended') suspended++
    }
    return { total: shops.length, verified, pending, suspended }
  }, [shops])

  const approve = (key: string) =>
    setShops((prev) =>
      prev.map((s) => (s.key === key ? { ...s, status: 'Verified' } : s)),
    )

  const reject = (key: string) =>
    setShops((prev) =>
      prev.map((s) => (s.key === key ? { ...s, status: 'Suspended' } : s)),
    )

  return (
    <div className="py-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Businesses"
          value={counts.total.toLocaleString()}
          icon={Store}
        />
        <StatCard
          label="Verified"
          value={counts.verified.toLocaleString()}
          icon={CheckCircle}
        />
        <StatCard
          label="Pending Approval"
          value={counts.pending.toLocaleString()}
          icon={Clock}
        />
        <StatCard
          label="Suspended"
          value={counts.suspended.toLocaleString()}
          icon={ShieldX}
        />
      </section>

      <section className="mt-6 rounded-2xl border border-surface-border bg-surface-card p-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-white">Shop Management</h1>

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
                placeholder="Search name/type...."
                className="h-10 w-full rounded-md border border-surface-border bg-transparent pl-9 pr-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-brand"
              />
            </div>
            <ShopFilter value={filter} onChange={setFilter} />
          </div>
        </header>

        <div className="mt-6">
          <ShopsTable
            data={filtered}
            onView={(shop) => setSelected(shop)}
            onApprove={approve}
            onReject={reject}
          />
        </div>
      </section>

      <ShopDetailsModal
        shop={selected}
        open={selected !== null}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}
