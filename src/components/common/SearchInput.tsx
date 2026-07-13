import { Search } from 'lucide-react'

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

/**
 * Reusable search field used across dashboard list pages.
 * Pair with `useDebouncedSearch` and pass the immediate `value` / `setValue`.
 */
export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  disabled = false,
}: Props) {
  return (
    <div className={`relative w-full max-w-sm ${className}`}>
      <Search
        size={16}
        className="pointer-events-none absolute inset-y-0 left-3 my-auto text-gray-400"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="h-10 w-full rounded-md border border-surface-border bg-transparent pl-9 pr-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-brand disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  )
}
