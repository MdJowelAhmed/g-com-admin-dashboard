import { useEffect, useMemo, useState } from 'react'
import { message, Spin } from 'antd'
import ConversationList from '../../components/dashboard/ConversationList'
import ChatWindow from '../../components/dashboard/ChatWindow'
import { type Conversation } from '../../data/chatData'
import {
  mapChatToConversation,
  mapMessagesFromApi,
  type SendMessagePayload,
  useGetChatMessagesQuery,
  useGetChatsQuery,
  useSendMessageMutation,
} from '../../redux/api/chatApi'

export default function Messages() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const { data: chatsData, isLoading, isError } = useGetChatsQuery({})
  const { data: messagesData, isLoading: isMessagesLoading } =
    useGetChatMessagesQuery(
      { id: activeId! },
      { skip: !activeId },
    )
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation()

  const conversations = useMemo(
    () => (chatsData?.data ?? []).map(mapChatToConversation),
    [chatsData],
  )

  useEffect(() => {
    if (conversations.length === 0) {
      setActiveId(null)
      return
    }

    if (!activeId || !conversations.some((chat) => chat.id === activeId)) {
      setActiveId(conversations[0].id)
    }
  }, [conversations, activeId])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return conversations
    return conversations.filter(
      (chat) =>
        chat.contact.name.toLowerCase().includes(q) ||
        chat.searchText?.toLowerCase().includes(q),
    )
  }, [conversations, query])

  const activeConversation = useMemo((): Conversation | null => {
    const base = conversations.find((chat) => chat.id === activeId)
    if (!base) return null

    const messages = mapMessagesFromApi(messagesData?.data ?? [])
    return {
      ...base,
      messages: messages.length > 0 ? messages : base.messages,
    }
  }, [conversations, activeId, messagesData])

  const handleSelect = (id: string) => {
    setActiveId(id)
  }

  const handleSend = async (payload: SendMessagePayload) => {
    try {
      await sendMessage(payload).unwrap()
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to send message.'
      message.error(errorMessage)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <Spin size="large" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <p className="text-sm text-red-400">
          Failed to load conversations. Please try again.
        </p>
      </div>
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
          {isMessagesLoading && activeId ? (
            <div className="flex h-full items-center justify-center">
              <Spin />
            </div>
          ) : (
            <ChatWindow
              conversation={activeConversation}
              onSend={handleSend}
              isSending={isSending}
            />
          )}
        </div>
      </div>
    </div>
  )
}
