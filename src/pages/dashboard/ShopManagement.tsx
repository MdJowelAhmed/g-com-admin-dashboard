import { useMemo, useState } from 'react'
import { message, Spin } from 'antd'
import SearchInput from '../../components/common/SearchInput'
import ShopsTable from '../../components/dashboard/ShopsTable'
import ShopDetailsModal from '../../components/dashboard/ShopDetailsModal'
import ShopFilter, {
  EMPTY_FILTER,
  type FilterState,
} from '../../components/dashboard/ShopFilter'
import { useDebouncedSearch } from '../../hooks/useDebouncedSearch'
import { type Shop } from '../../data/shopData'
import {
  mapShopFromApi,
  SHOP_STATUS_TO_API,
  useGetShopsQuery,
  useUpdateShopStatusMutation,
} from '../../redux/api/shopManagementApi'

const PAGE_SIZE = 10

export default function ShopManagement() {
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<FilterState>(EMPTY_FILTER)
  const [selected, setSelected] = useState<Shop | null>(null)

  const { value: query, setValue: setQuery, searchTerm } = useDebouncedSearch({
    delay: 400,
    onSearchTermChange: () => setPage(1),
  })

  const statusParam = filter.status
    ? SHOP_STATUS_TO_API[filter.status]
    : undefined

  const { data, isLoading, isError, isFetching } = useGetShopsQuery({
    page,
    limit: PAGE_SIZE,
    ...(searchTerm ? { searchTerm } : {}),
    ...(statusParam ? { status: statusParam } : {}),
  })
  const [updateShopStatus] = useUpdateShopStatusMutation()

  const shops = useMemo(() => {
    const pageOffset = ((data?.pagination.page ?? page) - 1) * PAGE_SIZE
    return (data?.data ?? []).map((doc, index) =>
      mapShopFromApi(doc, pageOffset + index),
    )
  }, [data, page])

  const pagination = data?.pagination

  const handleFilterChange = (next: FilterState) => {
    setFilter(next)
    setPage(1)
  }

  const approve = async (key: string) => {
    try {
      const result = await updateShopStatus({
        id: key,
        status: 'approved',
      }).unwrap()
      message.success(result.message || 'Business approved successfully.')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to approve business.'
      message.error(errorMessage)
    }
  }

  const reject = async (key: string) => {
    try {
      const result = await updateShopStatus({
        id: key,
        status: 'rejected',
      }).unwrap()
      message.success(result.message || 'Business rejected successfully.')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to reject business.'
      message.error(errorMessage)
    }
  }

  return (
    <div className="py-6">
      <section className="mt-6 rounded-2xl border border-surface-border bg-surface-card p-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-white">Shop Management</h1>

          <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search name/type...."
            />
            <ShopFilter value={filter} onChange={handleFilterChange} />
          </div>
        </header>

        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spin size="large" />
            </div>
          ) : isError ? (
            <p className="py-10 text-center text-sm text-red-400">
              Failed to load businesses. Please try again.
            </p>
          ) : (
            <ShopsTable
              data={shops}
              loading={isFetching}
              onView={(shop) => setSelected(shop)}
              onApprove={approve}
              onReject={reject}
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

      <ShopDetailsModal
        shop={selected}
        open={selected !== null}
        onClose={() => setSelected(null)}
        onApprove={approve}
        onReject={reject}
      />
    </div>
  )
}
