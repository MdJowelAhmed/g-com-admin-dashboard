import { Table } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { Eye } from 'lucide-react'
import {
  formatPayoutStatus,
  type PayoutListItem,
} from '../../redux/api/earningPayoutApi'

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-500 text-white',
  processing: 'bg-sky-500 text-white',
  completed: 'bg-emerald-500 text-white',
  failed: 'bg-red-500 text-white',
  cancelled: 'bg-gray-600 text-white',
}

type Props = {
  data: PayoutListItem[]
  loading?: boolean
  pagination?: TablePaginationConfig
  onView: (payout: PayoutListItem) => void
}

export default function PayoutsTable({
  data,
  loading = false,
  pagination,
  onView,
}: Props) {
  const columns: ColumnsType<PayoutListItem> = [
    { title: 'SL', dataIndex: 'sl', key: 'sl', width: 72 },
    {
      title: 'Reference',
      dataIndex: 'clientReference',
      key: 'clientReference',
      render: (value: string) => (
        <span className="font-medium text-white">{value}</span>
      ),
    },
    { title: 'Business', dataIndex: 'businessName', key: 'businessName' },
    { title: 'Method', dataIndex: 'method', key: 'method' },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (value: number) => `GH₵${value.toLocaleString()}`,
    },
    {
      title: 'Recipient',
      dataIndex: 'recipientName',
      key: 'recipientName',
      render: (value: string | null) => value ?? '—',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status] ?? 'bg-gray-600 text-white'}`}
        >
          {formatPayoutStatus(status)}
        </span>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 90,
      render: (_, record) => (
        <button
          type="button"
          aria-label={`View ${record.clientReference}`}
          onClick={() => onView(record)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-sky-400 transition-colors hover:bg-sky-500/10 hover:text-sky-300"
        >
          <Eye size={16} />
        </button>
      ),
    },
  ]

  return (
    <Table<PayoutListItem>
      columns={columns}
      dataSource={data}
      loading={loading}
      className="dashboard-table"
      pagination={pagination}
    />
  )
}
