import { useState } from 'react'
import { Popover } from 'antd'
import { ChevronDown, Filter } from 'lucide-react'
import {
  SHOP_STATUSES,
  SHOP_TYPES,
  type ShopStatus,
} from './shopData'

export type FilterState = {
  statuses: ShopStatus[]
  types: string[]
}

export const EMPTY_FILTER: FilterState = { statuses: [], types: [] }

type Props = {
  value: FilterState
  onChange: (next: FilterState) => void
}

export default function ShopFilter({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<FilterState>(value)

  const activeCount = value.statuses.length + value.types.length

  const toggleStatus = (status: ShopStatus) =>
    setDraft((prev) => ({
      ...prev,
      statuses: prev.statuses.includes(status)
        ? prev.statuses.filter((s) => s !== status)
        : [...prev.statuses, status],
    }))

  const toggleType = (type: string) =>
    setDraft((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }))

  const apply = () => {
    onChange(draft)
    setOpen(false)
  }

  const clear = () => {
    setDraft(EMPTY_FILTER)
    onChange(EMPTY_FILTER)
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
          <FilterGroup label="Status">
            {SHOP_STATUSES.map((status) => (
              <CheckboxPill
                key={status}
                label={status}
                checked={draft.statuses.includes(status)}
                onChange={() => toggleStatus(status)}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="Type">
            <div className="max-h-48 overflow-y-auto pr-1">
              {SHOP_TYPES.map((type) => (
                <CheckboxPill
                  key={type}
                  label={type}
                  checked={draft.types.includes(type)}
                  onChange={() => toggleType(type)}
                />
              ))}
            </div>
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
