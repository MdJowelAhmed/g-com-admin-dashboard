import { useMemo } from 'react'
import { Search } from 'lucide-react'
import { ME_ID, type Conversation } from './chatData'

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

const previewOf = (conv: Conversation) => {
  const last = conv.messages[conv.messages.length - 1]
  if (!last) return ''
  const prefix = last.senderId === ME_ID ? 'You: ' : ''

  if (last.type === 'image') return `${prefix}Photo`
  if (last.type === 'file') return `${prefix}${last.fileName ?? 'File'}`

  return `${prefix}${last.content}`
}

type Props = {
  conversations: Conversation[]
  activeId: string | null
  query: string
  onQueryChange: (q: string) => void
  onSelect: (id: string) => void
}

export default function ConversationList({
  conversations,
  activeId,
  query,
  onQueryChange,
  onSelect,
}: Props) {
  const totalUnread = useMemo(
    () => conversations.reduce((sum, c) => sum + c.unread, 0),
    [conversations],
  )

  return (
    <aside className="flex h-full w-full flex-col">
      <header className="border-b border-surface-border px-5 py-5">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-white">Messages</h1>
          {totalUnread > 0 && (
            <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-semibold text-white">
              {totalUnread}
            </span>
          )}
        </div>

        <div className="relative mt-3">
          <Search
            size={15}
            className="pointer-events-none absolute inset-y-0 left-3 my-auto text-gray-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search conversations"
            className="h-9 w-full rounded-md border border-surface-border bg-surface-page pl-9 pr-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-brand"
          />
        </div>
      </header>

      <ul className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <li className="px-5 py-10 text-center text-sm text-gray-400">
            No conversations match.
          </li>
        ) : (
          conversations.map((conv) => {
            const active = conv.id === activeId
            const last = conv.messages[conv.messages.length - 1]
            return (
              <li key={conv.id}>
                <button
                  type="button"
                  onClick={() => onSelect(conv.id)}
                  className={`flex w-full items-start gap-3 border-b border-surface-border px-5 py-3 text-left transition-colors ${
                    active
                      ? 'bg-brand/15'
                      : 'hover:bg-surface-elevated/50'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.contact.avatarUrl}
                      alt={conv.contact.name}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                    {conv.contact.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface-card bg-emerald-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className={`truncate text-sm ${
                          conv.unread > 0
                            ? 'font-semibold text-white'
                            : 'font-medium text-gray-100'
                        }`}
                      >
                        {conv.contact.name}
                      </div>
                      {last && (
                        <span
                          className={`shrink-0 text-[11px] ${
                            conv.unread > 0 ? 'text-brand-hover' : 'text-gray-500'
                          }`}
                        >
                          {timeAgo(last.sentAt)}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <p
                        className={`truncate text-xs ${
                          conv.unread > 0
                            ? 'text-gray-200'
                            : 'text-gray-400'
                        }`}
                      >
                        {conv.contact.isTyping ? (
                          <span className="text-brand-hover">
                            Typing…
                          </span>
                        ) : (
                          previewOf(conv)
                        )}
                      </p>
                      {conv.unread > 0 && (
                        <span className="shrink-0 rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-white">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            )
          })
        )}
      </ul>
    </aside>
  )
}
