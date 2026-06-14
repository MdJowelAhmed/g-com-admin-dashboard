export const ME_ID = 'me'

export type Contact = {
  id: string
  name: string
  avatarUrl: string
  online: boolean
  isTyping?: boolean
}

export type ChatMessageType = 'text' | 'image' | 'file'

export type ChatMessage = {
  id: string
  senderId: string
  type: ChatMessageType
  content: string
  fileName?: string
  sentAt: string
  read?: boolean
}

export type Conversation = {
  id: string
  contact: Contact
  messages: ChatMessage[]
  unread: number
  searchText?: string
}

export const initialConversations: Conversation[] = [
  {
    id: 'conv-larry',
    contact: {
      id: 'larry',
      name: 'Larry',
      avatarUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop',
      online: true,
      isTyping: true,
    },
    unread: 3,
    messages: [
      {
        id: 'm-1',
        type: 'text',
        senderId: 'larry',
        content: 'omg, this is amazing',
        sentAt: '2025-10-27T09:10:00',
        read: true,
      },
      {
        id: 'm-2',
        type: 'text',
        senderId: 'larry',
        content: 'perfect! ✅',
        sentAt: '2025-10-27T09:11:00',
        read: true,
      },
      {
        id: 'm-3',
        type: 'text',
        senderId: 'larry',
        content: 'Wow, this is really epic',
        sentAt: '2025-10-27T09:12:00',
        read: true,
      },
      {
        id: 'm-4',
        type: 'text',
        senderId: ME_ID,
        content: 'woohoooo',
        sentAt: '2025-10-27T09:14:00',
        read: true,
      },
      {
        id: 'm-5',
        type: 'text',
        senderId: ME_ID,
        content: 'Haha oh man',
        sentAt: '2025-10-27T09:14:20',
        read: true,
      },
      {
        id: 'm-6',
        type: 'text',
        senderId: ME_ID,
        content: "Haha that's terrifying 😅",
        sentAt: '2025-10-27T09:15:00',
        read: true,
      },
      {
        id: 'm-7',
        type: 'text',
        senderId: 'larry',
        content: "I've shipped the beta build — can you test tonight?",
        sentAt: '2025-10-27T14:10:00',
      },
      {
        id: 'm-8',
        type: 'text',
        senderId: 'larry',
        content: 'Woof!Woof!',
        sentAt: '2025-10-27T14:32:00',
      },
    ],
  },
  {
    id: 'conv-max',
    contact: {
      id: 'max',
      name: 'Max',
      avatarUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop',
      online: true,
    },
    unread: 1,
    messages: [
      {
        id: 'm-max-1',
        type: 'text',
        senderId: 'max',
        content: 'Hello',
        sentAt: '2025-10-27T13:52:00',
      },
    ],
  },
  {
    id: 'conv-lemon',
    contact: {
      id: 'lemon',
      name: 'Lemon',
      avatarUrl:
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=96&h=96&fit=crop',
      online: false,
    },
    unread: 0,
    messages: [
      {
        id: 'm-l-1',
        type: 'text',
        senderId: ME_ID,
        content: 'Where are you?',
        sentAt: '2025-10-27T13:10:00',
        read: true,
      },
      {
        id: 'm-l-2',
        type: 'text',
        senderId: 'lemon',
        content: "Just parking — 2 mins out!",
        sentAt: '2025-10-27T13:18:00',
        read: true,
      },
    ],
  },
  {
    id: 'conv-katy',
    contact: {
      id: 'katy',
      name: 'Katy',
      avatarUrl:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&fit=crop',
      online: true,
    },
    unread: 0,
    messages: [
      {
        id: 'm-k-1',
        type: 'text',
        senderId: 'katy',
        content: 'Hi!',
        sentAt: '2025-10-27T11:00:00',
        read: true,
      },
      {
        id: 'm-k-2',
        type: 'text',
        senderId: ME_ID,
        content: "Hey Katy — how'd the launch go?",
        sentAt: '2025-10-27T11:04:00',
        read: true,
      },
    ],
  },
  {
    id: 'conv-chedder',
    contact: {
      id: 'chedder',
      name: 'Chedder',
      avatarUrl:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=96&h=96&fit=crop',
      online: false,
    },
    unread: 0,
    messages: [
      {
        id: 'm-c-1',
        type: 'text',
        senderId: 'chedder',
        content: 'Yes',
        sentAt: '2025-10-26T17:30:00',
        read: true,
      },
    ],
  },
  {
    id: 'conv-daisy',
    contact: {
      id: 'daisy',
      name: 'Daisy',
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop',
      online: true,
    },
    unread: 2,
    messages: [
      {
        id: 'm-d-1',
        type: 'text',
        senderId: 'daisy',
        content: 'Can we sync about the new brand guidelines?',
        sentAt: '2025-10-25T10:00:00',
        read: true,
      },
      {
        id: 'm-d-2',
        type: 'text',
        senderId: ME_ID,
        content: 'Sure',
        sentAt: '2025-10-25T10:05:00',
        read: true,
      },
      {
        id: 'm-d-3',
        type: 'text',
        senderId: 'daisy',
        content: 'Friday 3pm works?',
        sentAt: '2025-10-25T10:15:00',
      },
      {
        id: 'm-d-4',
        type: 'text',
        senderId: 'daisy',
        content: 'Bringing coffee ☕',
        sentAt: '2025-10-25T10:16:00',
      },
    ],
  },
  {
    id: 'conv-noah',
    contact: {
      id: 'noah',
      name: 'Noah Patel',
      avatarUrl:
        'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=96&h=96&fit=crop',
      online: false,
    },
    unread: 0,
    messages: [
      {
        id: 'm-n-1',
        type: 'text',
        senderId: 'noah',
        content: 'Got a quote from the print shop — will forward.',
        sentAt: '2025-10-22T09:45:00',
        read: true,
      },
    ],
  },
]
