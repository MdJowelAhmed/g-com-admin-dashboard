export const PAGE_PERMISSIONS = [
  'Dashboard Overview',
  'Home Control',
  'Shop Management',
  'User Management',
  'Order Management',
  'Earning & Payouts',
  'Event Management',
  'Controller Management',
  'Messages',
  'Settings',
  'Terms & Conditions',
  'Privacy Policy',
] as const

export type PagePermission = (typeof PAGE_PERMISSIONS)[number]

export type Controller = {
  key: string
  sl: string
  name: string
  email: string
  pageAccess: PagePermission[]
  suspended: boolean
}

let counter = 2000
export const nextControllerKey = () => `c-${++counter}`

export const initialControllers: Controller[] = [
  {
    key: '1',
    sl: '01',
    name: 'sabbir ahmed',
    email: 'asabbir724@gmail.com',
    pageAccess: ['Shop Management', 'Order Management'],
    suspended: false,
  },
  {
    key: '2',
    sl: '02',
    name: 'lina martinez',
    email: 'lina.martinez@gmail.com',
    pageAccess: ['Event Management', 'Home Control', 'Settings'],
    suspended: false,
  },
  {
    key: '3',
    sl: '03',
    name: 'omar farouk',
    email: 'omar.farouk@yahoo.com',
    pageAccess: ['Earning & Payouts', 'Order Management'],
    suspended: true,
  },
  {
    key: '4',
    sl: '04',
    name: 'maya chen',
    email: 'maya.chen@outlook.com',
    pageAccess: ['User Management', 'Dashboard Overview'],
    suspended: false,
  },
  {
    key: '5',
    sl: '05',
    name: "james o'neil",
    email: 'james.oneil@gmail.com',
    pageAccess: ['Shop Management', 'Order Management', 'Earning & Payouts'],
    suspended: false,
  },
  {
    key: '6',
    sl: '06',
    name: 'anita singh',
    email: 'anita.singh@mail.com',
    pageAccess: [
      'Dashboard Overview',
      'User Management',
      'Event Management',
      'Messages',
    ],
    suspended: false,
  },
]
