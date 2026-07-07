import {  Switch, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Eye,  } from 'lucide-react'
import type { User, UserStatus } from './userData'

const statusStyles: Record<UserStatus, string> = {
  Pending: 'text-amber-400',
  Verified: 'text-emerald-400',
  Reviewed: 'text-sky-400',
  Suspended: 'text-red-400',
}

type Props = {
  data: User[]
  pageSize?: number
  onEdit: (user: User) => void
  onView: (user: User) => void
  onDelete: (key: string) => void
  onToggleActive: (key: string, next: boolean) => void
}

export default function UsersTable({
  data,
  pageSize = 8,
  // onEdit,
  onView,
  // onDelete,
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
      title: 'Total Orders',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      render: (v: number) => v.toLocaleString(),
    },
    { title: 'Joining Date', dataIndex: 'joiningDate', key: 'joiningDate' },
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
      width: 200,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          {/* <IconAction
            label={`Edit ${record.name}`}
            onClick={() => onEdit(record)}
            className="text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
          >
            <Pencil size={16} />
          </IconAction> */}

          <IconAction
            label={`View ${record.name}`}
            onClick={() => onView(record)}
            className="text-sky-400 hover:bg-sky-500/10 hover:text-sky-300"
          >
            <Eye size={16} />
          </IconAction>

          {/* <Popconfirm
            title="Delete user"
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
          </Popconfirm> */}

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

function IconAction({ label, onClick, className = '', children }: IconActionProps) {
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
