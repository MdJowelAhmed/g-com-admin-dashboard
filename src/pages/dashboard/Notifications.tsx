import { useMemo, useState } from 'react'
import { Spin } from 'antd'
import {
  Bell,
  CheckCheck,
  DollarSign,
  Package,
  Settings,
  UserPlus,
  type LucideIcon,
} from 'lucide-react'
import {
  mapNotificationFromApi,
  type NotificationRow,
  type NotificationSection,
  type NotificationUiType,
  useGetNotificationsQuery,
  useReadAllNotificationsMutation,
  useReadSingleNotificationMutation,
} from '../../redux/api/notificationApi'

type Filter = 'all' | 'unread'

const PAGE_SIZE = 10

const SECTION_ORDER: NotificationSection[] = [
  'Today',
  'Yesterday',
  'Earlier this week',
  'Older',
]

const typeMeta: Record<
  NotificationUiType,
  { icon: LucideIcon; tone: string; label: string }
> = {
  order: {
    icon: Package,
    tone: 'bg-brand/20 text-brand-hover',
    label: 'Order',
  },
  payment: {
    icon: DollarSign,
    tone: 'bg-emerald-500/20 text-emerald-300',
    label: 'Payment',
  },
  user: {
    icon: UserPlus,
    tone: 'bg-sky-500/20 text-sky-300',
    label: 'User',
  },
  system: {
    icon: Settings,
    tone: 'bg-amber-500/20 text-amber-300',
    label: 'System',
  },
}

export default function Notifications() {
  const [filter, setFilter] = useState<Filter>('all')
  const [page, setPage] = useState(1)

  const { data, isLoading, isFetching } = useGetNotificationsQuery({
    page,
    limit: PAGE_SIZE,
  })
  const [readSingleNotification] = useReadSingleNotificationMutation()
  const [readAllNotifications, { isLoading: markingAllRead }] =
    useReadAllNotificationsMutation()

  const items = useMemo(
    () => (data?.data.notifications ?? []).map(mapNotificationFromApi),
    [data],
  )

  const unreadCount = data?.data.unreadCount ?? 0
  const pagination = data?.pagination
  const loading = isLoading || isFetching

  const visible =
    filter === 'unread' ? items.filter((notification) => !notification.read) : items

  const grouped = useMemo(() => {
    const map = new Map<NotificationSection, NotificationRow[]>()
    for (const notification of visible) {
      const bucket = map.get(notification.section) ?? []
      bucket.push(notification)
      map.set(notification.section, bucket)
    }

    return SECTION_ORDER.map((section) => ({
      section,
      entries: map.get(section) ?? [],
    })).filter((group) => group.entries.length > 0)
  }, [visible])

  const markAllRead = async () => {
    if (unreadCount === 0) return
    try {
      await readAllNotifications().unwrap()
    } catch {
      // RTK Query handles mutation errors
    }
  }

  const markOneRead = async (id: string, read: boolean) => {
    if (read) return
    try {
      await readSingleNotification(id).unwrap()
    } catch {
      // RTK Query handles mutation errors
    }
  }

  return (
    <div className="py-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/20 text-brand-hover">
            <Bell size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Notifications</h1>
            <p className="text-sm text-gray-400">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
                : "You're all caught up"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={markAllRead}
          disabled={unreadCount === 0 || markingAllRead}
          className="flex items-center gap-1.5 rounded-md border border-surface-border px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-brand hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCheck size={16} />
          {markingAllRead ? 'Marking…' : 'Mark all as read'}
        </button>
      </header>

      <nav className="mt-6 flex gap-2">
        <FilterTab
          active={filter === 'all'}
          onClick={() => setFilter('all')}
          label="All"
          count={pagination?.total ?? items.length}
        />
        <FilterTab
          active={filter === 'unread'}
          onClick={() => setFilter('unread')}
          label="Unread"
          count={unreadCount}
        />
      </nav>

      <div className="relative mt-6 space-y-8">
        {loading && (
          <div className="flex justify-center py-16">
            <Spin size="large" />
          </div>
        )}

        {!loading && grouped.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-surface-border p-16 text-center">
            <Bell
              size={36}
              className="mx-auto mb-3 text-gray-500"
              strokeWidth={1.5}
            />
            <p className="text-sm text-gray-400">No notifications to show.</p>
          </div>
        ) : (
          grouped.map(({ section, entries }) => (
            <section key={section}>
              <div className="mb-3 flex items-center gap-3">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {section}
                </h2>
                <div className="h-px flex-1 bg-surface-border" />
                <span className="text-xs text-gray-500">
                  {entries.length} item{entries.length === 1 ? '' : 's'}
                </span>
              </div>

              <ul className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                {entries.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onClick={() => markOneRead(notification.id, notification.read)}
                  />
                ))}
              </ul>
            </section>
          ))
        )}
      </div>

      {!loading && pagination && pagination.totalPage > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="rounded-md border border-surface-border px-4 py-2 text-sm text-gray-300 transition-colors hover:border-brand hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-400">
            Page {pagination.page} of {pagination.totalPage}
          </span>
          <button
            type="button"
            disabled={page >= pagination.totalPage}
            onClick={() =>
              setPage((current) => Math.min(pagination.totalPage, current + 1))
            }
            className="rounded-md border border-surface-border px-4 py-2 text-sm text-gray-300 transition-colors hover:border-brand hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

type FilterTabProps = {
  label: string
  count: number
  active: boolean
  onClick: () => void
}

function FilterTab({ label, count, active, onClick }: FilterTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? 'bg-brand text-white'
          : 'bg-surface-card text-gray-300 hover:text-white'
      }`}
    >
      {label}
      <span
        className={`rounded-full px-2 py-0.5 text-[11px] ${
          active ? 'bg-white/20 text-white' : 'bg-black/30 text-gray-300'
        }`}
      >
        {count}
      </span>
    </button>
  )
}

type NotificationCardProps = {
  notification: NotificationRow
  onClick: () => void
}

function NotificationCard({ notification, onClick }: NotificationCardProps) {
  const meta = typeMeta[notification.type]
  const Icon = meta.icon

  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={`group flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all ${
          notification.read
            ? 'border-surface-border bg-surface-card hover:border-brand/50'
            : 'border-brand/40 bg-brand/5 hover:border-brand'
        }`}
      >
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${meta.tone}`}
        >
          <Icon size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">
                  {notification.title}
                </span>
                <span className="rounded-full bg-surface-elevated px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-300">
                  {meta.label}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-400">
                {notification.description}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-xs text-gray-500">
                {notification.createdAt}
              </span>
              {!notification.read && (
                <span
                  aria-label="Unread"
                  className="h-2 w-2 rounded-full bg-brand"
                />
              )}
            </div>
          </div>
        </div>
      </button>
    </li>
  )
}
