import type { ReactNode } from 'react'

type Props = {
  label: string
  children: ReactNode
  required?: boolean
}

export default function FormControl({ label, children, required }: Props) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-white">
        {label}
        {required && <span className="ml-1 text-accent-amber">*</span>}
      </span>
      {children}
    </label>
  )
}

export const controlClass =
  'h-12 w-full rounded-md border border-brand bg-transparent px-4 text-sm text-white placeholder:text-gray-500 outline-none transition-colors focus:border-brand-hover focus:ring-2 focus:ring-brand-ring/30'

export const textareaClass =
  'min-h-[88px] w-full rounded-md border border-brand bg-transparent px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition-colors focus:border-brand-hover focus:ring-2 focus:ring-brand-ring/30'
