import { Popconfirm, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { feeFor, type Transaction } from './payoutData'

type Props = {
  data: Transaction[]
  pageSize?: number
  onRelease: (key: string) => void
}

export default function PayoutsTable({
  data,
  pageSize = 8,
  onRelease,
}: Props) {
  const columns: ColumnsType<Transaction> = [
    { title: 'SL', dataIndex: 'sl', key: 'sl', width: 72 },
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      render: (v: string) => (
        <span className="font-medium text-white">{v}</span>
      ),
    },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'System', dataIndex: 'system', key: 'system' },
    {
      title: 'Gross Amount',
      dataIndex: 'grossAmount',
      key: 'grossAmount',
      render: (v: number) =>
        `$${v.toLocaleString('en-US', { minimumFractionDigits: 0 })}`,
    },
    {
      title: 'Fee (3%)',
      key: 'fee',
      render: (_, record) => {
        const fee = feeFor(record.grossAmount)
        return `$${fee.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 170,
      render: (_, record) =>
        record.status === 'Released' ? (
          <span className="inline-flex h-9 items-center justify-center rounded-md bg-emerald-500 px-4 text-xs font-semibold text-white">
            Released
          </span>
        ) : (
          <Popconfirm
            title="Release payout"
            description={`Release $${record.grossAmount.toLocaleString()} to ${record.name}?`}
            okText="Release"
            cancelText="Cancel"
            onConfirm={() => onRelease(record.key)}
          >
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-md border border-emerald-500 px-4 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/10"
            >
              Release Amount
            </button>
          </Popconfirm>
        ),
    },
  ]

  return (
    <Table<Transaction>
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
