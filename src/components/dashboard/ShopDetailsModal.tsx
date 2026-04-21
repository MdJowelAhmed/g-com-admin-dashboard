import { Modal } from 'antd'
import { Store } from 'lucide-react'
import type { Shop, ShopStatus } from './shopData'

const statusStyles: Record<ShopStatus, string> = {
  Pending: 'text-amber-400',
  Verified: 'text-emerald-400',
  'In Review': 'text-sky-400',
  Suspended: 'text-red-400',
}

type Props = {
  shop: Shop | null
  open: boolean
  onClose: () => void
}

export default function ShopDetailsModal({ shop, open, onClose }: Props) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Shop Details"
      centered
      destroyOnClose
      width={640}
    >
      {shop && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand/20 text-brand-hover">
              <Store size={24} />
            </div>
            <div>
              <div className="text-lg font-semibold text-white">
                {shop.name}
              </div>
              <div className="text-xs text-gray-400">{shop.shopId}</div>
            </div>
            <div className={`ml-auto text-sm font-semibold ${statusStyles[shop.status]}`}>
              {shop.status}
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-4">
            <DetailRow label="Type" value={shop.type} />
            <DetailRow label="Category" value={shop.category} />
            <DetailRow label="Joining Date" value={shop.joiningDate} />
            <DetailRow label="Owner" value={shop.owner} />
            <DetailRow label="Email" value={shop.email} />
            <DetailRow label="Phone" value={shop.phone} />
            <DetailRow label="Address" value={shop.address} />
          </dl>

          <div>
            <div className="text-xs uppercase tracking-wide text-gray-400">
              Description
            </div>
            <p className="mt-1 text-sm text-gray-200">{shop.description}</p>
          </div>
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
