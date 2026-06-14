import {
  ME_ID,
  type ChatMessage,
  type ChatMessageType,
  type Conversation,
} from '../../components/dashboard/chatData'
import { baseApi, imageUrl } from './baseApi'

export interface ChatCustomerRef {
  _id: string
  name: string
  profileImage: string
}

export interface ChatLastMessageDoc {
  _id: string
  chat: string
  sender: string
  senderRole: string
  type: string
  text: string
  fileName?: string
  createdAt: string
  updatedAt: string
  seenBy?: string[]
}

export interface ChatBusinessRef {
  _id: string
  businessName?: string
  user?: ChatCustomerRef
}

export interface ChatApiDoc {
  _id: string
  chatType: string
  customer?: ChatCustomerRef | null
  business?: ChatBusinessRef | null
  participants: string[]
  searchText?: string
  createdAt: string
  updatedAt: string
  lastMessage?: ChatLastMessageDoc
}

export interface MessageSenderRef {
  _id: string
  name: string
  role: string
}

export interface MessageApiDoc {
  _id: string
  chat: string
  sender: string | MessageSenderRef
  senderRole: string
  type: string
  text: string
  fileName?: string
  createdAt: string
  updatedAt: string
  seenBy?: string[]
}

export interface ChatsPagination {
  total: number
  limit: number
  page: number
  totalPage: number
}

export interface ChatsListResponse {
  success: boolean
  message: string
  pagination: ChatsPagination
  data: ChatApiDoc[]
}

export interface MessagesListResponse {
  success: boolean
  message: string
  pagination: ChatsPagination
  data: MessageApiDoc[]
}

export interface GetChatsParams {
  page?: number
  limit?: number
}

export interface GetChatMessagesParams {
  id: string
  page?: number
  limit?: number
}

export type MessageType = 'text' | 'image' | 'file'

export interface SendMessagePayload {
  chat: string
  type: MessageType
  text: string
  fileName?: string
}

export interface SendMessageResponse {
  success: boolean
  message: string
  data?: MessageApiDoc
}

const DEFAULT_AVATAR =
  'https://ui-avatars.com/api/?background=1e293b&color=fff&name=U'

export function resolveMediaUrl(path: string) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${imageUrl}${path}`
}

function isAdminSenderRole(role: string) {
  return role === 'super_admin' || role === 'admin'
}

function normalizeMessageType(type: string): ChatMessageType {
  if (type === 'image') return 'image'
  if (type === 'file' || type === 'document' || type === 'pdf') return 'file'
  return 'text'
}

function resolveFileName(doc: { text: string; fileName?: string }) {
  return doc.fileName ?? fileNameFromUrl(doc.text)
}

function fileNameFromUrl(url: string) {
  try {
    const name = url.split('/').pop()?.split('?')[0] ?? 'Document.pdf'
    return decodeURIComponent(name)
  } catch {
    return 'Document.pdf'
  }
}

export function mapMessageFromApi(doc: MessageApiDoc): ChatMessage {
  const senderId =
    typeof doc.sender === 'string' ? doc.sender : doc.sender._id
  const isMine = isAdminSenderRole(doc.senderRole)
  const type = normalizeMessageType(doc.type)

  return {
    id: doc._id,
    senderId: isMine ? ME_ID : senderId,
    type,
    content: doc.text,
    fileName: type === 'file' ? resolveFileName(doc) : undefined,
    sentAt: doc.createdAt,
    read: (doc.seenBy?.length ?? 0) > 0,
  }
}

export function mapMessagesFromApi(docs: MessageApiDoc[]): ChatMessage[] {
  return docs
    .map(mapMessageFromApi)
    .sort(
      (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime(),
    )
}

function mapLastMessageToChatMessage(doc: ChatLastMessageDoc): ChatMessage {
  const isMine = isAdminSenderRole(doc.senderRole)
  const type = normalizeMessageType(doc.type)

  return {
    id: doc._id,
    senderId: isMine ? ME_ID : doc.sender,
    type,
    content: doc.text,
    fileName: type === 'file' ? resolveFileName(doc) : undefined,
    sentAt: doc.createdAt,
    read: (doc.seenBy?.length ?? 0) > 0,
  }
}

function getChatContact(doc: ChatApiDoc) {
  if (doc.customer?.name) {
    return {
      id: doc.customer._id,
      name: doc.customer.name,
      profileImage: doc.customer.profileImage ?? '',
    }
  }

  if (doc.business) {
    const user = doc.business.user
    return {
      id: user?._id ?? doc.business._id,
      name:
        doc.business.businessName ??
        user?.name ??
        doc.searchText ??
        'Unknown contact',
      profileImage: user?.profileImage ?? '',
    }
  }

  const nameFromSearch = doc.searchText?.replace(/\s+Admin$/i, '').trim()

  return {
    id: doc.participants?.[0] ?? doc._id,
    name: nameFromSearch || 'Unknown contact',
    profileImage: '',
  }
}

export function mapChatToConversation(doc: ChatApiDoc): Conversation {
  const contact = getChatContact(doc)
  const avatar = resolveMediaUrl(contact.profileImage)

  return {
    id: doc._id,
    contact: {
      id: contact.id,
      name: contact.name,
      avatarUrl:
        avatar ||
        `${DEFAULT_AVATAR}&name=${encodeURIComponent(contact.name)}`,
      online: false,
    },
    messages: doc.lastMessage ? [mapLastMessageToChatMessage(doc.lastMessage)] : [],
    unread: 0,
    searchText: doc.searchText,
  }
}

const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChats: builder.query<ChatsListResponse, GetChatsParams | undefined>({
      query: (params = {}) => ({
        url: '/chats/mine',
        method: 'GET',
        params,
      }),
      providesTags: ['Chats'],
    }),
    getChatMessages: builder.query<MessagesListResponse, GetChatMessagesParams>({
      query: ({ id, ...params }) => ({
        url: `/messages/${id}`,
        method: 'GET',
        params,
      }),
      providesTags: (_result, _error, { id }) => [
        { type: 'Chats', id: `messages-${id}` },
      ],
    }),
    sendMessage: builder.mutation<SendMessageResponse, SendMessagePayload>({
      query: (body) => ({
        url: '/messages',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { chat }) => [
        'Chats',
        { type: 'Chats', id: `messages-${chat}` },
      ],
    }),
  }),
})

export const {
  useGetChatsQuery,
  useGetChatMessagesQuery,
  useSendMessageMutation,
} = chatApi
