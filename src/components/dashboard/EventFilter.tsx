import { useState } from 'react'
import { Popover } from 'antd'
import { ChevronDown, Filter } from 'lucide-react'
import {
  EVENT_SIZES,
  EVENT_STATUSES,
  type EventSize,
  type EventStatus,
} from './eventData'

export type EventFilterState = {
  statuses: EventStatus[]
  sizes: EventSize[]
}

export const EMPTY_EVENT_FILTER: EventFilterState = {
  statuses: [],
  sizes: [],
}

type Props = {
  value: EventFilterState
  onChange: (next: EventFilterState) => void
}

export default function EventFilter({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<EventFilterState>(value)

  const activeCount = value.statuses.length + value.sizes.length

  const toggleStatus = (s: EventStatus) =>
    setDraft((prev) => ({
      ...prev,
      statuses: prev.statuses.includes(s)
        ? prev.statuses.filter((x) => x !== s)
        : [...prev.statuses, s],
    }))

  const toggleSize = (s: EventSize) =>
    setDraft((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(s)
        ? prev.sizes.filter((x) => x !== s)
        : [...prev.sizes, s],
    }))

  const apply = () => {
    onChange(draft)
    setOpen(false)
  }

  const clear = () => {
    setDraft(EMPTY_EVENT_FILTER)
    onChange(EMPTY_EVENT_FILTER)
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
            {EVENT_STATUSES.map((status) => (
              <CheckboxPill
                key={status}
                label={status}
                checked={draft.statuses.includes(status)}
                onChange={() => toggleStatus(status)}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="Event Type">
            {EVENT_SIZES.map((size) => (
              <CheckboxPill
                key={size}
                label={size}
                checked={draft.sizes.includes(size)}
                onChange={() => toggleSize(size)}
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
        className="flex h-10 items-center gap-2 rounded-md border border-brand px-3 text-sm font-medium text-white transition-colors hover:bg-brand/10"
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
