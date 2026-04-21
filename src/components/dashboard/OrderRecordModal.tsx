import { Modal } from 'antd'
import { Package } from 'lucide-react'
import type { OrderRecord, OrderStatus } from './orderData'

const statusStyles: Record<OrderStatus, string> = {
  Paid: 'text-sky-400',
  Delivered: 'text-emerald-400',
  Pending: 'text-amber-400',
  Completed: 'text-emerald-400',
  Cancelled: 'text-red-400',
}

type Props = {
  order: OrderRecord | null
  open: boolean
  onClose: () => void
}

export default function OrderRecordModal({ order, open, onClose }: Props) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Order Details"
      centered
      destroyOnClose
      width={600}
    >
      {order && (
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand/20 text-brand-hover">
              <Package size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-semibold text-white">
                {order.orderId}
              </div>
              <div className="text-xs text-gray-400">{order.placedAt}</div>
            </div>
            <div className={`text-sm font-semibold ${statusStyles[order.status]}`}>
              {order.status}
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-4">
            <DetailRow label="Customer" value={order.customerName} />
            <DetailRow label="Vendor" value={order.vendor} />
            <DetailRow
              label="Amount"
              value={`$${order.amount.toFixed(2)}`}
            />
            <DetailRow label="Items" value={`${order.items} item${order.items === 1 ? '' : 's'}`} />
            <DetailRow label="Payment" value={order.paymentMethod} />
            <DetailRow label="Placed" value={order.time} />
            <div className="col-span-2">
              <dt className="text-xs uppercase tracking-wide text-gray-400">
                Shipping Address
              </dt>
              <dd className="mt-1 text-sm font-medium text-white">
                {order.shippingAddress}
              </dd>
            </div>
            {order.notes && (
              <div className="col-span-2">
                <dt className="text-xs uppercase tracking-wide text-gray-400">
                  Notes
                </dt>
                <dd className="mt-1 text-sm text-gray-200">{order.notes}</dd>
              </div>
            )}
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
