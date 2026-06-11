// Canonical location for all event-related mock data and types.
// All components/pages should import from 'src/data/eventData'.

export type EventStatus = 'Running' | 'Upcoming' | 'Completed' | 'Cancelled'

export type EventSize = 'Small' | 'Medium' | 'Large' | 'Mega'

export type EventRecord = {
  key: string
  sl: string
  name: string
  about: string
  size: EventSize
  location: string
  capacity: number
  seatSales: number
  checkIns: number
  ticketPrice: number
  startDate: string
  startTime: string
  organizer: string
  websiteLink: string
  status: EventStatus
  active: boolean
}

export const EVENT_STATUSES: EventStatus[] = [
  'Running',
  'Upcoming',
  'Completed',
  'Cancelled',
]

export const EVENT_SIZES: EventSize[] = ['Small', 'Medium', 'Large', 'Mega']

export const revenueOf = (e: Pick<EventRecord, 'seatSales' | 'ticketPrice'>) =>
  e.seatSales * e.ticketPrice

let counter = 1000
export const nextEventKey = () => `e-${++counter}`

export const initialEvents: EventRecord[] = [
  {
    key: '1',
    sl: '01',
    name: 'Tech Horizon Expo 2024',
    about: 'Hands-on showcase of emerging hardware and robotics.',
    size: 'Large',
    location: 'Dhaka Convention Hall',
    capacity: 50,
    seatSales: 40,
    checkIns: 38,
    ticketPrice: 30,
    startDate: '2025-11-12',
    startTime: '10:00 AM',
    organizer: 'Sarah Jenkins',
    websiteLink: 'https://techhorizon.example',
    status: 'Running',
    active: true,
  },
  {
    key: '2',
    sl: '02',
    name: 'Green Energy Summit',
    about: 'Industry leaders discussing the path to renewables.',
    size: 'Medium',
    location: 'Bashundhara City Hall',
    capacity: 75,
    seatSales: 60,
    checkIns: 0,
    ticketPrice: 15,
    startDate: '2025-12-02',
    startTime: '09:30 AM',
    organizer: 'Imran Chowdhury',
    websiteLink: 'https://greenenergy.example',
    status: 'Upcoming',
    active: true,
  },
  {
    key: '3',
    sl: '03',
    name: 'AI & Robotics Conference',
    about: 'Deep-dive workshops on ML pipelines and autonomy.',
    size: 'Large',
    location: 'ICCB, Dhaka',
    capacity: 120,
    seatSales: 110,
    checkIns: 104,
    ticketPrice: 22.73,
    startDate: '2025-11-20',
    startTime: '11:00 AM',
    organizer: 'Tania Chowdhury',
    websiteLink: 'https://airobotics.example',
    status: 'Running',
    active: true,
  },
  {
    key: '4',
    sl: '04',
    name: 'Digital Marketing World',
    about: 'Growth marketing tactics for South Asian startups.',
    size: 'Medium',
    location: 'Hatirjheel Auditorium',
    capacity: 85,
    seatSales: 85,
    checkIns: 78,
    ticketPrice: 12.94,
    startDate: '2025-10-10',
    startTime: '02:00 PM',
    organizer: 'Rakib Hossain',
    websiteLink: 'https://dmworld.example',
    status: 'Completed',
    active: true,
  },
  {
    key: '5',
    sl: '05',
    name: 'Creator Economy Meetup',
    about: 'Influencers and platform leads comparing notes.',
    size: 'Small',
    location: 'Studio Bangla, Gulshan',
    capacity: 40,
    seatSales: 32,
    checkIns: 0,
    ticketPrice: 10,
    startDate: '2025-12-15',
    startTime: '06:00 PM',
    organizer: 'Mousumi Akter',
    websiteLink: 'https://creatorbd.example',
    status: 'Upcoming',
    active: true,
  },
  {
    key: '6',
    sl: '06',
    name: 'FinTech Founders Panel',
    about: 'Early-stage founders share fundraising stories.',
    size: 'Small',
    location: 'EMK Center, Dhanmondi',
    capacity: 45,
    seatSales: 28,
    checkIns: 0,
    ticketPrice: 8,
    startDate: '2025-12-20',
    startTime: '05:30 PM',
    organizer: 'Arman Karim',
    websiteLink: 'https://fintechbd.example',
    status: 'Upcoming',
    active: true,
  },
  {
    key: '7',
    sl: '07',
    name: 'Healthcare Innovation Summit',
    about: 'Clinicians and engineers meet in the middle.',
    size: 'Large',
    location: 'Radisson, Dhaka',
    capacity: 200,
    seatSales: 180,
    checkIns: 172,
    ticketPrice: 45,
    startDate: '2025-09-18',
    startTime: '09:00 AM',
    organizer: 'Hasib Ali',
    websiteLink: 'https://healthsummit.example',
    status: 'Completed',
    active: true,
  },
  {
    key: '8',
    sl: '08',
    name: 'E-commerce Expo',
    about: 'Storefront operators comparing platforms and stacks.',
    size: 'Mega',
    location: 'Army Stadium, Dhaka',
    capacity: 1500,
    seatSales: 1240,
    checkIns: 0,
    ticketPrice: 25,
    startDate: '2026-01-12',
    startTime: '10:00 AM',
    organizer: 'Oishee Das',
    websiteLink: 'https://ecomexpo.example',
    status: 'Upcoming',
    active: true,
  },
  {
    key: '9',
    sl: '09',
    name: 'Design Systems Forum',
    about: 'Scaling design tokens across teams.',
    size: 'Small',
    location: 'Online',
    capacity: 60,
    seatSales: 42,
    checkIns: 0,
    ticketPrice: 5,
    startDate: '2025-11-30',
    startTime: '07:00 PM',
    organizer: 'Nusrat Rahman',
    websiteLink: 'https://dsforum.example',
    status: 'Upcoming',
    active: true,
  },
  {
    key: '10',
    sl: '10',
    name: 'Streaming Creators Night',
    about: 'Music and podcast hosts trade production tips.',
    size: 'Medium',
    location: 'Bengal Shilpalay',
    capacity: 150,
    seatSales: 0,
    checkIns: 0,
    ticketPrice: 15,
    startDate: '2025-08-22',
    startTime: '08:00 PM',
    organizer: 'Rafi Islam',
    websiteLink: 'https://neonbeats.fm/night',
    status: 'Cancelled',
    active: false,
  },
  {
    key: '11',
    sl: '11',
    name: 'Sustainable Fashion Week',
    about: 'Showcase of ethical apparel brands.',
    size: 'Large',
    location: 'Lakeshore, Gulshan',
    capacity: 320,
    seatSales: 210,
    checkIns: 195,
    ticketPrice: 35,
    startDate: '2025-10-25',
    startTime: '04:00 PM',
    organizer: 'Mousumi Akter',
    websiteLink: 'https://sustfash.example',
    status: 'Running',
    active: true,
  },
  {
    key: '12',
    sl: '12',
    name: 'Founders Yoga Retreat',
    about: 'Two-day wellness retreat for startup teams.',
    size: 'Small',
    location: "Cox's Bazar Resort",
    capacity: 30,
    seatSales: 24,
    checkIns: 0,
    ticketPrice: 120,
    startDate: '2026-02-08',
    startTime: '07:00 AM',
    organizer: 'Sumaiya Akter',
    websiteLink: 'https://retreats.example',
    status: 'Upcoming',
    active: true,
  },
]
