import { Popconfirm, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Check, X } from 'lucide-react'
import {
  canReviewShop,
  hasVerificationDocuments,
} from '../../redux/api/shopManagementApi'
import type { Shop, ShopStatus } from './shopData'

const statusStyles: Record<ShopStatus, string> = {
  Pending: 'text-amber-400',
  Verified: 'text-emerald-400',
  'In Review': 'text-sky-400',
  Suspended: 'text-red-400',
}

type Props = {
  data: Shop[]
  pageSize?: number
  onView: (shop: Shop) => void
  onApprove: (key: string) => void
  onReject: (key: string) => void
}

export default function ShopsTable({
  data,
  pageSize = 5,
  onView,
  onApprove,
  onReject,
}: Props) {
  const columns: ColumnsType<Shop> = [
    { title: 'SL', dataIndex: 'sl', key: 'sl', width: 72 },
    {
      title: 'Name / ID',
      key: 'name',
      render: (_, record) => (
        <div>
          <div className="font-medium text-white">{record.name}</div>
          <div className="text-xs text-gray-400">{record.shopId}</div>
        </div>
      ),
    },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Joining Date', dataIndex: 'joiningDate', key: 'joiningDate' },
    {
      title: 'Documents',
      key: 'documents',
      width: 110,
      render: (_, record) => {
        const hasDocs = hasVerificationDocuments(record)

        return (
          <span
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
              hasDocs
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'bg-red-500/15 text-red-400'
            }`}
            title={hasDocs ? 'Documents submitted' : 'No documents'}
            aria-label={hasDocs ? 'Documents submitted' : 'No documents'}
          >
            {hasDocs ? <Check size={16} /> : <X size={16} />}
          </span>
        )
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: ShopStatus) => (
        <span className={`text-sm font-semibold ${statusStyles[status]}`}>
          {status}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 300,
      render: (_, record) => {
        // Requires verification docs + pending status conditions
        const showApprovalActions = canReviewShop(record)

        return (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onView(record)}
              className="rounded-md border border-amber-500/60 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 transition-colors hover:bg-amber-500/20"
            >
              View Details
            </button>
            {showApprovalActions && (
              <>
                <Popconfirm
                  title="Approve shop"
                  description={`Mark ${record.name} as Verified?`}
                  okText="Approve"
                  cancelText="Cancel"
                  onConfirm={() => onApprove(record.key)}
                >
                  <button
                    type="button"
                    className="rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-600"
                  >
                    Approved
                  </button>
                </Popconfirm>
                <Popconfirm
                  title="Reject shop"
                  description={`Suspend ${record.name}?`}
                  okText="Reject"
                  cancelText="Cancel"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => onReject(record.key)}
                >
                  <button
                    type="button"
                    className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-600"
                  >
                    Reject
                  </button>
                </Popconfirm>
              </>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <Table<Shop>
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
