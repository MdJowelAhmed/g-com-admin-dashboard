import type { ReactNode } from 'react'
import { Table } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { Eye, Scale } from 'lucide-react'
import {
  formatOrderType,
  formatStatusLabel,
  type ApiOrderStatus,
  type OrderListItem,
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

const paymentStatusStyles: Record<string, string> = {
  pending: 'text-amber-400',
  paid: 'text-emerald-400',
  failed: 'text-red-400',
  refunded: 'text-gray-400',
}

type Props = {
  data: OrderListItem[]
  loading?: boolean
  pagination?: TablePaginationConfig
  onView: (order: OrderListItem) => void
  onResolveDispute: (order: OrderListItem) => void
}

export default function OrdersTable({
  data,
  loading = false,
  pagination,
  onView,
  onResolveDispute,
}: Props) {
  const columns: ColumnsType<OrderListItem> = [
    { title: 'SL', dataIndex: 'sl', key: 'sl', width: 72 },
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (v: string) => <span className="font-medium text-white">{v}</span>,
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Business',
      dataIndex: 'businessName',
      key: 'businessName',
    },
    {
      title: 'Branch',
      dataIndex: 'branchName',
      key: 'branchName',
      render: (v: string | null) => v ?? '—',
    },
    {
      title: 'Type',
      dataIndex: 'orderType',
      key: 'orderType',
      render: (type: string) => formatOrderType(type),
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (v: number) => `₵${v.toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: ApiOrderStatus) => (
        <span className={`text-sm font-semibold ${statusStyles[status] ?? 'text-gray-300'}`}>
          {formatStatusLabel(status)}
        </span>
      ),
    },
    {
      title: 'Payment',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status: string) => (
        <span
          className={`text-sm font-semibold ${paymentStatusStyles[status] ?? 'text-gray-300'}`}
        >
          {formatStatusLabel(status)}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <IconAction
            label={`View ${record.orderId}`}
            onClick={() => onView(record)}
            className="text-sky-400 hover:bg-sky-500/10 hover:text-sky-300"
          >
            <Eye size={16} />
          </IconAction>
          {record.status === 'dispute' && (
            <IconAction
              label={`Resolve dispute for ${record.orderId}`}
              onClick={() => onResolveDispute(record)}
              className="text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
            >
              <Scale size={16} />
            </IconAction>
          )}
        </div>
      ),
    },
  ]

  return (
    <Table<OrderListItem>
      columns={columns}
      dataSource={data}
      loading={loading}
      className="dashboard-table"
      rowKey="key"
      pagination={pagination}
    />
  )
}

type IconActionProps = {
  label: string
  onClick: () => void
  className: string
  children: ReactNode
}

function IconAction({ label, onClick, className, children }: IconActionProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${className}`}
    >
      {children}
    </button>
  )
}
