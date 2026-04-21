import { useMemo, useState } from 'react'
import ConversationList from '../../components/dashboard/ConversationList'
import ChatWindow from '../../components/dashboard/ChatWindow'
import {
  ME_ID,
  initialConversations,
  type ChatMessage,
  type Conversation,
} from '../../components/dashboard/chatData'

let messageCounter = 10000
const nextMessageId = () => `m-${++messageCounter}`

export default function Messages() {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations)
  const [activeId, setActiveId] = useState<string | null>(
    initialConversations[0]?.id ?? null,
  )
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return conversations
    return conversations.filter((c) =>
      c.contact.name.toLowerCase().includes(q),
    )
  }, [conversations, query])

  const active = conversations.find((c) => c.id === activeId) ?? null

  const handleSelect = (id: string) => {
    setActiveId(id)
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)),
    )
  }

  const handleSend = (conversationId: string, content: string) => {
    const newMessage: ChatMessage = {
      id: nextMessageId(),
      senderId: ME_ID,
      content,
      sentAt: new Date().toISOString(),
      read: false,
    }
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, messages: [...c.messages, newMessage] }
          : c,
      ),
    )
  }

  return (
    <div className="h-full py-6">
      <div className="flex h-full min-h-0 overflow-hidden rounded-2xl border border-surface-border bg-surface-card">
        <div className="w-[340px] shrink-0 border-r border-surface-border">
          <ConversationList
            conversations={filtered}
            activeId={activeId}
            query={query}
            onQueryChange={setQuery}
            onSelect={handleSelect}
          />
        </div>
        <div className="min-w-0 flex-1">
          <ChatWindow conversation={active} onSend={handleSend} />
        </div>
      </div>
    </div>
  )
}
