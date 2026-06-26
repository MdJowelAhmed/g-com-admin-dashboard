import { Modal } from 'antd'
import { CheckCircle2 } from 'lucide-react'
import type { Order, OrderStatus } from './RecentOrdersTable'

const statusStyles: Record<OrderStatus, string> = {
  Paid: 'bg-blue-500 text-white',
  Delivered: 'bg-emerald-600 text-white',
  Completed: 'bg-emerald-500 text-white',
  Pending: 'bg-amber-500 text-white',
  Cancelled: 'bg-red-500 text-white',
}

type Props = {
  order: Order | null
  open: boolean
  onClose: () => void
}

export default function OrderDetailsModal({ order, open, onClose }: Props) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Order Details"
      centered
      destroyOnClose
    >
      {order && (
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <img
              src={order.image}
              alt={order.title}
              className="h-20 w-20 rounded-xl object-cover"
            />
            <div>
              <div className="text-lg font-semibold text-white">
                {order.title}
              </div>
              <div className="text-sm text-gray-400">{order.orderNumber}</div>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-4">
            <DetailRow label="SL" value={order.sl} />
            <DetailRow label="Customer" value={order.customer} />
            <DetailRow label="Date" value={order.date} />
            <DetailRow label="Time" value={order.time} />
            <DetailRow label="Item Number" value={`${order.items} Items`} />
            <DetailRow label="Amount" value={`$${order.amount}`} />
          </dl>

          <div>
            <div className="text-xs uppercase tracking-wide text-gray-400">
              Status
            </div>
            <span
              className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusStyles[order.status]}`}
            >
              <CheckCircle2 size={14} />
              {order.status}
            </span>
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
