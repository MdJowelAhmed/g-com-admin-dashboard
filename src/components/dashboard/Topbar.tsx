import { Bell, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useGetNotificationsQuery } from '../../redux/api/notificationApi'

export default function Topbar() {
  const navigate = useNavigate()
  const { data } = useGetNotificationsQuery({ page: 1, limit: 1 })
  const unreadCount = data?.data.unreadCount ?? 0

  return (
    <header className="flex items-center justify-end gap-3 px-8 py-5">
      <IconButton
        label="Messages"
        onClick={() => navigate('/dashboard/messages')}
      >
        <Mail size={18} />
      </IconButton>
      <IconButton
        label="Notifications"
        badge={unreadCount > 0 ? unreadCount : undefined}
        onClick={() => navigate('/dashboard/notifications')}
      >
        <Bell size={18} />
      </IconButton>
    </header>
  )
}

type IconButtonProps = {
  label: string
  badge?: number
  onClick?: () => void
  children: React.ReactNode
}

function IconButton({ label, badge, onClick, children }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-surface-border text-gray-300 transition-colors hover:border-brand hover:text-white"
    >
      {children}
      {badge !== undefined && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  )
}
