import { Popconfirm, Table, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Ban, Pencil, ShieldCheck, Trash2 } from 'lucide-react'
import {
  PAGE_PERMISSIONS,
  type Controller,
  type PagePermission,
} from './controllerData'

type Props = {
  data: Controller[]
  pageSize?: number
  onEdit: (controller: Controller) => void
  onDelete: (key: string) => void
  onToggleSuspended: (key: string, next: boolean) => void
}

export default function ControllersTable({
  data,
  pageSize = 8,
  onEdit,
  onDelete,
  onToggleSuspended,
}: Props) {
  const columns: ColumnsType<Controller> = [
    { title: 'SL', dataIndex: 'sl', key: 'sl', width: 72 },
    {
      title: 'NAME',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record) => (
        <div className="flex items-center gap-2">
          <span className={record.suspended ? 'text-gray-400' : ''}>{name}</span>
          {record.suspended && (
            <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-300">
              Suspended
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'EMAIL',
      dataIndex: 'email',
      key: 'email',
      render: (v: string) => <span className="text-gray-300">{v}</span>,
    },
    {
      title: 'PAGE ACCESS',
      key: 'pageAccess',
      render: (_, record) => <AccessSummary permissions={record.pageAccess} />,
    },
    {
      title: 'Action',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`Edit ${record.name}`}
            onClick={() => onEdit(record)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-amber-400 transition-colors hover:bg-amber-500/10 hover:text-amber-300"
          >
            <Pencil size={16} />
          </button>

          <Popconfirm
            title={record.suspended ? 'Reactivate controller' : 'Suspend controller'}
            description={
              record.suspended
                ? `Restore access for ${record.name}?`
                : `Suspend ${record.name}? They will lose access immediately.`
            }
            okText={record.suspended ? 'Reactivate' : 'Suspend'}
            cancelText="Cancel"
            okButtonProps={{ danger: !record.suspended }}
            onConfirm={() => onToggleSuspended(record.key, !record.suspended)}
          >
            <button
              type="button"
              aria-label={
                record.suspended
                  ? `Reactivate ${record.name}`
                  : `Suspend ${record.name}`
              }
              className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
                record.suspended
                  ? 'text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300'
                  : 'text-orange-400 hover:bg-orange-500/10 hover:text-orange-300'
              }`}
            >
              {record.suspended ? <ShieldCheck size={16} /> : <Ban size={16} />}
            </button>
          </Popconfirm>

          <Popconfirm
            title="Delete controller"
            description={`Revoke access for ${record.name}?`}
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
        </div>
      ),
    },
  ]

  return (
    <Table<Controller>
      columns={columns}
      dataSource={data}
      className="dashboard-table"
      rowClassName={(record) => (record.suspended ? 'opacity-60' : '')}
      pagination={{
        pageSize,
        showSizeChanger: false,
        hideOnSinglePage: false,
      }}
    />
  )
}

function AccessSummary({ permissions }: { permissions: PagePermission[] }) {
  if (permissions.length === 0) {
    return <span className="text-xs italic text-gray-500">No access</span>
  }

  if (permissions.length === PAGE_PERMISSIONS.length) {
    return (
      <span className="inline-flex rounded-md bg-brand/20 px-2 py-0.5 text-xs font-medium text-brand-hover">
        Full Access
      </span>
    )
  }

  const visible = permissions.slice(0, 2)
  const extra = permissions.length - visible.length

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {visible.map((p) => (
        <span
          key={p}
          className="rounded-md bg-surface-elevated px-2 py-0.5 text-xs text-gray-200"
        >
          {p}
        </span>
      ))}
      {extra > 0 && (
        <Tooltip title={permissions.slice(2).join(', ')}>
          <span className="cursor-help rounded-md bg-brand/20 px-2 py-0.5 text-xs font-medium text-brand-hover">
            +{extra} more
          </span>
        </Tooltip>
      )}
    </div>
  )
}
