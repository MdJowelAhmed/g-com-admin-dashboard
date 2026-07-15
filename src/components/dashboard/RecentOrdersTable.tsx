import { useMemo, useState } from 'react'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { CheckCircle2, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import OrderRecordModal from './OrderRecordModal'
import {
  formatOverviewStatus,
  mapRecentOrderFromApi,
  type RecentOrderRow,
  useRecentOrdersQuery,
} from '../../redux/api/overviewApi'

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-500 text-white',
  processing: 'bg-sky-500 text-white',
  confirmed: 'bg-sky-500 text-white',
  in_progress: 'bg-sky-500 text-white',
  paid: 'bg-blue-500 text-white',
  delivered: 'bg-emerald-600 text-white',
  completed: 'bg-emerald-500 text-white',
  cancelled: 'bg-red-500 text-white',
  disputed: 'bg-orange-500 text-white',
}

const paymentStatusStyles: Record<string, string> = {
  pending: 'text-amber-400',
  paid: 'text-emerald-400',
  failed: 'text-red-400',
  refunded: 'text-gray-400',
}

export default function RecentOrdersTable() {
  const navigate = useNavigate()
  const [viewingId, setViewingId] = useState<string | null>(null)
  const { data, isLoading } = useRecentOrdersQuery()

  const recentOrders = useMemo(
    () => (data?.data ?? []).map((doc, index) => mapRecentOrderFromApi(doc, index)),
    [data],
  )

  const columns: ColumnsType<RecentOrderRow> = [
    { title: 'SL', dataIndex: 'sl', key: 'sl', width: 72 },
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (orderId: string, record) => (
        <div>
          <div className="font-medium text-white">{orderId}</div>
          <div className="text-xs text-gray-400">{record.businessName}</div>
        </div>
      ),
    },
    { title: 'Customer', dataIndex: 'customerName', key: 'customerName' },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `GH₵${amount.toLocaleString()}`,
    },
    {
      title: 'Payment',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status: string) => (
        <span
          className={`text-sm font-semibold ${paymentStatusStyles[status] ?? 'text-gray-300'}`}
        >
          {formatOverviewStatus(status)}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status] ?? 'bg-gray-600 text-white'}`}
        >
          <CheckCircle2 size={14} />
          {formatOverviewStatus(status)}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 90,
      render: (_, record) => (
        <button
          type="button"
          aria-label={`View details for ${record.orderId}`}
          onClick={() => setViewingId(record.key)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-border text-gray-300 transition-colors hover:border-brand hover:text-white"
        >
          <Eye size={16} />
        </button>
      ),
    },
  ]

  return (
    <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Recent Order</h2>
        <button
          type="button"
          onClick={() => navigate('/dashboard/orders')}
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
        >
          View All
        </button>
      </div>

      <div className="mt-5">
        <Table<RecentOrderRow>
          columns={columns}
          dataSource={recentOrders}
          loading={isLoading}
          pagination={false}
          className="dashboard-table"
        />
      </div>

      <OrderRecordModal
        orderId={viewingId}
        open={viewingId !== null}
        onClose={() => setViewingId(null)}
      />
    </section>
  )
}
