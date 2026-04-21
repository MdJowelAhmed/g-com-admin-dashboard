import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type {
  BroadcastRecord,
  BroadcastStatus,
  DeliveryChannel,
} from './broadcastData'

const statusStyles: Record<BroadcastStatus, string> = {
  Sent: 'bg-emerald-500/20 text-emerald-300',
  Scheduled: 'bg-sky-500/20 text-sky-300',
  Draft: 'bg-gray-500/20 text-gray-300',
}

const columns: ColumnsType<BroadcastRecord> = [
  {
    title: 'Broadcast',
    key: 'broadcast',
    render: (_, record) => (
      <div>
        <div className="text-xs font-medium text-brand-hover">{record.id}</div>
        <div className="mt-0.5 text-sm font-medium text-white">
          {record.title}
        </div>
      </div>
    ),
  },
  {
    title: 'Audience',
    dataIndex: 'audience',
    key: 'audience',
  },
  {
    title: 'Channels',
    dataIndex: 'channels',
    key: 'channels',
    render: (channels: DeliveryChannel[]) => (
      <div className="flex flex-wrap gap-1">
        {channels.map((c) => (
          <span
            key={c}
            className="rounded-md bg-surface-elevated px-2 py-0.5 text-[11px] text-gray-200"
          >
            {c}
          </span>
        ))}
      </div>
    ),
  },
  {
    title: 'Sent',
    dataIndex: 'sentCount',
    key: 'sentCount',
    render: (v: number) => v.toLocaleString(),
  },
  {
    title: 'Read Rate',
    dataIndex: 'readRate',
    key: 'readRate',
    render: (rate: number | null) => {
      if (rate === null) {
        return <span className="text-xs text-gray-500">—</span>
      }
      return (
        <div className="min-w-[120px]">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-elevated">
            <div
              className="h-full bg-brand transition-[width]"
              style={{ width: `${rate}%` }}
            />
          </div>
          <div className="mt-1 text-xs font-medium text-white">{rate}%</div>
        </div>
      )
    },
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: BroadcastStatus) => (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            status === 'Sent'
              ? 'bg-emerald-400'
              : status === 'Scheduled'
                ? 'bg-sky-400'
                : 'bg-gray-400'
          }`}
        />
        {status}
      </span>
    ),
  },
]

type Props = {
  data: BroadcastRecord[]
  pageSize?: number
}

export default function BroadcastHistoryTable({ data, pageSize = 8 }: Props) {
  return (
    <Table<BroadcastRecord>
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
