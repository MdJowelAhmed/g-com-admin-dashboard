import type { EventRecord, EventSize, EventStatus } from '../../data/eventData'
import { baseApi } from './baseApi'

export type EventApiStatus = 'active' | 'inactive'

export interface EventLocation {
  type: 'Point'
  coordinates: [number, number]
}

export interface EventBusinessRef {
  _id: string
  businessName: string
  category: string
}

export interface EventApiDoc {
  _id: string
  organizerName?: string
  business?: EventBusinessRef
  name: string
  mainCategory: string
  image: string
  description: string
  startTime: string
  endTime: string
  registrationDeadline: string
  location: EventLocation
  maxCapacity: number
  bookedCapacity: number
  ticketPrice: number
  status: EventApiStatus
  createdAt: string
  updatedAt: string
}

export interface EventsPagination {
  total: number
  limit: number
  page: number
  totalPage: number
}

export interface EventsListResponse {
  success: boolean
  message: string
  pagination: EventsPagination
  data: EventApiDoc[]
}

export interface GetEventsParams {
  page?: number
  limit?: number
}

export interface EventPayload {
  name: string
  description: string
  startTime: string
  endTime: string
  registrationDeadline: string
  location: EventLocation
  maxCapacity: number
  ticketPrice: number
  organizerName: string
  image: string
}

export interface EventMutationResponse {
  success: boolean
  message: string
  data?: EventApiDoc
}

export type UpdateEventBody = Partial<EventPayload> & {
  status?: EventApiStatus
}

export interface UpdateEventArgs {
  id: string
  body: UpdateEventBody
}

function splitIsoDateTime(iso: string) {
  const date = new Date(iso)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`,
  }
}

function formatEventDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatEventTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function capacityToSize(capacity: number): EventSize {
  if (capacity < 50) return 'Small'
  if (capacity < 200) return 'Medium'
  if (capacity < 1000) return 'Large'
  return 'Mega'
}

function getEventStatus(doc: EventApiDoc): EventStatus {
  if (doc.status !== 'active') return 'Cancelled'

  const now = Date.now()
  const start = new Date(doc.startTime).getTime()
  const end = new Date(doc.endTime).getTime()

  if (now > end) return 'Completed'
  if (now >= start) return 'Running'
  return 'Upcoming'
}

function formatLocation(location: EventLocation) {
  const [longitude, latitude] = location.coordinates
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
}

export function combineDateAndTime(date: string, time: string) {
  return new Date(`${date}T${time}:00`).toISOString()
}

export function toEventPayload(
  form: {
    name: string
    description: string
    startDate: string
    startTime: string
    endDate: string
    endTime: string
    registrationDeadline: string
    latitude: string
    longitude: string
    maxCapacity: number
    ticketPrice: number
    organizerName: string
    image: string
  },
  imageUrl: string,
): EventPayload {
  const latitude = Number(form.latitude)
  const longitude = Number(form.longitude)

  return {
    name: form.name.trim(),
    description: form.description.trim(),
    startTime: combineDateAndTime(form.startDate, form.startTime),
    endTime: combineDateAndTime(form.endDate, form.endTime),
    registrationDeadline: `${form.registrationDeadline}T23:59:59.000Z`,
    location: {
      type: 'Point',
      coordinates: [longitude, latitude],
    },
    maxCapacity: form.maxCapacity,
    ticketPrice: form.ticketPrice,
    organizerName: form.organizerName.trim(),
    image: imageUrl,
  }
}

export function mapEventFromApi(doc: EventApiDoc, index: number): EventRecord {
  const start = splitIsoDateTime(doc.startTime)
  const end = splitIsoDateTime(doc.endTime)
  const [longitude, latitude] = doc.location.coordinates

  return {
    key: doc._id,
    sl: String(index + 1).padStart(2, '0'),
    name: doc.name,
    about: doc.description,
    size: capacityToSize(doc.maxCapacity),
    location: formatLocation(doc.location),
    capacity: doc.maxCapacity,
    seatSales: doc.bookedCapacity,
    checkIns: doc.bookedCapacity,
    ticketPrice: doc.ticketPrice,
    startDate: formatEventDate(doc.startTime),
    startTime: formatEventTime(doc.startTime),
    startDateInput: start.date,
    startTimeInput: start.time,
    organizer: doc.organizerName ?? doc.business?.businessName ?? '—',
    websiteLink: '',
    status: getEventStatus(doc),
    active: doc.status === 'active',
    image: doc.image,
    endDate: end.date,
    endTime: end.time,
    registrationDeadline: doc.registrationDeadline.slice(0, 10),
    latitude,
    longitude,
  }
}

const eventApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEvent: builder.mutation<EventMutationResponse, EventPayload>({
      query: (body) => ({
        url: '/events',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Events'],
    }),
    getEvents: builder.query<EventsListResponse, GetEventsParams | undefined>({
      query: (params = {}) => ({
        url: '/events',
        method: 'GET',
        params,
      }),
      providesTags: ['Events'],
    }),
    updateEvent: builder.mutation<EventMutationResponse, UpdateEventArgs>({
      query: ({ id, body }) => ({
        url: `/events/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Events'],
    }),
    deleteEvent: builder.mutation<EventMutationResponse, string>({
      query: (id) => ({
        url: `/events/${id}/soft-delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Events'],
    }),
  }),
})

export const {
  useCreateEventMutation,
  useGetEventsQuery,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApi
