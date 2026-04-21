import { Modal } from 'antd'
import { UserRound } from 'lucide-react'
import type { User, UserStatus } from './userData'

const statusStyles: Record<UserStatus, string> = {
  Pending: 'text-amber-400',
  Verified: 'text-emerald-400',
  Reviewed: 'text-sky-400',
  Suspended: 'text-red-400',
}

type Props = {
  user: User | null
  open: boolean
  onClose: () => void
}

export default function UserDetailsModal({ user, open, onClose }: Props) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="User Details"
      centered
      destroyOnClose
      width={560}
    >
      {user && (
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/20 text-brand-hover">
              <UserRound size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-lg font-semibold text-white">
                {user.name}
              </div>
              <div className="truncate text-xs text-gray-400">{user.email}</div>
            </div>
            <div
              className={`text-sm font-semibold ${statusStyles[user.status]}`}
            >
              {user.status}
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-4">
            <DetailRow label="Phone" value={user.phone} />
            <DetailRow label="Joining Date" value={user.joiningDate} />
            <DetailRow
              label="Total Orders"
              value={user.totalOrders.toString()}
            />
            <DetailRow
              label="Account"
              value={user.active ? 'Active' : 'Disabled'}
            />
            <div className="col-span-2">
              <dt className="text-xs uppercase tracking-wide text-gray-400">
                Address
              </dt>
              <dd className="mt-1 text-sm font-medium text-white">
                {user.address}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </Modal>
  )
}

type DetailRowProps = {
  label: string
  value: string
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-white">{value}</dd>
    </div>
  )
}
