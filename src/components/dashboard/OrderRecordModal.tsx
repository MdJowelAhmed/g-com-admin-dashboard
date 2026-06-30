import { Modal, Spin } from 'antd'
import { Package } from 'lucide-react'
import {
  formatOrderType,
  formatStatusLabel,
  type CustomLineItem,
  type OrderDetailDoc,
  type ProductLineItem,
  type ServiceLineItem,
  type StayLineItem,
  useGetSingleOrderQuery,
} from '../../redux/api/orderManageApi'

const statusStyles: Record<string, string> = {
  pending: 'text-amber-400',
  processing: 'text-sky-400',
  confirmed: 'text-sky-400',
  delivered: 'text-emerald-400',
  completed: 'text-emerald-400',
  cancelled: 'text-red-400',
  dispute: 'text-orange-400',
}

type Props = {
  orderId: string | null
  open: boolean
  onClose: () => void
}

export default function OrderRecordModal({ orderId, open, onClose }: Props) {
  const { data, isLoading, isError } = useGetSingleOrderQuery(orderId ?? '', {
    skip: !open || !orderId,
  })

  const order = data?.data

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Order Details"
      centered
      destroyOnClose
      width={720}
    >
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spin size="large" />
        </div>
      ) : isError ? (
        <p className="py-10 text-center text-sm text-red-400">
          Failed to load order details. Please try again.
        </p>
      ) : order ? (
        <OrderDetailsContent order={order} />
      ) : null}
    </Modal>
  )
}

function OrderDetailsContent({ order }: { order: OrderDetailDoc }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {order.business.businessLogo ? (
          <img
            src={order.business.businessLogo}
            alt=""
            className="h-14 w-14 rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand/20 text-brand-hover">
            <Package size={24} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="text-lg font-semibold text-white">{order.orderId}</div>
          <div className="text-xs text-gray-400">
            {formatOrderType(order.orderType)} · {formatDate(order.createdAt)}
          </div>
        </div>
        <div className={`text-sm font-semibold ${statusStyles[order.status] ?? 'text-gray-300'}`}>
          {formatStatusLabel(order.status)}
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-4">
        <DetailRow label="Customer" value={order.customer.name} />
        <DetailRow label="Email" value={order.customer.email || '—'} />
        <DetailRow label="Phone" value={order.customer.phone || '—'} />
        <DetailRow label="Business" value={order.business.businessName} />
        <DetailRow label="Branch" value={order.branch?.branchName ?? '—'} />
        <DetailRow label="Order Type" value={formatOrderType(order.orderType)} />
        <DetailRow label="Payment Status" value={formatStatusLabel(order.paymentStatus)} />
        <DetailRow label="Payment Method" value={order.paymentMethod ?? '—'} />
        <DetailRow label="Payment Type" value={order.paymentType ?? '—'} />
        <DetailRow label="Client Reference" value={order.clientReference ?? '—'} />
        <DetailRow label="Subtotal" value={formatMoney(order.subTotal)} />
        <DetailRow label="Customer Fee" value={formatMoney(order.customerFee)} />
        <DetailRow label="Provider Fee" value={formatMoney(order.providerFee)} />
        <DetailRow label="Delivery Fee" value={formatMoney(order.deliveryFee)} />
        <DetailRow label="Provider Amount" value={formatMoney(order.providerAmount)} />
        <DetailRow label="Total Amount" value={formatMoney(order.totalAmount)} />
      </dl>

      {order.fulfillment && (
        <section className="rounded-xl border border-surface-border p-4">
          <h3 className="text-sm font-semibold text-white">Fulfillment</h3>
          <dl className="mt-3 grid grid-cols-2 gap-3">
            <DetailRow label="Method" value={order.fulfillment.method ?? '—'} />
            {order.fulfillment.pickupLocation && (
              <>
                <DetailRow
                  label="Pickup Location"
                  value={order.fulfillment.pickupLocation.name}
                />
                <DetailRow
                  label="Coordinates"
                  value={`${order.fulfillment.pickupLocation.latitude}, ${order.fulfillment.pickupLocation.longitude}`}
                />
              </>
            )}
          </dl>
        </section>
      )}

      <section className="rounded-xl border border-surface-border p-4">
        <h3 className="text-sm font-semibold text-white">Line Items</h3>
        <div className="mt-3">
          <LineItemsByType order={order} />
        </div>
      </section>
    </div>
  )
}

function LineItemsByType({ order }: { order: OrderDetailDoc }) {
  switch (order.orderType) {
    case 'product':
      return <ProductLineItems items={order.lineItems as ProductLineItem[]} />
    case 'service':
      return <ServiceLineItemView item={order.lineItems as ServiceLineItem} />
    case 'stay':
      return <StayLineItemView item={order.lineItems as StayLineItem} />
    case 'custom':
      return <CustomLineItems items={order.lineItems as CustomLineItem[]} />
    default:
      return <p className="text-sm text-gray-400">No line items available.</p>
  }
}

function ProductLineItems({ items }: { items: ProductLineItem[] }) {
  if (!Array.isArray(items) || items.length === 0) {
    return <p className="text-sm text-gray-400">No products found.</p>
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item._id}
          className="flex items-center gap-3 rounded-lg bg-surface-elevated p-3"
        >
          {item.product?.image && (
            <img
              src={item.product.image}
              alt=""
              className="h-12 w-12 rounded-lg object-cover"
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="font-medium text-white">
              {item.product?.name ?? item.items?.[0]?.name ?? 'Product'}
            </div>
            <div className="text-xs text-gray-400">
              Qty: {item.quantity} · {formatMoney(item.product?.price)} each
            </div>
          </div>
          <div className="text-sm font-semibold text-white">
            {formatMoney(item.totalAmount)}
          </div>
        </div>
      ))}
    </div>
  )
}

function ServiceLineItemView({ item }: { item: ServiceLineItem }) {
  if (!item || typeof item !== 'object') {
    return <p className="text-sm text-gray-400">No service details found.</p>
  }

  return (
    <div className="flex items-center gap-3 rounded-lg bg-surface-elevated p-3">
      {item.service?.image && (
        <img
          src={item.service.image}
          alt=""
          className="h-12 w-12 rounded-lg object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="font-medium text-white">{item.service?.name ?? 'Service'}</div>
        <div className="mt-1 space-y-0.5 text-xs text-gray-400">
          {item.duration && <div>Duration: {item.duration} hrs</div>}
          {item.startTime && <div>Start: {formatDateTime(item.startTime)}</div>}
          {item.location && <div>Location: {item.location || '—'}</div>}
          {item.status && <div>Status: {formatStatusLabel(item.status)}</div>}
        </div>
      </div>
      <div className="text-sm font-semibold text-white">
        {formatMoney(item.totalAmount)}
      </div>
    </div>
  )
}

function StayLineItemView({ item }: { item: StayLineItem }) {
  if (!item || typeof item !== 'object') {
    return <p className="text-sm text-gray-400">No stay details found.</p>
  }

  return (
    <div className="rounded-lg bg-surface-elevated p-3">
      <div className="flex items-start gap-3">
        {item.room?.image && (
          <img
            src={item.room.image}
            alt=""
            className="h-12 w-12 rounded-lg object-cover"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="font-medium text-white">{item.room?.name ?? 'Room'}</div>
          <div className="mt-1 space-y-0.5 text-xs text-gray-400">
            {item.roomNumber && <div>Room No: {item.roomNumber}</div>}
            {item.checkIn && <div>Check-in: {formatDateTime(item.checkIn)}</div>}
            {item.checkOut && <div>Check-out: {formatDateTime(item.checkOut)}</div>}
            <div>
              Guests: {item.adult ?? 0} adult{(item.adult ?? 0) === 1 ? '' : 's'}
              {(item.children ?? 0) > 0
                ? `, ${item.children} child${item.children === 1 ? '' : 'ren'}`
                : ''}
            </div>
            {item.night != null && <div>Nights: {item.night}</div>}
            {item.pricePerNight != null && (
              <div>Price/night: {formatMoney(item.pricePerNight)}</div>
            )}
            {item.status && <div>Status: {formatStatusLabel(item.status)}</div>}
          </div>
        </div>
        <div className="text-sm font-semibold text-white">
          {formatMoney(item.totalAmount)}
        </div>
      </div>
    </div>
  )
}

function CustomLineItems({ items }: { items: CustomLineItem[] }) {
  if (!Array.isArray(items) || items.length === 0) {
    return <p className="text-sm text-gray-400">No custom items found.</p>
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item._id} className="rounded-lg bg-surface-elevated p-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-300">Qty: {item.quantity}</div>
            <div className="text-sm font-semibold text-white">
              {formatMoney(item.totalAmount)}
            </div>
          </div>
          {item.items && item.items.length > 0 && (
            <ul className="mt-2 space-y-1 border-t border-surface-border pt-2">
              {item.items.map((entry, index) => (
                <li
                  key={`${entry.itemId}-${index}`}
                  className="flex items-center justify-between text-xs text-gray-400"
                >
                  <span>
                    {entry.itemType} · Qty {entry.quantity}
                  </span>
                  <span>{formatMoney(entry.price)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}

function formatMoney(value?: number) {
  if (value == null) return '—'
  return `₵${value.toLocaleString()}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
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
