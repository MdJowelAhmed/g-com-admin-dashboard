import { Modal } from 'antd'
import { CalendarDays } from 'lucide-react'
import { revenueOf, type EventRecord, type EventStatus } from './eventData'

const statusStyles: Record<EventStatus, string> = {
  Running: 'text-emerald-400',
  Upcoming: 'text-sky-400',
  Completed: 'text-gray-300',
  Cancelled: 'text-red-400',
}

type Props = {
  event: EventRecord | null
  open: boolean
  onClose: () => void
}

export default function EventDetailsModal({ event, open, onClose }: Props) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Event Details"
      centered
      destroyOnClose
      width={640}
    >
      {event && (
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand/20 text-brand-hover">
              <CalendarDays size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-lg font-semibold text-white">
                {event.name}
              </div>
              <div className="truncate text-xs text-gray-400">
                {event.organizer} · {event.size}
              </div>
            </div>
            <div className={`text-sm font-semibold ${statusStyles[event.status]}`}>
              {event.status}
            </div>
          </div>

          <p className="text-sm text-gray-200">{event.about}</p>

          <dl className="grid grid-cols-2 gap-4">
            <DetailRow label="Location" value={event.location} />
            <DetailRow
              label="Start"
              value={`${event.startDate} · ${event.startTime}`}
            />
            <DetailRow
              label="Capacity"
              value={event.capacity.toLocaleString()}
            />
            <DetailRow
              label="Seats Sold"
              value={`${event.seatSales.toLocaleString()} / ${event.capacity.toLocaleString()}`}
            />
            <DetailRow
              label="Ticket Price"
              value={`GH₵${event.ticketPrice.toFixed(2)}`}
            />
            <DetailRow
              label="Revenue"
              value={`GH₵${revenueOf(event).toLocaleString('en-US', { maximumFractionDigits: 2 })}`}
            />
            <DetailRow label="Check-ins" value={event.checkIns.toLocaleString()} />
            <DetailRow
              label="Account"
              value={event.active ? 'Active' : 'Disabled'}
            />
            {event.websiteLink && (
              <div className="col-span-2">
                <dt className="text-xs uppercase tracking-wide text-gray-400">
                  Website
                </dt>
                <dd className="mt-1 truncate text-sm font-medium text-sky-400">
                  {event.websiteLink}
                </dd>
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
