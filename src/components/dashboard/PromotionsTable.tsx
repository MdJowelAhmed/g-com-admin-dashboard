import { Popconfirm, Switch, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { CheckCircle2, Pencil, Trash2 } from 'lucide-react'

export type PromotionStatus = 'Completed' | 'Pending' | 'In Progress'

export type Promotion = {
  key: string
  sl: string
  image: string
  title: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  type: string
  amount: number
  status: PromotionStatus
  published: boolean
}

const statusStyles: Record<PromotionStatus, string> = {
  Completed: 'bg-emerald-500 text-white',
  Pending: 'bg-amber-500 text-white',
  'In Progress': 'bg-sky-500 text-white',
}

const baseColumns: ColumnsType<Promotion> = [
  { title: 'SL', dataIndex: 'sl', key: 'sl', width: 80 },
  {
    title: 'Items',
    dataIndex: 'image',
    key: 'image',
    width: 120,
    render: (src: string, record) => (
      <img
        src={src}
        alt={record.title}
        className="h-14 w-14 rounded-lg object-cover"
      />
    ),
  },
  { title: 'Title', dataIndex: 'title', key: 'title' },
  {
    title: 'Start Date & Time',
    key: 'start',
    render: (_, record) => (
      <div>
        <div className="text-white">{record.startDate}</div>
        <div className="mt-1 inline-flex rounded-md bg-surface-elevated px-2 py-0.5 text-xs text-gray-300">
          {record.startTime}
        </div>
      </div>
    ),
  },
  {
    title: 'End Date & Time',
    key: 'end',
    render: (_, record) => (
      <div>
        <div className="text-white">{record.endDate}</div>
        <div className="mt-1 inline-flex rounded-md bg-surface-elevated px-2 py-0.5 text-xs text-gray-300">
          {record.endTime}
        </div>
      </div>
    ),
  },
  { title: 'Promotion Type', dataIndex: 'type', key: 'type' },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    render: (amount: number) => `$${amount}`,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: PromotionStatus) => (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
      >
        <CheckCircle2 size={14} />
        {status}
      </span>
    ),
  },
]

type Props = {
  data: Promotion[]
  onEdit: (key: string) => void
  onDelete: (key: string) => void
  onTogglePublish: (key: string, next: boolean) => void
}

export default function PromotionsTable({
  data,
  onEdit,
  onDelete,
  onTogglePublish,
}: Props) {
  const columns: ColumnsType<Promotion> = [
    ...baseColumns,
    {
      title: 'Action',
      key: 'action',
      width: 220,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={`Edit ${record.title}`}
            onClick={() => onEdit(record.key)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-border text-amber-400 transition-colors hover:border-amber-500 hover:bg-amber-500/10 hover:text-amber-300"
          >
            <Pencil size={16} />
          </button>
          <Switch
            checked={record.published}
            onChange={(checked) => onTogglePublish(record.key, checked)}
            checkedChildren="Published"
            unCheckedChildren="Hide"
          />
          <Popconfirm
            title="Delete promotion"
            description="Are you sure to delete this?"
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(record.key)}
          >
            <button
              type="button"
              aria-label={`Delete ${record.title}`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-border text-red-400 transition-colors hover:border-red-500 hover:bg-red-500/10 hover:text-red-300"
            >
              <Trash2 size={16} />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <Table<Promotion>
      columns={columns}
      dataSource={data}
      pagination={false}
      className="dashboard-table"
    />
  )
}
