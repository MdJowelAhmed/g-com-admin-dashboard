import { useMemo, useState } from 'react'
import {
  Bell,
  CheckCheck,
  DollarSign,
  Package,
  Settings,
  UserPlus,
  type LucideIcon,
} from 'lucide-react'

type NotificationType = 'order' | 'user' | 'payment' | 'system'

type NotificationSection = 'Today' | 'Yesterday' | 'Earlier this week'

type Notification = {
  id: string
  type: NotificationType
  title: string
  description: string
  createdAt: string
  section: NotificationSection
  read: boolean
}

type Filter = 'all' | 'unread'

const SECTION_ORDER: NotificationSection[] = [
  'Today',
  'Yesterday',
  'Earlier this week',
]

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'New order placed',
    description: 'Rakib Hossain placed order #0245847 for Americano.',
    createdAt: '2 minutes ago',
    section: 'Today',
    read: false,
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payout processed',
    description: 'Your payout of $1,240.00 has been sent to your bank account.',
    createdAt: '1 hour ago',
    section: 'Today',
    read: false,
  },
  {
    id: '3',
    type: 'user',
    title: 'New shop registration',
    description: 'Solaris energy submitted documents for verification.',
    createdAt: '3 hours ago',
    section: 'Today',
    read: false,
  },
  {
    id: '4',
    type: 'system',
    title: 'Scheduled maintenance',
    description:
      'The dashboard will be briefly unavailable on Oct 28 from 02:00 UTC.',
    createdAt: 'Yesterday, 18:40',
    section: 'Yesterday',
    read: true,
  },
  {
    id: '5',
    type: 'order',
    title: 'Order refunded',
    description: 'Order #0245819 has been refunded to the customer.',
    createdAt: '2 days ago',
    section: 'Earlier this week',
    read: true,
  },
  {
    id: '6',
    type: 'user',
    title: 'New user signup',
    description: 'Tania Rahman joined the platform.',
    createdAt: '3 days ago',
    section: 'Earlier this week',
    read: true,
  },
]

const typeMeta: Record<
  NotificationType,
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
  const [items, setItems] = useState(initialNotifications)
  const [filter, setFilter] = useState<Filter>('all')

  const unreadCount = useMemo(
    () => items.filter((n) => !n.read).length,
    [items],
  )

  const visible = filter === 'unread' ? items.filter((n) => !n.read) : items

  const grouped = useMemo(() => {
    const map = new Map<NotificationSection, Notification[]>()
    for (const n of visible) {
      const bucket = map.get(n.section) ?? []
      bucket.push(n)
      map.set(n.section, bucket)
    }
    return SECTION_ORDER.map((section) => ({
      section,
      entries: map.get(section) ?? [],
    })).filter((group) => group.entries.length > 0)
  }, [visible])

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))

  const markOneRead = (id: string) =>
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )

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
          disabled={unreadCount === 0}
          className="flex items-center gap-1.5 rounded-md border border-surface-border px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-brand hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCheck size={16} />
          Mark all as read
        </button>
      </header>

      <nav className="mt-6 flex gap-2">
        <FilterTab
          active={filter === 'all'}
          onClick={() => setFilter('all')}
          label="All"
          count={items.length}
        />
        <FilterTab
          active={filter === 'unread'}
          onClick={() => setFilter('unread')}
          label="Unread"
          count={unreadCount}
        />
      </nav>

      <div className="mt-6 space-y-8">
        {grouped.length === 0 ? (
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
                {entries.map((n) => (
                  <NotificationCard
                    key={n.id}
                    notification={n}
                    onClick={() => markOneRead(n.id)}
                  />
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
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
  notification: Notification
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
