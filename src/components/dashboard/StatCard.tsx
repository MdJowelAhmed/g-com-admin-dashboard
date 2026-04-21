import type { LucideIcon } from 'lucide-react'

type Props = {
  label: string
  value: string
  icon: LucideIcon
}

export default function StatCard({ label, value, icon: Icon }: Props) {
  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card p-5">
      <div className="flex items-center gap-2 text-sm text-gray-300">
        <Icon size={18} className="text-gray-300" />
        <span>{label}</span>
      </div>
      <div className="mt-4 text-3xl font-semibold text-white">{value}</div>
    </div>
  )
}
