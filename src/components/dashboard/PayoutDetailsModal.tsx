import { Modal } from 'antd'
import { Wallet } from 'lucide-react'
import {
  formatPayoutStatus,
  type PayoutListItem,
} from '../../redux/api/earningPayoutApi'

const statusStyles: Record<string, string> = {
  pending: 'text-amber-400',
  processing: 'text-sky-400',
  completed: 'text-emerald-400',
  failed: 'text-red-400',
  cancelled: 'text-gray-400',
}

type Props = {
  payout: PayoutListItem | null
  open: boolean
  onClose: () => void
}

export default function PayoutDetailsModal({ payout, open, onClose }: Props) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Payout Details"
      centered
      destroyOnClose
      width={640}
    >
      {payout && (
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand/20 text-brand-hover">
              <Wallet size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-lg font-semibold text-white">
                {payout.businessName}
              </div>
              <div className="truncate text-xs text-gray-400">
                {payout.clientReference}
              </div>
            </div>
            <div
              className={`text-sm font-semibold ${statusStyles[payout.status] ?? 'text-gray-300'}`}
            >
              {formatPayoutStatus(payout.status)}
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-4">
            <DetailRow label="Amount" value={`GH₵${payout.amount.toLocaleString()}`} />
            <DetailRow label="Method" value={payout.method} />
            <DetailRow label="Created At" value={payout.createdAt} />
            <DetailRow label="Updated At" value={payout.updatedAt} />
            <DetailRow
              label="Recipient"
              value={payout.recipientName ?? '—'}
            />
            <DetailRow
              label="Charges"
              value={
                payout.charges != null
                  ? `GH₵${payout.charges.toLocaleString()}`
                  : '—'
              }
            />
            <DetailRow
              label="Transaction ID"
              value={payout.transactionId ?? '—'}
            />
            <DetailRow
              label="Response Code"
              value={payout.responseCode ?? '—'}
            />
            <DetailRow
              label="Processed At"
              value={payout.processedAt ?? '—'}
            />
            <DetailRow label="Wallet" value={payout.wallet} />
          </dl>

          {(payout.description || payout.failureReason) && (
            <div className="space-y-3 rounded-xl border border-surface-border bg-surface-elevated/40 p-4">
              {payout.description && (
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-400">
                    Description
                  </div>
                  <p className="mt-1 text-sm text-white">{payout.description}</p>
                </div>
              )}
              {payout.failureReason && (
                <div>
                  <div className="text-xs uppercase tracking-wide text-red-300">
                    Failure Reason
                  </div>
                  <p className="mt-1 text-sm text-red-300">
                    {payout.failureReason}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}

type DetailRowProps = {
  label: string
  value: string
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="mt-1 break-all text-sm font-medium text-white">{value}</dd>
    </div>
  )
}
