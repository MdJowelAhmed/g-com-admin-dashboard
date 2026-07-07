import { baseApi } from './baseApi'

export interface NotificationItem {
    _id: string
    type: string
    title: string
    message: string
    receiver: string
    referenceId: string
    isRead: boolean
    createdAt: string
    updatedAt: string
}

export interface NotificationsPagination {
    total: number
    limit: number
    page: number
    totalPage: number
}

export interface NotificationsData {
    notifications: NotificationItem[]
    unreadCount: number
}

export interface NotificationsResponse {
    success: boolean
    message: string
    pagination: NotificationsPagination
    data: NotificationsData
}

export interface GetNotificationsParams {
    page?: number
    limit?: number
}

export type NotificationUiType = 'order' | 'user' | 'payment' | 'system'

export type NotificationSection =
    | 'Today'
    | 'Yesterday'
    | 'Earlier this week'
    | 'Older'

export interface NotificationRow {
    id: string
    type: NotificationUiType
    title: string
    description: string
    createdAt: string
    section: NotificationSection
    read: boolean
}

export function mapNotificationType(apiType: string): NotificationUiType {
    const normalized = apiType.toUpperCase()

    if (normalized.includes('ORDER')) return 'order'
    if (normalized.includes('PAYMENT') || normalized.includes('PAYOUT')) {
        return 'payment'
    }
    if (
        normalized.includes('USER') ||
        normalized.includes('SHOP') ||
        normalized.includes('BUSINESS')
    ) {
        return 'user'
    }

    return 'system'
}

function getNotificationSection(dateIso: string): NotificationSection {
    const date = new Date(dateIso)
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfYesterday = new Date(startOfToday)
    startOfYesterday.setDate(startOfYesterday.getDate() - 1)
    const startOfWeek = new Date(startOfToday)
    startOfWeek.setDate(startOfWeek.getDate() - 7)

    if (date >= startOfToday) return 'Today'
    if (date >= startOfYesterday) return 'Yesterday'
    if (date >= startOfWeek) return 'Earlier this week'
    return 'Older'
}

export function formatNotificationTime(dateIso: string) {
    const diff = Date.now() - new Date(dateIso).getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) {
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
    }

    const hours = Math.floor(minutes / 60)
    if (hours < 24) {
        return `${hours} hour${hours === 1 ? '' : 's'} ago`
    }

    const days = Math.floor(hours / 24)
    if (days < 7) {
        return `${days} day${days === 1 ? '' : 's'} ago`
    }

    return new Date(dateIso).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export function mapNotificationFromApi(item: NotificationItem): NotificationRow {
    return {
        id: item._id,
        type: mapNotificationType(item.type),
        title: item.title,
        description: item.message,
        createdAt: formatNotificationTime(item.createdAt),
        section: getNotificationSection(item.createdAt),
        read: item.isRead,
    }
}

const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query<
            NotificationsResponse,
            GetNotificationsParams | undefined
        >({
            query: (params = {}) => ({
                url: '/notifications/me',
                method: 'GET',
                params: {
                    page: params.page ?? 1,
                    limit: params.limit ?? 10,
                },
            }),
            providesTags: ['Notification'],
        }),
        readSingleNotification: builder.mutation<
            { success: boolean; message: string },
            string
        >({
            query: (id) => ({
                url: `/notifications/read/${id}`,
                method: 'PATCH',
                body: {
                    isRead: true,
                },
            }),
            invalidatesTags: ['Notification'],
        }),
        readAllNotifications: builder.mutation<
            { success: boolean; message: string },
            void
        >({
            query: () => ({
                url: '/notifications/read-all',
                method: 'PATCH',
                body: {
                    isRead: true,
                },
            }),
            invalidatesTags: ['Notification'],
        }),
    }),
})

export const {
    useGetNotificationsQuery,
    useReadSingleNotificationMutation,
    useReadAllNotificationsMutation,
} = notificationApi
