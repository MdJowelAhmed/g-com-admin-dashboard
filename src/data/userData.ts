// Canonical location for all user-related mock data and types.
export type UserStatus = 'Pending' | 'Verified' | 'Reviewed' | 'Suspended'

export type User = {
  key: string
  sl: string
  name: string
  email: string
  phone: string
  address: string
  totalOrders: number
  joiningDate: string
  status: UserStatus
  active: boolean
}

export const USER_STATUSES: UserStatus[] = [
  'Pending',
  'Verified',
  'Reviewed',
  'Suspended',
]

export const initialUsers: User[] = [
  {
    key: '1',
    sl: '01',
    name: 'Rakib Hossain',
    email: 'rakib.hossain@greenhorizons.io',
    phone: '+880 1711 223344',
    address: 'Dhaka, Bangladesh',
    totalOrders: 34,
    joiningDate: '22 May 2024',
    status: 'Pending',
    active: true,
  },
  {
    key: '2',
    sl: '02',
    name: 'Nusrat Rahman',
    email: 'nusrat.rahman@freshbites.com',
    phone: '+880 1822 554477',
    address: 'Sylhet, Bangladesh',
    totalOrders: 128,
    joiningDate: '18 May 2024',
    status: 'Verified',
    active: true,
  },
  {
    key: '3',
    sl: '03',
    name: 'Hasib Ali',
    email: 'hasib@bluewave.co',
    phone: '+880 1711 998877',
    address: 'Chittagong, Bangladesh',
    totalOrders: 56,
    joiningDate: '25 May 2024',
    status: 'Reviewed',
    active: true,
  },
  {
    key: '4',
    sl: '04',
    name: 'Tania Chowdhury',
    email: 'tania@nextgenfinance.com',
    phone: '+880 1999 113355',
    address: 'Dhaka, Bangladesh',
    totalOrders: 92,
    joiningDate: '05 June 2024',
    status: 'Verified',
    active: true,
  },
  {
    key: '5',
    sl: '05',
    name: 'Sabbir Khan',
    email: 'sabbir@mindscape.edu',
    phone: '+880 1555 667788',
    address: 'Dhaka, Bangladesh',
    totalOrders: 12,
    joiningDate: '20 May 2024',
    status: 'Pending',
    active: true,
  },
  {
    key: '6',
    sl: '06',
    name: 'Sumaiya Akter',
    email: 'sumaiya@brightpath.io',
    phone: '+880 1900 221133',
    address: 'Dhaka, Bangladesh',
    totalOrders: 203,
    joiningDate: '12 June 2024',
    status: 'Verified',
    active: true,
  },
  {
    key: '7',
    sl: '07',
    name: 'Imran Chowdhury',
    email: 'imran@vitalhealth.com',
    phone: '+880 1600 889977',
    address: 'Rajshahi, Bangladesh',
    totalOrders: 18,
    joiningDate: '18 June 2024',
    status: 'Suspended',
    active: false,
  },
  {
    key: '8',
    sl: '08',
    name: 'Mousumi Akter',
    email: 'mousumi@novafashion.com',
    phone: '+880 1411 221144',
    address: 'Gulshan, Dhaka',
    totalOrders: 75,
    joiningDate: '25 June 2024',
    status: 'Verified',
    active: true,
  },
  {
    key: '9',
    sl: '09',
    name: 'Mahir Chowdhury',
    email: 'mahir@sparkcraft.store',
    phone: '+880 1322 998811',
    address: 'Comilla, Bangladesh',
    totalOrders: 41,
    joiningDate: '02 July 2024',
    status: 'Reviewed',
    active: true,
  },
  {
    key: '10',
    sl: '10',
    name: 'Rafi Islam',
    email: 'rafi@neonbeats.fm',
    phone: '+880 1822 445566',
    address: 'Dhaka, Bangladesh',
    totalOrders: 88,
    joiningDate: '10 July 2024',
    status: 'Verified',
    active: true,
  },
  {
    key: '11',
    sl: '11',
    name: 'Oishee Das',
    email: 'oishee@trailblaze.travel',
    phone: '+880 1999 554433',
    address: "Cox's Bazar, Bangladesh",
    totalOrders: 27,
    joiningDate: '18 July 2024',
    status: 'Pending',
    active: true,
  },
  {
    key: '12',
    sl: '12',
    name: 'Arman Karim',
    email: 'arman@skyline.io',
    phone: '+880 1722 110099',
    address: 'Dhaka, Bangladesh',
    totalOrders: 154,
    joiningDate: '26 July 2024',
    status: 'Verified',
    active: true,
  },
]
