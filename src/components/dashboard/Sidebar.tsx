import { NavLink } from 'react-router-dom'
import {
  Boxes,
  CalendarCheck,
  Home,
  LayoutGrid,
  LogOut,
  Mail,
  Package,
  Settings,
  Store,
  UserCog,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import GcomLogo from '../auth/GcomLogo'

type NavItem = {
  label: string
  to: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { label: 'Dashboard Overview', to: '/dashboard', icon: LayoutGrid },
  { label: 'Home Control', to: '/dashboard/home-control', icon: Home },
  { label: 'Shop Management', to: '/dashboard/shops', icon: Store },
  { label: 'Category', to: '/dashboard/category', icon: Boxes },
  { label: 'User Management', to: '/dashboard/users', icon: Users },
  { label: 'Order Management', to: '/dashboard/orders', icon: Package },
  { label: 'Earning & Payouts', to: '/dashboard/earnings', icon: Wallet },
  { label: 'Event Management', to: '/dashboard/events', icon: CalendarCheck },
  {
    label: 'Controller Management',
    to: '/dashboard/controllers',
    icon: UserCog,
  },
  { label: 'Messages', to: '/dashboard/messages', icon: Mail },
  // { label: 'Broadcast', to: '/dashboard/broadcast', icon: Megaphone },
  { label: 'Settings', to: '/dashboard/settings', icon: Settings },
]

type Props = {
  user: {
    name: string
    location: string
    avatarUrl?: string
  }
  onLogout?: () => void
}

export default function Sidebar({ user, onLogout }: Props) {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-brand/60 bg-surface-sidebar">
      <div className="flex items-center justify-center py-6">
        <GcomLogo className="h-[120px] w-[120px] rounded-3xl" />
      </div>

      <nav className="mt-2 flex flex-1 flex-col gap-1 overflow-y-auto px-3 pb-4">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-brand text-white'
                  : 'text-gray-300 hover:bg-surface-elevated hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-surface-border p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface-elevated">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-white">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-white">
              {user.name}
            </div>
            <div className="truncate text-xs text-gray-400">
              {user.location}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-gray-300 transition-colors hover:bg-surface-elevated hover:text-white"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </aside>
  )
}
