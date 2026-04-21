import { NOTIFICATION_TYPES, type NotificationType } from './broadcastData'

type Props = {
  type: NotificationType
  title: string
  message: string
}

export default function BroadcastPreview({ type, title, message }: Props) {
  const meta = NOTIFICATION_TYPES.find((t) => t.value === type)!
  const Icon = meta.icon

  return (
    <aside className="rounded-2xl border border-surface-border bg-surface-card p-5">
      <header className="mb-4">
        <h2 className="text-base font-semibold text-white">Live Preview</h2>
        <p className="text-xs text-gray-400">How users will see this</p>
      </header>

      <div className="rounded-xl border border-surface-border bg-surface-elevated p-4">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-page ${meta.tone}`}
          >
            <Icon size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-white">
              {title.trim() || 'Your notification title'}
            </div>
            <p className="mt-0.5 text-xs leading-snug text-gray-300">
              {message.trim() ||
                'Your message will appear here as users see it.'}
            </p>
            <div className="mt-2 text-[10px] font-medium uppercase tracking-wider text-gray-500">
              G-com
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
