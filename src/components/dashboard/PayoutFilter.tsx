import { useState } from 'react'
import { Popover } from 'antd'
import { ChevronDown, Filter } from 'lucide-react'
import {
  PAYMENT_SYSTEMS,
  PAYOUT_STATUSES,
  type PaymentSystem,
  type PayoutStatus,
} from './payoutData'

export type PayoutFilterState = {
  statuses: PayoutStatus[]
  systems: PaymentSystem[]
}

export const EMPTY_PAYOUT_FILTER: PayoutFilterState = {
  statuses: [],
  systems: [],
}

type Props = {
  value: PayoutFilterState
  onChange: (next: PayoutFilterState) => void
}

export default function PayoutFilter({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<PayoutFilterState>(value)

  const activeCount = value.statuses.length + value.systems.length

  const toggleStatus = (status: PayoutStatus) =>
    setDraft((prev) => ({
      ...prev,
      statuses: prev.statuses.includes(status)
        ? prev.statuses.filter((s) => s !== status)
        : [...prev.statuses, status],
    }))

  const toggleSystem = (system: PaymentSystem) =>
    setDraft((prev) => ({
      ...prev,
      systems: prev.systems.includes(system)
        ? prev.systems.filter((s) => s !== system)
        : [...prev.systems, system],
    }))

  const apply = () => {
    onChange(draft)
    setOpen(false)
  }

  const clear = () => {
    setDraft(EMPTY_PAYOUT_FILTER)
    onChange(EMPTY_PAYOUT_FILTER)
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
        <div className="w-64 space-y-4 p-1">
          <FilterGroup label="Status">
            {PAYOUT_STATUSES.map((status) => (
              <CheckboxPill
                key={status}
                label={status}
                checked={draft.statuses.includes(status)}
                onChange={() => toggleStatus(status)}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="Payment System">
            {PAYMENT_SYSTEMS.map((system) => (
              <CheckboxPill
                key={system}
                label={system}
                checked={draft.systems.includes(system)}
                onChange={() => toggleSystem(system)}
              />
            ))}
          </FilterGroup>

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

type FilterGroupProps = {
  label: string
  children: React.ReactNode
}

function FilterGroup({ label, children }: FilterGroupProps) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
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
