import { BadgeCheck } from 'lucide-react'

type VerificationItem = {
  id: string
  name: string
  type: string
  submittedAt: string
}

const items: VerificationItem[] = [
  {
    id: '1',
    name: 'Solaris energy',
    type: 'Service',
    submittedAt: '2023-10-24',
  },
  {
    id: '2',
    name: 'Solaris energy',
    type: 'Service',
    submittedAt: '2023-10-24',
  },
]

type Props = {
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

export default function VerificationQueue({ onApprove, onReject }: Props) {
  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card p-5">
      <div className="flex items-center gap-2">
        <BadgeCheck size={20} className="text-sky-400" />
        <h2 className="text-lg font-semibold text-white">Verification Queue</h2>
      </div>

      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-surface-border bg-surface-elevated p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-white">{item.name}</div>
                <div className="text-xs text-gray-400">{item.type}</div>
              </div>
              <div className="text-xs text-gray-400">{item.submittedAt}</div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onApprove?.(item.id)}
                className="h-9 rounded-md bg-emerald-500/20 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-500/30"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => onReject?.(item.id)}
                className="h-9 rounded-md bg-red-500/20 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/30"
              >
                Reject
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
