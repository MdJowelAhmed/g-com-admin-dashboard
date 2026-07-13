import { Switch, Table } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { Check, Eye, X } from 'lucide-react'
import type { User, UserStatus } from './userData'

const statusStyles: Record<UserStatus, string> = {
  Active: 'text-emerald-400',
  Inactive: 'text-red-400',
}

type Props = {
  data: User[]
  loading?: boolean
  pagination?: TablePaginationConfig
  onView: (user: User) => void
  onToggleActive: (key: string, next: boolean) => void
}

export default function UsersTable({
  data,
  loading = false,
  pagination,
  onView,
  onToggleActive,
}: Props) {
  const columns: ColumnsType<User> = [
    { title: 'SL', dataIndex: 'sl', key: 'sl', width: 72 },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => (
        <span className="text-gray-300">{email}</span>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    { title: 'Joining Date', dataIndex: 'joiningDate', key: 'joiningDate' },
    {
      title: 'Verified',
      dataIndex: 'isVerified',
      key: 'isVerified',
      width: 100,
      render: (isVerified: boolean) => (
        <span
          className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
            isVerified
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'bg-red-500/15 text-red-400'
          }`}
          title={isVerified ? 'Verified' : 'Not verified'}
        >
          {isVerified ? <Check size={16} /> : <X size={16} />}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: UserStatus) => (
        <span className={`text-sm font-semibold ${statusStyles[status]}`}>
          {status}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`View ${record.name}`}
            onClick={() => onView(record)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-sky-400 transition-colors hover:bg-sky-500/10 hover:text-sky-300"
          >
            <Eye size={16} />
          </button>

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
    <Table<User>
      columns={columns}
      dataSource={data}
      loading={loading}
      className="dashboard-table"
      pagination={pagination}
    />
  )
}
