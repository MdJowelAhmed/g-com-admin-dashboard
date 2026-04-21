import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { OrderRecord, OrderStatus } from './orderData'

const statusStyles: Record<OrderStatus, string> = {
  Paid: 'text-sky-400',
  Delivered: 'text-emerald-400',
  Pending: 'text-amber-400',
  Completed: 'text-emerald-400',
  Cancelled: 'text-red-400',
}

const columns: ColumnsType<OrderRecord> = [
  { title: 'SL', dataIndex: 'sl', key: 'sl', width: 72 },
  {
    title: 'Order ID',
    dataIndex: 'orderId',
    key: 'orderId',
    render: (v: string) => <span className="font-medium text-white">{v}</span>,
  },
  {
    title: 'Name',
    dataIndex: 'customerName',
    key: 'customerName',
  },
  { title: 'Vendor', dataIndex: 'vendor', key: 'vendor' },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    render: (v: number) => `$${v.toFixed(2)}`,
  },
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
    render: (v: string) => <span className="text-gray-300">{v}</span>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: OrderStatus) => (
      <span className={`text-sm font-semibold ${statusStyles[status]}`}>
        {status}
      </span>
    ),
  },
]

type Props = {
  data: OrderRecord[]
  pageSize?: number
  onRowClick: (order: OrderRecord) => void
}

export default function OrdersTable({ data, pageSize = 8, onRowClick }: Props) {
  return (
    <Table<OrderRecord>
      columns={columns}
      dataSource={data}
      className="dashboard-table"
      pagination={{
        pageSize,
        showSizeChanger: false,
        hideOnSinglePage: false,
      }}
      onRow={(record) => ({
        onClick: () => onRowClick(record),
        className: 'cursor-pointer',
      })}
    />
  )
}
