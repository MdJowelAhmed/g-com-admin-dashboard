import { useMemo, useState } from 'react'
import { message, Spin } from 'antd'
import SearchInput from '../../components/common/SearchInput'
import UsersTable from '../../components/dashboard/UsersTable'
import UserDetailsModal from '../../components/dashboard/UserDetailsModal'
import UserFilter, {
  EMPTY_USER_FILTER,
  type UserFilterState,
} from '../../components/dashboard/UserFilter'
import { useDebouncedSearch } from '../../hooks/useDebouncedSearch'
import { type User } from '../../data/userData'
import {
  mapUserFromApi,
  USER_STATUS_TO_API,
  useGetUsersQuery,
  useUpdateUserStatusMutation,
} from '../../redux/api/userApi'

const PAGE_SIZE = 10

export default function UserManagement() {
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<UserFilterState>(EMPTY_USER_FILTER)
  const [viewing, setViewing] = useState<User | null>(null)

  const { value: query, setValue: setQuery, searchTerm } = useDebouncedSearch({
    delay: 400,
    onSearchTermChange: () => setPage(1),
  })

  const statusParam = filter.status
    ? USER_STATUS_TO_API[filter.status]
    : undefined

  const { data, isLoading, isError, isFetching } = useGetUsersQuery({
    page,
    limit: PAGE_SIZE,
    ...(searchTerm ? { searchTerm } : {}),
    ...(statusParam ? { status: statusParam } : {}),
  })
  const [updateUserStatus] = useUpdateUserStatusMutation()

  const users = useMemo(() => {
    const pageOffset = ((data?.pagination.page ?? page) - 1) * PAGE_SIZE
    return (data?.data ?? []).map((doc, index) =>
      mapUserFromApi(doc, pageOffset + index),
    )
  }, [data, page])

  const pagination = data?.pagination

  const handleFilterChange = (next: UserFilterState) => {
    setFilter(next)
    setPage(1)
  }

  const handleToggleActive = async (key: string, next: boolean) => {
    try {
      const result = await updateUserStatus({
        id: key,
        status: next ? 'active' : 'inactive',
      }).unwrap()
      message.success(result.message || 'User status updated successfully.')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update user status.'
      message.error(errorMessage)
    }
  }

  return (
    <div className="py-6">
      <section className="rounded-2xl border border-surface-border bg-surface-card p-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-white">User Management</h1>

          <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search name Or E-mail.."
            />
            <UserFilter value={filter} onChange={handleFilterChange} />
          </div>
        </header>

        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spin size="large" />
            </div>
          ) : isError ? (
            <p className="py-10 text-center text-sm text-red-400">
              Failed to load users. Please try again.
            </p>
          ) : (
            <UsersTable
              data={users}
              loading={isFetching}
              onView={setViewing}
              onToggleActive={handleToggleActive}
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

      <UserDetailsModal
        user={viewing}
        open={viewing !== null}
        onClose={() => setViewing(null)}
      />
    </div>
  )
}
