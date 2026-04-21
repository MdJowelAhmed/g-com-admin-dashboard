import {
  Bell,
  Gift,
  Info,
  Mail,
  Megaphone,
  Smartphone,
  Zap,
  type LucideIcon,
} from 'lucide-react'

export type NotificationType = 'Announcement' | 'Warning' | 'Promo' | 'Info'

export type DeliveryChannel = 'In-App' | 'Email' | 'Push'

export type AudienceSegment =
  | 'All Users'
  | 'Premium Users'
  | 'Free Users'
  | 'New Users'
  | 'Inactive Users'

export type BroadcastStatus = 'Sent' | 'Scheduled' | 'Draft'

export type BroadcastRecord = {
  key: string
  id: string
  title: string
  audience: AudienceSegment
  channels: DeliveryChannel[]
  sentCount: number
  readRate: number | null
  status: BroadcastStatus
}

export const NOTIFICATION_TYPES: {
  value: NotificationType
  icon: LucideIcon
  tone: string
}[] = [
  { value: 'Announcement', icon: Megaphone, tone: 'text-brand-hover' },
  { value: 'Warning', icon: Zap, tone: 'text-amber-400' },
  { value: 'Promo', icon: Gift, tone: 'text-pink-400' },
  { value: 'Info', icon: Info, tone: 'text-sky-400' },
]

export const DELIVERY_CHANNELS: {
  value: DeliveryChannel
  icon: LucideIcon
}[] = [
  { value: 'In-App', icon: Bell },
  { value: 'Email', icon: Mail },
  { value: 'Push', icon: Smartphone },
]

export const AUDIENCE_SEGMENTS: {
  value: AudienceSegment
  count: number
}[] = [
  { value: 'All Users', count: 12842 },
  { value: 'Premium Users', count: 3216 },
  { value: 'Free Users', count: 9626 },
  { value: 'New Users', count: 842 },
  { value: 'Inactive Users', count: 1120 },
]

export const MESSAGE_LIMIT = 280

let counter = 1008
export const nextBroadcastId = () => {
  const id = ++counter
  return `BRC-${String(id).padStart(3, '0')}`
}

export const initialHistory: BroadcastRecord[] = [
  {
    key: '1',
    id: 'BRC-008',
    title: 'New Safety Features Rolled Out',
    audience: 'All Users',
    channels: ['In-App', 'Email'],
    sentCount: 12842,
    readRate: 69,
    status: 'Sent',
  },
  {
    key: '2',
    id: 'BRC-007',
    title: 'Scheduled Maintenance — Oct 25',
    audience: 'All Users',
    channels: ['In-App', 'Email', 'Push'],
    sentCount: 12842,
    readRate: 75,
    status: 'Sent',
  },
  {
    key: '3',
    id: 'BRC-006',
    title: 'Premium Plan 20% Off This Week',
    audience: 'Free Users',
    channels: ['In-App', 'Push'],
    sentCount: 8420,
    readRate: 50,
    status: 'Sent',
  },
  {
    key: '4',
    id: 'BRC-005',
    title: 'Community Guidelines Updated',
    audience: 'All Users',
    channels: ['In-App', 'Email'],
    sentCount: 12600,
    readRate: 62,
    status: 'Sent',
  },
  {
    key: '5',
    id: 'BRC-004',
    title: 'Weekend Meetup Challenge',
    audience: 'Premium Users',
    channels: ['Push'],
    sentCount: 4219,
    readRate: null,
    status: 'Scheduled',
  },
]
