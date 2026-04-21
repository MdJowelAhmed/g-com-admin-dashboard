import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import { CheckCheck, MessageCircle, Paperclip, Send } from 'lucide-react'
import { ME_ID, type ChatMessage, type Conversation } from './chatData'

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })

const dayLabel = (iso: string) => {
  const d = new Date(iso)
  const now = new Date()
  const dayMs = 24 * 60 * 60 * 1000
  const diffDays = Math.floor(
    (new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() -
      new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) /
      dayMs,
  )
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

type Group =
  | { kind: 'divider'; key: string; label: string }
  | { kind: 'block'; key: string; senderId: string; messages: ChatMessage[] }

const buildGroups = (messages: ChatMessage[]): Group[] => {
  const groups: Group[] = []
  let currentDay = ''
  let currentSender = ''
  let currentBlock: { key: string; senderId: string; messages: ChatMessage[] } | null =
    null

  for (const msg of messages) {
    const day = new Date(msg.sentAt).toDateString()
    if (day !== currentDay) {
      currentDay = day
      groups.push({
        kind: 'divider',
        key: `div-${day}`,
        label: dayLabel(msg.sentAt),
      })
      currentSender = ''
      currentBlock = null
    }

    if (msg.senderId !== currentSender) {
      currentSender = msg.senderId
      currentBlock = { key: `block-${msg.id}`, senderId: msg.senderId, messages: [] }
      groups.push({ kind: 'block', ...currentBlock })
    }

    currentBlock?.messages.push(msg)
  }
  return groups
}

type Props = {
  conversation: Conversation | null
  onSend: (conversationId: string, content: string) => void
}

export default function ChatWindow({ conversation, onSend }: Props) {
  const [draft, setDraft] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setDraft('')
  }, [conversation?.id])

  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [conversation?.messages.length, conversation?.id])

  const groups = useMemo(
    () => (conversation ? buildGroups(conversation.messages) : []),
    [conversation],
  )

  if (!conversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/15 text-brand-hover">
          <MessageCircle size={28} />
        </div>
        <div>
          <div className="text-lg font-semibold text-white">
            Pick a conversation
          </div>
          <p className="mt-1 text-sm text-gray-400">
            Select someone from the left to read or reply to messages.
          </p>
        </div>
      </div>
    )
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = draft.trim()
    if (!trimmed) return
    onSend(conversation.id, trimmed)
    setDraft('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const { contact } = conversation

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between gap-3 border-b border-surface-border px-6 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative shrink-0">
            <img
              src={contact.avatarUrl}
              alt={contact.name}
              className="h-11 w-11 rounded-full object-cover"
            />
            {contact.online && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface-card bg-emerald-400" />
            )}
          </div>
          <div className="min-w-0">
            <div className="truncate text-base font-semibold text-white">
              {contact.name}
            </div>
            <div className="truncate text-xs text-gray-400">
              {contact.isTyping ? (
                <span className="text-brand-hover">typing…</span>
              ) : contact.online ? (
                'Active now'
              ) : (
                'Offline'
              )}
            </div>
          </div>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-5"
      >
        <div className="mx-auto flex  flex-col gap-4">
          {groups.map((group) => {
            if (group.kind === 'divider') {
              return (
                <div key={group.key} className="flex items-center gap-3 py-2">
                  <div className="h-px flex-1 bg-surface-border" />
                  <span className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
                    {group.label}
                  </span>
                  <div className="h-px flex-1 bg-surface-border" />
                </div>
              )
            }

            const mine = group.senderId === ME_ID
            return (
              <MessageGroup
                key={group.key}
                mine={mine}
                avatar={mine ? undefined : contact.avatarUrl}
                messages={group.messages}
              />
            )
          })}

          {contact.isTyping && <TypingBubble avatar={contact.avatarUrl} />}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-surface-border px-6 py-4"
      >
        <div className="flex items-end gap-3 rounded-xl border border-surface-border bg-surface-page px-3 py-2 focus-within:border-brand">
          <button
            type="button"
            aria-label="Attach file"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-400 hover:text-white"
          >
            <Paperclip size={18} />
          </button>
          <textarea
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${contact.name}…`}
            className="max-h-32 flex-1 resize-none bg-transparent py-2 text-sm text-white placeholder:text-gray-500 outline-none"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="Send message"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  )
}

type MessageGroupProps = {
  mine: boolean
  avatar?: string
  messages: ChatMessage[]
}

function MessageGroup({ mine, avatar, messages }: MessageGroupProps) {
  const last = messages[messages.length - 1]
  return (
    <div className={`flex gap-3 ${mine ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className="w-8 shrink-0">
        {avatar && (
          <img
            src={avatar}
            alt=""
            className="mt-auto h-8 w-8 rounded-full object-cover"
          />
        )}
      </div>

      <div
        className={`flex max-w-[70%] flex-col gap-1 ${
          mine ? 'items-end' : 'items-start'
        }`}
      >
        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            className={`max-w-full px-4 py-2 text-sm leading-snug ${
              mine
                ? 'rounded-2xl rounded-br-md bg-brand text-white'
                : 'rounded-2xl rounded-bl-md bg-surface-elevated text-gray-100'
            } ${idx === 0 ? '' : mine ? 'rounded-tr-md' : 'rounded-tl-md'}`}
          >
            {msg.content}
          </div>
        ))}
        <div
          className={`flex items-center gap-1.5 text-[10px] text-gray-500 ${
            mine ? 'justify-end' : 'justify-start'
          }`}
        >
          <span>{formatTime(last.sentAt)}</span>
          {mine && (
            <CheckCheck
              size={12}
              className={last.read ? 'text-sky-400' : 'text-gray-500'}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function TypingBubble({ avatar }: { avatar: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-8 shrink-0">
        <img src={avatar} alt="" className="mt-auto h-8 w-8 rounded-full object-cover" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-surface-elevated px-4 py-3">
        <TypingDot delay="0ms" />
        <TypingDot delay="150ms" />
        <TypingDot delay="300ms" />
      </div>
    </div>
  )
}

function TypingDot({ delay }: { delay: string }) {
  return (
    <span
      className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
      style={{ animationDelay: delay }}
    />
  )
}

