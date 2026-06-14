import { useMemo, useState } from 'react'
import { message, Spin } from 'antd'
import { DollarSign, Plus, Search, TicketCheck, Users } from 'lucide-react'
import StatCard from '../../components/dashboard/StatCard'
import EventsTable from '../../components/dashboard/EventsTable'
import EventFormModal from '../../components/dashboard/EventFormModal'
import EventDetailsModal from '../../components/dashboard/EventDetailsModal'
import EventFilter, {
  EMPTY_EVENT_FILTER,
  type EventFilterState,
} from '../../components/dashboard/EventFilter'
import { revenueOf, type EventRecord } from '../../data/eventData'
import {
  mapEventFromApi,
  type EventPayload,
  useCreateEventMutation,
  useDeleteEventMutation,
  useGetEventsQuery,
  useUpdateEventMutation,
} from '../../redux/api/eventApi'
import { formatMoney } from '../../utils/formatMoney'

function filterEvents(
  events: EventRecord[],
  query: string,
  activeFilter: EventFilterState,
) {
  return events.filter((event) => {
    if (query) {
      const haystack =
        `${event.name} ${event.organizer} ${event.location}`.toLowerCase()
      if (!haystack.includes(query)) return false
    }
    if (
      activeFilter.statuses.length &&
      !activeFilter.statuses.includes(event.status)
    ) {
      return false
    }
    if (activeFilter.sizes.length && !activeFilter.sizes.includes(event.size)) {
      return false
    }
    return true
  })
}

export default function EventManagement() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<EventFilterState>(EMPTY_EVENT_FILTER)
  const [viewing, setViewing] = useState<EventRecord | null>(null)
  const [formMode, setFormMode] = useState<{
    open: boolean
    event: EventRecord | null
  }>({ open: false, event: null })

  const { data, isLoading, isError } = useGetEventsQuery({})
  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation()
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation()
  const [deleteEvent] = useDeleteEventMutation()

  const isSubmitting = isCreating || isUpdating

  const events = useMemo(
    () => (data?.data ?? []).map(mapEventFromApi),
    [data],
  )

  const filtered = useMemo(
    () => filterEvents(events, query.trim().toLowerCase(), filter),
    [events, query, filter],
  )

  const totals = useMemo(() => {
    let sales = 0
    let tickets = 0
    let checkIns = 0
    for (const event of events) {
      sales += revenueOf(event)
      tickets += event.seatSales
      checkIns += event.checkIns
    }
    const checkInRate = tickets > 0 ? (checkIns / tickets) * 100 : 0
    return { sales, tickets, checkInRate }
  }, [events])

  const openCreate = () => setFormMode({ open: true, event: null })
  const openEdit = (event: EventRecord) => setFormMode({ open: true, event })
  const closeForm = () => {
    if (isSubmitting) return
    setFormMode({ open: false, event: null })
  }

  const handleSubmit = async (payload: EventPayload) => {
    try {
      if (formMode.event) {
        const result = await updateEvent({
          id: formMode.event.key,
          body: payload,
        }).unwrap()
        message.success(result.message || 'Event updated successfully.')
      } else {
        const result = await createEvent(payload).unwrap()
        message.success(result.message || 'Event created successfully.')
      }
      setFormMode({ open: false, event: null })
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : formMode.event
            ? 'Failed to update event.'
            : 'Failed to create event.'
      message.error(errorMessage)
    }
  }

  const handleDelete = async (key: string) => {
    try {
      const result = await deleteEvent(key).unwrap()
      message.success(result.message || 'Event deleted successfully.')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete event.'
      message.error(errorMessage)
    }
  }

  const handleToggleActive = async (key: string, next: boolean) => {
    try {
      const result = await updateEvent({
        id: key,
        body: { status: next ? 'active' : 'inactive' },
      }).unwrap()
      message.success(result.message || 'Event status updated successfully.')
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to update event status.'
      message.error(errorMessage)
    }
  }

  return (
    <div className="py-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Sales" value={formatMoney(totals.sales)} icon={DollarSign} />
        <StatCard
          label="App Ticket Sales"
          value={totals.tickets.toLocaleString()}
          icon={TicketCheck}
        />
        <StatCard
          label="Entry Check-ins"
          value={`${totals.checkInRate.toFixed(0)}%`}
          icon={Users}
        />
      </section>

      <section className="mt-6 rounded-2xl border border-surface-border bg-surface-card p-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-white">Event Management</h1>

          <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
            <div className="relative w-full max-w-sm">
              <Search
                size={16}
                className="pointer-events-none absolute inset-y-0 left-3 my-auto text-gray-400"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search event, organizer, location.."
                className="h-10 w-full rounded-md border border-surface-border bg-transparent pl-9 pr-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-brand"
              />
            </div>
            <EventFilter value={filter} onChange={setFilter} />
            <button
              type="button"
              onClick={openCreate}
              className="flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              <Plus size={16} />
              Create New Event
            </button>
          </div>
        </header>

        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spin size="large" />
            </div>
          ) : isError ? (
            <p className="py-10 text-center text-sm text-red-400">
              Failed to load events. Please try again.
            </p>
          ) : (
            <EventsTable
              data={filtered}
              onEdit={openEdit}
              onView={setViewing}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
            />
          )}
        </div>
      </section>

      <EventFormModal
        open={formMode.open}
        event={formMode.event}
        onClose={closeForm}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <EventDetailsModal
        event={viewing}
        open={viewing !== null}
        onClose={() => setViewing(null)}
      />
    </div>
  )
}
