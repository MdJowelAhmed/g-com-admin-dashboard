import { useState } from 'react'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { CheckCircle2, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import OrderDetailsModal from './OrderDetailsModal'

export type OrderStatus = 'Completed' | 'Pending' | 'Cancelled'

export type Order = {
  key: string
  sl: string
  image: string
  title: string
  orderNumber: string
  date: string
  time: string
  customer: string
  items: number
  amount: number
  status: OrderStatus
}

const RECENT_LIMIT = 5

const sampleOrders: Order[] = [
  {
    key: '1',
    sl: '01',
    image:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=120&h=120&fit=crop',
    title: 'Americano',
    orderNumber: '#0245847',
    date: '27 Oct 2025',
    time: '13:00 pm',
    customer: 'Rakib Hossain',
    items: 2,
    amount: 65,
    status: 'Completed',
  },
  {
    key: '2',
    sl: '02',
    image:
      'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=120&h=120&fit=crop',
    title: 'Espresso',
    orderNumber: '#0245848',
    date: '27 Oct 2025',
    time: '13:24 pm',
    customer: 'Nadir Ahmed',
    items: 1,
    amount: 32,
    status: 'Pending',
  },
  {
    key: '3',
    sl: '03',
    image:
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=120&h=120&fit=crop',
    title: 'Cappuccino',
    orderNumber: '#0245849',
    date: '27 Oct 2025',
    time: '14:02 pm',
    customer: 'Sabbir Khan',
    items: 3,
    amount: 98,
    status: 'Completed',
  },
  {
    key: '4',
    sl: '04',
    image:
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=120&h=120&fit=crop',
    title: 'Latte',
    orderNumber: '#0245850',
    date: '27 Oct 2025',
    time: '14:30 pm',
    customer: 'Tania Rahman',
    items: 2,
    amount: 54,
    status: 'Cancelled',
  },
  {
    key: '5',
    sl: '05',
    image:
      'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=120&h=120&fit=crop',
    title: 'Mocha',
    orderNumber: '#0245851',
    date: '27 Oct 2025',
    time: '15:10 pm',
    customer: 'Hasib Ali',
    items: 1,
    amount: 42,
    status: 'Pending',
  },
  {
    key: '6',
    sl: '06',
    image:
      'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=120&h=120&fit=crop',
    title: 'Flat White',
    orderNumber: '#0245852',
    date: '27 Oct 2025',
    time: '15:42 pm',
    customer: 'Mousumi Akter',
    items: 2,
    amount: 58,
    status: 'Completed',
  },
  {
    key: '7',
    sl: '07',
    image:
      'https://images.unsplash.com/photo-1528697203043-733bfdc1f7f6?w=120&h=120&fit=crop',
    title: 'Cold Brew',
    orderNumber: '#0245853',
    date: '27 Oct 2025',
    time: '16:05 pm',
    customer: 'Imran Chowdhury',
    items: 4,
    amount: 120,
    status: 'Completed',
  },
]

const statusStyles: Record<OrderStatus, string> = {
  Completed: 'bg-emerald-500 text-white',
  Pending: 'bg-amber-500 text-white',
  Cancelled: 'bg-red-500 text-white',
}

const baseColumns: ColumnsType<Order> = [
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
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    render: (title: string, record) => (
      <div>
        <div className="font-medium text-white">{title}</div>
        <div className="text-xs text-gray-400">{record.orderNumber}</div>
      </div>
    ),
  },
  {
    title: 'Date & Time',
    key: 'datetime',
    render: (_, record) => (
      <div>
        <div className="text-white">{record.date}</div>
        <div className="mt-1 inline-flex rounded-md bg-surface-elevated px-2 py-0.5 text-xs text-gray-300">
          {record.time}
        </div>
      </div>
    ),
  },
  { title: 'Customer', dataIndex: 'customer', key: 'customer' },
  {
    title: 'Item Number',
    dataIndex: 'items',
    key: 'items',
    render: (items: number) => `${items} Items`,
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    render: (amount: number) => `$${amount}`,
  },
  {
    title: 'status',
    dataIndex: 'status',
    key: 'status',
    render: (status: OrderStatus) => (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
      >
        <CheckCircle2 size={14} />
        {status}
      </span>
    ),
  },
]

export default function RecentOrdersTable() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<Order | null>(null)
  const recentOrders = sampleOrders.slice(0, RECENT_LIMIT)

  const columns: ColumnsType<Order> = [
    ...baseColumns,
    {
      title: 'Action',
      key: 'action',
      width: 90,
      render: (_, record) => (
        <button
          type="button"
          aria-label={`View details for ${record.title}`}
          onClick={() => setSelected(record)}
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
        <Table<Order>
          columns={columns}
          dataSource={recentOrders}
          pagination={false}
          className="dashboard-table"
        />
      </div>

      <OrderDetailsModal
        order={selected}
        open={selected !== null}
        onClose={() => setSelected(null)}
      />
    </section>
  )
}
