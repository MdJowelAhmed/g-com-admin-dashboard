import { Bell, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Topbar() {
  const navigate = useNavigate()

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
        onClick={() => navigate('/dashboard/notifications')}
      >
        <Bell size={18} />
      </IconButton>
    </header>
  )
}

type IconButtonProps = {
  label: string
  onClick?: () => void
  children: React.ReactNode
}

function IconButton({ label, onClick, children }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-surface-border text-gray-300 transition-colors hover:border-brand hover:text-white"
    >
      {children}
    </button>
  )
}
