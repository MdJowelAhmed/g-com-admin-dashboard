import { useMemo, useState } from 'react'
import { message, Spin } from 'antd'
import { Search } from 'lucide-react'
import UsersTable from '../../components/dashboard/UsersTable'
import UserDetailsModal from '../../components/dashboard/UserDetailsModal'
import EditUserModal from '../../components/dashboard/EditUserModal'
import UserFilter, {
  EMPTY_USER_FILTER,
  type UserFilterState,
} from '../../components/dashboard/UserFilter'
import { type User } from '../../data/userData'
import {
  mapUserFromApi,
  useGetUsersQuery,
  useUpdateUserStatusMutation,
} from '../../redux/api/userApi'

function filterUsers(
  users: User[],
  query: string,
  activeFilter: UserFilterState,
) {
  return users.filter((user) => {
    if (query) {
      const haystack = `${user.name} ${user.email}`.toLowerCase()
      if (!haystack.includes(query)) return false
    }
    if (
      activeFilter.statuses.length &&
      !activeFilter.statuses.includes(user.status)
    ) {
      return false
    }
    if (activeFilter.activeOnly && !user.active) return false
    return true
  })
}

export default function UserManagement() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<UserFilterState>(EMPTY_USER_FILTER)
  const [viewing, setViewing] = useState<User | null>(null)
  const [editing, setEditing] = useState<User | null>(null)

  const { data, isLoading, isError } = useGetUsersQuery()
  const [updateUserStatus] = useUpdateUserStatusMutation()

  const users = useMemo(
    () => (data?.data ?? []).map(mapUserFromApi),
    [data],
  )

  const filtered = useMemo(
    () => filterUsers(users, query.trim().toLowerCase(), filter),
    [users, query, filter],
  )

  const handleDelete = (_key: string) => {
    message.info('Delete user is not available yet.')
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

  const handleSave = (_key: string, _patch: Partial<User>) => {
    message.info('Edit user is not available yet.')
  }

  return (
    <div className="py-6">
      <section className="rounded-2xl border border-surface-border bg-surface-card p-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-white">User Management</h1>

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
                placeholder="Search name Or E-mail.."
                className="h-10 w-full rounded-md border border-surface-border bg-transparent pl-9 pr-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-brand"
              />
            </div>
            <UserFilter value={filter} onChange={setFilter} />
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
              data={filtered}
              onEdit={setEditing}
              onView={setViewing}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
            />
          )}
        </div>
      </section>

      <UserDetailsModal
        user={viewing}
        open={viewing !== null}
        onClose={() => setViewing(null)}
      />

      <EditUserModal
        user={editing}
        open={editing !== null}
        onClose={() => setEditing(null)}
        onSave={handleSave}
      />
    </div>
  )
}
