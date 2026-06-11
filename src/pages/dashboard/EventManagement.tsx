import { useMemo, useState } from 'react'
import { DollarSign, Plus, Search, TicketCheck, Users } from 'lucide-react'
import StatCard from '../../components/dashboard/StatCard'
import EventsTable from '../../components/dashboard/EventsTable'
import EventFormModal, {
  type EventFormState,
} from '../../components/dashboard/EventFormModal'
import EventDetailsModal from '../../components/dashboard/EventDetailsModal'
import EventFilter, {
  EMPTY_EVENT_FILTER,
  type EventFilterState,
} from '../../components/dashboard/EventFilter'
import { useFilteredList } from '../../hooks/useFilteredList'
import {
  nextEventKey,
  revenueOf,
  type EventRecord,
} from '../../data/eventData'
import { getInitialEvents } from '../../services/mock/dashboardDataService'
import { formatMoney } from '../../utils/formatMoney'


export default function EventManagement() {
  const { data: events, setData: setEvents, query, setQuery, filter, setFilter, filtered } =
    useFilteredList<EventRecord, EventFilterState>({
      initialData: getInitialEvents(),
      emptyFilter: EMPTY_EVENT_FILTER,
      filterFn: (event, q, activeFilter) => {
        if (q) {
          const haystack =
            `${event.name} ${event.organizer} ${event.location}`.toLowerCase()
          if (!haystack.includes(q)) return false
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
      },
    })
  const [viewing, setViewing] = useState<EventRecord | null>(null)
  const [formMode, setFormMode] = useState<{
    open: boolean
    event: EventRecord | null
  }>({ open: false, event: null })

  const totals = useMemo(() => {
    let sales = 0
    let tickets = 0
    let checkIns = 0
    for (const e of events) {
      sales += revenueOf(e)
      tickets += e.seatSales
      checkIns += e.checkIns
    }
    const checkInRate = tickets > 0 ? (checkIns / tickets) * 100 : 0
    return { sales, tickets, checkInRate }
  }, [events])

  const openCreate = () => setFormMode({ open: true, event: null })
  const openEdit = (event: EventRecord) => setFormMode({ open: true, event })
  const closeForm = () => setFormMode({ open: false, event: null })

  const handleSubmit = (data: EventFormState) => {
    if (formMode.event) {
      setEvents((prev) =>
        prev.map((e) =>
          e.key === formMode.event!.key
            ? {
                ...e,
                name: data.name,
                about: data.about,
                size: data.size,
                location: data.location,
                capacity: data.capacity,
                startDate: data.startDate,
                startTime: data.startTime,
                ticketPrice: data.ticketPrice,
                organizer: data.organizer,
                websiteLink: data.websiteLink,
              }
            : e,
        ),
      )
      return
    }

    setEvents((prev) => {
      const sl = String(prev.length + 1).padStart(2, '0')
      const newEvent: EventRecord = {
        key: nextEventKey(),
        sl,
        name: data.name,
        about: data.about,
        size: data.size,
        location: data.location,
        capacity: data.capacity,
        seatSales: 0,
        checkIns: 0,
        ticketPrice: data.ticketPrice,
        startDate: data.startDate,
        startTime: data.startTime,
        organizer: data.organizer,
        websiteLink: data.websiteLink,
        status: 'Upcoming',
        active: true,
      }
      return [...prev, newEvent]
    })
  }

  const handleDelete = (key: string) =>
    setEvents((prev) => prev.filter((e) => e.key !== key))

  const handleToggleActive = (key: string, next: boolean) =>
    setEvents((prev) =>
      prev.map((e) =>
        e.key === key
          ? {
              ...e,
              active: next,
              status: next
                ? e.status === 'Cancelled'
                  ? 'Upcoming'
                  : e.status
                : 'Cancelled',
            }
          : e,
      ),
    )

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
          <EventsTable
            data={filtered}
            onEdit={openEdit}
            onView={setViewing}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
        </div>
      </section>

      <EventFormModal
        open={formMode.open}
        event={formMode.event}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />

      <EventDetailsModal
        event={viewing}
        open={viewing !== null}
        onClose={() => setViewing(null)}
      />
    </div>
  )
}
