import { useState } from 'react'
import { Popover } from 'antd'
import { ChevronDown, Filter } from 'lucide-react'
import { ORDER_STATUSES, type OrderStatus } from './orderData'

export type OrderFilterState = {
  statuses: OrderStatus[]
  minAmount: string
  maxAmount: string
}

export const EMPTY_ORDER_FILTER: OrderFilterState = {
  statuses: [],
  minAmount: '',
  maxAmount: '',
}

type Props = {
  value: OrderFilterState
  onChange: (next: OrderFilterState) => void
}

export default function OrderFilter({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<OrderFilterState>(value)

  const activeCount =
    value.statuses.length +
    (value.minAmount ? 1 : 0) +
    (value.maxAmount ? 1 : 0)

  const toggleStatus = (status: OrderStatus) =>
    setDraft((prev) => ({
      ...prev,
      statuses: prev.statuses.includes(status)
        ? prev.statuses.filter((s) => s !== status)
        : [...prev.statuses, status],
    }))

  const apply = () => {
    onChange(draft)
    setOpen(false)
  }

  const clear = () => {
    setDraft(EMPTY_ORDER_FILTER)
    onChange(EMPTY_ORDER_FILTER)
    setOpen(false)
  }

  const onOpenChange = (next: boolean) => {
    if (next) setDraft(value)
    setOpen(next)
  }

  return (
    <Popover
      open={open}
      onOpenChange={onOpenChange}
      trigger="click"
      placement="bottomRight"
      content={
        <div className="w-72 space-y-4 p-1">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Status
            </div>
            <div className="space-y-1">
              {ORDER_STATUSES.map((status) => (
                <CheckboxPill
                  key={status}
                  label={status}
                  checked={draft.statuses.includes(status)}
                  onChange={() => toggleStatus(status)}
                />
              ))}
            </div>
          </div>

          <div className="border-t border-surface-border pt-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Amount range ($)
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={draft.minAmount}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, minAmount: e.target.value }))
                }
                placeholder="Min"
                className="h-8 w-full rounded border border-surface-border bg-transparent px-2 text-sm text-white placeholder:text-gray-500 outline-none focus:border-brand"
              />
              <span className="text-xs text-gray-400">to</span>
              <input
                type="number"
                min={0}
                value={draft.maxAmount}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, maxAmount: e.target.value }))
                }
                placeholder="Max"
                className="h-8 w-full rounded border border-surface-border bg-transparent px-2 text-sm text-white placeholder:text-gray-500 outline-none focus:border-brand"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-surface-border pt-3">
            <button
              type="button"
              onClick={clear}
              className="h-8 rounded-md px-3 text-xs font-medium text-gray-300 hover:text-white"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={apply}
              className="h-8 rounded-md bg-brand px-3 text-xs font-semibold text-white hover:bg-brand-hover"
            >
              Apply
            </button>
          </div>
        </div>
      }
    >
      <button
        type="button"
        className="flex h-10 items-center gap-2 rounded-md border border-surface-border px-3 text-sm font-medium text-white transition-colors hover:bg-brand/10"
      >
        <Filter size={15} />
        Filter
        {activeCount > 0 && (
          <span className="rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-semibold">
            {activeCount}
          </span>
        )}
        <ChevronDown size={15} />
      </button>
    </Popover>
  )
}

type CheckboxPillProps = {
  label: string
  checked: boolean
  onChange: () => void
}

function CheckboxPill({ label, checked, onChange }: CheckboxPillProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-sm transition-colors ${
        checked
          ? 'bg-brand/20 text-white'
          : 'text-gray-300 hover:bg-surface-elevated hover:text-white'
      }`}
    >
      <span>{label}</span>
      <span
        className={`flex h-4 w-4 items-center justify-center rounded border ${
          checked ? 'border-brand bg-brand' : 'border-surface-border'
        }`}
      >
        {checked && (
          <svg viewBox="0 0 16 16" className="h-3 w-3 text-white" fill="none">
            <path
              d="M3 8l3 3 7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </button>
  )
}
