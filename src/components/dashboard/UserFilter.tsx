import { useState } from 'react'
import { Popover } from 'antd'
import { ChevronDown, Filter } from 'lucide-react'
import { USER_STATUSES, type UserStatus } from './userData'

export type UserFilterState = {
  status: UserStatus | null
}

export const EMPTY_USER_FILTER: UserFilterState = {
  status: null,
}

type Props = {
  value: UserFilterState
  onChange: (next: UserFilterState) => void
}

export default function UserFilter({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)

  const selectStatus = (status: UserStatus) => {
    onChange({
      status: value.status === status ? null : status,
    })
    setOpen(false)
  }

  const clear = () => {
    onChange(EMPTY_USER_FILTER)
    setOpen(false)
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger="click"
      placement="bottomRight"
      content={
        <div className="w-64 space-y-4 p-1">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Status
            </div>
            <div className="space-y-1">
              {USER_STATUSES.map((status) => (
                <CheckboxPill
                  key={status}
                  label={status}
                  checked={value.status === status}
                  onChange={() => selectStatus(status)}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end border-t border-surface-border pt-3">
            <button
              type="button"
              onClick={clear}
              className="h-8 rounded-md px-3 text-xs font-medium text-gray-300 hover:text-white"
            >
              Reset
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
        {value.status && (
          <span className="rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-semibold">
            1
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
        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
          checked ? 'border-brand bg-brand' : 'border-surface-border'
        }`}
      >
        {checked && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
      </span>
    </button>
  )
}
