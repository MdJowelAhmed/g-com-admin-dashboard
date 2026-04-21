import { Popconfirm, Switch, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { revenueOf, type EventRecord, type EventStatus } from './eventData'

const statusStyles: Record<EventStatus, string> = {
  Running: 'text-emerald-400',
  Upcoming: 'text-sky-400',
  Completed: 'text-gray-300',
  Cancelled: 'text-red-400',
}

type Props = {
  data: EventRecord[]
  pageSize?: number
  onEdit: (event: EventRecord) => void
  onView: (event: EventRecord) => void
  onDelete: (key: string) => void
  onToggleActive: (key: string, next: boolean) => void
}

export default function EventsTable({
  data,
  pageSize = 8,
  onEdit,
  onView,
  onDelete,
  onToggleActive,
}: Props) {
  const columns: ColumnsType<EventRecord> = [
    { title: 'SL', dataIndex: 'sl', key: 'sl', width: 72 },
    {
      title: 'Event Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record) => (
        <div>
          <div className="font-medium text-white">{name}</div>
          <div className="text-xs text-gray-400">{record.size}</div>
        </div>
      ),
    },
    {
      title: 'Total Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
      render: (v: number) => v.toLocaleString(),
    },
    {
      title: 'Seat Sales',
      key: 'seatSales',
      render: (_, record) => {
        const pct =
          record.capacity > 0
            ? Math.min(100, Math.round((record.seatSales / record.capacity) * 100))
            : 0
        return (
          <div className="min-w-[120px]">
            <div className="text-white">
              {record.seatSales.toLocaleString()}
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-elevated">
              <div
                className="h-full bg-brand transition-[width]"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-0.5 text-[10px] text-gray-400">{pct}% sold</div>
          </div>
        )
      },
    },
    {
      title: 'Total Revenue',
      key: 'revenue',
      render: (_, record) =>
        `$${revenueOf(record).toLocaleString('en-US', {
          maximumFractionDigits: 0,
        })}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: EventStatus) => (
        <span className={`text-sm font-semibold ${statusStyles[status]}`}>
          {status}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <IconAction
            label={`Edit ${record.name}`}
            onClick={() => onEdit(record)}
            className="text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
          >
            <Pencil size={16} />
          </IconAction>

          <IconAction
            label={`View ${record.name}`}
            onClick={() => onView(record)}
            className="text-sky-400 hover:bg-sky-500/10 hover:text-sky-300"
          >
            <Eye size={16} />
          </IconAction>

          <Popconfirm
            title="Delete event"
            description={`Permanently remove ${record.name}?`}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(record.key)}
          >
            <button
              type="button"
              aria-label={`Delete ${record.name}`}
              className="flex h-8 w-8 items-center justify-center rounded-md text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
            >
              <Trash2 size={16} />
            </button>
          </Popconfirm>

          <Switch
            size="small"
            checked={record.active}
            onChange={(checked) => onToggleActive(record.key, checked)}
          />
        </div>
      ),
    },
  ]

  return (
    <Table<EventRecord>
      columns={columns}
      dataSource={data}
      className="dashboard-table"
      pagination={{
        pageSize,
        showSizeChanger: false,
        hideOnSinglePage: false,
      }}
    />
  )
}

type IconActionProps = {
  label: string
  onClick: () => void
  className?: string
  children: React.ReactNode
}

function IconAction({
  label,
  onClick,
  className = '',
  children,
}: IconActionProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${className}`}
    >
      {children}
    </button>
  )
}
