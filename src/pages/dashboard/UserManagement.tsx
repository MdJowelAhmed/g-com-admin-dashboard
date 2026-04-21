import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import UsersTable from '../../components/dashboard/UsersTable'
import UserDetailsModal from '../../components/dashboard/UserDetailsModal'
import EditUserModal from '../../components/dashboard/EditUserModal'
import UserFilter, {
  EMPTY_USER_FILTER,
  type UserFilterState,
} from '../../components/dashboard/UserFilter'
import { initialUsers, type User } from '../../components/dashboard/userData'

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<UserFilterState>(EMPTY_USER_FILTER)
  const [viewing, setViewing] = useState<User | null>(null)
  const [editing, setEditing] = useState<User | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return users.filter((u) => {
      if (q) {
        const haystack = `${u.name} ${u.email}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      if (filter.statuses.length && !filter.statuses.includes(u.status)) {
        return false
      }
      if (filter.activeOnly && !u.active) return false
      return true
    })
  }, [users, query, filter])

  const handleDelete = (key: string) =>
    setUsers((prev) => prev.filter((u) => u.key !== key))

  const handleToggleActive = (key: string, next: boolean) =>
    setUsers((prev) =>
      prev.map((u) =>
        u.key === key
          ? {
              ...u,
              active: next,
              status: next
                ? u.status === 'Suspended'
                  ? 'Verified'
                  : u.status
                : 'Suspended',
            }
          : u,
      ),
    )

  const handleSave = (key: string, patch: Partial<User>) =>
    setUsers((prev) =>
      prev.map((u) => (u.key === key ? { ...u, ...patch } : u)),
    )

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
          <UsersTable
            data={filtered}
            onEdit={setEditing}
            onView={setViewing}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
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
